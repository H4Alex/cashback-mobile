import { Stack } from "expo-router";
import { ErrorBoundary } from "@/src/components";

export default function MerchantLayout() {
  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="multiloja"
          options={{ headerShown: true, title: "Selecionar Empresa", presentation: "modal" }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
