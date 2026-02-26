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
});
