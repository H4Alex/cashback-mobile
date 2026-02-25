import { apiClient } from "@/src/lib/api-client";

export interface ActiveSession {
  id: string;
  device_name: string;
  platform: string;
  ip_address: string;
  last_active_at: string;
  is_current: boolean;
}

const PREFIX = "/api/mobile/v1";

export const sessionService = {
  async getSessions(): Promise<ActiveSession[]> {
    const res = await apiClient.get<{ data: ActiveSession[] }>(`${PREFIX}/auth/sessions`);
    return res.data.data;
  },

  async revokeSession(sessionId: string): Promise<void> {
    await apiClient.delete(`${PREFIX}/auth/sessions/${sessionId}`);
  },
};
