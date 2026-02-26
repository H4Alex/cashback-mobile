import { useEffect, useRef, useCallback } from "react";
import { Platform } from "react-native";

interface StartupMetrics {
  coldStartMs: number;
  ttiMs: number;
  jsReady: boolean;
}

const appStartTime = Date.now();
let reportedStartup = false;

export function useStartupPerformance(onMetrics?: (metrics: StartupMetrics) => void) {
  const ttiRef = useRef<number | null>(null);
  const metricsRef = useRef<StartupMetrics | null>(null);

  const markTTI = useCallback(() => {
    if (ttiRef.current !== null) return;
    ttiRef.current = Date.now();

    const coldStartMs = ttiRef.current - appStartTime;
    const metrics: StartupMetrics = {
      coldStartMs,
      ttiMs: coldStartMs,
      jsReady: true,
    };

    metricsRef.current = metrics;

    if (!reportedStartup) {
      reportedStartup = true;

      if (__DEV__) {
        console.log(`[Performance] Cold start: ${coldStartMs}ms | Platform: ${Platform.OS}`);
      }

      onMetrics?.(metrics);
    }
  }, [onMetrics]);

  useEffect(() => {
    markTTI();
  }, [markTTI]);

  return {
    metrics: metricsRef.current,
    markTTI,
    appStartTime,
  };
}
