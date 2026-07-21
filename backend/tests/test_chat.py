import os
import tempfile
from unittest.mock import MagicMock, patch

os.environ["DB_PATH"] = os.path.join(tempfile.mkdtemp(), "test.db")

from fastapi.testclient import TestClient

from app.chat import ChatResponse, NdaFields
from app.main import app


def _fake_completion(*args, **kwargs):
    reply = ChatResponse(
        reply="What's the purpose of this NDA?",
        fields=NdaFields(party1CompanyName="Acme Inc"),
    )
    fake = MagicMock()
    fake.choices[0].message.content = reply.model_dump_json()
    return fake


def test_chat_nda_returns_reply_and_merged_fields():
    with TestClient(app) as client, patch("app.chat.litellm.completion", side_effect=_fake_completion):
        response = client.post(
            "/api/chat/nda",
            json={"messages": [{"role": "user", "content": "My company is Acme Inc"}], "fields": {}},
        )
        assert response.status_code == 200
        body = response.json()
        assert body["reply"] == "What's the purpose of this NDA?"
        assert body["fields"]["party1CompanyName"] == "Acme Inc"


def test_chat_nda_returns_503_when_ollama_unreachable():
    with TestClient(app) as client, patch("app.chat.litellm.completion", side_effect=ConnectionError("refused")):
        response = client.post("/api/chat/nda", json={"messages": [{"role": "user", "content": "hi"}]})
        assert response.status_code == 503
