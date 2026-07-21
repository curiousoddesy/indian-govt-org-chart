import { useCallback, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { search } from "@/lib/data";
import type { SearchRecord } from "@/lib/types";
import { colors, fonts } from "@/lib/theme";
import { Badge } from "@/components/ui";

interface SearchBarProps {
  placeholder?: string;
  onSelect: (item: SearchRecord) => void;
  autoFocus?: boolean;
}

export default function SearchBar({
  placeholder = "Search offices, people, jurisdictions…",
  onSelect,
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchRecord[]>([]);
  const [open, setOpen] = useState(false);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setResults(search(q, 12));
    setOpen(true);
  }, []);

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.ink400}
        value={query}
        autoFocus={autoFocus}
        onChangeText={handleSearch}
        onFocus={() => results.length > 0 && setOpen(true)}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      {open && results.length > 0 ? (
        <View style={styles.dropdown}>
          {results.map((item) => (
            <Pressable
              key={`${item.type}-${item.id}`}
              style={({ pressed }) => [
                styles.row,
                pressed && { backgroundColor: colors.ink50 },
              ]}
              onPress={() => {
                setOpen(false);
                setQuery("");
                setResults([]);
                onSelect(item);
              }}
            >
              <Badge label={item.type} bg={colors.ink100} text={colors.ink600} />
              <View style={styles.rowText}>
                <Text style={styles.label} numberOfLines={1}>
                  {item.label}
                </Text>
                {item.subtitle ? (
                  <Text style={styles.sub} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                ) : null}
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 20,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.ink200,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink900,
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ink200,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.ink100,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink900,
  },
  sub: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink500,
    marginTop: 2,
  },
});
