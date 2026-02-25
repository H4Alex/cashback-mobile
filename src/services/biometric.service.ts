import { apiClient } from "@/src/lib/api-client";

export type BiometricType = "fingerprint" | "facial" | "iris";

export interface BiometricCheckResult {
  available: boolean;
  biometricType: BiometricType | null;
}

export interface BiometricEnrollResponse {
  success: boolean;
}

const PREFIX = "/api/mobile/v1";

/**
 * Biometric service — wraps expo-local-authentication in production.
 * Provides check, enroll, and verify operations.
 */
export const biometricService = {
  /**
   * Check if biometric hardware is available.
   * In production: LocalAuthentication.hasHardwareAsync() + isEnrolledAsync()
   */
  async checkAvailability(): Promise<BiometricCheckResult> {
    // In production: use expo-local-authentication
    // const hasHardware = await LocalAuthentication.hasHardwareAsync();
    // const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    // const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    return { available: true, biometricType: "fingerprint" };
  },

  /**
   * Prompt the user for biometric authentication.
   * In production: LocalAuthentication.authenticateAsync()
   */
  async authenticate(promptMessage: string): Promise<boolean> {
    // In production:
    // const result = await LocalAuthentication.authenticateAsync({
    //   promptMessage,
    //   cancelLabel: 'Usar senha',
    //   disableDeviceFallback: false,
    // });
    // return result.success;
    return true;
  },

  /**
   * Enroll biometric token on the backend.
   * Called after first successful biometric auth.
   */
  async enroll(biometricToken: string, deviceId: string): Promise<BiometricEnrollResponse> {
    const res = await apiClient.post<BiometricEnrollResponse>(`${PREFIX}/auth/biometric/enroll`, {
      biometric_token: biometricToken,
      device_id: deviceId,
    });
    return res.data;
  },

  /**
   * Verify biometric token to get a JWT.
   * Used for biometric login.
   */
  async verify(
    biometricToken: string,
    deviceId: string,
  ): Promise<{ token: string; expires_in: number }> {
    const res = await apiClient.post<{ token: string; expires_in: number }>(
      `${PREFIX}/auth/biometric/verify`,
      {
        biometric_token: biometricToken,
        device_id: deviceId,
      },
    );
    return res.data;
  },
};
