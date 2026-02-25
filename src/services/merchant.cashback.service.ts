import { apiClient } from "@/src/lib/api-client";
import type {
  GerarCashbackRequest,
  GerarCashbackResponse,
  UtilizarCashbackRequest,
  UtilizarCashbackResponse,
  ClienteSearchResult,
  ClienteSaldo,
  Campanha,
} from "@/src/types/merchant";

const PREFIX = "/api/v1";

export const merchantCashbackService = {
  async searchCliente(cpf: string): Promise<ClienteSearchResult[]> {
    const res = await apiClient.get<{ data: ClienteSearchResult[] }>(`${PREFIX}/clientes`, {
      params: { search: cpf },
    });
    return res.data.data;
  },

  async getClienteSaldo(clienteId: number): Promise<ClienteSaldo> {
    const res = await apiClient.get<ClienteSaldo>(`${PREFIX}/clientes/${clienteId}/saldo`);
    return res.data;
  },

  async getCampanhas(): Promise<Campanha[]> {
    const res = await apiClient.get<{ data: Campanha[] }>(`${PREFIX}/campanhas`, {
      params: { status: "ativa" },
    });
    return res.data.data;
  },

  async gerarCashback(
    data: GerarCashbackRequest,
    idempotencyKey: string,
  ): Promise<GerarCashbackResponse> {
    const res = await apiClient.post<GerarCashbackResponse>(`${PREFIX}/cashback`, data, {
      headers: { "Idempotency-Key": idempotencyKey },
    });
    return res.data;
  },

  async utilizarCashback(
    data: UtilizarCashbackRequest,
    idempotencyKey: string,
  ): Promise<UtilizarCashbackResponse> {
    const res = await apiClient.post<UtilizarCashbackResponse>(
      `${PREFIX}/cashback/utilizar`,
      data,
      { headers: { "Idempotency-Key": idempotencyKey } },
    );
    return res.data;
  },
};
