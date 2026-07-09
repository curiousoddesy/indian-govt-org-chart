/**
 * Deterministic citizen-problem → accountability hierarchy resolver.
 * Golden source only: Accountable India dataset (no model knowledge).
 */

const STOP = new Set([
  "a", "an", "the", "in", "on", "at", "to", "for", "of", "and", "or", "my",
  "is", "are", "was", "no", "not", "please", "help", "with", "from", "our",
  "we", "i", "me", "there", "here", "this", "that", "have", "has", "been",
]);

/** Topic id → title patterns used when responsibility_map is level-only. */
const TOPIC_TITLE_PATTERNS = {
  1: [/municipal commissioner/i, /mayor/i, /jal shakti/i, /water/i],
  2: [/municipal commissioner/i, /mayor/i, /\bpwd\b/i, /public works/i, /district magistrate|collector/i],
  3: [/electric|power|energy|discom/i, /chief secretary/i],
  4: [/municipal commissioner/i, /mayor/i],
  5: [/superintendent of police/i, /district magistrate|collector/i],
  6: [/health/i, /medical/i, /district magistrate|collector/i],
  7: [/education/i, /school/i, /district magistrate|collector/i],
  8: [/municipal commissioner/i, /mayor/i],
  9: [/municipal commissioner/i, /mayor/i],
  10: [/municipal commissioner/i, /mayor/i],
  11: [/railway/i],
  12: [/district magistrate|collector/i, /chief secretary/i],
  13: [/transport/i, /municipal commissioner/i],
  14: [/municipal commissioner/i, /mayor/i, /district magistrate|collector/i],
  15: [/election/i],
  16: [/court|justice|judge/i],
  17: [/finance|income tax|revenue/i],
};

const LOCAL_ESCALATION_PATTERNS = [
  /municipal commissioner/i,
  /mayor/i,
  /superintendent of police/i,
  /district magistrate|collector/i,
  /chief secretary/i,
  /chief minister/i,
];

export function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function tokenize(value = "") {
  return normalizeText(value)
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}

function keywordList(keywords) {
  if (!keywords) return [];
  return String(keywords)
    .split(",")
    .map((k) => normalizeText(k))
    .filter(Boolean);
}

export function matchTopic(dataset, problemText) {
  const text = normalizeText(problemText);
  const topics = dataset.topics ?? [];
  let best = null;
  let bestScore = 0;

  for (const topic of topics) {
    const keys = keywordList(topic.keywords);
    let score = 0;
    for (const key of keys) {
      if (!key) continue;
      if (text.includes(key)) score += key.split(" ").length >= 2 ? 4 : 2;
    }
    const name = normalizeText(topic.name);
    if (name && text.includes(name)) score += 3;
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  if (!best || bestScore <= 0) {
    return { topic: null, score: 0, confidence: 0 };
  }
  return {
    topic: best,
    score: bestScore,
    confidence: Math.min(0.95, 0.35 + bestScore * 0.08),
  };
}

export function matchJurisdiction(dataset, locationText, problemText = "") {
  const text = normalizeText([locationText, problemText].filter(Boolean).join(" "));
  if (!text) return { jurisdiction: null, score: 0, path: [] };

  const jurisdictions = dataset.jurisdictions ?? [];
  let best = null;
  let bestScore = 0;

  for (const j of jurisdictions) {
    const name = normalizeText(j.name);
    if (!name || name.length < 3) continue;
    if (!text.includes(name)) continue;
    // Prefer more specific / longer names; boost districts over states when both match.
    let score = name.length;
    if (j.level === "district") score += 20;
    if (j.level === "municipal_corporation" || j.level === "municipal") score += 25;
    if (j.level === "state" || j.level === "ut") score += 5;
    if (score > bestScore) {
      bestScore = score;
      best = j;
    }
  }

  if (!best) return { jurisdiction: null, score: 0, path: [] };
  return {
    jurisdiction: best,
    score: bestScore,
    path: jurisdictionPath(dataset, best),
  };
}

export function jurisdictionPath(dataset, jurisdiction) {
  const byId = indexBy(dataset.jurisdictions ?? [], "id");
  const path = [];
  let current = jurisdiction;
  const seen = new Set();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    path.unshift({
      id: current.id,
      name: current.name,
      level: current.level,
    });
    current = current.parent_id ? byId.get(current.parent_id) : null;
  }
  return path;
}

function indexBy(arr, key) {
  const map = new Map();
  for (const item of arr) map.set(item[key], item);
  return map;
}

function contactsForPosition(dataset, positionId) {
  return (dataset.contacts ?? [])
    .filter((c) => c.position_id === positionId && c.is_public !== false)
    .slice(0, 6)
    .map((c) => ({
      type: c.contact_type,
      value: c.value,
      label: c.label ?? null,
    }));
}

function toHierarchyNode(dataset, position, why, rung) {
  return {
    rung,
    positionId: position.id,
    role: position.title,
    whyResponsible: why,
    person: position.person_name
      ? {
          name: position.person_name,
          party: position.person_party ?? null,
        }
      : null,
    vacant: Boolean(position.is_vacant) && !position.person_name,
    jurisdiction: {
      id: position.jurisdiction_id,
      name: position.jurisdiction_name,
      level: position.jurisdiction_level,
      state: position.state_name ?? null,
    },
    body: position.body_name ?? null,
    reportsTo: position.reports_to_title ?? null,
    contacts: contactsForPosition(dataset, position.id),
    status: position.data_status ?? null,
    confidence: position.confidence ?? null,
    sourceUrl: position.source_url ?? null,
  };
}

function ancestorJurisdictionIds(dataset, jurisdiction) {
  if (!jurisdiction) return new Set();
  const byId = indexBy(dataset.jurisdictions ?? [], "id");
  const ids = new Set();
  let current = jurisdiction;
  const seen = new Set();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    ids.add(current.id);
    current = current.parent_id ? byId.get(current.parent_id) : null;
  }
  return ids;
}

function positionsInScope(dataset, jurisdictionIds) {
  if (!jurisdictionIds || jurisdictionIds.size === 0) {
    return dataset.positions ?? [];
  }
  return (dataset.positions ?? []).filter((p) =>
    jurisdictionIds.has(p.jurisdiction_id)
  );
}

/** Prefer exact place, then parents — never sibling districts. */
function rankedScopePositions(dataset, jurisdiction) {
  if (!jurisdiction) return dataset.positions ?? [];
  const byId = indexBy(dataset.jurisdictions ?? [], "id");
  const layers = [];
  let current = jurisdiction;
  const seen = new Set();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    layers.push(current.id);
    current = current.parent_id ? byId.get(current.parent_id) : null;
  }
  const ranked = [];
  for (const jid of layers) {
    for (const p of dataset.positions ?? []) {
      if (p.jurisdiction_id === jid) ranked.push(p);
    }
  }
  return ranked;
}

function findByPatterns(positions, patterns, limit = 3) {
  const found = [];
  const used = new Set();
  for (const pattern of patterns) {
    for (const p of positions) {
      if (used.has(p.id)) continue;
      if (pattern.test(p.title ?? "")) {
        found.push(p);
        used.add(p.id);
        if (found.length >= limit) return found;
      }
    }
  }
  return found;
}

function seedPositionsForMapping(dataset, mapping, topic, jurisdiction) {
  const positionById = indexBy(dataset.positions ?? [], "id");
  const seeds = [];
  const why = mapping.notes || `${topic.name} is routed to this office in the responsibility map.`;

  if (mapping.position_id && positionById.has(mapping.position_id)) {
    const mapped = positionById.get(mapping.position_id);
    // Prefer a local peer when the citizen named a place; keep mapped office as escalation tip.
    if (jurisdiction) {
      const localPeers = findByPatterns(
        rankedScopePositions(dataset, jurisdiction),
        TOPIC_TITLE_PATTERNS[topic.id] ?? LOCAL_ESCALATION_PATTERNS,
        1
      );
      for (const peer of localPeers) {
        if (peer.id !== mapped.id) {
          seeds.push({
            position: peer,
            why: `Local office matching this problem in ${jurisdiction.name}.`,
          });
        }
      }
    }
    seeds.push({ position: mapped, why });
    return seeds;
  }

  if (mapping.body_id) {
    const bodyPositions = (dataset.positions ?? []).filter(
      (p) => p.body_id === mapping.body_id
    );
    const rankedLocal = jurisdiction
      ? rankedScopePositions(dataset, jurisdiction).filter(
          (p) => p.body_id === mapping.body_id
        )
      : [];
    const pick = (rankedLocal.length ? rankedLocal : bodyPositions).slice(0, 1);
    for (const p of pick) seeds.push({ position: p, why });
    if (seeds.length) return seeds;
  }

  // Level-only mapping: one best local seed, then walk reports_to.
  const scopedPositions = rankedScopePositions(dataset, jurisdiction);
  const patterns = TOPIC_TITLE_PATTERNS[topic.id] ?? LOCAL_ESCALATION_PATTERNS;
  const local = findByPatterns(scopedPositions, patterns, 1);
  for (const p of local) {
    seeds.push({
      position: p,
      why:
        mapping.notes ||
        `${topic.name} is typically handled at the ${mapping.jurisdiction_level || "local"} level.`,
    });
  }
  return seeds;
}

function walkReportsTo(dataset, startPosition, maxDepth = 6) {
  const positionById = indexBy(dataset.positions ?? [], "id");
  const chain = [];
  let current = startPosition;
  const seen = new Set();
  while (current && chain.length < maxDepth && !seen.has(current.id)) {
    seen.add(current.id);
    chain.push(current);
    const nextId = current.reports_to_position_id;
    current = nextId ? positionById.get(nextId) : null;
  }
  return chain;
}

function mergeChains(seededChains) {
  // Use the best (most local) seed chain only — avoid sibling-city pollution.
  if (!seededChains.length) return [];
  const levelRank = (level) => {
    if (level === "district" || level === "municipal_corporation") return 0;
    if (level === "state" || level === "ut") return 1;
    return 2;
  };
  const sorted = [...seededChains].sort((a, b) => {
    const la = levelRank(a[0]?.jurisdiction?.level);
    const lb = levelRank(b[0]?.jurisdiction?.level);
    if (la !== lb) return la - lb;
    return b.length - a.length;
  });
  const primary = sorted[0];
  const ordered = [];
  const seen = new Set();
  for (const node of primary) {
    if (seen.has(node.positionId)) continue;
    seen.add(node.positionId);
    ordered.push(node);
  }
  // Append unique higher offices from other seed chains (e.g. Union ministry).
  for (const chain of sorted.slice(1)) {
    for (const node of chain) {
      if (seen.has(node.positionId)) continue;
      const lvl = node.jurisdiction?.level;
      if (lvl === "union" || lvl === "state" || lvl === "ut") {
        seen.add(node.positionId);
        ordered.push(node);
      }
    }
  }
  return ordered.map((node, idx) => ({ ...node, rung: idx }));
}

/**
 * Resolve a citizen problem into a bottom→top accountability hierarchy.
 */
export function resolveAccountability(dataset, { problem, location } = {}) {
  const gaps = [];
  const problemText = String(problem ?? "").trim();
  const locationText = String(location ?? "").trim();

  if (!problemText) {
    return {
      matchedTopic: null,
      jurisdiction: null,
      jurisdictionPath: [],
      hierarchy: [],
      gaps: ["Describe the problem you are facing."],
      evidence: [],
    };
  }

  const topicMatch = matchTopic(dataset, problemText);
  const placeMatch = matchJurisdiction(dataset, locationText, problemText);

  if (!topicMatch.topic) {
    gaps.push(
      "No matching citizen topic was found in the Accountable India topic list."
    );
  }
  if (!placeMatch.jurisdiction && locationText) {
    gaps.push(
      `Location "${locationText}" was not matched to a jurisdiction in the dataset.`
    );
  }
  if (!placeMatch.jurisdiction && !locationText) {
    gaps.push(
      "No location was provided — showing national/state policy offices where mapped; local escalation needs a city or district."
    );
  }

  const mappings = topicMatch.topic
    ? (dataset.responsibilityMap ?? [])
        .filter((r) => r.topic_id === topicMatch.topic.id)
        .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
    : [];

  if (topicMatch.topic && mappings.length === 0) {
    gaps.push(
      `Topic "${topicMatch.topic.name}" has no responsibility_map rows in the dataset.`
    );
  }

  const seededChains = [];
  const evidence = [];

  for (const mapping of mappings) {
    evidence.push({
      kind: "responsibility",
      topic: topicMatch.topic.name,
      notes: mapping.notes,
      jurisdictionLevel: mapping.jurisdiction_level,
      body: mapping.body_name,
      position: mapping.position_title,
      sourceUrl: mapping.source_url,
    });
    const seeds = seedPositionsForMapping(
      dataset,
      mapping,
      topicMatch.topic,
      placeMatch.jurisdiction
    );
    for (const seed of seeds) {
      const walked = walkReportsTo(dataset, seed.position);
      const nodes = walked.map((pos, idx) =>
        toHierarchyNode(
          dataset,
          pos,
          idx === 0
            ? seed.why
            : `Escalation: ${walked[idx - 1].title} reports to this office.`,
          idx
        )
      );
      if (nodes.length) seededChains.push(nodes);
    }
  }

  // Fallback: if topic matched but no seeds, try local escalation patterns.
  if (seededChains.length === 0 && placeMatch.jurisdiction) {
    const local = findByPatterns(
      rankedScopePositions(dataset, placeMatch.jurisdiction),
      LOCAL_ESCALATION_PATTERNS,
      1
    );
    for (const pos of local) {
      const walked = walkReportsTo(dataset, pos);
      seededChains.push(
        walked.map((p, idx) =>
          toHierarchyNode(
            dataset,
            p,
            idx === 0
              ? "Fallback district/local administration chain from the dataset."
              : `Escalation via reports_to from ${walked[idx - 1].title}.`,
            idx
          )
        )
      );
    }
    if (local.length === 0) {
      gaps.push(
        "No local offices matched this problem in the selected jurisdiction."
      );
    }
  }

  const hierarchy = mergeChains(seededChains);

  if (hierarchy.length === 0) {
    gaps.push(
      "The dataset does not establish an accountability hierarchy for this query."
    );
  }

  return {
    matchedTopic: topicMatch.topic
      ? {
          id: topicMatch.topic.id,
          name: topicMatch.topic.name,
          description: topicMatch.topic.description,
          confidence: topicMatch.confidence,
        }
      : null,
    jurisdiction: placeMatch.jurisdiction
      ? {
          id: placeMatch.jurisdiction.id,
          name: placeMatch.jurisdiction.name,
          level: placeMatch.jurisdiction.level,
        }
      : null,
    jurisdictionPath: placeMatch.path,
    hierarchy,
    gaps,
    evidence,
  };
}

export function formatHierarchyForPrompt(resolution) {
  if (!resolution) return "No structured resolution was produced.";
  return JSON.stringify(
    {
      matchedTopic: resolution.matchedTopic,
      jurisdiction: resolution.jurisdiction,
      jurisdictionPath: resolution.jurisdictionPath,
      hierarchy: resolution.hierarchy,
      gaps: resolution.gaps,
      evidence: resolution.evidence,
    },
    null,
    2
  );
}
