import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Badge,
  Card,
  ErrorState,
  LoadingState,
  MetricCard,
  SectionTitle,
} from "@/components/ui";
import { formatNumber, loadDataset, statusColor } from "@/lib/data";
import type { Dataset } from "@/lib/types";
import { colors, fonts } from "@/lib/theme";

export default function GeographyScreen() {
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);

  useEffect(() => {
    loadDataset()
      .then((d) => {
        setData(d);
        if (d.metrics.stateStats.length) {
          setSelectedState(d.metrics.stateStats[0].id);
        }
      })
      .catch(() => setError("Could not load dataset."));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  const { stateStats, breakdowns, counts } = data.metrics;
  const state = stateStats.find((s) => s.id === selectedState);

  const jurisdictionLevels = Object.entries(breakdowns.jurisdictionsByLevel)
    .map(([name, value]) => ({ name: name.replace(/_/g, " "), value }))
    .sort((a, b) => b.value - a.value);

  const statePositions = selectedState
    ? data.positions
        .filter((p) => {
          const j = data.jurisdictions.find((x) => x.id === p.jurisdiction_id);
          if (!j) return false;
          if (j.id === selectedState) return true;
          return j.parent_id === selectedState;
        })
        .slice(0, 40)
    : [];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SectionTitle
        title="Geography"
        subtitle={`India's administrative hierarchy — ${counts.states} states/UTs covering ${counts.districts} districts.`}
      />

      <View style={styles.grid}>
        <MetricCard label="States & UTs" value={counts.states} />
        <MetricCard label="Districts" value={counts.districts} accent="green" />
        <MetricCard label="Municipal Bodies" value={counts.municipal ?? 0} />
        <MetricCard
          label="Jurisdictions"
          value={counts.jurisdictions}
          accent="saffron"
        />
      </View>

      <Card style={styles.block}>
        <Text style={styles.cardTitle}>Jurisdictions by level</Text>
        {jurisdictionLevels.map((row) => (
          <View key={row.name} style={styles.levelRow}>
            <Text style={styles.levelName}>{row.name}</Text>
            <Text style={styles.levelVal}>{formatNumber(row.value)}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.block}>
        <Text style={styles.cardTitle}>Select a state / UT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chips}>
            {stateStats.map((s) => {
              const active = s.id === selectedState;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setSelectedState(s.id)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}
                  >
                    {s.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {state ? (
          <View style={styles.stateMeta}>
            <Text style={styles.stateTitle}>{state.name}</Text>
            <Text style={styles.metaLine}>
              Districts: {state.districts} · Positions: {state.positions}
            </Text>
            <Text style={styles.metaLine}>
              DM seats: {state.dms_filled}/{state.dms_total}
            </Text>
            <Badge
              label={state.data_status}
              bg={statusColor(state.data_status).bg}
              text={statusColor(state.data_status).text}
            />
          </View>
        ) : null}
      </Card>

      <Card style={styles.block}>
        <Text style={styles.cardTitle}>Offices in selection</Text>
        {statePositions.length === 0 ? (
          <Text style={styles.empty}>No positions found for this state.</Text>
        ) : (
          statePositions.map((p) => (
            <View key={p.id} style={styles.posRow}>
              <Text style={styles.posTitle}>{p.title}</Text>
              <Text style={styles.posSub}>
                {p.person_name ?? (p.is_vacant ? "Vacant" : "Unfilled")}
                {p.jurisdiction_name ? ` · ${p.jurisdiction_name}` : ""}
              </Text>
            </View>
          ))
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink50 },
  content: { padding: 16, gap: 16, paddingBottom: 40 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  block: { gap: 10 },
  cardTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    color: colors.ink950,
  },
  levelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.ink100,
  },
  levelName: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink700,
    textTransform: "capitalize",
  },
  levelVal: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink900,
  },
  chips: { flexDirection: "row", gap: 8, paddingVertical: 4 },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.ink100,
  },
  chipActive: { backgroundColor: colors.ink950 },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink600,
  },
  chipTextActive: { color: colors.white },
  stateMeta: { gap: 6, marginTop: 8 },
  stateTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 20,
    color: colors.ink950,
  },
  metaLine: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink600,
  },
  empty: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink500,
  },
  posRow: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.ink100,
  },
  posTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink900,
  },
  posSub: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink500,
    marginTop: 2,
  },
});
