import { Stack } from "expo-router";

export default function ConsumerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="saldo-detail" options={{ presentation: "card" }} />
      <Stack.Screen name="extrato" options={{ presentation: "card" }} />
      <Stack.Screen name="historico" options={{ presentation: "card" }} />
    </Stack>
  );
}
