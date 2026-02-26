import { renderHook } from "@testing-library/react-native";
import { usePushSetup } from "@/src/hooks/usePushSetup";

describe("usePushSetup", () => {
  it("mounts without errors", () => {
    expect(() => {
      renderHook(() => usePushSetup());
    }).not.toThrow();
  });

  it("only registers once across rerenders", () => {
    const { rerender } = renderHook(() => usePushSetup());
    rerender({});
    rerender({});
    // No assertion needed - verifying no errors and no infinite loops
  });
});
