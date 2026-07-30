import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/lib/theme";
import { formatNumber } from "@/lib/data";

export function LoadingView({
  message = "Loading Accountable India…",
  progressBytes = 0,
}: {
  message?: string;
  progressBytes?: number;
}) {
  const mb = progressBytes > 0 ? (progressBytes / (1024 * 1024)).toFixed(1) : null;
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.saffron} />
      <Text style={styles.loadingText}>{message}</Text>
      {mb ? <Text style={styles.progressText}>{mb} MB downloaded</Text> : null}
    </View>
  );
}

export function ErrorView({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorTitle}>Couldn’t load data</Text>
      <Text style={styles.errorText}>{message}</Text>
      {onRetry ? (
        <Pressable style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function MetricCard({
  label,
  value,
  sub,
  accent = "ink",
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: "ink" | "saffron" | "green";
}) {
  const accentColor =
    accent === "saffron"
      ? colors.saffron
      : accent === "green"
        ? colors.green
        : colors.ink800;

  return (
    <View style={styles.metricCard}>
      <View style={[styles.metricAccent, { backgroundColor: accentColor }]} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>
        {typeof value === "number" ? formatNumber(value) : value}
      </Text>
      {sub ? <Text style={styles.metricSub}>{sub}</Text> : null}
    </View>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    verified: { bg: "#dcfce7", text: "#15803d" },
    collected: { bg: "#dbeafe", text: "#1d4ed8" },
    pending: { bg: "#fef3c7", text: "#b45309" },
    stale: { bg: "#fee2e2", text: "#b91c1c" },
  };
  const c = map[status] ?? { bg: colors.ink100, text: colors.ink600 };
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <Text style={[styles.badgeText, { color: c.text }]}>{status}</Text>
    </View>
  );
}

export function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    backgroundColor: colors.cream,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.ink800,
    fontWeight: "600",
  },
  progressText: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.ink400,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink950,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: colors.ink600,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  retryBtn: {
    backgroundColor: colors.saffron,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 10,
  },
  retryText: {
    color: colors.white,
    fontWeight: "700",
  },
  metricCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: spacing.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.ink100,
  },
  metricAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink400,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  metricValue: {
    marginTop: spacing.sm,
    fontSize: 24,
    fontWeight: "800",
    color: colors.ink950,
  },
  metricSub: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: colors.ink600,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.ink950,
  },
  sectionSubtitle: {
    marginTop: spacing.xs,
    fontSize: 14,
    color: colors.ink600,
    lineHeight: 20,
  },
});
