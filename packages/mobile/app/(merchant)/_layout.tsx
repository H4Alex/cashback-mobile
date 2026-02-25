import { Stack } from "expo-router";

export default function MerchantLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="gerar-cashback" options={{ presentation: "card" }} />
      <Stack.Screen name="utilizar-cashback" options={{ presentation: "card" }} />
    </Stack>
  );
}
