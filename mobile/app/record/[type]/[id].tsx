import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useDataset } from "@/context/DatasetContext";
import { ErrorView, LoadingView, StatusBadge } from "@/components/ui";
import { colors, spacing } from "@/lib/theme";

export default function RecordScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const { data, loading, error, progressBytes, reload } = useDataset();

  const record = useMemo(() => {
    if (!data || !type || !id) return null;
    return data.searchIndex.find((r) => r.type === type && String(r.id) === id) ?? null;
  }, [data, type, id]);

  if (loading) return <LoadingView progressBytes={progressBytes} />;
  if (error || !data) return <ErrorView message={error ?? "Unknown error"} onRetry={reload} />;
  if (!record) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Record not found.</Text>
      </View>
    );
  }

  const entries = Object.entries(record.data).filter(
    ([k, v]) =>
      !k.startsWith("_") &&
      v != null &&
      v !== "" &&
      k !== "id"
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.type}>{record.type}</Text>
      <Text style={styles.title}>{record.label}</Text>
      {record.subtitle ? <Text style={styles.subtitle}>{record.subtitle}</Text> : null}
      {typeof record.data.data_status === "string" ? (
        <View style={{ marginTop: spacing.md }}>
          <StatusBadge status={record.data.data_status} />
        </View>
      ) : null}

      <View style={styles.card}>
        {entries.slice(0, 24).map(([key, value]) => (
          <View key={key} style={styles.field}>
            <Text style={styles.fieldKey}>{key.replace(/_/g, " ")}</Text>
            <Text style={styles.fieldValue}>
              {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cream,
  },
  missing: { color: colors.ink600, fontWeight: "600" },
  type: {
    color: colors.saffronDark,
    fontWeight: "800",
    textTransform: "uppercase",
    fontSize: 12,
  },
  title: {
    marginTop: spacing.xs,
    fontSize: 26,
    fontWeight: "800",
    color: colors.ink950,
  },
  subtitle: {
    marginTop: spacing.sm,
    fontSize: 15,
    color: colors.ink600,
    lineHeight: 22,
  },
  card: {
    marginTop: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ink100,
    padding: spacing.lg,
    gap: spacing.md,
  },
  field: {
    backgroundColor: colors.ink50,
    borderRadius: 10,
    padding: spacing.md,
  },
  fieldKey: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.ink400,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  fieldValue: {
    marginTop: 4,
    fontSize: 14,
    color: colors.ink800,
    lineHeight: 20,
  },
});
