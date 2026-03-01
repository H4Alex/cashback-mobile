import { apiClient } from "@/src/lib/api-client";
import type { ApiResponse, CursorPaginatedData } from "@/src/types";
import type {
  Contestacao,
  ContestacaoListResponse,
  CreateContestacaoRequest,
} from "@/src/types/contestacao";
import { validateResponse } from "@/src/schemas/validateResponse";
import { contestacaoListResponseSchema, contestacaoSchema } from "@/src/schemas/api-responses";

const PREFIX = "/api/mobile/v1/contestacoes";

export const mobileContestacaoService = {
  async list(params?: { cursor?: string; limit?: number }): Promise<CursorPaginatedData<Contestacao>> {
    const res = await apiClient.get<ContestacaoListResponse>(PREFIX, { params });
    validateResponse(contestacaoListResponseSchema, res.data, "GET /contestacoes");
    return res.data.data;
  },

  async create(data: CreateContestacaoRequest): Promise<Contestacao> {
    const res = await apiClient.post<ApiResponse<Contestacao>>(PREFIX, data);
    validateResponse(contestacaoSchema, res.data.data, "POST /contestacoes");
    return res.data.data;
  },
};
