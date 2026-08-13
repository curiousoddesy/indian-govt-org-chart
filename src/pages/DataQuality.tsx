import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import { loadDataset, CHART_COLORS, formatNumber } from "../lib/data";
import type { Dataset } from "../lib/types";
import { MetricCard, ChartCard, LoadingState, ErrorState } from "../components/MetricCard";

export default function DataQuality() {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDataset()
      .then(setData)
      .catch(() => setError("Could not load dataset."));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  const { coverage, breakdowns } = data.metrics;
  const statusData = Object.entries(breakdowns.positionsByStatus).map(
    ([name, value]) => ({ name, value })
  );

  const confidenceBuckets = [
    { range: "0.9+", count: 0 },
    { range: "0.7–0.9", count: 0 },
    { range: "0.5–0.7", count: 0 },
    { range: "<0.5", count: 0 },
  ];
  for (const p of data.positions) {
    const c = p.confidence ?? 0;
    if (c >= 0.9) confidenceBuckets[0].count++;
    else if (c >= 0.7) confidenceBuckets[1].count++;
    else if (c >= 0.5) confidenceBuckets[2].count++;
    else confidenceBuckets[3].count++;
  }

  const staleRecords = data.positions.filter((p) => p.data_status === "stale");
  const pendingRecords = data.positions.filter((p) => p.data_status === "pending");
  const latestRun = data.metrics.latestCollection;
  const collectionHistory = (data.collectionLog ?? []).slice().reverse().slice(0, 8);
  const vacantMos = data.metrics.leadership?.vacantMos ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink-950">
          Data Quality
        </h1>
        <p className="text-ink-600 mt-2">
          Verification status, confidence scores, and collection audit trail for
          the Accountable India dataset.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Verification Rate"
          value={`${coverage.verificationRate}%`}
          sub={`${coverage.positionsVerified} positions verified`}
          accent="green"
        />
        <MetricCard
          label="Fill Rate"
          value={`${coverage.fillRate}%`}
          sub={`${coverage.positionsFilled} offices filled`}
          accent="saffron"
        />
        <MetricCard
          label="Pending Review"
          value={pendingRecords.length}
          sub="Awaiting verification"
        />
        <MetricCard
          label="Collection Runs"
          value={data.metrics.counts.collectionRuns}
          sub="Automated job executions"
        />
      </div>

      {vacantMos.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <h2 className="font-medium text-amber-900">Union MoS vacancies</h2>
          <p className="text-sm text-amber-800 mt-1">
            {vacantMos.map((office) => office.title).join(" · ")}
          </p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard title="Verification Status Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => formatNumber(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Confidence Score Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={confidenceBuckets}>
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => formatNumber(v)} />
              <Bar dataKey="count" fill="#667690" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {latestRun && (
        <div className="card p-6">
          <h3 className="font-display text-lg font-semibold mb-3">
            Latest Collection Run
          </h3>
          <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <dt className="text-ink-400">Date</dt>
              <dd className="font-medium">{latestRun.run_date}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Type</dt>
              <dd className="font-medium">{latestRun.run_type}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Records Added</dt>
              <dd className="font-medium">{latestRun.records_added}</dd>
            </div>
            <div>
              <dt className="text-ink-400">Records Updated</dt>
              <dd className="font-medium">{latestRun.records_updated}</dd>
            </div>
          </dl>
          {latestRun.notes && (
            <p className="text-sm text-ink-600 mt-3">{latestRun.notes}</p>
          )}
        </div>
      )}

      {collectionHistory.length > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b border-ink-100">
            <h3 className="font-display text-lg font-semibold">Collection history</h3>
            <p className="text-sm text-ink-500">Most recent verification and collection runs</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-ink-50 text-left text-ink-500">
                <tr>
                  <th className="px-5 py-2 font-medium">Date</th>
                  <th className="px-5 py-2 font-medium">Type</th>
                  <th className="px-5 py-2 font-medium">Scope</th>
                  <th className="px-5 py-2 font-medium">Added</th>
                  <th className="px-5 py-2 font-medium">Updated</th>
                  <th className="px-5 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {collectionHistory.map((run) => (
                  <tr key={run.id}>
                    <td className="px-5 py-2 whitespace-nowrap">{run.run_date}</td>
                    <td className="px-5 py-2 whitespace-nowrap">{run.run_type}</td>
                    <td className="px-5 py-2 text-ink-600">{run.scope}</td>
                    <td className="px-5 py-2">{run.records_added}</td>
                    <td className="px-5 py-2">{run.records_updated}</td>
                    <td className="px-5 py-2">{run.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b bg-amber-50">
            <h4 className="font-medium text-amber-800">
              Pending Verification ({pendingRecords.length})
            </h4>
          </div>
          <div className="max-h-[300px] overflow-y-auto divide-y">
            {pendingRecords.slice(0, 20).map((p) => (
              <div key={p.id} className="px-5 py-2.5 text-sm">
                <p className="font-medium">{p.title}</p>
                <p className="text-ink-500">{p.jurisdiction_name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="px-5 py-3 border-b bg-red-50">
            <h4 className="font-medium text-red-800">
              Stale Records ({staleRecords.length})
            </h4>
          </div>
          <div className="max-h-[300px] overflow-y-auto divide-y">
            {staleRecords.length === 0 ? (
              <p className="px-5 py-4 text-sm text-ink-500">No stale records 🎉</p>
            ) : (
              staleRecords.slice(0, 20).map((p) => (
                <div key={p.id} className="px-5 py-2.5 text-sm">
                  <p className="font-medium">{p.title}</p>
                  <p className="text-ink-500">{p.jurisdiction_name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
