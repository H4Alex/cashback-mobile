import { Tabs } from "expo-router";

export default function ConsumerTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#22C55E",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Início",
          headerTitle: "H4 Cashback",
        }}
      />
      <Tabs.Screen
        name="qrcode"
        options={{
          title: "Resgatar",
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Avisos",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
        }}
      />
    </Tabs>
  );
}
