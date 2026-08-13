# Metrics

The dashboard displays aggregate statistics computed at build time from the raw CSV dataset. Here's what each number means.

## Count metrics

| Metric | Source | Meaning |
|--------|--------|---------|
| **Government Offices** | `positions` count | Total org-chart nodes |
| **Officials Tracked** | `persons` count | Unique individuals in dataset |
| **Jurisdictions** | `jurisdictions` count | All admin units (Union to ward) |
| **Public Contacts** | `contacts` count | Official contact channels |
| **Current Appointments** | `appointments WHERE is_current` | Active person↔position links |

## Coverage metrics

| Metric | Formula | What it tells you |
|--------|---------|-------------------|
| **Fill Rate** | positions with a current holder / total positions | How complete the org chart is |
| **Verification Rate** | verified positions / total positions | Data quality |
| **DM Coverage** | DMs named / DM positions per state | District-level completeness |

## Breakdown charts

### Positions by Level
Groups positions by their jurisdiction's admin level (union, state, district, etc.). Shows where most offices sit in the hierarchy.

### Positions by Type
Groups by `position_type`: constitutional, political_executive, bureaucratic, elected_representative, etc.

### Contacts by Type
Distribution of contact channel types (email, phone, portal, website, etc.).

### Data Verification Status
Pie chart of `data_status` values across all positions.

## State stats

For each state/UT, the build script computes:

- Number of districts
- Total positions in state
- DMs named vs total DM positions
- Data status of the state record itself

These power the **Geography** dashboard's state selector.

## AI context

A retrieval index (`ai-context.json`) is generated at build time. For each
question, the Netlify Function selects a bounded set of relevant records and
adds them to the AI agent's evidence-first system prompt. This grounds answers
without sending the entire dataset on every request. See [[ai-agent]] for the
request flow, response formatting, and safety rules.

## High-office snapshot

The Dashboard also renders a **leadership snapshot** compiled at build time:

- Union leadership (President, VP, PM, Home, Defence, Finance, Education, External Affairs)
- Constitutional offices (CJI, CEC, CAG, Attorney General, Lok Sabha Speaker, Cabinet Secretary)
- Full Union cabinet, with vacant MoS seats called out
- Governor/LG and Chief Minister for every state/UT with a CM
- Recent high-office changes from the latest weekly verification (started or ended since March 2026)

Geography uses the same snapshot fields (`cm_name`, `governor_name`, cabinet filled/vacant) on each state card.

## Related

- [[Data Model]] — where these numbers come from
- [[Methodology]] — how verification status is assigned
- [[Jurisdictions]] — geographic breakdown details
