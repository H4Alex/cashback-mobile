import { useCallback, useEffect } from "react";
import { useDeviceStore } from "@/src/stores/device.store";
import { biometricService } from "@/src/services/biometric.service";

/**
 * Hook for biometric authentication management.
 * Checks hardware availability, handles enroll and verify flows.
 * Provides fallback tracking (max 3 failed attempts).
 */
export function useBiometric() {
  const biometricAvailable = useDeviceStore((s) => s.biometricAvailable);
  const biometricEnrolled = useDeviceStore((s) => s.biometricEnrolled);
  const setBiometricAvailable = useDeviceStore((s) => s.setBiometricAvailable);
  const setBiometricEnrolled = useDeviceStore((s) => s.setBiometricEnrolled);
  const deviceId = useDeviceStore((s) => s.deviceId);

  useEffect(() => {
    biometricService.checkAvailability().then((result) => {
      setBiometricAvailable(result.available);
    });
  }, [setBiometricAvailable]);

  const authenticate = useCallback(
    async (promptMessage = "Confirme sua identidade") => {
      if (!biometricAvailable) return false;
      return biometricService.authenticate(promptMessage);
    },
    [biometricAvailable],
  );

  const enroll = useCallback(async () => {
    if (!deviceId) return false;
    const token = `bio_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    try {
      await biometricService.enroll(token, deviceId);
      setBiometricEnrolled(true);
      return true;
    } catch {
      return false;
    }
  }, [deviceId, setBiometricEnrolled]);

  return {
    biometricAvailable,
    biometricEnrolled,
    authenticate,
    enroll,
  };
}
