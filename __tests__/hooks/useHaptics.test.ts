import { renderHook } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import { useHaptics } from "@/src/hooks/useHaptics";

describe("useHaptics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns all haptic functions", () => {
    const { result } = renderHook(() => useHaptics());
    expect(result.current.hapticSuccess).toBeDefined();
    expect(result.current.hapticError).toBeDefined();
    expect(result.current.hapticLight).toBeDefined();
    expect(result.current.hapticMedium).toBeDefined();
    expect(result.current.hapticSelection).toBeDefined();
  });

  it("calls Haptics.notificationAsync for hapticSuccess", async () => {
    const { result } = renderHook(() => useHaptics());
    await result.current.hapticSuccess();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Success,
    );
  });

  it("calls Haptics.notificationAsync for hapticError", async () => {
    const { result } = renderHook(() => useHaptics());
    await result.current.hapticError();
    expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Error);
  });

  it("calls Haptics.impactAsync for hapticLight", async () => {
    const { result } = renderHook(() => useHaptics());
    await result.current.hapticLight();
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
  });

  it("calls Haptics.impactAsync for hapticMedium", async () => {
    const { result } = renderHook(() => useHaptics());
    await result.current.hapticMedium();
    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });

  it("calls Haptics.selectionAsync for hapticSelection", async () => {
    const { result } = renderHook(() => useHaptics());
    await result.current.hapticSelection();
    expect(Haptics.selectionAsync).toHaveBeenCalled();
  });
});
