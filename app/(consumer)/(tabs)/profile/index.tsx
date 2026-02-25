import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/src/stores";
import { useDeviceStore } from "@/src/stores/device.store";
import { ThemeToggle } from "@/src/components/ThemeToggle";
import { useBiometric } from "@/src/hooks/useBiometric";

function MenuRow({
  label,
  onPress,
  accessibilityLabel: a11yLabel,
}: {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}) {
  return (
    <TouchableOpacity
      className="flex-row items-center py-4 border-b border-gray-100"
      onPress={onPress}
      accessibilityLabel={a11yLabel ?? label}
      accessibilityRole="button"
    >
      <Text className="flex-1 text-base">{label}</Text>
      <Text className="text-gray-400">›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const cliente = useAuthStore((s) => s.cliente);
  const logout = useAuthStore((s) => s.logout);
  const { biometricAvailable, biometricEnrolled, enroll } = useBiometric();
  const setBiometricEnrolled = useDeviceStore((s) => s.setBiometricEnrolled);

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

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      const success = await enroll();
      if (!success) {
        Alert.alert("Erro", "Não foi possível ativar a biometria.");
      }
    } else {
      setBiometricEnrolled(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      {/* User info */}
      <View className="items-center mb-8" accessibilityRole="header">
        <View
          className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-3"
          accessibilityLabel={`Avatar de ${cliente?.nome ?? "usuário"}`}
        >
          <Text className="text-2xl font-bold text-blue-600">
            {cliente?.nome?.charAt(0)?.toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text className="text-xl font-bold">{cliente?.nome ?? "—"}</Text>
        <Text className="text-gray-500">{cliente?.email ?? "—"}</Text>
      </View>

      {/* Account section */}
      <MenuRow
        label="Editar Perfil"
        onPress={() => router.push("/(consumer)/(tabs)/profile/edit")}
      />
      <MenuRow
        label="Alterar Senha"
        onPress={() => router.push("/(consumer)/(tabs)/profile/change-password")}
      />
      <MenuRow
        label="Preferências de Notificação"
        onPress={() => router.push("/(consumer)/(tabs)/notifications/preferences")}
      />

      {/* Biometrics */}
      {biometricAvailable && (
        <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
          <View className="flex-1 mr-4">
            <Text className="text-base">Biometria</Text>
            <Text className="text-gray-400 text-xs mt-0.5">FaceID / Impressão digital</Text>
          </View>
          <Switch
            value={biometricEnrolled}
            onValueChange={handleBiometricToggle}
            trackColor={{ true: "#3b82f6" }}
            accessibilityLabel="Ativar login biométrico"
          />
        </View>
      )}

      {/* Theme */}
      <View className="mt-6 mb-4">
        <ThemeToggle />
      </View>

      {/* Settings links */}
      <MenuRow
        label="Política de Privacidade"
        onPress={() => router.push("/(shared)/privacy-policy")}
      />

      {/* Logout */}
      <TouchableOpacity
        className="py-4 mt-4"
        onPress={handleLogout}
        accessibilityLabel="Sair da conta"
        accessibilityRole="button"
      >
        <Text className="text-red-500 text-base font-medium text-center">Sair</Text>
      </TouchableOpacity>

      {/* Delete account */}
      <TouchableOpacity
        className="py-4 mb-8"
        onPress={() => router.push("/(consumer)/(tabs)/profile/delete-account")}
        accessibilityLabel="Excluir conta permanentemente"
        accessibilityRole="button"
      >
        <Text className="text-red-600 text-sm text-center">Excluir Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
