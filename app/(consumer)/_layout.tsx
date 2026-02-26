import { Stack } from "expo-router";
import { ErrorBoundary } from "@/src/components";

export default function ConsumerLayout() {
  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="contestacao/index"
          options={{ headerShown: true, title: "Contestações" }}
        />
        <Stack.Screen
          name="contestacao/create"
          options={{ headerShown: true, title: "Nova Contestação" }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
