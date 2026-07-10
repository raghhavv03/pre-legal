# Pre-Legal

A dataset of standard legal agreement templates for startups and software companies, sourced from [Common Paper](https://github.com/CommonPaper) and indexed with structured metadata for easy discovery and integration.

## Contents

The [`templates/`](templates) directory contains 12 ready-to-use legal agreement templates in Markdown format:

| Template | File | Description |
|---|---|---|
| Mutual Non-Disclosure Agreement (Standard Terms) | `Mutual-NDA.md` | Standard terms for two parties exchanging confidential information. |
| Mutual Non-Disclosure Agreement (Cover Page) | `Mutual-NDA-coverpage.md` | Cover page defining purpose, term, and governing law for a specific mutual NDA. |
| Cloud Service Agreement | `CSA.md` | Standard SaaS agreement covering access, payment, liability, and confidentiality. |
| Design Partner Agreement | `design-partner-agreement.md` | Grants early-access product use in exchange for structured feedback. |
| Service Level Agreement | `sla.md` | Uptime targets, support response times, and service credits, for use alongside the CSA. |
| Professional Services Agreement | `psa.md` | Governs professional services and statements of work. |
| Data Processing Agreement | `DPA.md` | GDPR/UK GDPR-compliant data processing terms, subprocessors, and incident response. |
| Software License Agreement | `Software-License-Agreement.md` | Licensing terms for on-premises or client-side software. |
| Partnership Agreement | `Partnership-Agreement.md` | Mutual obligations, trademark licensing, and co-marketing between companies. |
| Pilot Agreement | `Pilot-Agreement.md` | Short-term trial/evaluation agreement for prospective customers. |
| Business Associate Agreement | `BAA.md` | HIPAA-compliant terms governing protected health information (PHI). |
| AI Addendum | `AI-Addendum.md` | Supplemental terms for AI services, covering input/output ownership and model training rights. |

## Catalog

[`catalog.json`](catalog.json) is a machine-readable index of every template, with each entry containing:

- `name` — human-readable template name
- `description` — summary of the agreement's purpose and scope
- `filename` — path to the template within `templates/`

This makes it easy to programmatically browse, search, or surface templates (e.g., in an internal tool, chatbot, or document generator).

## Usage

These templates are intended as a starting point for standard commercial agreements. They are **not a substitute for legal advice** — have counsel review any agreement before use, especially for terms specific to your business, jurisdiction, or deal.

## License

All templates are sourced from [Common Paper](https://github.com/CommonPaper) and licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). You may share and adapt them for any purpose, including commercially, provided you credit Common Paper and indicate any changes made. See [`templates/LICENSE.txt`](templates/LICENSE.txt) for details.
