import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

export const env = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_URL ?? (extra.apiBaseUrl as string) ?? "http://localhost:3000",
  SENTRY_DSN: process.env.SENTRY_DSN ?? (extra.sentryDsn as string) ?? "",
  APP_ENV: process.env.APP_ENV ?? (extra.appEnv as string) ?? "development",
} as const;

export const isDev = env.APP_ENV === "development";
export const isProd = env.APP_ENV === "production";

/**
 * Validates that required environment variables are set in production.
 * Call once at app startup.
 */
export function validateEnv(): void {
  if (!isProd) return;

  const missing: string[] = [];

  if (!env.SENTRY_DSN) missing.push("SENTRY_DSN");
  if (env.API_BASE_URL === "http://localhost:3000") missing.push("EXPO_PUBLIC_API_URL");

  if (missing.length > 0) {
    throw new Error(`[ENV] Missing required env vars for production: ${missing.join(", ")}`);
  }
}
