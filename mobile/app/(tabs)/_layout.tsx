import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Platform } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { colors, fonts } from "@/lib/theme";

function TabIcon(props: {
  name: ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -2 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabIconSelected,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          paddingTop: 4,
          height: Platform.OS === "ios" ? 88 : 64,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 11,
        },
        headerStyle: {
          backgroundColor: theme.card,
        },
        headerTitleStyle: {
          fontFamily: fonts.displaySemi,
          color: colors.ink950,
        },
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <TabIcon name="home" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <TabIcon name="search" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="geography"
        options={{
          title: "Geography",
          tabBarIcon: ({ color }) => (
            <TabIcon name="map" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="quality"
        options={{
          title: "Quality",
          tabBarIcon: ({ color }) => (
            <TabIcon name="check-circle" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "AI Agent",
          tabBarIcon: ({ color }) => (
            <TabIcon name="comments" color={String(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="wiki"
        options={{
          title: "Wiki",
          tabBarIcon: ({ color }) => (
            <TabIcon name="book" color={String(color)} />
          ),
        }}
      />
    </Tabs>
  );
}
