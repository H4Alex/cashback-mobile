import { useState, useEffect, useCallback, useRef } from "react";
import { storage } from "@/src/lib/mmkv";
import { apiClient } from "@/src/lib/api-client";
import { useConnectivityStore } from "@/src/stores/connectivity.store";
import { analytics } from "@/src/lib/analytics";

const STORAGE_KEY = "offline_queue";
const MAX_ITEMS = 50;
const TTL_MS = 24 * 60 * 60_000; // 24 hours
const MAX_RETRIES = 3;

interface QueueItem {
  id: string;
  action: string;
  payload: unknown;
  createdAt: number;
  retries: number;
}

type HttpMethod = "post" | "put" | "patch" | "delete";

interface ActionPayload {
  method: HttpMethod;
  url: string;
  data?: unknown;
}

function loadQueue(): QueueItem[] {
  const raw = storage.getString(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QueueItem[];
  } catch {
    return [];
  }
}

function persistQueue(items: QueueItem[]) {
  storage.set(STORAGE_KEY, JSON.stringify(items));
}

async function executeAction(item: QueueItem): Promise<boolean> {
  const payload = item.payload as ActionPayload;
  if (!payload?.method || !payload?.url) return false;

  try {
    if (payload.method === "delete") {
      await apiClient.delete(payload.url);
    } else {
      await apiClient[payload.method](payload.url, payload.data);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Offline queue that persists mutations to MMKV and flushes them
 * when the device comes back online.
 *
 * Usage:
 *   const { enqueue } = useOfflineQueue();
 *   enqueue("create_cashback", { method: "post", url: "/api/...", data: { ... } });
 */
export function useOfflineQueue() {
  const [queue, setQueue] = useState<QueueItem[]>(loadQueue);
  const isOnline = useConnectivityStore((s) => s.isOnline);
  const flushingRef = useRef(false);

  // Persist queue to MMKV whenever it changes
  useEffect(() => {
    persistQueue(queue);
  }, [queue]);

  const enqueue = useCallback((action: string, payload: unknown) => {
    setQueue((prev) => {
      const filtered = prev.length >= MAX_ITEMS ? prev.slice(1) : prev;
      return [
        ...filtered,
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          action,
          payload,
          createdAt: Date.now(),
          retries: 0,
        },
      ];
    });
  }, []);

  const flush = useCallback(async () => {
    if (flushingRef.current || queue.length === 0) return;
    flushingRef.current = true;

    const now = Date.now();
    const validItems = queue.filter((item) => now - item.createdAt < TTL_MS);
    const expired = queue.length - validItems.length;

    if (expired > 0) {
      analytics.track("offline_queue_expired", { count: expired });
    }

    const failed: QueueItem[] = [];

    for (const item of validItems) {
      const success = await executeAction(item);
      if (!success) {
        if (item.retries < MAX_RETRIES) {
          failed.push({ ...item, retries: item.retries + 1 });
        } else {
          analytics.track("offline_queue_item_dropped", { action: item.action });
        }
      }
    }

    setQueue(failed);
    flushingRef.current = false;

    if (validItems.length > 0) {
      analytics.cameOnlineWithQueue(validItems.length);
    }
  }, [queue]);

  // Auto-flush when coming back online
  useEffect(() => {
    if (isOnline && queue.length > 0 && !flushingRef.current) {
      flush();
    }
  }, [isOnline, queue.length, flush]);

  const clear = useCallback(() => {
    setQueue([]);
  }, []);

  return {
    queue,
    queueSize: queue.length,
    isOnline,
    enqueue,
    flush,
    clear,
  };
}
