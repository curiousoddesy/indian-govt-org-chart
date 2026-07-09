import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadDataset, formatNumber } from "../lib/data";
import type { Dataset } from "../lib/types";
import { LoadingState, ErrorState } from "../components/MetricCard";

const EXAMPLES = [
  { problem: "No water in my society for three days", location: "Lucknow" },
  { problem: "Pothole damaging vehicles on my street", location: "Pune" },
  { problem: "Police not filing FIR", location: "Jaipur" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    loadDataset()
      .then(setData)
      .catch(() => setError("Could not load accountability dataset."));
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!problem.trim()) return;
    const qs = new URLSearchParams({
      problem: problem.trim(),
      ...(location.trim() ? { location: location.trim() } : {}),
    });
    navigate(`/ask?${qs.toString()}`);
  }

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  const { metrics } = data;

  return (
    <div className="page-enter space-y-10">
      <section className="relative overflow-hidden border border-[var(--rule)] bg-white/75 px-5 py-8 sm:px-8 sm:py-12">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-40"
          style={{
            background:
              "repeating-linear-gradient(-45deg, transparent, transparent 10px, oklch(0.9 0.02 55 / 0.35) 10px, oklch(0.9 0.02 55 / 0.35) 11px)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="eyebrow mb-3">Public accountability register</p>
          <h1 className="display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05]">
            Facing a civic problem? See who is accountable.
          </h1>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-600">
            Describe what is going wrong and where. We map it to the Accountable
            India org chart — local office first, then the escalation ladder —
            with holders, contacts, and why each rung is responsible.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-3">
            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
                Your problem
              </span>
              <textarea
                className="input min-h-[96px] resize-y text-base"
                placeholder="e.g. No drinking water in my ward for three days"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                required
                autoFocus
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
                City or district
              </span>
              <input
                type="text"
                className="input text-base"
                placeholder="e.g. Lucknow"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </label>
            <button type="submit" className="btn-primary">
              Find who is accountable
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.problem}
                type="button"
                className="border border-[var(--rule)] bg-white/90 px-3 py-1.5 text-left text-sm text-ink-700 transition hover:border-saffron-400"
                onClick={() => {
                  setProblem(ex.problem);
                  setLocation(ex.location);
                }}
              >
                {ex.location}: {ex.problem}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="metric-tile" data-accent="saffron">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
            Offices in register
          </p>
          <p className="font-display text-3xl font-bold text-saffron-600">
            {formatNumber(metrics.counts.positions)}
          </p>
        </div>
        <div className="metric-tile">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
            Officials named
          </p>
          <p className="font-display text-3xl font-bold text-ink-950">
            {formatNumber(metrics.counts.persons)}
          </p>
        </div>
        <div className="metric-tile" data-accent="green">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
            Districts covered
          </p>
          <p className="font-display text-3xl font-bold text-green-600">
            {formatNumber(metrics.counts.districts)}
          </p>
        </div>
        <div className="metric-tile">
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
            Problem topics
          </p>
          <p className="font-display text-3xl font-bold text-ink-950">
            {formatNumber(metrics.counts.topics)}
          </p>
        </div>
      </section>

      <section>
        <p className="eyebrow mb-2">Also in this register</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              to: "/explore",
              label: "Browse offices",
              desc: "Search the full org chart",
            },
            {
              to: "/geography",
              label: "By geography",
              desc: "States, districts, coverage",
            },
            {
              to: "/docs",
              label: "How it works",
              desc: "Data model & methodology",
            },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="border border-[var(--rule)] bg-white/75 p-4 transition hover:border-saffron-400"
            >
              <p className="font-display text-lg font-semibold text-ink-950">
                {item.label}
              </p>
              <p className="mt-1 text-sm text-ink-500">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
