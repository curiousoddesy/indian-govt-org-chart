/**
 * High-office snapshot used by dashboards and the AI context summary.
 * Built from enriched positions/appointments at CSV→JSON compile time.
 */

export const UNION_LEADERSHIP_TITLES = [
  "President of India",
  "Vice President of India",
  "Prime Minister of India",
  "Minister of Home Affairs",
  "Minister of Defence",
  "Minister of Finance",
  "Minister of Education",
  "Minister of External Affairs",
];

export const CONSTITUTIONAL_TITLES = [
  "Chief Justice of India",
  "Chief Election Commissioner of India",
  "Comptroller and Auditor General of India",
  "Attorney General for India",
  "Speaker of the Lok Sabha",
  "Cabinet Secretary of India",
];

export function officeRow(position) {
  return {
    id: position.id,
    title: position.title,
    person_name: position.person_name ?? null,
    person_party: position.person_party ?? null,
    jurisdiction_name: position.jurisdiction_name ?? null,
    is_vacant: Boolean(position.is_vacant),
    last_verified_at: position.last_verified_at ?? null,
  };
}

export function isChiefMinisterTitle(title) {
  return typeof title === "string" && /^Chief Minister of /.test(title);
}

export function isDeputyChiefMinisterTitle(title) {
  return typeof title === "string" && title.includes("Deputy Chief Minister");
}

export function isGovernorTitle(title) {
  return (
    typeof title === "string" &&
    (/^Governor of /.test(title) || /^Lieutenant Governor of /.test(title))
  );
}

export function isAdministratorTitle(title) {
  return typeof title === "string" && /^Administrator of /.test(title);
}

export function isUnionCabinetTitle(title) {
  return (
    typeof title === "string" &&
    title.startsWith("Minister of ") &&
    !title.startsWith("Minister of State") &&
    !/^Minister of [A-Za-z .]+ \(/.test(title)
  );
}

export function isMosIndependentTitle(title) {
  return (
    typeof title === "string" &&
    title.startsWith("Minister of State") &&
    title.includes("Independent Charge")
  );
}

export function isMosTitle(title) {
  return (
    typeof title === "string" &&
    title.startsWith("Minister of State") &&
    !title.includes("Independent Charge")
  );
}

function isUnionLevel(position) {
  return position.jurisdiction_level === "union" || position.jurisdiction_id === 1;
}

function pickByTitles(positions, titles) {
  const byTitle = new Map();
  for (const position of positions) {
    if (titles.includes(position.title)) byTitle.set(position.title, position);
  }
  return titles.map((title) => byTitle.get(title)).filter(Boolean).map(officeRow);
}

export function isStateHeadChangeTitle(title) {
  if (!title) return false;
  if (isChiefMinisterTitle(title) || isDeputyChiefMinisterTitle(title)) return true;
  if (isGovernorTitle(title) || isAdministratorTitle(title)) return true;
  if (isUnionCabinetTitle(title) || isMosTitle(title) || isMosIndependentTitle(title)) {
    return true;
  }
  const lower = title.toLowerCase();
  return (
    lower.includes("president of india") ||
    lower.includes("vice president") ||
    lower.includes("prime minister") ||
    lower.includes("chief justice") ||
    lower.includes("speaker of the lok") ||
    lower.includes("attorney general") ||
    lower.includes("election commissioner") ||
    lower.includes("comptroller and auditor")
  );
}

export function buildLeadership(enrichedPositions) {
  const unionPositions = enrichedPositions.filter(isUnionLevel);

  const cabinet = unionPositions
    .filter((p) => isUnionCabinetTitle(p.title) && p.position_type === "political_executive")
    .map(officeRow);

  const mosIndependent = unionPositions.filter((p) => isMosIndependentTitle(p.title)).map(officeRow);
  const mos = unionPositions.filter((p) => isMosTitle(p.title)).map(officeRow);

  const uniqueCabinetHolders = new Set(
    cabinet.map((row) => row.person_name).filter(Boolean)
  );

  return {
    union: pickByTitles(enrichedPositions, UNION_LEADERSHIP_TITLES),
    constitutional: pickByTitles(enrichedPositions, CONSTITUTIONAL_TITLES),
    cabinet,
    mosIndependent,
    mos,
    vacantMos: mos.filter((row) => row.is_vacant || !row.person_name),
    cabinetHolderCount: uniqueCabinetHolders.size,
    chiefMinisters: enrichedPositions
      .filter((p) => isChiefMinisterTitle(p.title))
      .map(officeRow),
    governors: enrichedPositions.filter((p) => isGovernorTitle(p.title)).map(officeRow),
    administrators: enrichedPositions
      .filter((p) => isAdministratorTitle(p.title))
      .map(officeRow),
  };
}

export function buildRecentChanges(enrichedAppointments, runDate, { since = "2026-03-01" } = {}) {
  return enrichedAppointments
    .filter((appointment) => appointment.last_verified_at === runDate)
    .filter((appointment) => isStateHeadChangeTitle(appointment.position_title))
    .filter((appointment) => {
      if (appointment.is_current && appointment.start_date && appointment.start_date >= since) {
        return true;
      }
      if (!appointment.is_current && appointment.end_date && appointment.end_date >= since) {
        return true;
      }
      return false;
    })
    .map((appointment) => ({
      id: appointment.id,
      person_name: appointment.person_name ?? null,
      position_title: appointment.position_title ?? null,
      jurisdiction_name: appointment.jurisdiction_name ?? null,
      start_date: appointment.start_date ?? null,
      end_date: appointment.end_date ?? null,
      is_current: Boolean(appointment.is_current),
      notes: appointment.notes ?? null,
    }))
    .sort((a, b) => {
      const dateA = a.end_date || a.start_date || "";
      const dateB = b.end_date || b.start_date || "";
      return dateB.localeCompare(dateA);
    });
}

export function attachStateLeadership(stateStats, enrichedPositions) {
  return stateStats.map((state) => {
    const inState = enrichedPositions.filter((p) => p.jurisdiction_id === state.id);
    const cm = inState.find((p) => isChiefMinisterTitle(p.title));
    const governor = inState.find((p) => isGovernorTitle(p.title));
    const dcms = inState
      .filter((p) => isDeputyChiefMinisterTitle(p.title) && p.person_name)
      .map((p) => p.person_name);
    const cabinetFilled = inState.filter(
      (p) =>
        p.position_type === "political_executive" &&
        p.person_name &&
        !isGovernorTitle(p.title)
    ).length;
    const cabinetVacant = inState.filter(
      (p) => p.position_type === "political_executive" && (p.is_vacant || !p.person_name)
    ).length;
    return {
      ...state,
      cm_name: cm?.person_name ?? null,
      governor_name: governor?.person_name ?? null,
      dcm_names: dcms,
      cabinet_filled: cabinetFilled,
      cabinet_vacant: cabinetVacant,
    };
  });
}

export function leadershipSummaryLine(leadership) {
  const nameOf = (title) =>
    leadership.union.find((row) => row.title === title)?.person_name ?? "unlisted";
  const education = leadership.union.find((row) => row.title === "Minister of Education");
  const karnataka = leadership.chiefMinisters.find((row) =>
    (row.title || "").includes("Karnataka")
  );
  const vacantMos = leadership.vacantMos
    .map((row) => row.title.replace(/^Minister of State, /, ""))
    .join("; ");
  return [
    `Union leadership: President ${nameOf("President of India")}; Vice President ${nameOf("Vice President of India")}; Prime Minister ${nameOf("Prime Minister of India")}; Education Minister ${education?.person_name ?? "unlisted"}${education?.person_name === "Pralhad Joshi" ? " (additional charge)" : ""}.`,
    karnataka?.person_name
      ? `Karnataka Chief Minister: ${karnataka.person_name}.`
      : null,
    vacantMos
      ? `Vacant Union MoS seats: ${vacantMos}.`
      : "No vacant Union MoS seats in the current snapshot.",
  ]
    .filter(Boolean)
    .join(" ");
}

export function rankStatePosition(position) {
  const title = position.title ?? "";
  if (isGovernorTitle(title)) return 0;
  if (isChiefMinisterTitle(title)) return 1;
  if (isDeputyChiefMinisterTitle(title)) return 2;
  if (position.position_type === "political_executive" && position.person_name) return 3;
  if (position.position_type === "political_executive") return 4;
  return 5;
}

export function partitionStatePositions(positions) {
  const leadership = [];
  const cabinet = [];
  const vacantPolitical = [];
  const other = [];
  for (const position of [...positions].sort(
    (a, b) => rankStatePosition(a) - rankStatePosition(b) || String(a.title).localeCompare(String(b.title))
  )) {
    const title = position.title ?? "";
    if (isGovernorTitle(title) || isChiefMinisterTitle(title) || isDeputyChiefMinisterTitle(title)) {
      leadership.push(position);
    } else if (position.position_type === "political_executive" && position.person_name) {
      cabinet.push(position);
    } else if (position.position_type === "political_executive") {
      vacantPolitical.push(position);
    } else {
      other.push(position);
    }
  }
  return { leadership, cabinet, vacantPolitical, other };
}
