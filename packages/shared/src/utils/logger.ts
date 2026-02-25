/**
 * Minimal platform-agnostic logger.
 */
const logger = {
  info: (...args: unknown[]) => console.log('[INFO]', ...args),
  warn: (...args: unknown[]) => console.warn('[WARN]', ...args),
  error: (...args: unknown[]) => console.error('[ERROR]', ...args),
  debug: (...args: unknown[]) => {
    if (__DEV__) console.debug('[DEBUG]', ...args)
  },
}

declare const __DEV__: boolean

export default logger
