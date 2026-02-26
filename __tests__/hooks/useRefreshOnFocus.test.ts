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
});
