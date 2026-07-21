import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useDataset } from "@/context/DatasetContext";
import {
  ErrorView,
  LoadingView,
  MetricCard,
  SectionTitle,
  StatusBadge,
} from "@/components/ui";
import { colors, spacing } from "@/lib/theme";
import { formatNumber } from "@/lib/data";

export default function QualityScreen() {
  const { data, loading, error, progressBytes, reload } = useDataset();

  if (loading) return <LoadingView progressBytes={progressBytes} />;
  if (error || !data) return <ErrorView message={error ?? "Unknown error"} onRetry={reload} />;

  const { coverage, breakdowns, latestCollection } = data.metrics;
  const statusRows = Object.entries(breakdowns.positionsByStatus).sort(
    (a, b) => b[1] - a[1]
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

  const pending = data.positions.filter((p) => p.data_status === "pending").slice(0, 12);
  const vacant = data.positions.filter((p) => p.is_vacant).slice(0, 12);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionTitle
        title="Data quality"
        subtitle="Verification, fill rates, and recent collection runs."
      />

      <View style={styles.grid}>
        <MetricCard
          label="Verification"
          value={`${coverage.verificationRate}%`}
          sub={`${formatNumber(coverage.positionsVerified)} verified`}
          accent="green"
        />
        <MetricCard
          label="Fill rate"
          value={`${coverage.fillRate}%`}
          sub={`${formatNumber(coverage.positionsFilled)} filled`}
          accent="saffron"
        />
        <MetricCard
          label="Pending"
          value={coverage.positionsUnfilled}
          sub="Still empty / review"
        />
        <MetricCard
          label="Vacant"
          value={coverage.positionsVacant}
          sub="Marked vacant"
        />
      </View>

      <SectionTitle title="Status mix" />
      <View style={styles.card}>
        {statusRows.map(([name, value]) => (
          <View key={name} style={styles.row}>
            <StatusBadge status={name} />
            <Text style={styles.value}>{formatNumber(value)}</Text>
          </View>
        ))}
      </View>

      <SectionTitle title="Confidence buckets" />
      <View style={styles.card}>
        {confidenceBuckets.map((b) => (
          <View key={b.range} style={styles.row}>
            <Text style={styles.label}>{b.range}</Text>
            <Text style={styles.value}>{formatNumber(b.count)}</Text>
          </View>
        ))}
      </View>

      {latestCollection ? (
        <>
          <SectionTitle title="Latest collection run" />
          <View style={styles.card}>
            <Text style={styles.runDate}>
              {latestCollection.run_date} · {latestCollection.run_type}
            </Text>
            <Text style={styles.runScope}>{latestCollection.scope}</Text>
            <Text style={styles.runMeta}>
              +{latestCollection.records_added} added · {latestCollection.records_updated}{" "}
              updated · status {latestCollection.status}
            </Text>
            {latestCollection.next_target ? (
              <Text style={styles.next}>Next: {latestCollection.next_target}</Text>
            ) : null}
          </View>
        </>
      ) : null}

      <SectionTitle title="Sample pending offices" />
      <View style={styles.card}>
        {pending.length === 0 ? (
          <Text style={styles.empty}>No pending positions.</Text>
        ) : (
          pending.map((p) => (
            <View key={p.id} style={styles.item}>
              <Text style={styles.itemTitle}>{p.title}</Text>
              <Text style={styles.itemSub}>
                {p.jurisdiction_name ?? "—"} · {p.person_name ?? "unfilled"}
              </Text>
            </View>
          ))
        )}
      </View>

      <SectionTitle title="Sample vacant offices" />
      <View style={styles.card}>
        {vacant.length === 0 ? (
          <Text style={styles.empty}>No vacant flags.</Text>
        ) : (
          vacant.map((p) => (
            <View key={p.id} style={styles.item}>
              <Text style={styles.itemTitle}>{p.title}</Text>
              <Text style={styles.itemSub}>{p.jurisdiction_name ?? "—"}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ink100,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontWeight: "700", color: colors.ink800 },
  value: { fontWeight: "800", color: colors.ink950 },
  runDate: { fontWeight: "800", color: colors.ink950, fontSize: 15 },
  runScope: { color: colors.ink800, lineHeight: 20 },
  runMeta: { color: colors.ink600, fontSize: 13 },
  next: { color: colors.greenDark, fontWeight: "600", fontSize: 13, lineHeight: 19 },
  item: { gap: 2 },
  itemTitle: { fontWeight: "700", color: colors.ink950, fontSize: 14 },
  itemSub: { color: colors.ink600, fontSize: 12 },
  empty: { color: colors.ink400 },
});
