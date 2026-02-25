/**
 * Platform-agnostic auth orchestrator stubs.
 * Platforms can override via initAuthOrchestrator().
 */

interface AuthOrchestrator {
  onLoginSuccess: (data: unknown) => void
  onLogout: () => void
}

let _orchestrator: AuthOrchestrator = {
  onLoginSuccess: () => {},
  onLogout: () => {},
}

export function initAuthOrchestrator(orchestrator: AuthOrchestrator): void {
  _orchestrator = orchestrator
}

export function onLoginSuccess(data: unknown): void {
  _orchestrator.onLoginSuccess(data)
}

export function onLogout(): void {
  _orchestrator.onLogout()
}
