/**
 * Platform-agnostic error reporting stubs.
 * Platforms can override via initErrorReporting().
 */

interface ErrorReporter {
  captureError: (error: unknown, context?: Record<string, unknown>) => void
  setUserContext: (user: { id: string; email: string } | null) => void
}

let _reporter: ErrorReporter = {
  captureError: (error, context) => {
    console.error('[ErrorReporting]', error, context)
  },
  setUserContext: () => {},
}

export function initErrorReporting(reporter: ErrorReporter): void {
  _reporter = reporter
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  _reporter.captureError(error, context)
}

export function setUserContext(user: { id: string; email: string } | null): void {
  _reporter.setUserContext(user)
}
