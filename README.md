# Indian Government Org Chart

[![Netlify Status](https://api.netlify.com/api/v1/badges/b1f0c3e4-757b-4bbf-bf8d-55e05343a793/deploy-status)](https://app.netlify.com/projects/indianorgchart/deploys)
[![License: MIT](https://img.shields.io/badge/code-MIT-blue.svg)](LICENSE)
[![Data: ODC-By](https://img.shields.io/badge/data-ODC--By-green.svg)](https://opendatacommons.org/licenses/by/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Describe a civic problem. Get the accountability chain — bottom to top.**

Open-source civic tech for India: citizens enter what is going wrong and where; the app returns who is responsible (local office → escalation ladder), with holders and official contacts — grounded only in the **Accountable India** dataset.

**Live:** https://indianorgchart.netlify.app  
**Ask:** https://indianorgchart.netlify.app/ask  
**Repo:** https://github.com/curiousoddesy/indian-govt-org-chart  
**Contributing:** [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Features

| Section | Description |
|---------|-------------|
| **Home / Ask** | Problem + location → structured hierarchy (golden-source resolver + AI narration) |
| **Explore** | Full-text search across 6,600+ records |
| **Geography** | State/district breakdowns, DM coverage |
| **Data Quality** | Verification status, confidence scores, audit trail |
| **Wiki** | In-app documentation for the data model |

## Dataset (Accountable India)

A connected org chart of government offices at Union, State/UT, District, and Local levels — 10 linked CSV tables with PostgreSQL schema.

| Level | Coverage (July 2026) |
|-------|----------------------|
| Union Council of Ministers | 73 ministers + President/VP |
| Union bureaucracy (Secretaries) | 35/36 ministries |
| State Governors + Chief Ministers | All 31 states/UTs |
| Chief Secretaries | All 36 states/UTs |
| District Collectors/DMs | **782/785 (99.6%)** |
| Superintendents of Police | **766/785 (97.6%)** |
| Municipal Corporations | 250 with Mayor + Commissioner offices |

See [`Accountable India/`](Accountable%20India/) for CSVs, schema, ER diagram, and collection runbooks.
See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the application, data pipeline, AI grounding, and deployment architecture.

## Quick start

```bash
git clone https://github.com/curiousoddesy/indian-govt-org-chart.git
cd indian-govt-org-chart
npm install
cp .env.example .env        # add DEEPSEEK_API_KEY for the AI agent
npm run netlify:dev         # Vite dev server + Netlify functions
```

Build for production (compiles CSVs → JSON, then Vite):

```bash
npm run build
npm run preview             # preview static build locally
npm run deploy              # build + deploy to Netlify prod
```

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DEEPSEEK_API_KEY` | For AI Agent | DeepSeek API key — set in [Netlify env vars](https://app.netlify.com/projects/indianorgchart/configuration/env) and local `.env` |

**Never commit `.env` or API keys to git.**

## AI Agent response rendering

Assistant responses support GitHub-flavored Markdown, including headings, lists,
tables, blockquotes, emphasis, links, and code. The browser uses a dedicated
renderer that escapes raw HTML, rejects unsafe link protocols, and does not load
remote images from model output.

```bash
npm run test:chat:coverage         # request validation, retrieval, and API behavior
npm run test:chat-format:coverage  # Markdown output and safety rules
```

## Project structure

```
├── Accountable India/       # Source CSV dataset + schema + jobs
├── scripts/build-data.mjs   # CSV → public/data/*.json at build time
├── src/                     # React app (Vite + TypeScript + Tailwind)
├── netlify/functions/       # Serverless: /api/chat (DeepSeek)
├── public/                  # Static assets + generated data (build output)
└── netlify.toml             # Netlify build & redirect config
```

## Related project

**[Kisko Bolun UP](https://kisko-bolun-up.netlify.app)** — a separate civic tool for Uttar Pradesh that maps citizen complaints to responsible officers. Same maintainer, different scope.

## License

Data: [Open Data Commons Attribution License (ODC-By)](https://opendatacommons.org/licenses/by/)  
Code: MIT

All contacts are **official/public channels only** — no personal mobile numbers or private emails.

## Contributing

We want contributors — especially for **data corrections**, **coverage gaps**, and **good first issues**.

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for setup, PR checklist, and contribution paths.  
In-app wiki: `/docs` · collection runbooks: `Accountable India/jobs/`.

### Good first contributions

1. Fix a wrong office-holder with a public source URL  
2. Add missing public contacts for a Municipal Commissioner / DM / SP  
3. Expand `responsibility_map.csv` for unmapped citizen topics  
4. Improve empty states when location is unknown  
5. Translate or clarify a wiki page
