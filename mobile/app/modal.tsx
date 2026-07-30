import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors, spacing } from "@/lib/theme";

const SITE = "https://indianorgchart.netlify.app";

export default function AboutModal() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.eyebrow}>Accountable India</Text>
      <Text style={styles.title}>Indian Govt Org Chart</Text>
      <Text style={styles.body}>
        Mobile companion for the open org-chart dataset. Dashboard, search,
        geography, and data-quality views load live from the production site.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Test on Expo Go</Text>
        <Text style={styles.cardBody}>
          1. Install Expo Go on your Android phone{"\n"}
          2. In this repo run:{"\n"}
          {"   "}cd mobile && npx expo start{"\n"}
          3. Scan the QR code with Expo Go{"\n"}
          4. First launch downloads ~12 MB of data — wait for it once
        </Text>
      </View>

      <Pressable onPress={() => Linking.openURL(SITE)} style={styles.btn}>
        <Text style={styles.btnText}>Open web app</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    padding: spacing.xl,
  },
  eyebrow: {
    color: colors.saffronDark,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.ink950,
    marginBottom: spacing.md,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.ink600,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.ink100,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  cardTitle: {
    fontWeight: "800",
    color: colors.ink950,
    marginBottom: spacing.sm,
    fontSize: 16,
  },
  cardBody: {
    color: colors.ink800,
    lineHeight: 22,
    fontSize: 14,
  },
  btn: {
    backgroundColor: colors.saffron,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 15,
  },
});
