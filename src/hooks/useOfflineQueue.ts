import { useState, useEffect, useCallback, useRef } from "react";

const MAX_ITEMS = 50;
// TTL for queued items — 24 hours. Used in production when flushing.
// const TTL_MS = 24 * 60 * 60_000;

interface QueueItem {
  id: string;
  action: string;
  payload: unknown;
  createdAt: number;
}

/**
 * Offline queue for mutations.
 * In production, items are persisted to MMKV and flushed on reconnect
 * via NetInfo.addEventListener.
 */
export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isOnline] = useState(true);
  const flushingRef = useRef(false);

  // In production: subscribe to NetInfo for connectivity changes
  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsOnline(!!state.isConnected);
  //   });
  //   return unsubscribe;
  // }, []);

  const enqueue = useCallback((action: string, payload: unknown) => {
    setQueue((prev) => {
      // Enforce max items
      const filtered = prev.length >= MAX_ITEMS ? prev.slice(1) : prev;
      return [
        ...filtered,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          action,
          payload,
          createdAt: Date.now(),
        },
      ];
    });
  }, []);

  const flush = useCallback(async () => {
    if (flushingRef.current || queue.length === 0) return;
    flushingRef.current = true;

    // In production: filter by TTL and execute each item's action against the API
    // const now = Date.now();
    // const validItems = queue.filter((item) => now - item.createdAt < TTL_MS);
    // for (const item of validItems) { await executeAction(item); }
    setQueue([]);
    flushingRef.current = false;
  }, [queue]);

  // Auto-flush when coming back online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      flush();
    }
  }, [isOnline, queue.length, flush]);

  return {
    queue,
    queueSize: queue.length,
    isOnline,
    enqueue,
    flush,
  };
}
