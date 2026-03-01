import { apiClient } from "@/src/lib/api-client";
import type { ApiResponse, CashbackStatus, CashbackSaldo, ExtratoEntry, EmpresaSaldo, CursorPaginatedResponse, CursorPaginatedData } from "@/src/types";
import type { HistoricoUsoResponse } from "@/src/types/historico";
import { validateResponse } from "@/src/schemas/validateResponse";
import { saldoResponseSchema, extratoResponseSchema } from "@/src/schemas/api-responses";

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
    const res = await apiClient.get<ApiResponse<CashbackSaldo>>(`${PREFIX}/saldo`);
    validateResponse(saldoResponseSchema, res.data, "GET /saldo");
    return res.data.data;
  },

  async getExtrato(params?: ExtratoParams): Promise<CursorPaginatedData<ExtratoEntry>> {
    const res = await apiClient.get<CursorPaginatedResponse<ExtratoEntry>>(`${PREFIX}/extrato`, {
      params,
    });
    validateResponse(extratoResponseSchema, res.data, "GET /extrato");
    return res.data.data;
  },

  async getLojasComSaldo(): Promise<EmpresaSaldo[]> {
    const res = await apiClient.get<ApiResponse<EmpresaSaldo[]>>(`${PREFIX}/utilizacao/lojas`);
    return res.data.data;
  },

  async getHistorico(params?: {
    cursor?: string;
    limit?: number;
    data_inicio?: string;
    data_fim?: string;
  }): Promise<HistoricoUsoResponse> {
    const res = await apiClient.get<ApiResponse<HistoricoUsoResponse>>(`${PREFIX}/historico`, {
      params,
    });
    return res.data.data;
  },
};
