/**
 * @cashback/shared — i18n configuration
 *
 * Platform-agnostic i18next setup. Each platform (web/mobile) should call
 * initI18n() with a language detector appropriate for their environment.
 */

import i18n from 'i18next'
import ptBR from './locales/pt-BR.json'
import en from './locales/en.json'

export const defaultResources = {
  'pt-BR': { translation: ptBR },
  en: { translation: en },
}

/**
 * Initialize i18n with shared resources and optional platform-specific config.
 * Call this once during app startup.
 */
export function initI18n(options?: {
  lng?: string
  fallbackLng?: string
}) {
  if (!i18n.isInitialized) {
    i18n.init({
      resources: defaultResources,
      lng: options?.lng ?? 'pt-BR',
      fallbackLng: options?.fallbackLng ?? 'pt-BR',
      interpolation: { escapeValue: false },
      compatibilityJSON: 'v4',
    })
  }
  return i18n
}

export default i18n
