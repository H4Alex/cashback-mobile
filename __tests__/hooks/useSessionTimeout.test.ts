import { renderHook, act } from "@testing-library/react-native";
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
});
