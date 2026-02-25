import { Tabs } from "expo-router";

export default function MerchantTabsLayout() {
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
          title: "Dashboard",
          headerTitle: "H4 Cashback",
        }}
      />
      <Tabs.Screen
        name="cashback"
        options={{
          title: "Cashback",
        }}
      />
      <Tabs.Screen
        name="clientes"
        options={{
          title: "Clientes",
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "Mais",
        }}
      />
    </Tabs>
  );
}
