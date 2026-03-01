import { apiClient } from "@/src/lib/api-client";
import type { ApiResponse } from "@/src/types";

export interface ActiveSession {
  id: number;
  device_name: string;
  platform: string;
  ip_address: string;
  last_active_at: string | null;
  is_current: boolean;
}

const PREFIX = "/api/mobile/v1";

export const sessionService = {
  async getSessions(): Promise<ActiveSession[]> {
    const res = await apiClient.get<ApiResponse<{ sessions: ActiveSession[] }>>(`${PREFIX}/auth/sessions`);
    return res.data.data.sessions;
  },

  async revokeSession(sessionId: number): Promise<void> {
    await apiClient.delete(`${PREFIX}/auth/sessions/${sessionId}`);
  },
};
