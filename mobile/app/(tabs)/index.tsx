import { Link } from "expo-router";
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
} from "@/components/ui";
import { colors, spacing } from "@/lib/theme";
import { formatNumber } from "@/lib/data";

export default function DashboardScreen() {
  const { data, loading, error, progressBytes, reload } = useDataset();

  if (loading) return <LoadingView progressBytes={progressBytes} />;
  if (error || !data) return <ErrorView message={error ?? "Unknown error"} onRetry={reload} />;

  const { metrics, meta } = data;
  const { counts, coverage, breakdowns } = metrics;

  const levelRows = Object.entries(breakdowns.positionsByLevel)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const topStates = [...metrics.stateStats]
    .sort((a, b) => b.dms_filled - a.dms_filled)
    .slice(0, 8);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>{meta.name}</Text>
        <Text style={styles.heroTitle}>Indian Govt Org Chart</Text>
        <Text style={styles.heroSub}>
          {meta.description} Updated{" "}
          {new Date(meta.generatedAt).toLocaleDateString("en-IN", {
            dateStyle: "medium",
          })}
          .
        </Text>
        <Link href="/modal" asChild>
          <Pressable style={styles.aboutLink}>
            <Text style={styles.aboutLinkText}>About & Expo tips</Text>
          </Pressable>
        </Link>
      </View>

      <View style={styles.grid}>
        <MetricCard
          label="Offices"
          value={counts.positions}
          sub={`${coverage.fillRate}% filled`}
          accent="saffron"
        />
        <MetricCard
          label="Officials"
          value={counts.persons}
          sub={`${formatNumber(counts.currentAppointments ?? 0)} current`}
        />
        <MetricCard
          label="Jurisdictions"
          value={counts.jurisdictions}
          sub={`${counts.states} states · ${counts.districts} districts`}
          accent="green"
        />
        <MetricCard
          label="Contacts"
          value={counts.contacts}
          sub="Public official only"
        />
      </View>

      <SectionTitle title="Positions by level" />
      <View style={styles.card}>
        {levelRows.map(([name, value]) => (
          <View key={name} style={styles.row}>
            <Text style={styles.rowLabel}>{name.replace(/_/g, " ")}</Text>
            <Text style={styles.rowValue}>{formatNumber(value)}</Text>
          </View>
        ))}
      </View>

      <SectionTitle title="DM coverage leaders" />
      <View style={styles.card}>
        {topStates.map((s) => {
          const pct = s.dms_total ? Math.round((s.dms_filled / s.dms_total) * 100) : 0;
          return (
            <View key={s.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>{s.name}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
              </View>
              <Text style={styles.rowValue}>
                {s.dms_filled}/{s.dms_total}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  hero: { marginBottom: spacing.xl },
  eyebrow: {
    color: colors.saffronDark,
    fontWeight: "700",
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.ink950,
  },
  heroSub: {
    marginTop: spacing.sm,
    color: colors.ink600,
    fontSize: 14,
    lineHeight: 21,
  },
  aboutLink: { marginTop: spacing.md },
  aboutLinkText: {
    color: colors.greenDark,
    fontWeight: "700",
    fontSize: 14,
  },
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  rowLabel: {
    color: colors.ink800,
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  rowValue: {
    color: colors.ink950,
    fontWeight: "800",
    fontSize: 14,
  },
  barTrack: {
    marginTop: 6,
    height: 6,
    backgroundColor: colors.ink100,
    borderRadius: 999,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: colors.green,
    borderRadius: 999,
  },
});
