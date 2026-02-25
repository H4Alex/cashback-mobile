/**
 * Mobile-specific Axios instance
 *
 * Creates an Axios instance with mobile interceptors:
 * - JWT injection from expo-secure-store
 * - Token refresh on 401
 * - Rate limiting from @cashback/shared
 * - No CSRF (mobile doesn't need it)
 * - No DOMPurify (React Native has no DOM)
 */

import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const API_TIMEOUT_MS = 15_000;

const baseURL =
  Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:4000";

export function createMobileApiClient() {
  const api = axios.create({
    baseURL,
    timeout: API_TIMEOUT_MS,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  let isRefreshing = false;
  let refreshPromise: Promise<string | null> | null = null;

  // ─── Request Interceptor ───────────────────────────────────
  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Inject JWT from SecureStore
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ─── Response Interceptor ──────────────────────────────────
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalRequest = error.config;

      // 401 — Token expired: try refresh
      if (
        status === 401 &&
        originalRequest &&
        !(originalRequest as any)._isRetry
      ) {
        const isAuthRoute =
          originalRequest.url?.includes("/auth/login") ||
          originalRequest.url?.includes("/auth/register") ||
          originalRequest.url?.includes("/auth/refresh");

        if (!isAuthRoute) {
          (originalRequest as any)._isRetry = true;

          if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = tryRefreshToken(api);
          }

          try {
            const newToken = await refreshPromise;
            if (newToken && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return api(originalRequest);
          } catch {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            return Promise.reject(error);
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        }
      }

      // Attach user-friendly message
      if (status) {
        const responseData = error.response?.data as
          | Record<string, unknown>
          | undefined;
        const errorObj = responseData?.error as
          | Record<string, unknown>
          | undefined;
        const serverMessage = errorObj?.message ?? responseData?.message;
        (error as any).userMessage =
          (typeof serverMessage === "string" ? serverMessage : null) ||
          `Erro ${status}`;
      } else if (error.code === "ECONNABORTED") {
        (error as any).userMessage =
          "Tempo limite excedido. Verifique sua conexão.";
      } else if (!error.response) {
        (error as any).userMessage =
          "Sem conexão com o servidor. Verifique sua internet.";
      }

      return Promise.reject(error);
    }
  );

  return api;
}

async function tryRefreshToken(
  api: ReturnType<typeof axios.create>
): Promise<string | null> {
  try {
    const response = await api.post<{
      status: boolean;
      data: { token: string; token_type: string; expires_in: number };
    }>("/auth/refresh");

    const newToken = response.data?.data?.token;
    if (newToken) {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
}
