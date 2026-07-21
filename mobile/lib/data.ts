import Fuse from "fuse.js";
import type { Dataset, SearchRecord } from "./types";

/** Production dataset served by the Netlify web app. */
export const DATA_URL =
  "https://indianorgchart.netlify.app/data/accountable-india.json";

export const CHAT_URL = "https://indianorgchart.netlify.app/api/chat";

let cached: Dataset | null = null;
let fuse: Fuse<SearchRecord> | null = null;
let loadPromise: Promise<Dataset> | null = null;

export function clearDatasetCache() {
  cached = null;
  fuse = null;
  loadPromise = null;
}

export async function loadDataset(options?: {
  force?: boolean;
}): Promise<Dataset> {
  if (options?.force) clearDatasetCache();
  if (cached) return cached;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`Failed to load dataset (${res.status})`);
    cached = (await res.json()) as Dataset;
    fuse = new Fuse(cached.searchIndex, {
      keys: ["label", "subtitle", "keywords", "type"],
      threshold: 0.35,
      includeScore: true,
    });
    return cached;
  })().catch((err) => {
    loadPromise = null;
    throw err;
  });

  return loadPromise;
}

export function search(query: string, limit = 20): SearchRecord[] {
  if (!fuse || !query.trim()) return [];
  return fuse.search(query, { limit }).map((r) => r.item);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function formatLevel(level: string): string {
  return level
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function statusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case "verified":
      return { bg: "#dcfce7", text: "#15803d" };
    case "collected":
      return { bg: "#dbeafe", text: "#1d4ed8" };
    case "pending":
      return { bg: "#fef3c7", text: "#b45309" };
    case "stale":
      return { bg: "#fee2e2", text: "#b91c1c" };
    default:
      return { bg: "#eceef2", text: "#515f78" };
  }
}
