import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { env } from "@/src/config/env";
import { sslPinningInterceptor } from "@/src/lib/ssl-pinning";
import { secureStorage } from "./secureStorageService";

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
}

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: 15_000,
    headers: { "Content-Type": "application/json" },
  });

  // SSL host validation (runs first, before auth)
  client.interceptors.request.use(sslPinningInterceptor);

  client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await secureStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(client(originalRequest));
              },
              reject,
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const currentToken = await secureStorage.getToken();
          if (!currentToken) {
            throw new Error("No token available for refresh");
          }

          const { data } = await axios.post(
            `${env.API_BASE_URL}/auth/refresh`,
            {},
            { headers: { Authorization: `Bearer ${currentToken}` } },
          );

          const newToken = data.data.token;
          await secureStorage.setToken(newToken);

          processQueue(null, newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          await secureStorage.clearTokens();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
}

export const apiClient = createApiClient();
