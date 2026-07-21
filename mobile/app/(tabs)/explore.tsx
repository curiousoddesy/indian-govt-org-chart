import { useMemo, useState } from "react";
import { Link } from "expo-router";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDataset } from "@/context/DatasetContext";
import {
  ErrorView,
  LoadingView,
  SectionTitle,
  StatusBadge,
} from "@/components/ui";
import { colors, spacing } from "@/lib/theme";
import { formatNumber } from "@/lib/data";
import type { SearchRecord } from "@/lib/types";

const FILTERS = ["all", "position", "person", "jurisdiction", "body", "topic"] as const;

export default function ExploreScreen() {
  const { data, loading, error, progressBytes, reload, search } = useDataset();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

  const results = useMemo(() => {
    if (!data) return [] as SearchRecord[];
    const base = query.trim()
      ? search(query, 50)
      : data.searchIndex.filter((r) => filter === "all" || r.type === filter).slice(0, 80);
    return query.trim() && filter !== "all"
      ? base.filter((r) => r.type === filter)
      : base;
  }, [data, query, filter, search]);

  if (loading) return <LoadingView progressBytes={progressBytes} />;
  if (error || !data) return <ErrorView message={error ?? "Unknown error"} onRetry={reload} />;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <SectionTitle
          title="Explore"
          subtitle={`Search ${formatNumber(data.searchIndex.length)} offices, people, and places.`}
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search CM, DM, ministry, district…"
          placeholderTextColor={colors.ink400}
          style={styles.input}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        <View style={styles.filters}>
          {FILTERS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setFilter(t)}
              style={[styles.chip, filter === t && styles.chipActive]}
            >
              <Text style={[styles.chipText, filter === t && styles.chipTextActive]}>
                {t === "all" ? "All" : t[0].toUpperCase() + t.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Text style={styles.empty}>No matches. Try another search.</Text>
        }
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/record/[type]/[id]",
              params: { type: item.type, id: String(item.id) },
            }}
            asChild
          >
            <Pressable style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.type}>{item.type}</Text>
                <Text style={styles.label}>{item.label}</Text>
                {item.subtitle ? (
                  <Text style={styles.subtitle} numberOfLines={2}>
                    {item.subtitle}
                  </Text>
                ) : null}
              </View>
              {typeof item.data.data_status === "string" ? (
                <StatusBadge status={item.data.data_status} />
              ) : null}
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.ink100,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink950,
    marginBottom: spacing.md,
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  chip: {
    backgroundColor: colors.ink100,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  chipActive: { backgroundColor: colors.ink950 },
  chipText: { color: colors.ink600, fontWeight: "600", fontSize: 13 },
  chipTextActive: { color: colors.white },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl, gap: spacing.sm },
  row: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ink100,
    padding: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  type: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.saffronDark,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  label: { fontSize: 16, fontWeight: "700", color: colors.ink950 },
  subtitle: { marginTop: 4, fontSize: 13, color: colors.ink600, lineHeight: 18 },
  empty: {
    textAlign: "center",
    color: colors.ink400,
    marginTop: spacing.xl,
  },
});
