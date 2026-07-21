export interface WikiPage {
  slug: string;
  title: string;
  description: string;
  content: string;
}

const PAGES: WikiPage[] = [
  {
    slug: "index",
    title: "Documentation Wiki",
    description:
      "Connected knowledge base for Accountable India — data model, methodology, and how to contribute.",
    content: `This wiki explains how the Indian Government Org Chart dataset is structured and maintained.

Browse topics below, or open the full documentation on the web app for the complete Markdown pages with cross-links.

**Start here**
- Data model — jurisdictions, bodies, positions, persons, appointments, contacts
- Methodology — collection, verification, confidence scores
- Contributing — how to submit verified corrections with sources`,
  },
  {
    slug: "data-model",
    title: "Data Model",
    description: "Ten linked tables that form the Accountable India org chart.",
    content: `The dataset is a connected org chart of government offices across Union, State/UT, District, and Local levels.

**Core entities**
- Jurisdictions — geographic and administrative units
- Bodies — ministries, departments, corporations
- Positions — offices of responsibility (DM, SP, Minister, …)
- Persons — office holders
- Appointments — who currently holds which office
- Contacts — official/public channels only
- Topics & responsibility map — citizen problem routing
- Sources & collection log — provenance and audit trail`,
  },
  {
    slug: "methodology",
    title: "Methodology",
    description: "How records are collected, verified, and scored.",
    content: `Records move through statuses: pending → collected → verified (or stale when outdated).

Confidence scores reflect source quality and recency. Official government portals and gazettes are preferred. Personal mobile numbers and private emails are never stored — only official/public contacts.`,
  },
  {
    slug: "contributing",
    title: "Contributing",
    description: "Submit verified corrections with source citations.",
    content: `Verified corrections with source citations are welcome. Prefer official government websites, gazette notifications, or press releases.

See the GitHub repository and Accountable India job runbooks for collection workflows.`,
  },
  {
    slug: "metrics",
    title: "Coverage Metrics",
    description: "What the dashboard coverage numbers mean.",
    content: `The dashboard reports fill rate (positions with a current appointment), verification rate, and per-state DM/SP coverage. Counts update when the CSV source tables are rebuilt into accountable-india.json.`,
  },
];

export function getAllWikiPages(): WikiPage[] {
  return PAGES;
}

export function getWikiPage(slug: string): WikiPage | undefined {
  return PAGES.find((p) => p.slug === slug);
}
