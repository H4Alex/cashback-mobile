import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores";

export default function ProfileScreen() {
  const router = useRouter();
  const cliente = useAuthStore((s) => s.cliente);
  const logout = useAuthStore((s) => s.logout);

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
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      {/* User info */}
      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3">
          <Text className="text-2xl font-bold text-blue-600">
            {cliente?.nome?.charAt(0)?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text className="text-xl font-bold">{cliente?.nome ?? "—"}</Text>
        <Text className="text-gray-500">{cliente?.email ?? "—"}</Text>
      </View>

      {/* Menu items */}
      <TouchableOpacity
        className="flex-row items-center py-4 border-b border-gray-100"
        onPress={() => router.push("/(consumer)/(tabs)/profile/edit")}
      >
        <Text className="flex-1 text-base">Editar Perfil</Text>
        <Text className="text-gray-400">{">"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center py-4 border-b border-gray-100"
        onPress={() => router.push("/(consumer)/(tabs)/profile/change-password")}
      >
        <Text className="flex-1 text-base">Alterar Senha</Text>
        <Text className="text-gray-400">{">"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center py-4 border-b border-gray-100"
        onPress={() => router.push("/(consumer)/(tabs)/notifications/preferences")}
      >
        <Text className="flex-1 text-base">Preferências de Notificação</Text>
        <Text className="text-gray-400">{">"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-row items-center py-4 border-b border-gray-100"
        onPress={() => router.push("/(shared)/privacy-policy")}
      >
        <Text className="flex-1 text-base">Política de Privacidade</Text>
        <Text className="text-gray-400">{">"}</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity className="py-4 mt-4" onPress={handleLogout}>
        <Text className="text-red-500 text-base font-medium text-center">Sair</Text>
      </TouchableOpacity>

      {/* Delete account */}
      <TouchableOpacity
        className="py-4"
        onPress={() => router.push("/(consumer)/(tabs)/profile/delete-account")}
      >
        <Text className="text-red-600 text-sm text-center">Excluir Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
