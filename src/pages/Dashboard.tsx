import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { loadDataset, CHART_COLORS, formatNumber } from "../lib/data";
import type { Dataset } from "../lib/types";
import { MetricCard, ChartCard, LoadingState, ErrorState } from "../components/MetricCard";
import SearchBar from "../components/SearchBar";
import { HolderName, OfficeRow } from "../components/OfficeList";

export default function Dashboard() {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDataset()
      .then(setData)
      .catch(() => setError("Could not load accountability dataset."));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  const { metrics, meta } = data;
  const { counts, coverage, breakdowns } = metrics;

  const levelData = Object.entries(breakdowns.positionsByLevel)
    .map(([name, value]) => ({ name: name.replace(/_/g, " "), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const statusData = Object.entries(breakdowns.positionsByStatus).map(
    ([name, value]) => ({ name, value })
  );

  const contactData = Object.entries(breakdowns.contactsByType)
    .map(([name, value]) => ({ name: name.replace(/_/g, " "), value }))
    .sort((a, b) => b.value - a.value);

  const topStates = [...metrics.stateStats]
    .sort((a, b) => b.dms_filled - a.dms_filled)
    .slice(0, 10)
    .map((s) => ({
      name: s.name.replace(" Pradesh", "").replace(" Pradesh", ""),
      filled: s.dms_filled,
      total: s.dms_total,
    }));

  const leadership = metrics.leadership;
  const latestRun = metrics.latestCollection;
  const recentChanges = metrics.recentChanges ?? [];
  const stateLeadershipRows = (leadership?.chiefMinisters ?? []).map((cm) => {
    const state =
      cm.jurisdiction_name ||
      (cm.title.startsWith("Chief Minister of ")
        ? cm.title.slice("Chief Minister of ".length)
        : cm.title);
    const governor = (leadership?.governors ?? []).find(
      (g) =>
        g.jurisdiction_name === state ||
        g.title.endsWith(` of ${state}`)
    );
    return { state, cm, governor };
  }).sort((a, b) => a.state.localeCompare(b.state));

  return (
    <div className="space-y-8">
      <section>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-saffron-600 mb-1">
              {meta.name}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-950">
              Government Accountability Dashboard
            </h1>
            <p className="text-ink-600 mt-2 max-w-2xl">
              {meta.description} Last updated{" "}
              {new Date(meta.generatedAt).toLocaleDateString("en-IN", {
                dateStyle: "medium",
              })}
              .
            </p>
          </div>
          <div className="w-full lg:max-w-md">
            <SearchBar />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Government Offices"
            value={counts.positions}
            sub={`${coverage.fillRate}% filled`}
            accent="saffron"
          />
          <MetricCard
            label="Officials Tracked"
            value={counts.persons}
            sub={`${counts.currentAppointments} current roles`}
          />
          <MetricCard
            label="Jurisdictions"
            value={counts.jurisdictions}
            sub={`${counts.states} states/UTs · ${counts.districts} districts`}
            accent="green"
          />
          <MetricCard
            label="Public Contacts"
            value={counts.contacts}
            sub={`${counts.topics} citizen problem topics`}
          />
        </div>
      </section>

      {leadership && (
        <section className="space-y-6">
          {latestRun && (
            <div className="card p-5 sm:p-6 border-l-4 border-saffron-500">
              <p className="text-xs font-medium uppercase tracking-wide text-saffron-700">
                Latest verification · {latestRun.run_date} · {latestRun.run_type}
              </p>
              <h2 className="font-display text-lg font-semibold text-ink-950 mt-1">
                {latestRun.scope}
              </h2>
              {latestRun.notes && (
                <p className="text-sm text-ink-600 mt-2 max-w-4xl">{latestRun.notes}</p>
              )}
              <p className="text-xs text-ink-400 mt-3">
                {formatNumber(latestRun.records_added)} records added ·{" "}
                {formatNumber(latestRun.records_updated)} updated
                {leadership.vacantMos.length
                  ? ` · ${leadership.vacantMos.length} Union MoS seats vacant`
                  : ""}
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card p-5 sm:p-6">
              <h2 className="font-display text-lg font-semibold text-ink-900">
                Union leadership
              </h2>
              <p className="text-sm text-ink-500 mb-3">
                Current constitutional and cabinet heads after the August 2026 verification
              </p>
              <div className="divide-y divide-ink-100">
                {leadership.union.map((office) => (
                  <OfficeRow key={office.id} office={office} />
                ))}
              </div>
            </div>

            <div className="card p-5 sm:p-6">
              <h2 className="font-display text-lg font-semibold text-ink-900">
                Constitutional offices
              </h2>
              <p className="text-sm text-ink-500 mb-3">
                Judiciary, legislature, and statutory heads
              </p>
              <div className="divide-y divide-ink-100">
                {leadership.constitutional.map((office) => (
                  <OfficeRow key={office.id} office={office} />
                ))}
              </div>
            </div>
          </div>

          <div className="card p-5 sm:p-6">
            <div className="mb-4">
              <h2 className="font-display text-lg font-semibold text-ink-900">
                Union Council of Ministers
              </h2>
              <p className="text-sm text-ink-500">
                {leadership.cabinetHolderCount} cabinet ministers ·{" "}
                {leadership.mosIndependent.length} MoS (Independent Charge) ·{" "}
                {leadership.mos.filter((row) => row.person_name).length} MoS
                {leadership.vacantMos.length
                  ? ` · ${leadership.vacantMos.length} vacant`
                  : ""}
              </p>
            </div>
            {leadership.vacantMos.length > 0 && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 mb-4 text-sm">
                <p className="font-medium text-amber-900">Vacant MoS seats</p>
                <ul className="mt-1 text-amber-800 space-y-0.5">
                  {leadership.vacantMos.map((office) => (
                    <li key={office.id}>{office.title}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-x-8">
              {leadership.cabinet.map((office) => (
                <OfficeRow key={office.id} office={office} />
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-ink-100">
              <h2 className="font-display text-lg font-semibold text-ink-900">
                States and UTs — Governor / LG and Chief Minister
              </h2>
              <p className="text-sm text-ink-500">
                {leadership.chiefMinisters.length} chief ministers ·{" "}
                {leadership.governors.length} governors and lieutenant governors
              </p>
            </div>
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-ink-50 sticky top-0">
                  <tr className="text-left text-ink-500">
                    <th className="px-5 py-2 font-medium">State / UT</th>
                    <th className="px-5 py-2 font-medium">Governor / LG</th>
                    <th className="px-5 py-2 font-medium">Chief Minister</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {stateLeadershipRows.map((row) => (
                    <tr key={row.state}>
                      <td className="px-5 py-2 font-medium text-ink-900">{row.state}</td>
                      <td className="px-5 py-2">
                        <HolderName
                          person={row.governor?.person_name}
                          vacant={row.governor?.is_vacant}
                        />
                      </td>
                      <td className="px-5 py-2">
                        <HolderName person={row.cm?.person_name} vacant={row.cm?.is_vacant} />
                        {row.cm?.person_party ? (
                          <span className="text-ink-400 ml-2 text-xs">{row.cm.person_party}</span>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {recentChanges.length > 0 && (
            <div className="card p-5 sm:p-6">
              <h2 className="font-display text-lg font-semibold text-ink-900">
                Recent high-office changes
              </h2>
              <p className="text-sm text-ink-500 mb-4">
                Union, CM, DCM, and governor/LG appointments verified in the latest run
                that started or ended since March 2026
              </p>
              <ul className="divide-y divide-ink-100 max-h-[420px] overflow-y-auto">
                {recentChanges.map((change) => (
                  <li
                    key={change.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1"
                  >
                    <div>
                      <p className="font-medium text-ink-900">{change.person_name}</p>
                      <p className="text-sm text-ink-500">
                        {change.position_title}
                        {change.jurisdiction_name ? ` · ${change.jurisdiction_name}` : ""}
                      </p>
                    </div>
                    <p className="text-xs font-medium shrink-0">
                      {change.is_current ? (
                        <span className="text-green-700">In office from {change.start_date}</span>
                      ) : (
                        <span className="text-ink-500">Left {change.end_date}</span>
                      )}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <section className="grid lg:grid-cols-2 gap-6">
        <ChartCard
          title="Positions by Administrative Level"
          description="Where offices sit in India's governance hierarchy"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={levelData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip formatter={(v: number) => formatNumber(v)} />
              <Bar dataKey="value" fill="#f58220" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Data Verification Status"
          description="How much of the dataset has been verified vs pending"
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <ChartCard
          title="District Magistrates Named by State"
          description="DM/Collector coverage — top 10 states"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topStates}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="filled" name="Filled" fill="#138808" radius={[4, 4, 0, 0]} />
              <Bar dataKey="total" name="Total" fill="#d5dae3" radius={[4, 4, 0, 0]} />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Contact Channel Types"
          description="Official public contact methods in the dataset"
        >
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={contactData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                angle={-25}
                textAnchor="end"
                height={70}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => formatNumber(v)} />
              <Bar dataKey="value" fill="#667690" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="card p-6">
        <h2 className="font-display text-xl font-semibold mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: "/explore", label: "Search & Explore", desc: "Query the full dataset" },
            { to: "/geography", label: "Geographic View", desc: "States & districts breakdown" },
            { to: "/chat", label: "Ask AI Agent", desc: "Natural language queries" },
            { to: "/docs", label: "Read the Wiki", desc: "Learn the data model" },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="rounded-xl border border-ink-200 p-4 hover:border-saffron-400 hover:bg-saffron-50/30 transition group"
            >
              <p className="font-medium text-ink-900 group-hover:text-saffron-700">
                {action.label}
              </p>
              <p className="text-sm text-ink-500 mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
