import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { useNotificationStore } from "@/src/stores";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text className={`text-xl ${focused ? "opacity-100" : "opacity-50"}`}>{label}</Text>;
}

export default function ConsumerTabsLayout() {
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { paddingBottom: 4, height: 56 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Início",
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="saldo/index"
        options={{
          title: "Saldo",
          tabBarIcon: ({ focused }) => <TabIcon label="💰" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="qrcode/index"
        options={{
          title: "QR Code",
          tabBarIcon: ({ focused }) => <TabIcon label="📱" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="notifications/index"
        options={{
          title: "Alertas",
          tabBarIcon: ({ focused }) => (
            <View>
              <TabIcon label="🔔" focused={focused} />
              {unreadCount > 0 && (
                <View className="absolute -top-1 -right-2 bg-red-500 rounded-full min-w-[16px] h-[16px] items-center justify-center">
                  <Text className="text-white text-[9px] font-bold">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => <TabIcon label="👤" focused={focused} />,
        }}
      />

      {/* Hidden screens (accessible via navigation, not shown in tab bar) */}
      <Tabs.Screen
        name="notifications/preferences"
        options={{ href: null, title: "Preferências" }}
      />
      <Tabs.Screen name="profile/edit" options={{ href: null, title: "Editar Perfil" }} />
      <Tabs.Screen
        name="profile/change-password"
        options={{ href: null, title: "Alterar Senha" }}
      />
      <Tabs.Screen name="profile/delete-account" options={{ href: null, title: "Excluir Conta" }} />
    </Tabs>
  );
}
