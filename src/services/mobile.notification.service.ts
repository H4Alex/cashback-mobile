import { apiClient } from "@/src/lib/api-client";
import type { ApiResponse, NotificationListResponse, NotificationPreferences } from "@/src/types";

const PREFIX = "/api/mobile/v1/notifications";

export const mobileNotificationService = {
  /** List notifications with cursor-based pagination */
  async getNotifications(params?: {
    cursor?: string;
    limit?: number;
    unread_only?: boolean;
  }): Promise<NotificationListResponse> {
    const res = await apiClient.get<ApiResponse<NotificationListResponse>>(PREFIX, {
      params,
    });
    return res.data.data;
  },

  /** Mark a single notification as read */
  async markAsRead(id: number): Promise<void> {
    await apiClient.patch(`${PREFIX}/${id}/read`);
  },

  /** Mark all notifications as read */
  async markAllAsRead(): Promise<{ updated: number }> {
    const res = await apiClient.post<ApiResponse<{ updated: number }>>(`${PREFIX}/read-all`);
    return res.data.data;
  },

  /** Get notification preferences */
  async getPreferences(): Promise<NotificationPreferences> {
    const res = await apiClient.get<ApiResponse<NotificationPreferences>>(`${PREFIX}/preferences`);
    return res.data.data;
  },

  /** Update notification preferences */
  async updatePreferences(data: Partial<NotificationPreferences>): Promise<void> {
    await apiClient.patch(`${PREFIX}/preferences`, data);
  },
};
