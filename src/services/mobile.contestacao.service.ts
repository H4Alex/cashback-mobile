import { apiClient } from "@/src/lib/api-client";
import type { ApiResponse, CursorPaginatedData } from "@/src/types";
import type {
  Contestacao,
  ContestacaoListResponse,
  CreateContestacaoRequest,
} from "@/src/types/contestacao";

const PREFIX = "/api/mobile/v1/contestacoes";

export const mobileContestacaoService = {
  async list(params?: { cursor?: string; limit?: number }): Promise<CursorPaginatedData<Contestacao>> {
    const res = await apiClient.get<ContestacaoListResponse>(PREFIX, { params });
    return res.data.data;
  },

  async create(data: CreateContestacaoRequest): Promise<Contestacao> {
    const res = await apiClient.post<ApiResponse<Contestacao>>(PREFIX, data);
    return res.data.data;
  },
};
