import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { ChatMessage } from "../lib/types";
import type { AccountabilityResolution } from "../components/HierarchyChain";
import HierarchyChain from "../components/HierarchyChain";
import { renderChatMarkdown } from "../lib/chat-markdown.mjs";
import { resolveAccountability } from "../lib/resolve";
import { loadDataset } from "../lib/data";

const EXAMPLES = [
  {
    problem: "No water in my society for three days",
    location: "Lucknow",
  },
  {
    problem: "Large pothole on my street, cars are getting damaged",
    location: "Pune",
  },
  {
    problem: "Police station is not filing my FIR",
    location: "Jaipur",
  },
  {
    problem: "Garbage not collected for a week",
    location: "Ahmedabad",
  },
];

export default function Chat() {
  const [params] = useSearchParams();
  const [problem, setProblem] = useState(params.get("problem") ?? "");
  const [location, setLocation] = useState(params.get("location") ?? "");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [resolution, setResolution] = useState<AccountabilityResolution | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const autoStarted = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, resolution]);

  useEffect(() => {
    if (autoStarted.current) return;
    const p = params.get("problem");
    const loc = params.get("location") ?? "";
    if (p?.trim()) {
      autoStarted.current = true;
      void submit(p, loc);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(problemText: string, locationText: string) {
    const trimmed = problemText.trim();
    if (!trimmed || loading) return;

    setError(null);
    setProblem(trimmed);
    setLocation(locationText.trim());
    setLoading(true);

    const userContent = locationText.trim()
      ? `${trimmed}\n\nLocation: ${locationText.trim()}`
      : trimmed;
    const userMsg: ChatMessage = { role: "user", content: userContent };
    const next = [...messages, userMsg];
    setMessages(next);

    // Instant structured ladder from the same golden dataset (client-side).
    try {
      const dataset = await loadDataset();
      const localResolution = resolveAccountability(dataset, {
        problem: trimmed,
        location: locationText.trim(),
      }) as AccountabilityResolution;
      setResolution(localResolution);
    } catch {
      // Server will still return resolution.
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          problem: trimmed,
          location: locationText.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }
      if (data.resolution) {
        setResolution(data.resolution as AccountabilityResolution);
      }
      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.message?.content ?? "No response.",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach AI agent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-enter mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <p className="eyebrow mb-2">Who is accountable?</p>
        <h1 className="display text-3xl sm:text-4xl">
          Describe the problem. Get the chain.
        </h1>
        <p className="mt-2 text-ink-600">
          Answers come only from the Accountable India register — offices,
          holders, contacts, and why each level is responsible — bottom to top.
        </p>
      </div>

      <form
        className="panel space-y-3 p-4 sm:p-5"
        onSubmit={(e) => {
          e.preventDefault();
          void submit(problem, location);
        }}
      >
        <label className="block">
          <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
            What is going wrong?
          </span>
          <textarea
            className="input min-h-[88px] resize-y"
            placeholder="e.g. No water supply in my society for three days"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            disabled={loading}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
            Where? (city or district)
          </span>
          <input
            type="text"
            className="input"
            placeholder="e.g. Lucknow"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          />
        </label>
        <button
          type="submit"
          className="btn-primary w-full sm:w-auto"
          disabled={loading || !problem.trim()}
        >
          {loading ? "Resolving…" : "Show who is accountable"}
        </button>
      </form>

      {messages.length === 0 && (
        <div>
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-500">
            Try an example
          </p>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.problem}
                type="button"
                onClick={() => {
                  setProblem(ex.problem);
                  setLocation(ex.location);
                  void submit(ex.problem, ex.location);
                }}
                className="border border-[var(--rule)] bg-white/80 px-3 py-2.5 text-left text-sm transition hover:border-saffron-400"
              >
                <span className="font-medium text-ink-900">{ex.problem}</span>
                <span className="mt-0.5 block text-ink-500">{ex.location}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {resolution && (
        <div className="panel p-4 sm:p-6">
          <HierarchyChain resolution={resolution} />
        </div>
      )}

      {messages.filter((m) => m.role === "assistant").length > 0 && (
        <div className="space-y-3">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-500">
            Agent explanation
          </p>
          {messages
            .filter((m) => m.role === "assistant")
            .map((msg, i) => (
              <div
                key={i}
                className="border border-[var(--rule)] bg-ink-50/70 px-4 py-3"
              >
                <div
                  className="chat-markdown"
                  dangerouslySetInnerHTML={{
                    __html: renderChatMarkdown(msg.content),
                  }}
                />
              </div>
            ))}
        </div>
      )}

      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
