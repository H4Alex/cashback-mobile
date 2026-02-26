import { renderHook, act } from "@testing-library/react-native";
import { useCountdown } from "@/src/hooks/useCountdown";

describe("useCountdown", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts with correct time remaining", () => {
    const expiresAt = new Date(Date.now() + 120_000).toISOString(); // 2 min from now
    const { result } = renderHook(() => useCountdown({ expiresAt }));
    expect(result.current.timeLeft).toBeGreaterThanOrEqual(119);
    expect(result.current.isExpired).toBe(false);
  });

  it("formats as minutes:seconds", () => {
    const expiresAt = new Date(Date.now() + 150_000).toISOString(); // 2:30
    const { result } = renderHook(() => useCountdown({ expiresAt }));
    expect(result.current.formatted).toMatch(/\d+:\d{2}/);
  });

  it("returns isExpired true for past dates", () => {
    const expiresAt = new Date(Date.now() - 10_000).toISOString();
    const { result } = renderHook(() => useCountdown({ expiresAt }));
    expect(result.current.isExpired).toBe(true);
    expect(result.current.timeLeft).toBe(0);
  });

  it("returns isUrgent when <= 60 seconds remain", () => {
    const expiresAt = new Date(Date.now() + 30_000).toISOString(); // 30 seconds
    const { result } = renderHook(() => useCountdown({ expiresAt }));
    expect(result.current.isUrgent).toBe(true);
  });

  it("calls onExpire when countdown reaches zero", () => {
    const onExpire = jest.fn();
    const expiresAt = new Date(Date.now() + 2_000).toISOString(); // 2 seconds
    renderHook(() => useCountdown({ expiresAt, onExpire }));

    act(() => {
      jest.advanceTimersByTime(3_000);
    });

    expect(onExpire).toHaveBeenCalled();
  });
});
