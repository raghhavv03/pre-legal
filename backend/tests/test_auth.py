import os
import tempfile

os.environ["DB_PATH"] = os.path.join(tempfile.mkdtemp(), "test.db")

from fastapi.testclient import TestClient

from app.main import app


def test_register_login_me_flow():
    with TestClient(app) as client:
        register = client.post("/api/auth/register", json={"email": "a@b.com", "password": "password123"})
        assert register.status_code == 201
        token = register.json()["access_token"]

        login = client.post("/api/auth/login", json={"email": "a@b.com", "password": "password123"})
        assert login.status_code == 200

        me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me.status_code == 200
        assert me.json()["email"] == "a@b.com"


def test_duplicate_register_rejected():
    with TestClient(app) as client:
        client.post("/api/auth/register", json={"email": "dup@b.com", "password": "password123"})
        second = client.post("/api/auth/register", json={"email": "dup@b.com", "password": "password123"})
        assert second.status_code == 409


def test_login_wrong_password_rejected():
    with TestClient(app) as client:
        client.post("/api/auth/register", json={"email": "c@b.com", "password": "password123"})
        bad_login = client.post("/api/auth/login", json={"email": "c@b.com", "password": "wrong"})
        assert bad_login.status_code == 401
