import { useEffect, useRef } from "react";
import { AppState } from "react-native";

/**
 * Calls `refetch` when the app returns from background to foreground.
 * Useful for financial data that should stay fresh.
 */
export function useRefreshOnFocus(refetch: () => void) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (appState.current.match(/inactive|background/) && nextState === "active") {
        refetch();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [refetch]);
}
