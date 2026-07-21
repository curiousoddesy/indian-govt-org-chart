import Fuse from "fuse.js";
import type { Dataset, SearchRecord } from "./types";

export const DATA_URL =
  "https://indianorgchart.netlify.app/data/accountable-india.json";

let cached: Dataset | null = null;
let fuse: Fuse<SearchRecord> | null = null;

export async function loadDataset(
  onProgress?: (loadedBytes: number) => void
): Promise<Dataset> {
  if (cached) return cached;

  const res = await fetch(DATA_URL);
  if (!res.ok) {
    throw new Error(`Failed to load dataset (${res.status})`);
  }

  // Stream when possible so we can show download progress for ~12MB JSON.
  const reader = res.body?.getReader();
  if (!reader) {
    cached = (await res.json()) as Dataset;
  } else {
    const chunks: Uint8Array[] = [];
    let received = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.length;
        onProgress?.(received);
      }
    }
    const total = chunks.reduce((n, c) => n + c.length, 0);
    const merged = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    const text = new TextDecoder().decode(merged);
    cached = JSON.parse(text) as Dataset;
  }

  fuse = new Fuse(cached.searchIndex, {
    keys: ["label", "subtitle", "keywords", "type"],
    threshold: 0.35,
    includeScore: true,
  });
  return cached;
}

export function search(query: string, limit = 30): SearchRecord[] {
  if (!fuse || !query.trim()) return [];
  return fuse.search(query, { limit }).map((r) => r.item);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function formatLevel(level: string): string {
  return level.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function statusColors(status: string): { bg: string; text: string } {
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
      return { bg: "#e8edf5", text: "#515f78" };
  }
}
