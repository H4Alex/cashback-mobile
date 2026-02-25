import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/src/theme";
import { queryClient } from "@/src/config";
import "../global.css";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="index" options={{ title: "Cashback" }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
