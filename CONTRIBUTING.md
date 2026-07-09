# Contributing to Indian Government Org Chart

Thank you for helping build a public accountability register for India.

**Live app:** https://indianorgchart.netlify.app  
**Goal:** A citizen describes a problem + place; we return a **bottom → top** hierarchy of who is accountable — grounded only in the Accountable India dataset.

## Ways to contribute

| Path | Best for | Where to start |
|------|----------|----------------|
| **Data corrections** | Journalists, civic volunteers | Edit CSVs in `Accountable India/data/` + cite `sources.csv` |
| **Coverage expansion** | Researchers | Fill missing contacts, municipal offices, `responsibility_map` rows |
| **Product / UI** | Frontend engineers | `src/` — Ask flow, hierarchy UI, Explore |
| **Resolver / agent** | Backend engineers | `shared/resolve-accountability.mjs`, `netlify/functions/` |
| **Docs / wiki** | Writers | `src/content/wiki/`, `docs/ARCHITECTURE.md`, README |

Look for issues labeled `good first issue`, `help wanted`, `data:correction`, or `data:coverage`.

## Golden rules

1. **Data is the source of truth.** Do not invent office-holders or personal contacts.
2. **Official / public channels only** — no private mobiles or personal emails.
3. **Cite sources** for any CSV change (`sources.csv` + `source_url` on the row).
4. **Never commit secrets** (`.env`, API keys).

## Local setup

```bash
git clone https://github.com/curiousoddesy/indian-govt-org-chart.git
cd indian-govt-org-chart
npm install
cp .env.example .env   # optional: DEEPSEEK_API_KEY for AI agent
npm run netlify:dev
```

Useful commands:

```bash
npm run validate:data              # CSV schema + FK checks
npm run build:data                 # rebuild public/data/*.json
npm test                           # unit tests
npm run test:chat                  # chat handler tests
node --test test/resolve-accountability.test.js
```

## Pull request checklist

- [ ] `npm run validate:data` passes (for CSV changes)
- [ ] Relevant tests pass
- [ ] Sources cited for data edits
- [ ] No secrets in the diff
- [ ] Short PR description: what / why

## Issue templates (suggested titles)

- `[data] Wrong DM for <district> — source: <url>`
- `[data] Add contacts for Municipal Commissioner, <city>`
- `[map] Responsibility mapping missing for <topic>`
- `[ui] Improve hierarchy empty-state when location unknown`
- `[docs] Clarify how reports_to chains are built`

## Code of conduct

Be respectful. This is a public-interest project used in stressful civic moments — keep discussion precise, kind, and evidence-based.

## License

- **Code:** MIT  
- **Data:** [ODC-By 1.0](https://opendatacommons.org/licenses/by/1.0/)
