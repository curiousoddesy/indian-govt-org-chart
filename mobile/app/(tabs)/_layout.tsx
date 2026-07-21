import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { colors } from "@/lib/theme";

function TabIcon({
  name,
  color,
}: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={22} style={{ marginBottom: -2 }} name={name} color={color} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.saffron,
        tabBarInactiveTintColor: colors.ink400,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.ink100,
        },
        headerStyle: { backgroundColor: colors.cream },
        headerTintColor: colors.ink950,
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <TabIcon name="home" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <TabIcon name="search" color={String(color)} />,
        }}
      />
      <Tabs.Screen
        name="geography"
        options={{
          title: "Geography",
          tabBarIcon: ({ color }) => <TabIcon name="map" color={String(color)} />,
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
    </Tabs>
  );
}
