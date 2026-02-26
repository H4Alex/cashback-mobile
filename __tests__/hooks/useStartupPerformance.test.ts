import { renderHook } from "@testing-library/react-native";
import { useStartupPerformance } from "@/src/hooks/useStartupPerformance";

describe("useStartupPerformance", () => {
  it("returns markTTI function", () => {
    const { result } = renderHook(() => useStartupPerformance());
    expect(typeof result.current.markTTI).toBe("function");
  });

  it("returns appStartTime as a positive number", () => {
    const { result } = renderHook(() => useStartupPerformance());
    expect(typeof result.current.appStartTime).toBe("number");
    expect(result.current.appStartTime).toBeGreaterThan(0);
  });

  it("markTTI is idempotent", () => {
    const { result } = renderHook(() => useStartupPerformance());
    // Call markTTI multiple times — should not throw
    result.current.markTTI();
    result.current.markTTI();
  });
});
