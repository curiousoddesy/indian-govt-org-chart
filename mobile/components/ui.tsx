import type { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from "react-native";
import { colors, fonts } from "@/lib/theme";
import { formatNumber } from "@/lib/data";

export function LoadingState({ label = "Loading dataset…" }: { label?: string }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.saffron500} />
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.muted}>{message}</Text>
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
  value: number | string;
  sub?: string;
  accent?: "ink" | "saffron" | "green";
}) {
  const accentColor =
    accent === "saffron"
      ? colors.saffron500
      : accent === "green"
        ? colors.green500
        : colors.ink950;

  return (
    <View style={[styles.card, styles.metricCard]}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color: accentColor }]}>
        {typeof value === "number" ? formatNumber(value) : value}
      </Text>
      {sub ? <Text style={styles.muted}>{sub}</Text> : null}
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
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Badge({
  label,
  bg,
  text,
}: {
  label: string;
  bg: string;
  text: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.ink200,
    padding: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: "45%",
    overflow: "hidden",
  },
  accentBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  metricLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink500,
    marginBottom: 6,
  },
  metricValue: {
    fontFamily: fonts.display,
    fontSize: 26,
    marginBottom: 4,
  },
  muted: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink500,
    textAlign: "center",
  },
  errorTitle: {
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    color: colors.danger,
  },
  sectionHeader: {
    marginBottom: 16,
    gap: 6,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink950,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink600,
    lineHeight: 22,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    textTransform: "capitalize",
  },
});
