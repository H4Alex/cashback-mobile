import * as Sentry from "@sentry/react-native";
import { env, isDev } from "@/src/config/env";

export function initSentry() {
  if (!env.SENTRY_DSN) return;

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.APP_ENV,
    enabled: !isDev,
    tracesSampleRate: isDev ? 1.0 : 0.2,
    attachScreenshot: true,
    sendDefaultPii: false,
  });
}

export { Sentry };
