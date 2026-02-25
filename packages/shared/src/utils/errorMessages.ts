import axios from 'axios'
import type { TFunction } from 'i18next'

/**
 * Extracts a user-friendly, i18n-aware error message from an unknown error.
 * Maps common network/HTTP errors to specific translation keys.
 */
export function getErrorMessage(error: unknown, t: TFunction, fallbackKey = 'errors.generic'): string {
  if (axios.isAxiosError(error)) {
    // Server returned a message
    const serverMsg = error.response?.data?.message
    if (serverMsg && typeof serverMsg === 'string') {
      return serverMsg
    }

    // Map by status code
    const status = error.response?.status
    if (status) {
      if (status === 401) return t('errors.unauthorized')
      if (status === 403) return t('errors.forbidden')
      if (status === 404) return t('errors.notFound')
      if (status === 409) return t('errors.conflict')
      if (status === 422) return t('errors.validation')
      if (status === 429) return t('errors.rateLimit')
      if (status >= 500) return t('errors.server')
    }

    // Network error (no response)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return t('errors.network')
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      return t('errors.timeout')
    }
  }

  // Rate limiter rejection (from api.ts interceptor)
  if (error instanceof Error && error.message.includes('Rate limit')) {
    return t('errors.rateLimit')
  }

  return t(fallbackKey)
}
