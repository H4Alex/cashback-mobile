import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useOfflineQueue } from "@/src/hooks/useOfflineQueue";
import { apiClient } from "@/src/lib/api-client";
import { storage } from "@/src/lib/mmkv";
import { useConnectivityStore } from "@/src/stores/connectivity.store";
import { analytics } from "@/src/lib/analytics";

jest.mock("@/src/lib/api-client", () => ({
  apiClient: {
    post: jest.fn().mockResolvedValue({ data: {} }),
    put: jest.fn().mockResolvedValue({ data: {} }),
    patch: jest.fn().mockResolvedValue({ data: {} }),
    delete: jest.fn().mockResolvedValue({ data: {} }),
  },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

jest.mock("@/src/lib/analytics", () => ({
  analytics: {
    track: jest.fn(),
    cameOnlineWithQueue: jest.fn(),
  },
}));

const STORAGE_KEY = "offline_queue";

describe("useOfflineQueue", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.delete(STORAGE_KEY);
    useConnectivityStore.setState({ isOnline: false });
  });

  // ── Basic state ──

  it("starts with empty queue", () => {
    const { result } = renderHook(() => useOfflineQueue());
    expect(result.current.queueSize).toBe(0);
    expect(result.current.queue).toEqual([]);
  });

  it("reports isOnline from connectivity store", () => {
    useConnectivityStore.setState({ isOnline: true });
    const { result } = renderHook(() => useOfflineQueue());
    expect(result.current.isOnline).toBe(true);
  });

  // ── Enqueue ──

  it("enqueues an item and increments queueSize", () => {
    const { result } = renderHook(() => useOfflineQueue());
    act(() => {
      result.current.enqueue("create_cashback", {
        method: "post",
        url: "/api/v1/cashback",
        data: { valor: 100 },
      });
    });
    expect(result.current.queueSize).toBe(1);
    expect(result.current.queue[0]).toMatchObject({
      action: "create_cashback",
      retries: 0,
    });
  });

  it("enqueues multiple items in FIFO order", () => {
    const { result } = renderHook(() => useOfflineQueue());
    act(() => {
      result.current.enqueue("action_a", { method: "post", url: "/a" });
    });
    act(() => {
      result.current.enqueue("action_b", { method: "post", url: "/b" });
    });
    expect(result.current.queueSize).toBe(2);
    expect(result.current.queue[0].action).toBe("action_a");
    expect(result.current.queue[1].action).toBe("action_b");
  });

  it("persists queue to MMKV storage", () => {
    const { result } = renderHook(() => useOfflineQueue());
    act(() => {
      result.current.enqueue("test", { method: "post", url: "/test" });
    });
    const stored = storage.getString(STORAGE_KEY);
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].action).toBe("test");
  });

  it("culls oldest item when queue reaches MAX_ITEMS (50)", () => {
    const { result } = renderHook(() => useOfflineQueue());
    // Fill queue to 50
    for (let i = 0; i < 50; i++) {
      act(() => {
        result.current.enqueue(`action_${i}`, { method: "post", url: `/url/${i}` });
      });
    }
    expect(result.current.queueSize).toBe(50);

    // Enqueue 51st — oldest should be removed
    act(() => {
      result.current.enqueue("action_50", { method: "post", url: "/url/50" });
    });
    expect(result.current.queueSize).toBe(50);
    expect(result.current.queue[0].action).toBe("action_1"); // action_0 culled
    expect(result.current.queue[49].action).toBe("action_50");
  });

  // ── Clear ──

  it("clear empties the queue", () => {
    const { result } = renderHook(() => useOfflineQueue());
    act(() => {
      result.current.enqueue("a", { method: "post", url: "/a" });
      result.current.enqueue("b", { method: "post", url: "/b" });
    });
    act(() => {
      result.current.clear();
    });
    expect(result.current.queueSize).toBe(0);
  });

  // ── Flush ──

  it("flush processes items via apiClient", async () => {
    const { result } = renderHook(() => useOfflineQueue());
    act(() => {
      result.current.enqueue("post_action", {
        method: "post",
        url: "/api/v1/data",
        data: { key: "value" },
      });
    });
    await act(async () => {
      await result.current.flush();
    });
    expect(apiClient.post).toHaveBeenCalledWith("/api/v1/data", { key: "value" });
    expect(result.current.queueSize).toBe(0);
  });

  it("flush uses delete method for delete actions", async () => {
    const { result } = renderHook(() => useOfflineQueue());
    act(() => {
      result.current.enqueue("delete_action", {
        method: "delete",
        url: "/api/v1/item/123",
      });
    });
    await act(async () => {
      await result.current.flush();
    });
    expect(apiClient.delete).toHaveBeenCalledWith("/api/v1/item/123");
  });

  it("flush uses put method correctly", async () => {
    const { result } = renderHook(() => useOfflineQueue());
    act(() => {
      result.current.enqueue("update_action", {
        method: "put",
        url: "/api/v1/item/1",
        data: { name: "updated" },
      });
    });
    await act(async () => {
      await result.current.flush();
    });
    expect(apiClient.put).toHaveBeenCalledWith("/api/v1/item/1", { name: "updated" });
  });

  it("flush keeps failed items with incremented retries", async () => {
    (apiClient.post as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));
    const { result } = renderHook(() => useOfflineQueue());
    act(() => {
      result.current.enqueue("failing_action", {
        method: "post",
        url: "/api/v1/fail",
      });
    });
    await act(async () => {
      await result.current.flush();
    });
    expect(result.current.queueSize).toBe(1);
    expect(result.current.queue[0].retries).toBe(1);
  });

  it("flush drops items after MAX_RETRIES (3) and tracks analytics", async () => {
    (apiClient.post as jest.Mock).mockRejectedValue(new Error("Persistent Error"));
    renderHook(() => useOfflineQueue());

    // Manually seed a queue item with retries=3 (at max)
    const maxRetriedItem = {
      id: "test-max-retry",
      action: "doomed_action",
      payload: { method: "post", url: "/api/v1/doomed" },
      createdAt: Date.now(),
      retries: 3,
    };
    storage.set(STORAGE_KEY, JSON.stringify([maxRetriedItem]));

    const { result: result2 } = renderHook(() => useOfflineQueue());
    await act(async () => {
      await result2.current.flush();
    });
    expect(result2.current.queueSize).toBe(0);
    expect(analytics.track).toHaveBeenCalledWith("offline_queue_item_dropped", {
      action: "doomed_action",
    });
  });

  it("flush filters expired items (>24h) and tracks analytics", async () => {
    const expiredItem = {
      id: "expired-1",
      action: "old_action",
      payload: { method: "post", url: "/api/v1/old" },
      createdAt: Date.now() - 25 * 60 * 60 * 1000, // 25h ago
      retries: 0,
    };
    storage.set(STORAGE_KEY, JSON.stringify([expiredItem]));

    const { result } = renderHook(() => useOfflineQueue());
    await act(async () => {
      await result.current.flush();
    });
    expect(analytics.track).toHaveBeenCalledWith("offline_queue_expired", { count: 1 });
    expect(result.current.queueSize).toBe(0);
  });

  it("flush is noop when queue is empty", async () => {
    const { result } = renderHook(() => useOfflineQueue());
    await act(async () => {
      await result.current.flush();
    });
    expect(apiClient.post).not.toHaveBeenCalled();
    expect(apiClient.delete).not.toHaveBeenCalled();
  });

  it("flush returns false for items with missing method/url", async () => {
    const badItem = {
      id: "bad-1",
      action: "bad_action",
      payload: {}, // no method or url
      createdAt: Date.now(),
      retries: 0,
    };
    storage.set(STORAGE_KEY, JSON.stringify([badItem]));

    const { result } = renderHook(() => useOfflineQueue());
    await act(async () => {
      await result.current.flush();
    });
    // Item should be retried (failure) then kept with retries incremented
    expect(result.current.queue[0]?.retries).toBe(1);
  });

  it("flush calls cameOnlineWithQueue analytics for valid items", async () => {
    const { result } = renderHook(() => useOfflineQueue());
    act(() => {
      result.current.enqueue("track_test", {
        method: "post",
        url: "/api/v1/track",
      });
    });
    await act(async () => {
      await result.current.flush();
    });
    expect(analytics.cameOnlineWithQueue).toHaveBeenCalledWith(1);
  });

  // ── Loadqueue with corrupt data ──

  it("handles corrupt MMKV data gracefully", () => {
    storage.set(STORAGE_KEY, "not-valid-json{{{");
    const { result } = renderHook(() => useOfflineQueue());
    expect(result.current.queueSize).toBe(0);
  });

  // ── Auto-flush on reconnect ──

  it("auto-flushes when coming back online with queued items", async () => {
    useConnectivityStore.setState({ isOnline: false });
    const { result } = renderHook(() => useOfflineQueue());

    act(() => {
      result.current.enqueue("auto_action", {
        method: "post",
        url: "/api/v1/auto",
      });
    });

    expect(result.current.queueSize).toBe(1);

    // Simulate coming back online
    await act(async () => {
      useConnectivityStore.setState({ isOnline: true });
    });

    // The auto-flush effect should process the queue
    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith("/api/v1/auto", undefined);
    });
  });
});
