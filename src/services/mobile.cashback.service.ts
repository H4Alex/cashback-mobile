import { apiClient } from "@/src/lib/api-client";
import type { CashbackStatus, CashbackSaldo, ExtratoResponse, EmpresaSaldo } from "@/src/types";
import type { HistoricoUsoResponse } from "@/src/types/historico";

const PREFIX = "/api/mobile/v1";

export interface ExtratoParams {
  cursor?: string;
  limit?: number;
  empresa_id?: string;
  status?: CashbackStatus;
  data_inicio?: string;
  data_fim?: string;
}

export const mobileCashbackService = {
  async getSaldo(): Promise<CashbackSaldo> {
    const res = await apiClient.get<CashbackSaldo>(`${PREFIX}/saldo`);
    return res.data;
  },

  async getExtrato(params?: ExtratoParams): Promise<ExtratoResponse> {
    const res = await apiClient.get<ExtratoResponse>(`${PREFIX}/extrato`, {
      params,
    });
    return res.data;
  },

  async getLojasComSaldo(): Promise<EmpresaSaldo[]> {
    const res = await apiClient.get<{ data: EmpresaSaldo[] }>(`${PREFIX}/utilizacao/lojas`);
    return res.data.data;
  },

  async getHistorico(params?: {
    cursor?: string;
    limit?: number;
    data_inicio?: string;
    data_fim?: string;
  }): Promise<HistoricoUsoResponse> {
    const res = await apiClient.get<HistoricoUsoResponse>(`${PREFIX}/historico`, {
      params,
    });
    return res.data;
  },
};
