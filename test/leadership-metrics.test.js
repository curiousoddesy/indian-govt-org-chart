import test from "node:test";
import assert from "node:assert/strict";

import {
  attachStateLeadership,
  buildLeadership,
  buildRecentChanges,
  isChiefMinisterTitle,
  isGovernorTitle,
  isStateHeadChangeTitle,
  isUnionCabinetTitle,
  leadershipSummaryLine,
  partitionStatePositions,
} from "../scripts/leadership-metrics.mjs";

test("classifies high-office titles", () => {
  assert.equal(isChiefMinisterTitle("Chief Minister of Karnataka"), true);
  assert.equal(isChiefMinisterTitle("Deputy Chief Minister of Karnataka"), false);
  assert.equal(isGovernorTitle("Governor of Bihar"), true);
  assert.equal(isGovernorTitle("Lieutenant Governor of Delhi"), true);
  assert.equal(isUnionCabinetTitle("Minister of Education"), true);
  assert.equal(isUnionCabinetTitle("Minister of State, Minority Affairs"), false);
  assert.equal(isStateHeadChangeTitle("Minister of Karnataka (Home)"), false);
  assert.equal(isStateHeadChangeTitle("Minister of State, Minority Affairs"), true);
});

test("buildLeadership snapshots union heads, vacant MoS, and CMs", () => {
  const leadership = buildLeadership([
    {
      id: 1,
      title: "President of India",
      person_name: "Droupadi Murmu",
      jurisdiction_level: "union",
      jurisdiction_id: 1,
      is_vacant: false,
    },
    {
      id: 3,
      title: "Prime Minister of India",
      person_name: "Narendra Modi",
      jurisdiction_level: "union",
      jurisdiction_id: 1,
      is_vacant: false,
    },
    {
      id: 8,
      title: "Minister of Education",
      person_name: "Pralhad Joshi",
      person_party: "BJP",
      jurisdiction_level: "union",
      jurisdiction_id: 1,
      position_type: "political_executive",
      is_vacant: false,
    },
    {
      id: 72,
      title: "Minister of State, Minority Affairs",
      person_name: null,
      jurisdiction_level: "union",
      jurisdiction_id: 1,
      is_vacant: true,
    },
    {
      id: 107,
      title: "Chief Minister of Karnataka",
      person_name: "D. K. Shivakumar",
      jurisdiction_name: "Karnataka",
      is_vacant: false,
    },
  ]);

  assert.equal(leadership.union[0].person_name, "Droupadi Murmu");
  assert.equal(
    leadership.union.find((row) => row.title === "Minister of Education")?.person_name,
    "Pralhad Joshi"
  );
  assert.equal(leadership.cabinet.length, 1);
  assert.equal(leadership.vacantMos.length, 1);
  assert.equal(leadership.chiefMinisters[0].person_name, "D. K. Shivakumar");
  assert.match(leadershipSummaryLine(leadership), /Pralhad Joshi \(additional charge\)/);
  assert.match(leadershipSummaryLine(leadership), /D\. K\. Shivakumar/);
  assert.match(leadershipSummaryLine(leadership), /Minority Affairs/);
});

test("buildRecentChanges keeps 2026 head-of-government moves from the weekly run", () => {
  const changes = buildRecentChanges(
    [
      {
        id: 2712,
        person_name: "D. K. Shivakumar",
        position_title: "Chief Minister of Karnataka",
        jurisdiction_name: "Karnataka",
        start_date: "2026-06-03",
        end_date: null,
        is_current: true,
        last_verified_at: "2026-08-13",
        notes: "Chief Minister of Karnataka (Shivakumar ministry)",
      },
      {
        id: 96,
        person_name: "Siddaramaiah",
        position_title: "Chief Minister of Karnataka",
        jurisdiction_name: "Karnataka",
        start_date: "2023-05-20",
        end_date: "2026-05-29",
        is_current: false,
        last_verified_at: "2026-08-13",
      },
      {
        id: 71,
        person_name: "George Kurian",
        position_title: "Minister of State, Minority Affairs",
        start_date: "2024-06-10",
        end_date: "2026-06-23",
        is_current: false,
        last_verified_at: "2026-08-13",
      },
      {
        id: 2719,
        person_name: "Priyank Kharge",
        position_title: "Minister of Karnataka (Home (excluding Intelligence); IT & BT; E-Governance)",
        start_date: "2026-06-03",
        is_current: true,
        last_verified_at: "2026-08-13",
      },
      {
        id: 3,
        person_name: "Narendra Modi",
        position_title: "Prime Minister of India",
        start_date: "2024-06-09",
        is_current: true,
        last_verified_at: "2026-08-13",
      },
    ],
    "2026-08-13"
  );

  const names = changes.map((row) => row.person_name);
  assert.deepEqual(names.sort(), ["D. K. Shivakumar", "George Kurian", "Siddaramaiah"]);
});

test("attachStateLeadership and partitionStatePositions surface CM before vacant portfolios", () => {
  const positions = [
    {
      id: 401,
      title: "Minister of Karnataka (Higher Education)",
      position_type: "political_executive",
      person_name: null,
      is_vacant: true,
      jurisdiction_id: 12,
    },
    {
      id: 107,
      title: "Chief Minister of Karnataka",
      position_type: "political_executive",
      person_name: "D. K. Shivakumar",
      jurisdiction_id: 12,
    },
    {
      id: 106,
      title: "Governor of Karnataka",
      position_type: "constitutional",
      person_name: "Thawar Chand Gehlot",
      jurisdiction_id: 12,
    },
    {
      id: 373,
      title: "Minister of Karnataka (Home)",
      position_type: "political_executive",
      person_name: "Priyank Kharge",
      jurisdiction_id: 12,
    },
    {
      id: 900,
      title: "District Magistrate / Collector, Bengaluru Urban",
      position_type: "bureaucratic",
      person_name: "A. Collector",
      jurisdiction_id: 99,
    },
  ];

  const stats = attachStateLeadership(
    [{ id: 12, name: "Karnataka", districts: 31, positions: 40, dms_total: 31, dms_filled: 31 }],
    positions
  );
  assert.equal(stats[0].cm_name, "D. K. Shivakumar");
  assert.equal(stats[0].governor_name, "Thawar Chand Gehlot");
  assert.equal(stats[0].cabinet_filled, 2);
  assert.equal(stats[0].cabinet_vacant, 1);

  const parts = partitionStatePositions(positions);
  assert.equal(parts.leadership[0].title, "Governor of Karnataka");
  assert.equal(parts.leadership[1].person_name, "D. K. Shivakumar");
  assert.equal(parts.cabinet[0].person_name, "Priyank Kharge");
  assert.equal(parts.vacantPolitical.length, 1);
  assert.equal(parts.other.length, 1);
});
