import { renderHook } from "@testing-library/react-native";
import { AppState } from "react-native";
import { useAppState } from "@/src/hooks/useAppState";

describe("useAppState", () => {
  it("subscribes to AppState changes", () => {
    const spy = jest.spyOn(AppState, "addEventListener");
    renderHook(() => useAppState());
    expect(spy).toHaveBeenCalledWith("change", expect.any(Function));
    spy.mockRestore();
  });

  it("cleans up subscription on unmount", () => {
    const removeMock = jest.fn();
    jest.spyOn(AppState, "addEventListener").mockReturnValue({
      remove: removeMock,
    } as any);

    const { unmount } = renderHook(() => useAppState());
    unmount();
    expect(removeMock).toHaveBeenCalled();
  });

  it("returns currentState", () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.currentState).toBeDefined();
  });

  it("calls onForeground when transitioning from background to active", () => {
    const onForeground = jest.fn();
    let appStateCallback: (state: string) => void = () => {};
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, cb) => {
      appStateCallback = cb as (state: string) => void;
      return { remove: jest.fn() } as any;
    });

    // Start in background
    Object.defineProperty(AppState, "currentState", { value: "background", configurable: true });
    renderHook(() => useAppState({ onForeground }));

    appStateCallback("active");
    expect(onForeground).toHaveBeenCalled();
  });

  it("calls onBackground when transitioning from active to background", () => {
    const onBackground = jest.fn();
    let appStateCallback: (state: string) => void = () => {};
    jest.spyOn(AppState, "addEventListener").mockImplementation((_type, cb) => {
      appStateCallback = cb as (state: string) => void;
      return { remove: jest.fn() } as any;
    });

    Object.defineProperty(AppState, "currentState", { value: "active", configurable: true });
    renderHook(() => useAppState({ onBackground }));

    appStateCallback("background");
    expect(onBackground).toHaveBeenCalled();
  });
});
