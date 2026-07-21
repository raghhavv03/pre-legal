FROM node:22-slim AS frontend-build
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen --no-dev

COPY backend/app ./app
COPY --from=frontend-build /frontend/out ./frontend/out

ENV FRONTEND_DIST=/app/frontend/out
ENV DB_PATH=/app/data/app.db
# Ollama runs on the host, not in this container -- host.docker.internal reaches it from inside.
ENV OLLAMA_BASE_URL=http://host.docker.internal:11434

EXPOSE 8000
CMD [".venv/bin/uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
