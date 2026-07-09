/// <reference types="vite/client" />

declare module "../lib/resolve-accountability.mjs" {
  export function resolveAccountability(
    dataset: unknown,
    input: { problem?: string; location?: string }
  ): unknown;
  export function formatHierarchyForPrompt(resolution: unknown): string;
}

declare module "../../shared/resolve-accountability.mjs" {
  export function resolveAccountability(
    dataset: unknown,
    input: { problem?: string; location?: string }
  ): unknown;
  export function formatHierarchyForPrompt(resolution: unknown): string;
}
