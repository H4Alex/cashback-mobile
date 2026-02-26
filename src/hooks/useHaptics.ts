import { useCallback } from "react";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

/**
 * Provides haptic feedback helpers.
 * Silently no-ops on devices without haptic engine.
 */
export function useHaptics() {
  const isSupported = Platform.OS === "ios" || Platform.OS === "android";

  const hapticSuccess = useCallback(async () => {
    if (!isSupported) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
  }, [isSupported]);

  const hapticError = useCallback(async () => {
    if (!isSupported) return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {}
  }, [isSupported]);

  const hapticLight = useCallback(async () => {
    if (!isSupported) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  }, [isSupported]);

  const hapticMedium = useCallback(async () => {
    if (!isSupported) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
  }, [isSupported]);

  const hapticSelection = useCallback(async () => {
    if (!isSupported) return;
    try {
      await Haptics.selectionAsync();
    } catch {}
  }, [isSupported]);

  return {
    hapticSuccess,
    hapticError,
    hapticLight,
    hapticMedium,
    hapticSelection,
  };
}
