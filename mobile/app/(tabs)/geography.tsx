import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

export default function GeographyScreen() {
  const { data, loading, error, progressBytes, reload } = useDataset();
  const [selectedState, setSelectedState] = useState<number | null>(null);

  const activeStateId = selectedState ?? data?.metrics.stateStats[0]?.id ?? null;

  const state = useMemo(
    () => data?.metrics.stateStats.find((s) => s.id === activeStateId) ?? null,
    [data, activeStateId]
  );

  const statePositions = useMemo(() => {
    if (!data || activeStateId == null) return [];
    return data.positions
      .filter((p) => {
        const j = data.jurisdictions.find((x) => x.id === p.jurisdiction_id);
        if (!j) return false;
        if (j.id === activeStateId) return true;
        return j.parent_id === activeStateId;
      })
      .slice(0, 40);
  }, [data, activeStateId]);

  if (loading) return <LoadingView progressBytes={progressBytes} />;
  if (error || !data) return <ErrorView message={error ?? "Unknown error"} onRetry={reload} />;

  const { stateStats, counts, breakdowns } = data.metrics;
  const levelRows = Object.entries(breakdowns.jurisdictionsByLevel).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionTitle
        title="Geography"
        subtitle={`${counts.states} states/UTs · ${formatNumber(counts.districts)} districts`}
      />

      <View style={styles.grid}>
        <MetricCard label="States & UTs" value={counts.states} />
        <MetricCard label="Districts" value={counts.districts} accent="green" />
        <MetricCard label="Municipal" value={counts.municipal ?? 0} />
        <MetricCard
          label="Jurisdictions"
          value={counts.jurisdictions}
          accent="saffron"
        />
      </View>

      <SectionTitle title="Pick a state" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {stateStats.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => setSelectedState(s.id)}
            style={[styles.chip, activeStateId === s.id && styles.chipActive]}
          >
            <Text
              style={[
                styles.chipText,
                activeStateId === s.id && styles.chipTextActive,
              ]}
            >
              {s.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {state ? (
        <View style={styles.card}>
          <View style={styles.stateHeader}>
            <Text style={styles.stateName}>{state.name}</Text>
            <StatusBadge status={state.data_status} />
          </View>
          <Text style={styles.stateMeta}>
            {state.districts} districts · {formatNumber(state.positions)} positions · DM{" "}
            {state.dms_filled}/{state.dms_total}
          </Text>
          <View style={styles.barTrack}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${
                    state.dms_total
                      ? Math.round((state.dms_filled / state.dms_total) * 100)
                      : 0
                  }%`,
                },
              ]}
            />
          </View>
        </View>
      ) : null}

      <SectionTitle title="Offices in this state" />
      <View style={styles.card}>
        {statePositions.length === 0 ? (
          <Text style={styles.empty}>No positions listed for this selection.</Text>
        ) : (
          statePositions.map((p) => (
            <View key={p.id} style={styles.posRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.posTitle}>{p.title}</Text>
                <Text style={styles.posSub}>
                  {p.person_name ?? (p.is_vacant ? "Vacant" : "Unfilled")}
                  {p.jurisdiction_name ? ` · ${p.jurisdiction_name}` : ""}
                </Text>
              </View>
              <StatusBadge status={p.data_status} />
            </View>
          ))
        )}
      </View>

      <SectionTitle title="Jurisdictions by level" />
      <View style={styles.card}>
        {levelRows.map(([name, value]) => (
          <View key={name} style={styles.posRow}>
            <Text style={styles.posTitle}>{name.replace(/_/g, " ")}</Text>
            <Text style={styles.count}>{formatNumber(value)}</Text>
          </View>
        ))}
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
  chips: { gap: spacing.sm, paddingBottom: spacing.lg },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.ink100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipActive: { backgroundColor: colors.green, borderColor: colors.green },
  chipText: { color: colors.ink600, fontWeight: "600", fontSize: 13 },
  chipTextActive: { color: colors.white },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ink100,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  stateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  stateName: { fontSize: 18, fontWeight: "800", color: colors.ink950, flex: 1 },
  stateMeta: { color: colors.ink600, fontSize: 13 },
  barTrack: {
    height: 8,
    backgroundColor: colors.ink100,
    borderRadius: 999,
    overflow: "hidden",
  },
  barFill: { height: "100%", backgroundColor: colors.saffron },
  posRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  posTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink950,
    textTransform: "capitalize",
  },
  posSub: { marginTop: 2, fontSize: 12, color: colors.ink600 },
  count: { fontWeight: "800", color: colors.ink950 },
  empty: { color: colors.ink400 },
});
