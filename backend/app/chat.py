import os
from datetime import date
from typing import Literal, Optional

import litellm
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
CHAT_MODEL = os.environ.get("OLLAMA_CHAT_MODEL", "ollama/qwen3:8b")

router = APIRouter(prefix="/api/chat")


# Flat, non-nested fields -- qwen3:8b fills nested objects (party1.companyName) unreliably
# under structured-output constraints, but fills flat top-level keys consistently.
class NdaFields(BaseModel):
    party1CompanyName: Optional[str] = None
    party1SignatoryName: Optional[str] = None
    party1SignatoryTitle: Optional[str] = None
    party1NoticeAddress: Optional[str] = None
    party2CompanyName: Optional[str] = None
    party2SignatoryName: Optional[str] = None
    party2SignatoryTitle: Optional[str] = None
    party2NoticeAddress: Optional[str] = None
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTermType: Optional[Literal["fixed", "until_terminated"]] = None
    mndaTermYears: Optional[int] = None
    confidentialityTermType: Optional[Literal["fixed", "perpetuity"]] = None
    confidentialityTermYears: Optional[int] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None


class ChatTurn(BaseModel):
    role: Literal["user", "assistant"]
    content: str


# Only the last few turns are sent, not the whole transcript -- an unbounded, ever-growing
# transcript is what caused the model to get stuck repeating stale replies on long conversations.
RECENT_TURNS_LIMIT = 6


class ChatRequest(BaseModel):
    messages: list[ChatTurn]
    fields: NdaFields = NdaFields()


class ChatResponse(BaseModel):
    reply: str
    fields: NdaFields


SYSTEM_PROMPT = """You are a legal intake assistant collecting information to draft a Mutual Non-Disclosure Agreement (NDA) between two parties.

You are only shown the most recent messages, not the full conversation. The fields already known
(collected from everything said so far, including earlier messages you can't see) are ground truth --
never ask again for a field that's already known unless the user corrects it.

Required fields:
- party1CompanyName, party1SignatoryName, party1SignatoryTitle, party1NoticeAddress (email or postal address)
- party2CompanyName, party2SignatoryName, party2SignatoryTitle, party2NoticeAddress
- purpose: why the parties are exchanging confidential information
- effectiveDate: ISO date (YYYY-MM-DD). If the user says "today", use today's date given below.
- mndaTermType: "fixed" (expires N years from effective date, requires mndaTermYears) or "until_terminated"
- confidentialityTermType: "fixed" (N years, requires confidentialityTermYears) or "perpetuity"
- governingLaw: US state
- jurisdiction: city/county and state for courts

Steps for every reply:
1. Re-read the latest user message carefully and pull out every fact it states, even in passing
   (company names, people, dates, durations, states/cities, reasons for the NDA). Put each fact into
   its matching field.
2. Merge those facts with the already-known fields -- keep everything already known.
3. Ask about one or two related still-missing fields, in a natural conversational tone. Use null for
   anything not yet known -- never guess or use placeholder text. When every field is known, say so and
   tell the user to review the document preview and download it.

Respond with the full set of known fields (step 2's result) plus a natural-language reply (step 3)."""


@router.post("/nda", response_model=ChatResponse)
def chat_nda(body: ChatRequest) -> ChatResponse:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": f"Today's date is {date.today().isoformat()}."},
        {"role": "system", "content": f"Known fields so far: {body.fields.model_dump_json()}"},
        *(
            {"role": turn.role, "content": turn.content}
            for turn in body.messages[-RECENT_TURNS_LIMIT:]
        ),
    ]

    try:
        response = litellm.completion(
            model=CHAT_MODEL,
            api_base=OLLAMA_BASE_URL,
            messages=messages,
            response_format=ChatResponse,
            temperature=0,
        )
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"AI service unavailable: {exc}")

    return ChatResponse.model_validate_json(response.choices[0].message.content)
