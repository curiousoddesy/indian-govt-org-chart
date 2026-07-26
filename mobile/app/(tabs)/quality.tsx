import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import {
  Card,
  ErrorState,
  LoadingState,
  MetricCard,
  SectionTitle,
} from "@/components/ui";
import { formatNumber, loadDataset } from "@/lib/data";
import type { Dataset } from "@/lib/types";
import { colors, fonts } from "@/lib/theme";

export default function QualityScreen() {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDataset()
      .then(setData)
      .catch(() => setError("Could not load dataset."));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  const { coverage, breakdowns, latestCollection } = data.metrics;
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

  const stale = data.positions.filter((p) => p.data_status === "stale").length;
  const pending = data.positions.filter((p) => p.data_status === "pending")
    .length;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionTitle
        title="Data Quality"
        subtitle="Verification status, confidence scores, and the latest collection run."
      />

      <View style={styles.grid}>
        <MetricCard
          label="Fill rate"
          value={`${coverage.fillRate}%`}
          sub={`${formatNumber(coverage.positionsFilled)} filled`}
          accent="saffron"
        />
        <MetricCard
          label="Verified"
          value={`${coverage.verificationRate}%`}
          sub={`${formatNumber(coverage.positionsVerified)} seats`}
          accent="green"
        />
        <MetricCard label="Pending" value={pending} />
        <MetricCard label="Stale" value={stale} />
      </View>

      <Card style={styles.block}>
        <Text style={styles.cardTitle}>Positions by status</Text>
        {statusData.map((row) => (
          <View key={row.name} style={styles.row}>
            <Text style={styles.rowName}>{row.name}</Text>
            <Text style={styles.rowVal}>{formatNumber(row.value)}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.block}>
        <Text style={styles.cardTitle}>Confidence distribution</Text>
        {confidenceBuckets.map((row) => (
          <View key={row.range} style={styles.row}>
            <Text style={styles.rowName}>{row.range}</Text>
            <Text style={styles.rowVal}>{formatNumber(row.count)}</Text>
          </View>
        ))}
      </Card>

      {latestCollection ? (
        <Card style={styles.block}>
          <Text style={styles.cardTitle}>Latest collection run</Text>
          <Text style={styles.meta}>
            {latestCollection.run_date} · {latestCollection.run_type} ·{" "}
            {latestCollection.status}
          </Text>
          {latestCollection.scope ? (
            <Text style={styles.meta}>Scope: {latestCollection.scope}</Text>
          ) : null}
          <Text style={styles.meta}>
            +{latestCollection.records_added} added ·{" "}
            {latestCollection.records_updated} updated ·{" "}
            {latestCollection.records_flagged} flagged
          </Text>
          {latestCollection.next_target ? (
            <Text style={styles.meta}>
              Next: {latestCollection.next_target}
            </Text>
          ) : null}
          {latestCollection.notes ? (
            <Text style={styles.notes}>{latestCollection.notes}</Text>
          ) : null}
        </Card>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink50 },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  block: { gap: 8 },
  cardTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    color: colors.ink950,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.ink100,
  },
  rowName: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink700,
    textTransform: "capitalize",
  },
  rowVal: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink900,
  },
  meta: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink600,
    lineHeight: 20,
  },
  notes: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink700,
    marginTop: 4,
    lineHeight: 20,
  },
});
