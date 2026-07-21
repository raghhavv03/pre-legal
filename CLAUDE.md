# Prelegal Project

## Overview

This is a SaaS application that allows users to draft legal agreements from templates stored in the `templates/` directory.

Users interact with an AI chat assistant to determine which legal document they need and collect the information required to populate the document fields.

The supported document types are defined in `catalog.json` in the project root.

The application currently supports AI chat-based Mutual NDA generation (via a local Ollama/qwen3:8b model through LiteLLM), backed by a FastAPI/SQLite backend and Docker foundation (see **Progress** at the end of this document). Additional functionality should be implemented according to the corresponding Jira issues.

---

## Development Process

When instructed to build a feature:

1. Use the Atlassian MCP tools to read the corresponding Jira issue.
2. Use the **Feature Specifications** in this document to supplement the Jira requirements.
3. Follow the complete **feature-dev** 7-step development workflow without skipping any steps.
4. Implement the feature.
5. Thoroughly test the feature using both unit and integration tests.
6. Fix any issues discovered during testing.
7. Verify that all existing functionality continues to work.
8. Submit a Pull Request using the GitHub MCP tools.

---

## AI Design

When writing code that interacts with an LLM, use **LiteLLM** with a locally running **Ollama** server.

### Model

Use the following model:

```text
qwen3:8b
```

### Ollama Server

Assume Ollama is running locally at:

```text
http://localhost:11434
```

### Structured Outputs

Use Structured Outputs whenever possible so that responses can be reliably parsed and used to populate the fields in legal documents.

### Local Inference

This project is intended to run entirely locally.

Do **not** use:

- OpenRouter
- Cerebras
- OpenAI APIs
- Anthropic APIs
- Any other cloud inference provider

unless explicitly instructed.

If the required model is not installed, install it with:

```bash
ollama pull qwen3:8b
```

Then use that model for all LLM inference.

---

## Technical Design

The entire application should be packaged into a Docker container.

### Backend

- Located in `backend/`
- Built as a **uv** project
- Uses **FastAPI**

### Frontend

- Located in `frontend/`

### Database

- Uses SQLite.
- The database should be recreated from scratch each time the Docker container starts.
- The database should include a `users` table supporting user registration and authentication.

If appropriate, statically build the frontend and serve it through FastAPI.

### Scripts

Provide the following platform-specific scripts inside the `scripts/` directory:

```text
scripts/
├── start-mac.sh
├── stop-mac.sh
├── start-linux.sh
├── stop-linux.sh
├── start-windows.ps1
└── stop-windows.ps1
```

The backend should be available at:

```text
http://localhost:8000
```

---

## Color Scheme

- **Accent Yellow:** `#ecad0a`
- **Primary Blue:** `#209dd7`
- **Secondary Purple (Submit Buttons):** `#753991`
- **Dark Navy (Headings):** `#032147`
- **Gray Text:** `#888888`

---

## Progress

- **KAN-6 — Mutual NDA Creator prototype**: Done. Client-only Next.js form (`frontend/src`) generating and previewing a Mutual NDA, with PDF export via `@react-pdf/renderer`. No backend, no auth, no persistence.
- **KAN-7 — V1 technical foundation**: Done. Added:
  - `backend/` — uv-managed FastAPI app. `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, JWT-based (PyJWT + bcrypt).
  - SQLite `users` table, dropped and recreated on every backend startup (`backend/app/database.py`).
  - `frontend/next.config.ts` set to `output: "export"`; FastAPI serves the static export at `/`, API at `/api/*`, single origin on `:8000`.
  - Root `Dockerfile` (multi-stage: Node build → Python/uv runtime) + `.dockerignore`.
  - `scripts/{start,stop}-{mac,linux,windows}` to build/run/stop the container.
- **KAN-8 — AI chat support for Mutual NDA generation**: Done. Added:
  - `POST /api/chat/nda` (`backend/app/chat.py`) — LiteLLM against local Ollama `qwen3:8b`, structured output. Stateless: frontend sends the last few turns (`RECENT_TURNS_LIMIT = 6`, bounded so context doesn't grow unboundedly on long conversations) plus an accumulated "known fields" snapshot each turn; backend returns the updated snapshot.
  - Wire schema uses flat top-level keys (`party1CompanyName`, ...) rather than nested `party1`/`party2` objects — qwen3:8b fills nested objects unreliably under structured-output constraints. `ChatPanel.tsx` converts to/from the app's nested `NdaFormData` shape at the API boundary only.
  - `frontend/src/components/ChatPanel.tsx` replaces the old form (`NdaForm.tsx`/`PartyFields.tsx`, removed); `page.tsx` is now a chat + live document preview split screen. Download unlocks only once all required fields are deterministically known (`isNdaFieldsComplete` in `lib/nda.ts`), not based on the model's own claim of completion.
  - Docker: `OLLAMA_BASE_URL` defaults to `http://host.docker.internal:11434` in-container; start scripts add `--add-host=host.docker.internal:host-gateway` for Linux.
  - Brand color scheme (see **Color Scheme** above) applied via Tailwind v4 theme tokens in `globals.css`.
  - Known limitation: qwen3:8b (an 8B local model) has residual per-turn extraction variance — occasionally misses a fact stated in a message. Not a determinism bug (fixed by bounding context); restating the fact in a later message reliably recovers it.
  - Also fixed a pre-existing bug: root `.gitignore` had an unanchored `lib/` pattern that was silently matching `frontend/src/lib/`, so `frontend/src/lib/nda.ts` (the core NDA data model) had never actually been committed since the KAN-6 prototype. Anchored to `/lib/` and `/lib64/`.