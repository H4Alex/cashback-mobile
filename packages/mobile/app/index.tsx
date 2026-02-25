import { Redirect } from "expo-router";
import { useAuthStore } from "@cashback/shared";

/**
 * Root index — redirects to auth or main app based on auth state.
 */
export default function Index() {
  const token = useAuthStore((s) => s.token);

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  // TODO: Check user type (consumer vs merchant) and redirect accordingly
  return <Redirect href="/(consumer)/(tabs)/dashboard" />;
}
