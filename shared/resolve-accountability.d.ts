export function resolveAccountability(
  dataset: unknown,
  input: { problem?: string; location?: string }
): unknown;

export function formatHierarchyForPrompt(resolution: unknown): string;

export function matchTopic(
  dataset: unknown,
  problemText: string
): unknown;

export function matchJurisdiction(
  dataset: unknown,
  locationText: string,
  problemText?: string
): unknown;
