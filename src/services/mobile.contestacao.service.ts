import { apiClient } from "@/src/lib/api-client";
import type {
  Contestacao,
  ContestacaoListResponse,
  CreateContestacaoRequest,
} from "@/src/types/contestacao";

const PREFIX = "/api/mobile/v1/contestacoes";

export const mobileContestacaoService = {
  async list(params?: { cursor?: string; limit?: number }): Promise<ContestacaoListResponse> {
    const res = await apiClient.get<ContestacaoListResponse>(PREFIX, { params });
    return res.data;
  },

  async create(data: CreateContestacaoRequest): Promise<Contestacao> {
    const res = await apiClient.post<Contestacao>(PREFIX, data);
    return res.data;
  },
};
