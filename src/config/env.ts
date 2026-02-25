import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

export const env = {
  API_BASE_URL: (extra.apiBaseUrl as string) ?? "http://localhost:3000",
  SENTRY_DSN: (extra.sentryDsn as string) ?? "",
  APP_ENV: (extra.appEnv as string) ?? "development",
} as const;

export const isDev = env.APP_ENV === "development";
export const isProd = env.APP_ENV === "production";
