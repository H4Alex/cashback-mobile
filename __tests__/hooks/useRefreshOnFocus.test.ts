import { renderHook } from "@testing-library/react-native";
import { AppState } from "react-native";
import { useRefreshOnFocus } from "@/src/hooks/useRefreshOnFocus";

describe("useRefreshOnFocus", () => {
  it("sets up AppState listener on mount", () => {
    const spy = jest.spyOn(AppState, "addEventListener");
    const refetch = jest.fn();
    renderHook(() => useRefreshOnFocus(refetch));
    expect(spy).toHaveBeenCalledWith("change", expect.any(Function));
    spy.mockRestore();
  });

  it("cleans up AppState listener on unmount", () => {
    const removeMock = jest.fn();
    jest.spyOn(AppState, "addEventListener").mockReturnValue({
      remove: removeMock,
    } as any);

    const { unmount } = renderHook(() => useRefreshOnFocus(jest.fn()));
    unmount();
    expect(removeMock).toHaveBeenCalled();
  });

  it("calls refetch when transitioning from background to active", () => {
    const refetch = jest.fn();
    let appStateCallback: (state: string) => void = () => {};
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, cb) => {
      appStateCallback = cb as (state: string) => void;
      return { remove: jest.fn() } as any;
    });

    Object.defineProperty(AppState, "currentState", { value: "background", configurable: true });
    renderHook(() => useRefreshOnFocus(refetch));

    appStateCallback("active");
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("does not call refetch when staying active", () => {
    const refetch = jest.fn();
    let appStateCallback: (state: string) => void = () => {};
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, cb) => {
      appStateCallback = cb as (state: string) => void;
      return { remove: jest.fn() } as any;
    });

    Object.defineProperty(AppState, "currentState", { value: "active", configurable: true });
    renderHook(() => useRefreshOnFocus(refetch));

    appStateCallback("active");
    expect(refetch).not.toHaveBeenCalled();
  });
});
