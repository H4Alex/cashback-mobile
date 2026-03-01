import { sessionService } from "@/src/services/session.service";
import { apiClient } from "@/src/lib/api-client";

jest.mock("@/src/lib/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    delete: jest.fn(),
  },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

const mockGet = apiClient.get as jest.Mock;
const mockDelete = (apiClient as any).delete as jest.Mock;

describe("sessionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSessions", () => {
    it("fetches active sessions list", async () => {
      const sessions = [
        {
          id: "sess_1",
          device_name: "iPhone 15",
          platform: "ios",
          ip_address: "192.168.1.1",
          last_active_at: "2025-06-20T10:00:00Z",
          is_current: true,
        },
        {
          id: "sess_2",
          device_name: "Chrome Desktop",
          platform: "web",
          ip_address: "10.0.0.1",
          last_active_at: "2025-06-19T08:00:00Z",
          is_current: false,
        },
      ];
      mockGet.mockResolvedValue({ data: { data: sessions } });

      const result = await sessionService.getSessions();

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/auth/sessions");
      expect(result).toHaveLength(2);
      expect(result[0].is_current).toBe(true);
      expect(result[1].device_name).toBe("Chrome Desktop");
    });

    it("returns empty array when no sessions", async () => {
      mockGet.mockResolvedValue({ data: { data: [] } });

      const result = await sessionService.getSessions();

      expect(result).toHaveLength(0);
    });

    it("propagates network errors", async () => {
      mockGet.mockRejectedValue(new Error("Network Error"));

      await expect(sessionService.getSessions()).rejects.toThrow(
        "Network Error",
      );
    });

    it("propagates 401 unauthorized error", async () => {
      const error = Object.assign(new Error("Unauthorized"), {
        response: { status: 401 },
      });
      mockGet.mockRejectedValue(error);

      await expect(sessionService.getSessions()).rejects.toThrow(
        "Unauthorized",
      );
    });
  });

  describe("revokeSession", () => {
    it("revokes a session by ID", async () => {
      mockDelete.mockResolvedValue({ data: { status: true } });

      await sessionService.revokeSession("sess_2");

      expect(mockDelete).toHaveBeenCalledWith(
        "/api/mobile/v1/auth/sessions/sess_2",
      );
    });

    it("propagates errors when revoking session", async () => {
      mockDelete.mockRejectedValue(new Error("Not Found"));

      await expect(sessionService.revokeSession("invalid_id")).rejects.toThrow(
        "Not Found",
      );
    });

    it("propagates 500 server error", async () => {
      const error = Object.assign(new Error("Internal Server Error"), {
        response: { status: 500 },
      });
      mockDelete.mockRejectedValue(error);

      await expect(sessionService.revokeSession("sess_1")).rejects.toThrow(
        "Internal Server Error",
      );
    });
  });
});
