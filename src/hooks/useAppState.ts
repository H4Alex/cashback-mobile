import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";

/**
 * Calls `onForeground` when app transitions from background → active.
 * Calls `onBackground` when app transitions from active → background.
 */
export function useAppState(options?: {
  onForeground?: () => void;
  onBackground?: () => void;
}) {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === "active") {
        options?.onForeground?.();
      }
      if (appState.current === "active" && nextState.match(/inactive|background/)) {
        options?.onBackground?.();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [options]);

  return { currentState: appState.current };
}
