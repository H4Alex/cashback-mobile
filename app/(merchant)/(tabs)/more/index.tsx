import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores";
import { useMultilojaStore } from "@/src/stores/multiloja.store";

const MENU_ITEMS = [
  { icon: "📢", label: "Campanhas", route: "/(merchant)/(tabs)/more/campanhas" },
  { icon: "🛒", label: "Vendas", route: "/(merchant)/(tabs)/more/vendas" },
  { icon: "⚖️", label: "Contestações", route: "/(merchant)/(tabs)/more/contestacoes" },
  { icon: "📊", label: "Relatórios", route: "/(merchant)/(tabs)/more/relatorios" },
  { icon: "⚙️", label: "Configurações", route: "/(merchant)/(tabs)/more/config" },
] as const;

export default function MoreMenuScreen() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const isMultiloja = useMultilojaStore((s) => s.isMultiloja);

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente sair da conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50 pt-4">
      <Text className="text-2xl font-bold px-4 mb-4">Mais</Text>

      <View className="bg-white rounded-xl mx-4 overflow-hidden mb-4">
        {MENU_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={item.label}
            className={`flex-row items-center px-4 py-4 ${i < MENU_ITEMS.length - 1 ? "border-b border-gray-100" : ""}`}
            onPress={() => router.push(item.route)}
          >
            <Text className="text-lg mr-3">{item.icon}</Text>
            <Text className="flex-1 text-base">{item.label}</Text>
            <Text className="text-gray-300">›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="bg-white rounded-xl mx-4 overflow-hidden mb-4">
        {isMultiloja() && (
          <TouchableOpacity
            className="flex-row items-center px-4 py-4 border-b border-gray-100"
            onPress={() => router.push("/(merchant)/multiloja")}
          >
            <Text className="text-lg mr-3">🔄</Text>
            <Text className="flex-1 text-base">Trocar empresa</Text>
            <Text className="text-gray-300">›</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="flex-row items-center px-4 py-4"
          onPress={() => router.push("/(shared)/privacy-policy")}
        >
          <Text className="text-lg mr-3">📄</Text>
          <Text className="flex-1 text-base">Política de Privacidade</Text>
          <Text className="text-gray-300">›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-red-50 rounded-xl mx-4 py-4 items-center mt-4"
        onPress={handleLogout}
      >
        <Text className="text-red-600 font-semibold">Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
