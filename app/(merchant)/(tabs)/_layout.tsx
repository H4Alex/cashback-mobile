import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useMultilojaStore } from "@/src/stores/multiloja.store";

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  return <Text className={`text-xl ${focused ? "opacity-100" : "opacity-50"}`}>{label}</Text>;
}

export default function MerchantTabsLayout() {
  const empresaAtiva = useMultilojaStore((s) => s.empresaAtiva);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { paddingBottom: 4, height: 56 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        headerTitle: empresaAtiva?.nome_fantasia ?? "Lojista",
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => <TabIcon label="📊" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cashback/index"
        options={{
          title: "Cashback",
          tabBarIcon: ({ focused }) => <TabIcon label="💰" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="clientes/index"
        options={{
          title: "Clientes",
          tabBarIcon: ({ focused }) => <TabIcon label="👥" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="more/index"
        options={{
          title: "Mais",
          tabBarIcon: ({ focused }) => <TabIcon label="☰" focused={focused} />,
        }}
      />

      {/* Hidden screens */}
      <Tabs.Screen name="cashback/gerar" options={{ href: null, title: "Gerar Cashback" }} />
      <Tabs.Screen name="cashback/utilizar" options={{ href: null, title: "Utilizar Cashback" }} />
      <Tabs.Screen name="cashback/qr-scan" options={{ href: null, title: "Escanear QR" }} />
      <Tabs.Screen name="clientes/[id]" options={{ href: null, title: "Detalhe do Cliente" }} />
      <Tabs.Screen name="more/campanhas" options={{ href: null, title: "Campanhas" }} />
      <Tabs.Screen name="more/vendas" options={{ href: null, title: "Vendas" }} />
      <Tabs.Screen name="more/contestacoes" options={{ href: null, title: "Contestações" }} />
      <Tabs.Screen name="more/config" options={{ href: null, title: "Configurações" }} />
      <Tabs.Screen name="more/relatorios" options={{ href: null, title: "Relatórios" }} />
    </Tabs>
  );
}
