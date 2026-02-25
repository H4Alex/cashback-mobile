import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import * as SecureStore from 'expo-secure-store';
import type { ApiError, TokenPair } from '@/src/types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.h4cashback.com';
const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'refresh_token';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

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
    baseURL: BASE_URL,
    timeout: 15_000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor — attach JWT
  client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor — handle 401 refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiError>) => {
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
          const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const { data } = await axios.post<TokenPair>(
            `${BASE_URL}/api/mobile/v1/auth/refresh`,
            {},
            { headers: { Authorization: `Bearer ${refreshToken}` } },
          );

          await saveTokens(data.token, refreshToken);
          processQueue(null, data.token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
          }
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          await clearTokens();
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
}

export async function saveTokens(
  token: string,
  refreshToken?: string,
): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  if (refreshToken) {
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
  }
}

export async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_KEY);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export const apiClient = createApiClient();
