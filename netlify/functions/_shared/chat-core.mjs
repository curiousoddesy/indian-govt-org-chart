import {
  formatHierarchyForPrompt,
  resolveAccountability,
} from "./resolve-accountability.mjs";

export const DEEPSEEK_URL = "https://api.deepseek.com/chat/completions";

export const SYSTEM_PROMPT = `You are the accountability guide for Indian citizens.

Your only job: given a problem someone is facing, explain WHO is accountable — from the local office at the bottom up to higher authorities — using ONLY the structured Accountable India resolution provided below.

Rules (strict):
- The STRUCTURED ACCOUNTABILITY RESOLUTION is the sole golden source for office-holders, contacts, and why each rung is responsible.
- Do NOT invent names, phone numbers, emails, or offices from general knowledge.
- If the resolution hierarchy is empty or gaps say the dataset does not establish a fact, say that clearly. Do not fill gaps from memory.
- Present the hierarchy BOTTOM → TOP (local first, then escalation).
- For each rung: role, current holder (or vacant/unknown), why they are responsible, and any official contacts from the data.
- Mention data_status / confidence when it is pending, stale, or low.
- Keep the tone calm, civic, and actionable. Short paragraphs + bullets.
- If location is missing, ask for city/district so local offices can be resolved.`;

const STOP_WORDS = new Set([
  "a",
  "about",
  "an",
  "and",
  "are",
  "at",
  "be",
  "by",
  "do",
  "does",
  "for",
  "from",
  "have",
  "how",
  "i",
  "in",
  "is",
  "it",
  "me",
  "of",
  "on",
  "please",
  "the",
  "to",
  "we",
  "what",
  "which",
  "who",
  "with",
]);

const TOKEN_ALIASES = {
  dm: ["district", "magistrate", "collector"],
  sp: ["superintendent", "police"],
  cm: ["chief", "minister"],
  pm: ["prime", "minister"],
  cs: ["chief", "secretary"],
};

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function tokenizeQuery(value) {
  const baseTokens = normalizeText(value)
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
  const tokens = new Set(baseTokens);
  for (const token of baseTokens) {
    for (const alias of TOKEN_ALIASES[token] ?? []) tokens.add(alias);
    if (token.length > 4 && token.endsWith("s")) {
      tokens.add(token.slice(0, -1));
    }
  }
  return [...tokens];
}

export function retrieveGroundingRecords(aiContext, messages, limit = 40) {
  const records = Array.isArray(aiContext?.groundingRecords)
    ? aiContext.groundingRecords
    : [];
  const latestUserMessage = [...(Array.isArray(messages) ? messages : [])]
    .reverse()
    .find(
      (message) =>
        message?.role === "user" && typeof message.content === "string"
    );
  const tokens = tokenizeQuery(latestUserMessage?.content);
  if (records.length === 0 || tokens.length === 0) return [];
  const routingIntent = tokens.some((token) =>
    ["complaint", "handle", "responsibility", "responsible"].includes(token)
  );
  const contactIntent = tokens.some((token) =>
    ["contact", "email", "phone", "telephone"].includes(token)
  );
  const contentTokens = tokens.filter(
    (token) =>
      ![
        "complaint",
        "handle",
        "responsibility",
        "responsible",
        "office",
        "contact",
        "email",
        "phone",
        "telephone",
      ].includes(token)
  );
  if (contentTokens.length === 0) return [];

  const ranked = records
    .map((record) => {
      const { reportsTo: _reportsTo, sourceUrl: _sourceUrl, ...searchable } =
        record;
      const text = normalizeText(JSON.stringify(searchable));
      const words = new Set(text.split(/\s+/));
      let score = contentTokens.reduce((total, token) => {
        if (words.has(token)) return total + 4;
        if (token.length >= 4 && text.includes(token)) return total + 2;
        return total;
      }, 0);
      if (score > 0 && routingIntent && record.kind === "responsibility") {
        score += 8;
      }
      if (
        score > 0 &&
        contactIntent &&
        Array.isArray(record.contacts) &&
        record.contacts.length > 0
      ) {
        score += 6;
      }
      return { record, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        String(a.record.id).localeCompare(String(b.record.id))
    );
  const bestScore = ranked[0]?.score ?? 0;
  const cutoff = contentTokens.length > 1 ? Math.max(1, bestScore - 3) : 1;

  return ranked
    .filter(({ score }) => score >= cutoff)
    .slice(0, limit)
    .map(({ record }) => record);
}

export function validateMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "messages array is required.";
  }
  if (messages.length > 40) {
    return "messages array cannot contain more than 40 messages.";
  }
  if (
    messages.reduce(
      (total, message) =>
        total +
        (typeof message?.content === "string" ? message.content.length : 0),
      0
    ) > 32000
  ) {
    return "Combined message content cannot exceed 32000 characters.";
  }
  const valid = messages.every(
    (message) =>
      message &&
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0 &&
      message.content.length <= 4000
  );
  return valid
    ? null
    : "Each message needs a user/assistant role and 1–4000 characters of content.";
}

export function loadAiContextFromCandidates(candidates, readFileSync) {
  for (const candidate of candidates) {
    try {
      return JSON.parse(readFileSync(candidate, "utf8"));
    } catch {
      // Try the next build/local path.
    }
  }
  return null;
}

export function extractProblemAndLocation(messages = [], payload = {}) {
  const latestUserMessage = [...(Array.isArray(messages) ? messages : [])]
    .reverse()
    .find(
      (message) =>
        message?.role === "user" && typeof message.content === "string"
    );
  const problem =
    (typeof payload.problem === "string" && payload.problem.trim()) ||
    latestUserMessage?.content ||
    "";
  const location =
    (typeof payload.location === "string" && payload.location.trim()) || "";
  return { problem, location };
}

export function buildContextBlock(
  aiContext,
  messages = [],
  { dataset = null, problem = "", location = "" } = {}
) {
  if (!aiContext && !dataset) return "";

  const resolution =
    dataset != null
      ? resolveAccountability(dataset, { problem, location })
      : null;
  const retrieved = retrieveGroundingRecords(aiContext ?? { groundingRecords: [] }, messages);
  const retrievedText =
    retrieved.length > 0
      ? retrieved
          .slice(0, 12)
          .map((record) => JSON.stringify(record))
          .join("\n")
      : "No supplemental grounding records matched.";

  const topics = Array.isArray(aiContext?.topics) ? aiContext.topics : [];

  return `\n\n--- ACCOUNTABLE INDIA (generated ${aiContext?.generatedAt ?? dataset?.meta?.generatedAt ?? "unknown"}) ---
${aiContext?.summary ?? dataset?.meta?.description ?? ""}

Citizen topics in the dataset:
${topics.map((topic) => `- ${topic.name}: ${topic.keywords}`).join("\n") || "(see structured resolution)"}

--- STRUCTURED ACCOUNTABILITY RESOLUTION (golden source — use only this for holders/contacts/why) ---
Problem: ${problem || "(empty)"}
Location: ${location || "(not provided)"}
${formatHierarchyForPrompt(resolution)}

--- Supplemental retrieved records (optional colour; never override the structured resolution) ---
${retrievedText}`;
}

export function createChatHandler({
  getApiKey,
  loadAiContext,
  loadDataset,
  fetchImpl,
  logger,
}) {
  return async function chatHandler(req) {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const apiKey = getApiKey();
    if (!apiKey) {
      return Response.json(
        { error: "DEEPSEEK_API_KEY is not configured." },
        { status: 503 }
      );
    }

    try {
      const payload = await req.json();
      const messages = payload.messages ?? [];
      const validationError = validateMessages(messages);
      if (validationError) {
        return Response.json(
          { error: validationError },
          { status: 400 }
        );
      }

      const { problem, location } = extractProblemAndLocation(messages, payload);
      const dataset = typeof loadDataset === "function" ? loadDataset() : null;
      const resolution =
        dataset != null
          ? resolveAccountability(dataset, { problem, location })
          : null;

      const contextBlock = buildContextBlock(loadAiContext(), messages, {
        dataset,
        problem,
        location,
      });
      const upstream = await fetchImpl(DEEPSEEK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-v4-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT + contextBlock },
            ...messages,
          ],
          thinking: { type: "disabled" },
          temperature: 0.2,
          max_tokens: 2048,
        }),
      });

      if (!upstream.ok) {
        const errText = await upstream.text();
        logger.error("DeepSeek API error:", upstream.status, errText);
        return Response.json(
          { error: "AI service unavailable.", detail: errText.slice(0, 200) },
          { status: 502 }
        );
      }

      const data = await upstream.json();
      const choice = data.choices?.[0];

      return Response.json({
        message: choice?.message ?? {
          role: "assistant",
          content: "No response.",
        },
        resolution,
        model: data.model,
        usage: data.usage,
      });
    } catch (error) {
      logger.error("Chat function error:", error);
      return Response.json(
        { error: "Failed to process chat request." },
        { status: 500 }
      );
    }
  };
}
