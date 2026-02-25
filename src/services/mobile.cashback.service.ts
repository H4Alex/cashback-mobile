import { apiClient } from "@/src/lib/api-client";
import type { CashbackSaldo, ExtratoResponse } from "@/src/types";

const PREFIX = "/api/mobile/v1";

export const mobileCashbackService = {
  async getSaldo(): Promise<CashbackSaldo> {
    const res = await apiClient.get<CashbackSaldo>(`${PREFIX}/saldo`);
    return res.data;
  },

  async getExtrato(params?: {
    cursor?: string;
    limit?: number;
    empresa_id?: string;
  }): Promise<ExtratoResponse> {
    const res = await apiClient.get<ExtratoResponse>(`${PREFIX}/extrato`, {
      params,
    });
    return res.data;
  },
};
