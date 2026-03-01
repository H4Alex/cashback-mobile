import { biometricService } from "@/src/services/biometric.service";
import { apiClient } from "@/src/lib/api-client";

jest.mock("@/src/lib/api-client", () => ({
  apiClient: {
    post: jest.fn(),
  },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

const mockPost = apiClient.post as jest.Mock;

describe("biometricService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkAvailability", () => {
    it("returns availability result", async () => {
      const result = await biometricService.checkAvailability();

      expect(result).toEqual({
        available: true,
        biometricType: "fingerprint",
      });
    });
  });

  describe("authenticate", () => {
    it("returns true on successful authentication", async () => {
      const result = await biometricService.authenticate(
        "Confirme sua identidade",
      );

      expect(result).toBe(true);
    });
  });

  describe("enroll", () => {
    it("enrolls biometric token on the backend", async () => {
      mockPost.mockResolvedValue({
        data: { success: true },
      });

      const result = await biometricService.enroll(
        "biometric-token-abc",
        "device-123",
      );

      expect(mockPost).toHaveBeenCalledWith(
        "/api/mobile/v1/auth/biometric/enroll",
        {
          biometric_token: "biometric-token-abc",
          device_id: "device-123",
        },
      );
      expect(result.success).toBe(true);
    });

    it("propagates network errors", async () => {
      mockPost.mockRejectedValue(new Error("Network Error"));

      await expect(
        biometricService.enroll("token", "device"),
      ).rejects.toThrow("Network Error");
    });

    it("propagates 401 unauthorized error", async () => {
      const error = Object.assign(new Error("Unauthorized"), {
        response: { status: 401 },
      });
      mockPost.mockRejectedValue(error);

      await expect(
        biometricService.enroll("token", "device"),
      ).rejects.toThrow("Unauthorized");
    });

    it("propagates 500 server error", async () => {
      const error = Object.assign(new Error("Internal Server Error"), {
        response: { status: 500 },
      });
      mockPost.mockRejectedValue(error);

      await expect(
        biometricService.enroll("token", "device"),
      ).rejects.toThrow("Internal Server Error");
    });
  });

  describe("verify", () => {
    it("verifies biometric token and returns JWT", async () => {
      mockPost.mockResolvedValue({
        data: { token: "jwt-token-xyz", expires_in: 3600 },
      });

      const result = await biometricService.verify(
        "biometric-token-abc",
        "device-123",
      );

      expect(mockPost).toHaveBeenCalledWith(
        "/api/mobile/v1/auth/biometric/verify",
        {
          biometric_token: "biometric-token-abc",
          device_id: "device-123",
        },
      );
      expect(result.token).toBe("jwt-token-xyz");
      expect(result.expires_in).toBe(3600);
    });

    it("propagates network errors", async () => {
      mockPost.mockRejectedValue(new Error("Network Error"));

      await expect(
        biometricService.verify("token", "device"),
      ).rejects.toThrow("Network Error");
    });

    it("propagates 422 validation error", async () => {
      const error = Object.assign(new Error("Unprocessable Entity"), {
        response: { status: 422 },
      });
      mockPost.mockRejectedValue(error);

      await expect(
        biometricService.verify("token", "device"),
      ).rejects.toThrow("Unprocessable Entity");
    });
  });
});
