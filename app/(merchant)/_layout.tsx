import { Stack } from "expo-router";

export default function MerchantLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="multiloja"
        options={{ headerShown: true, title: "Selecionar Empresa", presentation: "modal" }}
      />
    </Stack>
  );
}
