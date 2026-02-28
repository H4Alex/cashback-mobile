import { mobileNotificationService } from "@/src/services/mobile.notification.service";
import { apiClient } from "@/src/lib/api-client";

jest.mock("@/src/lib/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;

describe("mobileNotificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getNotifications", () => {
    it("fetches notifications list", async () => {
      const mockResponse = {
        notifications: [
          {
            id: 1,
            titulo: "Cashback recebido",
            mensagem: "Você recebeu R$ 10,00",
            tipo: "cashback_recebido",
            lida: false,
            dados_extras: null,
            created_at: "2026-02-25T10:00:00Z",
          },
        ],
        meta: { total_unread: 1, next_cursor: null, has_more_pages: false },
      };
      mockGet.mockResolvedValue({ data: { status: true, data: mockResponse, error: null, message: 'Sucesso' } });

      const result = await mobileNotificationService.getNotifications({
        limit: 20,
      });

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/notifications", {
        params: { limit: 20 },
      });
      expect(result.notifications).toHaveLength(1);
      expect(result.meta.total_unread).toBe(1);
    });

    it("fetches unread-only notifications", async () => {
      mockGet.mockResolvedValue({
        data: { status: true, data: {
          notifications: [],
          meta: { total_unread: 0, next_cursor: null, has_more_pages: false },
        }, error: null, message: 'Sucesso' },
      });

      await mobileNotificationService.getNotifications({ unread_only: true });

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/notifications", {
        params: { unread_only: true },
      });
    });
  });

  describe("markAsRead", () => {
    it("marks a notification as read", async () => {
      mockPatch.mockResolvedValue({ data: { status: true, data: { lida: true }, error: null, message: 'Sucesso' } });

      await mobileNotificationService.markAsRead(42);

      expect(mockPatch).toHaveBeenCalledWith("/api/mobile/v1/notifications/42/read");
    });
  });

  describe("markAllAsRead", () => {
    it("marks all notifications as read", async () => {
      mockPost.mockResolvedValue({ data: { status: true, data: { updated: 5 }, error: null, message: 'Sucesso' } });

      const result = await mobileNotificationService.markAllAsRead();

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/notifications/read-all");
      expect(result.updated).toBe(5);
    });
  });

  describe("getPreferences", () => {
    it("fetches notification preferences", async () => {
      mockGet.mockResolvedValue({
        data: { status: true, data: {
          push_enabled: true,
          email_enabled: false,
          marketing_enabled: true,
        }, error: null, message: 'Sucesso' },
      });

      const result = await mobileNotificationService.getPreferences();

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/notifications/preferences");
      expect(result.push_enabled).toBe(true);
      expect(result.email_enabled).toBe(false);
    });
  });

  describe("updatePreferences", () => {
    it("updates notification preferences", async () => {
      mockPatch.mockResolvedValue({ data: { status: true, data: { atualizado: true }, error: null, message: 'Sucesso' } });

      await mobileNotificationService.updatePreferences({
        push_enabled: false,
      });

      expect(mockPatch).toHaveBeenCalledWith("/api/mobile/v1/notifications/preferences", {
        push_enabled: false,
      });
    });
  });
});
