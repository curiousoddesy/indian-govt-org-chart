import type { Context, Config } from "@netlify/functions";
import fs from "node:fs";
import path from "node:path";
import {
  createChatHandler,
  loadAiContextFromCandidates,
} from "./_shared/chat-core.mjs";

let cachedAiContext: unknown | undefined;
let cachedDataset: unknown | undefined;

function loadAiContext() {
  if (cachedAiContext !== undefined) return cachedAiContext;
  const candidates = [
    path.join(process.cwd(), "dist/data/ai-context.json"),
    path.join(process.cwd(), "public/data/ai-context.json"),
    path.join(process.cwd(), "data/ai-context.json"),
  ];
  cachedAiContext = loadAiContextFromCandidates(candidates, fs.readFileSync);
  return cachedAiContext;
}

function loadDataset() {
  if (cachedDataset !== undefined) return cachedDataset;
  const candidates = [
    path.join(process.cwd(), "dist/data/accountable-india.json"),
    path.join(process.cwd(), "public/data/accountable-india.json"),
    path.join(process.cwd(), "data/accountable-india.json"),
  ];
  cachedDataset = loadAiContextFromCandidates(candidates, fs.readFileSync);
  return cachedDataset;
}

const chatHandler = createChatHandler({
  getApiKey: () => Netlify.env.get("DEEPSEEK_API_KEY"),
  loadAiContext,
  loadDataset,
  fetchImpl: fetch,
  logger: console,
});

export default async (req: Request, _context: Context) => chatHandler(req);

export const config: Config = {
  path: "/api/chat",
  method: ["POST"],
};
