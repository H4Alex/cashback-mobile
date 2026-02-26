import { renderHook } from "@testing-library/react-native";
import { useOfflineQueue } from "@/src/hooks/useOfflineQueue";

describe("useOfflineQueue", () => {
  it("starts with empty queue", () => {
    const { result } = renderHook(() => useOfflineQueue());
    expect(result.current.queueSize).toBe(0);
    expect(result.current.queue).toEqual([]);
  });

  it("reports isOnline", () => {
    const { result } = renderHook(() => useOfflineQueue());
    expect(result.current.isOnline).toBe(true);
  });

  it("provides enqueue function", () => {
    const { result } = renderHook(() => useOfflineQueue());
    expect(typeof result.current.enqueue).toBe("function");
  });

  it("provides flush function", () => {
    const { result } = renderHook(() => useOfflineQueue());
    expect(typeof result.current.flush).toBe("function");
  });
});
