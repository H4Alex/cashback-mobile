import { useEffect } from "react";
import { View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/src/theme";
import { queryClient, validateEnv } from "@/src/config";
import { useAuthStore } from "@/src/stores";
import { useConnectivity } from "@/src/hooks/useConnectivity";
import { ErrorBoundary, OfflineBanner } from "@/src/components";
import { initSentry } from "@/src/lib/sentry";
import { validateApiHost } from "@/src/lib/ssl-pinning";
import { usePushSetup } from "@/src/hooks/usePushSetup";
import { hasCompletedOnboarding } from "./(auth)/onboarding";
import { hasGivenConsent } from "./(auth)/consent";
import "../global.css";

initSentry();
validateEnv();
validateApiHost();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Check onboarding first
      if (!hasCompletedOnboarding()) {
        router.replace("/(auth)/onboarding");
      } else {
        router.replace("/(auth)/login");
      }
    } else if (isAuthenticated && inAuthGroup) {
      // Check LGPD consent before proceeding
      if (!hasGivenConsent()) {
        router.replace("/(auth)/consent");
      } else {
        router.replace("/");
      }
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return <>{children}</>;
}

function PushRegistration() {
  usePushSetup();
  return null;
}

function ConnectivityBanner() {
  const { isOnline } = useConnectivity();
  return <OfflineBanner visible={!isOnline} />;
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthGuard>
            <View className="flex-1">
              <PushRegistration />
              <ConnectivityBanner />
              <StatusBar style="auto" />
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" options={{ headerShown: true, title: "Cashback" }} />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(consumer)" />
                <Stack.Screen name="(merchant)" />
                <Stack.Screen name="(shared)" />
              </Stack>
            </View>
          </AuthGuard>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
