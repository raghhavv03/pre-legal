import os
import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.staticfiles import StaticFiles

from app import database
from app.auth import create_access_token, get_current_user, hash_password, verify_password
from app.schemas import LoginRequest, RegisterRequest, TokenResponse, UserResponse

FRONTEND_DIST = Path(os.environ.get("FRONTEND_DIST", Path(__file__).resolve().parent.parent.parent / "frontend" / "out"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    database.reset_database()
    yield


app = FastAPI(title="Prelegal API", lifespan=lifespan)


@app.post("/api/auth/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest):
    with database.get_connection() as conn:
        try:
            cursor = conn.execute(
                "INSERT INTO users (email, password_hash) VALUES (?, ?)",
                (body.email, hash_password(body.password)),
            )
        except sqlite3.IntegrityError:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        user_id = cursor.lastrowid

    return TokenResponse(access_token=create_access_token(user_id, body.email))


@app.post("/api/auth/login", response_model=TokenResponse)
def login(body: LoginRequest):
    with database.get_connection() as conn:
        row = conn.execute("SELECT id, password_hash FROM users WHERE email = ?", (body.email,)).fetchone()

    if row is None or not verify_password(body.password, row["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    return TokenResponse(access_token=create_access_token(row["id"], body.email))


@app.get("/api/auth/me", response_model=UserResponse)
def me(current_user: dict = Depends(get_current_user)):
    return UserResponse(id=int(current_user["sub"]), email=current_user["email"])


@app.get("/api/health")
def health():
    return {"status": "ok"}


if FRONTEND_DIST.is_dir():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
