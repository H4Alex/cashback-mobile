import { renderHook } from "@testing-library/react-native";
import { useAppUpdate } from "@/src/hooks/useAppUpdate";

describe("useAppUpdate", () => {
  it("starts with initial state", () => {
    const { result } = renderHook(() => useAppUpdate());
    expect(result.current.isDownloading).toBe(false);
    expect(result.current.isAvailable).toBe(false);
  });

  it("provides checkForUpdate function", () => {
    const { result } = renderHook(() => useAppUpdate());
    expect(typeof result.current.checkForUpdate).toBe("function");
  });

  it("provides downloadAndApply function", () => {
    const { result } = renderHook(() => useAppUpdate());
    expect(typeof result.current.downloadAndApply).toBe("function");
  });
});
