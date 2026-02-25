import { View, Text, Switch, ActivityIndicator, Alert } from "react-native";
import { useNotificationPreferences, useUpdateNotificationPreferences } from "@/src/hooks";
import type { NotificationPreferences } from "@/src/types";

function PreferenceRow({
  label,
  description,
  value,
  onValueChange,
  disabled,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
      <View className="flex-1 mr-4">
        <Text className="text-base font-medium">{label}</Text>
        <Text className="text-gray-500 text-sm mt-1">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ true: "#3b82f6" }}
      />
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text className="text-xs font-semibold text-gray-400 uppercase mt-6 mb-2">{title}</Text>;
}

export default function NotificationPreferencesScreen() {
  const { data: prefs, isLoading } = useNotificationPreferences();
  const updateMutation = useUpdateNotificationPreferences();

  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    updateMutation.mutate(
      { [key]: value },
      {
        onError: () => Alert.alert("Erro", "Não foi possível atualizar preferência."),
      },
    );
  };

  if (isLoading || !prefs) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pt-6">
      <Text className="text-2xl font-bold mb-2">Preferências</Text>
      <Text className="text-gray-500 text-sm mb-4">
        Escolha como e quando deseja ser notificado.
      </Text>

      <SectionHeader title="Canais" />

      <PreferenceRow
        label="Push Notifications"
        description="Receber alertas no celular em tempo real"
        value={prefs.push_enabled}
        onValueChange={(v) => handleToggle("push_enabled", v)}
        disabled={updateMutation.isPending}
      />

      <PreferenceRow
        label="Email"
        description="Receber resumos e alertas por email"
        value={prefs.email_enabled}
        onValueChange={(v) => handleToggle("email_enabled", v)}
        disabled={updateMutation.isPending}
      />

      <SectionHeader title="Categorias" />

      <PreferenceRow
        label="Transações"
        description="Cashback recebido, resgates e expirações"
        value={prefs.push_enabled}
        onValueChange={(v) => handleToggle("push_enabled", v)}
        disabled={updateMutation.isPending}
      />

      <PreferenceRow
        label="Promoções"
        description="Ofertas e campanhas de lojistas parceiros"
        value={prefs.marketing_enabled}
        onValueChange={(v) => handleToggle("marketing_enabled", v)}
        disabled={updateMutation.isPending}
      />

      <PreferenceRow
        label="Marketing"
        description="Novidades, dicas e conteúdo do app"
        value={prefs.marketing_enabled}
        onValueChange={(v) => handleToggle("marketing_enabled", v)}
        disabled={updateMutation.isPending}
      />
    </View>
  );
}
