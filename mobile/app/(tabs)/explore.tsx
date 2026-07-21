import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import SearchBar from "@/components/SearchBar";
import {
  Badge,
  Card,
  ErrorState,
  LoadingState,
  SectionTitle,
} from "@/components/ui";
import { loadDataset, statusColor } from "@/lib/data";
import type { Dataset, SearchRecord } from "@/lib/types";
import { colors, fonts } from "@/lib/theme";

const TYPES = ["all", "position", "person", "jurisdiction", "body", "topic"];

export default function ExploreScreen() {
  const params = useLocalSearchParams<{ type?: string; id?: string }>();
  const [data, setData] = useState<Dataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SearchRecord | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadDataset()
      .then(setData)
      .catch(() => setError("Could not load dataset."));
  }, []);

  useEffect(() => {
    if (!data) return;
    const { type, id } = params;
    if (type && id) {
      const found = data.searchIndex.find(
        (r) => r.type === type && String(r.id) === id
      );
      if (found) setSelected(found);
    }
  }, [data, params]);

  const filteredBrowse = useMemo(() => {
    if (!data) return [];
    return data.searchIndex
      .filter((r) => filter === "all" || r.type === filter)
      .slice(0, 100);
  }, [data, filter]);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <SectionTitle
          title="Explore"
          subtitle={`Search ${data.searchIndex.length.toLocaleString("en-IN")} records across offices, people, and jurisdictions.`}
        />
        <SearchBar onSelect={setSelected} autoFocus />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {TYPES.map((t) => {
            const active = filter === t;
            return (
              <Pressable
                key={t}
                onPress={() => setFilter(t)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {selected ? (
        <ScrollView contentContainerStyle={styles.detailPad}>
          <DetailPanel item={selected} onClear={() => setSelected(null)} />
        </ScrollView>
      ) : (
        <FlatList
          data={filteredBrowse}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={styles.listPad}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.listRow,
                pressed && { backgroundColor: colors.ink100 },
              ]}
              onPress={() => setSelected(item)}
            >
              <Badge label={item.type} bg={colors.ink100} text={colors.ink600} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {item.label}
                </Text>
                {item.subtitle ? (
                  <Text style={styles.rowSub} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

function DetailPanel({
  item,
  onClear,
}: {
  item: SearchRecord;
  onClear: () => void;
}) {
  const d = item.data;
  const status =
    typeof d.data_status === "string" ? statusColor(d.data_status) : null;

  const entries = Object.entries(d)
    .filter(
      ([k, v]) =>
        !k.startsWith("_") &&
        v != null &&
        v !== "" &&
        !["id"].includes(k)
    )
    .slice(0, 16);

  return (
    <Card style={{ gap: 14 }}>
      <View style={styles.detailHead}>
        <View style={{ flex: 1, gap: 6 }}>
          <Badge label={item.type} bg={colors.ink100} text={colors.ink600} />
          <Text style={styles.detailTitle}>{item.label}</Text>
          {item.subtitle ? (
            <Text style={styles.rowSub}>{item.subtitle}</Text>
          ) : null}
        </View>
        {status && typeof d.data_status === "string" ? (
          <Badge label={d.data_status} bg={status.bg} text={status.text} />
        ) : null}
      </View>

      <View style={styles.fields}>
        {entries.map(([key, value]) => (
          <View key={key} style={styles.field}>
            <Text style={styles.fieldKey}>{key.replace(/_/g, " ")}</Text>
            <Text style={styles.fieldVal}>
              {typeof value === "boolean"
                ? value
                  ? "Yes"
                  : "No"
                : String(value)}
            </Text>
          </View>
        ))}
      </View>

      <Pressable onPress={onClear} style={styles.clearBtn}>
        <Text style={styles.clearText}>Back to list</Text>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink50,
  },
  header: {
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.ink200,
    backgroundColor: colors.white,
  },
  chips: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.ink100,
  },
  chipActive: {
    backgroundColor: colors.ink950,
  },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink600,
  },
  chipTextActive: {
    color: colors.white,
  },
  listPad: {
    padding: 12,
  },
  detailPad: {
    padding: 16,
  },
  listRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.ink200,
    padding: 12,
    marginBottom: 8,
  },
  rowTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink900,
  },
  rowSub: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink500,
    marginTop: 2,
  },
  detailHead: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  detailTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink950,
  },
  fields: {
    gap: 8,
  },
  field: {
    backgroundColor: colors.ink50,
    borderRadius: 10,
    padding: 10,
  },
  fieldKey: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.ink400,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  fieldVal: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink800,
    marginTop: 2,
  },
  clearBtn: {
    alignSelf: "flex-start",
    paddingVertical: 8,
  },
  clearText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.saffron600,
  },
});
