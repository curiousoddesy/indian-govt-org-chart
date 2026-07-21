import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { SectionTitle } from "@/components/ui";
import { getAllWikiPages } from "@/lib/wiki";
import { colors, fonts } from "@/lib/theme";

export default function WikiScreen() {
  const router = useRouter();
  const pages = getAllWikiPages();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <SectionTitle
          title="Wiki"
          subtitle="In-app docs for the Accountable India data model and methodology."
        />
      </View>
      <FlatList
        data={pages}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && { borderColor: colors.saffron400 },
            ]}
            onPress={() => router.push(`/wiki/${item.slug}`)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc} numberOfLines={3}>
              {item.description}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink50 },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.ink200,
  },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.ink200,
    padding: 16,
    marginBottom: 4,
  },
  title: {
    fontFamily: fonts.displaySemi,
    fontSize: 18,
    color: colors.ink950,
    marginBottom: 6,
  },
  desc: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink600,
    lineHeight: 20,
  },
});
