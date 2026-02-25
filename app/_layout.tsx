import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/src/theme";
import { queryClient } from "@/src/config";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

function AppInitializer({ children }: { children: React.ReactNode }) {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return <>{children}</>;
}

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
