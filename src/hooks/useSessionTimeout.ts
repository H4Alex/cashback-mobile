import { useEffect, useRef, useCallback } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useAuthStore } from "@/src/stores";

const TIMEOUT_MS = 15 * 60_000; // 15 minutes

/**
 * Auto-logout after 15 minutes of inactivity.
 * Tracks last activity time and checks on app state changes.
 */
export function useSessionTimeout() {
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const lastActivityRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (isAuthenticated) {
      timerRef.current = setTimeout(() => {
        logout();
      }, TIMEOUT_MS);
    }
  }, [isAuthenticated, logout]);

  useEffect(() => {
    if (!isAuthenticated) return;

    resetTimer();

    const handleAppState = (nextState: AppStateStatus) => {
      if (nextState === "active") {
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= TIMEOUT_MS) {
          logout();
        } else {
          resetTimer();
        }
      }
    };

    const sub = AppState.addEventListener("change", handleAppState);

    return () => {
      sub.remove();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAuthenticated, logout, resetTimer]);

  return { resetTimer };
}
