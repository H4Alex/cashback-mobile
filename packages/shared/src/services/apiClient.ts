/**
 * @cashback/shared — API Client abstraction
 *
 * Provides a platform-agnostic API client wrapper.
 * The actual Axios instance is injected at app startup via initApiClient().
 * Web and mobile each create their own Axios instance with platform-specific
 * interceptors (CSRF, token storage, error handling) and call initApiClient().
 */

import type { AxiosInstance, AxiosRequestConfig } from 'axios'

let _client: AxiosInstance | null = null

/**
 * Initialize the shared API client with a platform-specific Axios instance.
 * Must be called once during app startup before any service calls.
 *
 * @example
 * // In mobile app entry:
 * import { initApiClient } from '@cashback/shared'
 * initApiClient(mobileAxiosInstance)
 *
 * // In web app entry:
 * import { initApiClient } from '@cashback/shared'
 * initApiClient(webAxiosInstance)
 */
export function initApiClient(client: AxiosInstance): void {
  _client = client
}

function getClient(): AxiosInstance {
  if (!_client) {
    throw new Error(
      '@cashback/shared: API client not initialized. Call initApiClient() at app startup.'
    )
  }
  return _client
}

/**
 * Shared API client — delegates to the platform-specific Axios instance.
 * Services import this instead of a platform-specific api.ts.
 */
const api = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return getClient().get<T>(url, config)
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return getClient().post<T>(url, data, config)
  },
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return getClient().patch<T>(url, data, config)
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return getClient().put<T>(url, data, config)
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig) {
    return getClient().delete<T>(url, config)
  },
}

export default api
