# Pre-Legal

> **AI-powered commercial legal agreement generator for startups and software companies.**

Pre-Legal simplifies drafting standard commercial legal contracts by combining **Common Paper** standard legal templates with a privacy-first, local AI chat assistant. Users interact with the AI assistant to determine document requirements, populate agreement fields, preview drafts in real time, and export production-ready PDFs—all running locally on your own machine.

---

## Key Features

- **AI-Guided Document Creation**: Natural language chat interface that dynamically collects and validates required agreement fields using local structured output extraction.
- **Standardized Legal Templates**: High-quality, industry-standard templates sourced from [Common Paper](https://commonpaper.com/), including Mutual NDAs, Cloud Service Agreements (CSA), Data Processing Agreements (DPA), SLAs, and AI Addendums.
- **Live Document Preview & Export**: Interactive side-by-side live document preview with instant client-side PDF export powered by `@react-pdf/renderer`.
- **100% Privacy-First & Local**: Designed to run completely offline using local LLM inference via LiteLLM and Ollama (`qwen3:8b`). No cloud API keys or proprietary legal data transmitted externally.
- **Structured Template Catalog**: Machine-readable `catalog.json` index facilitating search, automated workflow integration, and template discovery.
- **Containerized Deployment**: Single-command startup scripts for macOS, Linux, and Windows backed by Docker and `uv`.

---

## Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | Next.js 16 (Static Export), React 19, TypeScript, Tailwind CSS v4, `@react-pdf/renderer` |
| **Backend** | FastAPI, Python 3.12, SQLite, PyJWT, bcrypt, `uv` package manager |
| **AI / LLM** | LiteLLM connected to local Ollama (`qwen3:8b` model) |
| **Containerization** | Docker multi-stage build |

---

## Available Templates

The [`templates/`](templates) directory includes 12 standard legal templates indexed in [`catalog.json`](catalog.json):

| Template | File | Purpose |
|---|---|---|
| **Mutual NDA (Standard Terms)** | `Mutual-NDA.md` | Standard confidential information protection for two parties. |
| **Mutual NDA (Cover Page)** | `Mutual-NDA-coverpage.md` | Key terms, party details, and governing law definition. |
| **Cloud Service Agreement** | `CSA.md` | Standard SaaS customer terms, payment, liability, and usage. |
| **Design Partner Agreement** | `design-partner-agreement.md` | Early-access software usage in exchange for feedback. |
| **Service Level Agreement** | `sla.md` | Uptime commitments, response windows, and service credits. |
| **Professional Services Agreement** | `psa.md` | Statement of Work (SOW) terms for custom consulting or integration services. |
| **Data Processing Agreement** | `DPA.md` | GDPR / UK GDPR compliant terms and subprocessor rules. |
| **Software License Agreement** | `Software-License-Agreement.md` | Licensing terms for client-side or on-premises software. |
| **Partnership Agreement** | `Partnership-Agreement.md` | Strategic partnership, trademark licensing, and co-marketing terms. |
| **Pilot Agreement** | `Pilot-Agreement.md` | Evaluation terms for prospective enterprise customers. |
| **Business Associate Agreement** | `BAA.md` | HIPAA-compliant protected health information (PHI) agreement. |
| **AI Addendum** | `AI-Addendum.md` | Terms governing AI input/output ownership and model training rights. |

---

## Getting Started

### Prerequisites

1. **Docker**: Installed and running on your system.
2. **Ollama**: Installed locally with the `qwen3:8b` model pulled:
   ```bash
   ollama pull qwen3:8b
   ```

### Quick Start (Recommended)

Run the containerized application using the platform-specific launcher script:

**macOS / Linux:**
```bash
# macOS
./scripts/start-mac.sh

# Linux
./scripts/start-linux.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\start-windows.ps1
```

Once running, access the web app at **`http://localhost:8000`**.

To stop the container:
```bash
./scripts/stop-mac.sh    # or stop-linux.sh / stop-windows.ps1
```

---

## Local Development Setup

### Backend (FastAPI + uv)

```bash
cd backend
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

---

## Disclaimer

These templates and AI-generated documents serve as starting points for commercial agreements. They do **not** constitute formal legal advice. Always consult qualified legal counsel to review any agreement prior to execution.

---

## License

All legal templates are sourced from [Common Paper](https://github.com/CommonPaper) and licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). See [`templates/LICENSE.txt`](templates/LICENSE.txt) for details.
