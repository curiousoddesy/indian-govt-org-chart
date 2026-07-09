import { formatNumber } from "../lib/data";

interface MetricCardProps {
  label: string;
  value: number | string;
  sub?: string;
  accent?: "saffron" | "green" | "ink";
}

export function MetricCard({ label, value, sub, accent = "ink" }: MetricCardProps) {
  const accentClass = {
    saffron: "text-saffron-600",
    green: "text-green-600",
    ink: "text-ink-950",
  }[accent];

  return (
    <div className="metric-tile" data-accent={accent}>
      <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-500">
        {label}
      </p>
      <p className={`font-display text-3xl font-bold tracking-tight ${accentClass}`}>
        {typeof value === "number" ? formatNumber(value) : value}
      </p>
      {sub && <p className="mt-1.5 text-xs leading-snug text-ink-500">{sub}</p>}
    </div>
  );
}

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className="panel p-5 sm:p-6">
      <div className="mb-5 border-b border-[var(--rule)] pb-3">
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink-950">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-ink-500">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-28">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-ink-200 border-t-saffron-500" />
        <p className="text-sm tracking-wide text-ink-500">Loading register…</p>
      </div>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="panel border-red-200 bg-red-50/80 p-8 text-center">
      <p className="font-medium text-red-700">{message}</p>
    </div>
  );
}
