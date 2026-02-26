import type { InternalAxiosRequestConfig } from "axios";
import { env, isProd } from "@/src/config/env";

/**
 * Allowed API hostnames. Requests to any other host are rejected in production.
 *
 * Native-level certificate pinning (HPKP / TrustKit) requires a custom dev
 * client and should be added when moving to EAS custom builds:
 *   - iOS: TrustKit via expo config plugin
 *   - Android: network_security_config.xml
 *
 * This module provides application-level host validation that blocks
 * requests to unexpected origins, preventing accidental data leakage
 * and providing a baseline MITM mitigation layer.
 */
const ALLOWED_HOSTS = ["api.h4cashback.com", "u.expo.dev"];

function extractHost(url: string | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/**
 * Axios request interceptor that enforces HTTPS and validates the target host
 * against the allow-list. Only active in production.
 */
export function sslPinningInterceptor(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  if (!isProd) return config;

  const fullUrl = config.baseURL
    ? `${config.baseURL}${config.url ?? ""}`
    : config.url ?? "";

  const host = extractHost(fullUrl);

  if (!host) {
    throw new Error("[SSL] Cannot determine request host");
  }

  if (!ALLOWED_HOSTS.includes(host)) {
    throw new Error(`[SSL] Host not allowed: ${host}`);
  }

  // Enforce HTTPS in production
  if (fullUrl.startsWith("http://") && !fullUrl.includes("localhost")) {
    throw new Error(`[SSL] HTTPS required in production: ${fullUrl}`);
  }

  return config;
}

/**
 * Validate that the env config points to an allowed host.
 * Call once at startup to catch misconfigurations early.
 */
export function validateApiHost(): void {
  if (!isProd) return;

  const host = extractHost(env.API_BASE_URL);
  if (!host || !ALLOWED_HOSTS.includes(host)) {
    throw new Error(
      `[SSL] API_BASE_URL points to disallowed host: ${env.API_BASE_URL}. ` +
        `Allowed: ${ALLOWED_HOSTS.join(", ")}`,
    );
  }
}
