import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/src/stores';
import '../global.css';

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
      <AppInitializer>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="index" options={{ title: 'Cashback' }} />
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(consumer)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(shared)/privacy-policy"
            options={{ title: 'Política de Privacidade' }}
          />
        </Stack>
      </AppInitializer>
    </QueryClientProvider>
  );
}
