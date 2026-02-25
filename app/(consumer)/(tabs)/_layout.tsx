import { Stack } from "expo-router";

export default function ConsumerTabsLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile/index" options={{ title: "Perfil" }} />
      <Stack.Screen name="profile/edit" options={{ title: "Editar Perfil" }} />
      <Stack.Screen name="profile/change-password" options={{ title: "Alterar Senha" }} />
      <Stack.Screen name="profile/delete-account" options={{ title: "Excluir Conta" }} />
      <Stack.Screen name="notifications/index" options={{ title: "Notificações" }} />
      <Stack.Screen name="notifications/preferences" options={{ title: "Preferências" }} />
      <Stack.Screen name="qrcode/index" options={{ title: "QR Code" }} />
    </Stack>
  );
}
