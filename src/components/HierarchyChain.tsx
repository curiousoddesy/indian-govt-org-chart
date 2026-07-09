interface Contact {
  type: string;
  value: string;
  label?: string | null;
}

export interface HierarchyNode {
  rung: number;
  positionId: number;
  role: string;
  whyResponsible: string;
  person: { name: string; party?: string | null } | null;
  vacant?: boolean;
  jurisdiction?: {
    id: number;
    name: string | null;
    level: string | null;
    state?: string | null;
  };
  body?: string | null;
  reportsTo?: string | null;
  contacts: Contact[];
  status?: string | null;
  confidence?: number | null;
  sourceUrl?: string | null;
}

export interface AccountabilityResolution {
  matchedTopic: {
    id: number;
    name: string;
    description?: string | null;
    confidence: number;
  } | null;
  jurisdiction: { id: number; name: string; level: string } | null;
  jurisdictionPath: Array<{ id: number; name: string; level: string }>;
  hierarchy: HierarchyNode[];
  gaps: string[];
  evidence: Array<Record<string, unknown>>;
}

function contactHref(type: string, value: string) {
  if (type.includes("email") || value.includes("@")) return `mailto:${value}`;
  if (type.includes("phone") || type.includes("helpline")) {
    return `tel:${value.replace(/\s+/g, "")}`;
  }
  if (value.startsWith("http")) return value;
  return undefined;
}

export default function HierarchyChain({
  resolution,
}: {
  resolution: AccountabilityResolution;
}) {
  if (!resolution?.hierarchy?.length) {
    return (
      <div className="panel border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-950">
        <p className="font-medium">No hierarchy established from the dataset.</p>
        {resolution?.gaps?.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {resolution.gaps.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--rule)] pb-3">
        <div>
          <p className="eyebrow mb-1">Accountability chain</p>
          <h2 className="display text-xl sm:text-2xl">
            {resolution.matchedTopic?.name ?? "Matched issue"}
            {resolution.jurisdiction
              ? ` · ${resolution.jurisdiction.name}`
              : ""}
          </h2>
          {resolution.jurisdictionPath?.length > 0 && (
            <p className="mt-1 text-xs uppercase tracking-[0.08em] text-ink-500">
              {resolution.jurisdictionPath.map((p) => p.name).join(" → ")}
            </p>
          )}
        </div>
        {resolution.matchedTopic && (
          <p className="text-xs text-ink-500">
            Topic match{" "}
            {Math.round(resolution.matchedTopic.confidence * 100)}%
          </p>
        )}
      </div>

      <ol className="relative space-y-0">
        {resolution.hierarchy.map((node, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === resolution.hierarchy.length - 1;
          return (
            <li key={`${node.positionId}-${node.rung}`} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className="absolute left-[15px] top-8 bottom-0 w-px bg-[var(--rule)]"
                  aria-hidden
                />
              )}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border text-xs font-bold ${
                  isFirst
                    ? "border-saffron-500 bg-saffron-500 text-white"
                    : "border-ink-950 bg-white text-ink-950"
                }`}
              >
                {node.rung + 1}
              </div>
              <div className="min-w-0 flex-1 border border-[var(--rule)] bg-white/85 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    {isFirst && (
                      <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-saffron-600">
                        Start here
                      </p>
                    )}
                    <h3 className="font-display text-lg font-semibold leading-snug text-ink-950">
                      {node.role}
                    </h3>
                    <p className="mt-1 text-sm text-ink-700">
                      {node.person?.name ? (
                        <>
                          <span className="font-medium text-ink-950">
                            {node.person.name}
                          </span>
                          {node.person.party ? ` · ${node.person.party}` : ""}
                        </>
                      ) : (
                        <span className="italic text-ink-500">
                          {node.vacant ? "Vacant / not named in dataset" : "Holder not in dataset"}
                        </span>
                      )}
                    </p>
                  </div>
                  {node.status && (
                    <span className="badge bg-ink-100 text-ink-600">
                      {node.status}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  <span className="font-medium text-ink-800">Why: </span>
                  {node.whyResponsible}
                </p>

                {node.contacts?.length > 0 && (
                  <ul className="mt-3 space-y-1.5 border-t border-[var(--rule)] pt-3">
                    {node.contacts.map((c) => {
                      const href = contactHref(c.type, c.value);
                      return (
                        <li
                          key={`${c.type}-${c.value}`}
                          className="flex flex-wrap items-baseline gap-x-2 text-sm"
                        >
                          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-400">
                            {c.type.replace(/_/g, " ")}
                          </span>
                          {href ? (
                            <a
                              href={href}
                              className="font-medium text-saffron-700 underline decoration-saffron-400/40 underline-offset-2"
                              target={href.startsWith("http") ? "_blank" : undefined}
                              rel="noreferrer"
                            >
                              {c.value}
                            </a>
                          ) : (
                            <span className="text-ink-800">{c.value}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {resolution.gaps?.length > 0 && (
        <div className="border border-[var(--rule)] bg-ink-50/80 p-3 text-sm text-ink-600">
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ink-400">
            Dataset gaps
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {resolution.gaps.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
