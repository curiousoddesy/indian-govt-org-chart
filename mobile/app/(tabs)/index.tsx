import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import SearchBar from "@/components/SearchBar";
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

export default function DashboardScreen() {
  const router = useRouter();
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(force = false) {
    try {
      const dataset = await loadDataset({ force });
      setData(dataset);
      setError(null);
    } catch {
      setError("Could not load accountability dataset. Check your network.");
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (error && !data) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  const { metrics, meta } = data;
  const { counts, coverage, breakdowns } = metrics;

  const levelRows = Object.entries(breakdowns.positionsByLevel)
    .map(([name, value]) => ({ name: name.replace(/_/g, " "), value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const topStates = [...metrics.stateStats]
    .sort((a, b) => b.dms_filled - a.dms_filled)
    .slice(0, 8);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true);
            await load(true);
            setRefreshing(false);
          }}
          tintColor={colors.saffron500}
        />
      }
    >
      <View style={styles.hero}>
        <Text style={styles.brand}>{meta.name}</Text>
        <SectionTitle
          title="Government Accountability"
          subtitle={`${meta.description} Updated ${new Date(
            meta.generatedAt
          ).toLocaleDateString("en-IN", { dateStyle: "medium" })}.`}
        />
        <SearchBar
          onSelect={(item) =>
            router.push({
              pathname: "/explore",
              params: { type: item.type, id: String(item.id) },
            })
          }
        />
      </View>

      <View style={styles.grid}>
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
          label="Verified"
          value={`${coverage.verificationRate}%`}
          sub={`${formatNumber(coverage.positionsVerified)} verified seats`}
        />
      </View>

      <Card style={styles.block}>
        <Text style={styles.cardTitle}>Positions by level</Text>
        {levelRows.map((row) => (
          <View key={row.name} style={styles.barRow}>
            <Text style={styles.barLabel} numberOfLines={1}>
              {row.name}
            </Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.max(
                      8,
                      (row.value / levelRows[0].value) * 100
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.barValue}>{formatNumber(row.value)}</Text>
          </View>
        ))}
      </Card>

      <Card style={styles.block}>
        <Text style={styles.cardTitle}>Top states by DM coverage</Text>
        {topStates.map((s) => {
          const pct =
            s.dms_total > 0
              ? Math.round((s.dms_filled / s.dms_total) * 100)
              : 0;
          return (
            <View key={s.id} style={styles.stateRow}>
              <Text style={styles.stateName} numberOfLines={1}>
                {s.name}
              </Text>
              <Text style={styles.statePct}>
                {s.dms_filled}/{s.dms_total} · {pct}%
              </Text>
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink50,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  hero: {
    gap: 12,
  },
  brand: {
    fontFamily: fonts.sansSemi,
    fontSize: 13,
    color: colors.saffron600,
    letterSpacing: 0.3,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  block: {
    gap: 10,
  },
  cardTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    color: colors.ink950,
    marginBottom: 4,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  barLabel: {
    width: 88,
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink600,
    textTransform: "capitalize",
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.ink100,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.saffron500,
  },
  barValue: {
    width: 48,
    textAlign: "right",
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink700,
  },
  stateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.ink100,
  },
  stateName: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink900,
  },
  statePct: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink500,
  },
});
