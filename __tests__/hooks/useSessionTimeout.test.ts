import { renderHook, act } from "@testing-library/react-native";
import { AppState } from "react-native";
import { useSessionTimeout } from "@/src/hooks/useSessionTimeout";
import { useAuthStore } from "@/src/stores/auth.store";

jest.mock("@/src/services/mobile.auth.service");
jest.mock("@/src/lib/api-client", () => ({
  apiClient: { post: jest.fn(), get: jest.fn(), patch: jest.fn() },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

describe("useSessionTimeout", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useAuthStore.setState({
      isAuthenticated: true,
      cliente: { id: 1, nome: "Test" } as any,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns resetTimer function", () => {
    const { result } = renderHook(() => useSessionTimeout());
    expect(typeof result.current.resetTimer).toBe("function");
  });

  it("calls logout after 15 minutes", () => {
    const logoutSpy = jest.fn();
    useAuthStore.setState({ logout: logoutSpy } as any);

    renderHook(() => useSessionTimeout());

    act(() => {
      jest.advanceTimersByTime(15 * 60_000 + 100);
    });

    expect(logoutSpy).toHaveBeenCalled();
  });

  it("does not logout before 15 minutes", () => {
    const logoutSpy = jest.fn();
    useAuthStore.setState({ logout: logoutSpy } as any);

    renderHook(() => useSessionTimeout());

    act(() => {
      jest.advanceTimersByTime(14 * 60_000);
    });

    expect(logoutSpy).not.toHaveBeenCalled();
  });

  it("logs out when returning to foreground after timeout", () => {
    const logoutSpy = jest.fn();
    useAuthStore.setState({ logout: logoutSpy } as any);

    let appStateCallback: (state: string) => void = () => {};
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, cb) => {
      appStateCallback = cb as (state: string) => void;
      return { remove: jest.fn() } as any;
    });

    renderHook(() => useSessionTimeout());

    // Simulate 16 minutes passing while in background
    act(() => {
      jest.advanceTimersByTime(16 * 60_000);
    });

    // Return to foreground after timeout elapsed
    act(() => {
      appStateCallback("active");
    });

    expect(logoutSpy).toHaveBeenCalled();
  });

  it("resets timer when returning to foreground before timeout", () => {
    const logoutSpy = jest.fn();
    useAuthStore.setState({ logout: logoutSpy } as any);

    let appStateCallback: (state: string) => void = () => {};
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, cb) => {
      appStateCallback = cb as (state: string) => void;
      return { remove: jest.fn() } as any;
    });

    renderHook(() => useSessionTimeout());

    // 5 minutes pass
    act(() => {
      jest.advanceTimersByTime(5 * 60_000);
    });

    // Return to foreground — should reset timer
    act(() => {
      appStateCallback("active");
    });

    expect(logoutSpy).not.toHaveBeenCalled();
  });

  it("does not set timer when not authenticated", () => {
    useAuthStore.setState({ isAuthenticated: false } as any);
    const { result } = renderHook(() => useSessionTimeout());
    expect(result.current.resetTimer).toBeDefined();
  });
});
