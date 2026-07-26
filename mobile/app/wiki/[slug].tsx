import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { getWikiPage } from "@/lib/wiki";
import { colors, fonts } from "@/lib/theme";

export default function WikiDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const page = getWikiPage(slug ?? "index");

  if (!page) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Page not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: page.title }} />
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{page.title}</Text>
        <Text style={styles.body}>{page.content}</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink50 },
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink950,
    marginBottom: 16,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink700,
    lineHeight: 24,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ink50,
  },
  missing: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.ink500,
  },
});
