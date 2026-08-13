import type { Position } from "./types";

function isChiefMinisterTitle(title: string) {
  return /^Chief Minister of /.test(title);
}

function isDeputyChiefMinisterTitle(title: string) {
  return title.includes("Deputy Chief Minister");
}

function isGovernorTitle(title: string) {
  return /^Governor of /.test(title) || /^Lieutenant Governor of /.test(title);
}

function rankStatePosition(position: Position) {
  const title = position.title ?? "";
  if (isGovernorTitle(title)) return 0;
  if (isChiefMinisterTitle(title)) return 1;
  if (isDeputyChiefMinisterTitle(title)) return 2;
  if (position.position_type === "political_executive" && position.person_name) return 3;
  if (position.position_type === "political_executive") return 4;
  return 5;
}

export function partitionStatePositions(positions: Position[]) {
  const leadership: Position[] = [];
  const cabinet: Position[] = [];
  const vacantPolitical: Position[] = [];
  const other: Position[] = [];
  for (const position of [...positions].sort(
    (a, b) =>
      rankStatePosition(a) - rankStatePosition(b) ||
      String(a.title).localeCompare(String(b.title))
  )) {
    const title = position.title ?? "";
    if (
      isGovernorTitle(title) ||
      isChiefMinisterTitle(title) ||
      isDeputyChiefMinisterTitle(title)
    ) {
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
