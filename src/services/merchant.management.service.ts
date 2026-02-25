import { apiClient } from "@/src/lib/api-client";
import type {
  DashboardStats,
  DashboardTransacao,
  DashboardTopCliente,
  ChartDataPoint,
  ClienteDetail,
  CampanhaFull,
  CreateCampanhaRequest,
  VendaResource,
  ContestacaoMerchant,
  EmpresaConfig,
  RelatorioData,
} from "@/src/types/merchant";

const PREFIX = "/api/v1";

export const merchantManagementService = {
  // Dashboard
  async getStats(): Promise<DashboardStats> {
    const res = await apiClient.get<DashboardStats>(`${PREFIX}/dashboard/stats`);
    return res.data;
  },

  async getTransacoes(): Promise<DashboardTransacao[]> {
    const res = await apiClient.get<{ data: DashboardTransacao[] }>(
      `${PREFIX}/dashboard/transacoes`,
    );
    return res.data.data;
  },

  async getTopClientes(): Promise<DashboardTopCliente[]> {
    const res = await apiClient.get<{ data: DashboardTopCliente[] }>(
      `${PREFIX}/dashboard/top-clientes`,
    );
    return res.data.data;
  },

  async getChart(periodo: string): Promise<ChartDataPoint[]> {
    const res = await apiClient.get<{ data: ChartDataPoint[] }>(`${PREFIX}/dashboard/chart`, {
      params: { periodo },
    });
    return res.data.data;
  },

  // Clientes
  async getClientes(params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: ClienteDetail[]; total: number; total_pages: number }> {
    const res = await apiClient.get<{ data: ClienteDetail[]; total: number; total_pages: number }>(
      `${PREFIX}/clientes`,
      { params },
    );
    return res.data;
  },

  async getCliente(id: number): Promise<ClienteDetail> {
    const res = await apiClient.get<ClienteDetail>(`${PREFIX}/clientes/${id}`);
    return res.data;
  },

  // Campanhas
  async getCampanhas(status?: string): Promise<CampanhaFull[]> {
    const res = await apiClient.get<{ data: CampanhaFull[] }>(`${PREFIX}/campanhas`, {
      params: status ? { status } : undefined,
    });
    return res.data.data;
  },

  async createCampanha(data: CreateCampanhaRequest): Promise<CampanhaFull> {
    const res = await apiClient.post<CampanhaFull>(`${PREFIX}/campanhas`, data);
    return res.data;
  },

  async updateCampanha(id: number, data: Partial<CreateCampanhaRequest>): Promise<CampanhaFull> {
    const res = await apiClient.patch<CampanhaFull>(`${PREFIX}/campanhas/${id}`, data);
    return res.data;
  },

  async deleteCampanha(id: number): Promise<void> {
    await apiClient.delete(`${PREFIX}/campanhas/${id}`);
  },

  // Vendas
  async getVendas(params: {
    page?: number;
    limit?: number;
    status?: string;
    data_inicio?: string;
    data_fim?: string;
  }): Promise<{ data: VendaResource[]; total: number; total_pages: number }> {
    const res = await apiClient.get<{ data: VendaResource[]; total: number; total_pages: number }>(
      `${PREFIX}/cashback`,
      { params },
    );
    return res.data;
  },

  // Contestações
  async getContestacoes(status?: string): Promise<ContestacaoMerchant[]> {
    const res = await apiClient.get<{ data: ContestacaoMerchant[] }>(`${PREFIX}/contestacoes`, {
      params: status ? { status } : undefined,
    });
    return res.data.data;
  },

  async resolveContestacao(
    id: number,
    data: { status: "aprovada" | "rejeitada"; resposta: string },
  ): Promise<void> {
    await apiClient.patch(`${PREFIX}/contestacoes/${id}`, data);
  },

  // Config
  async getConfig(): Promise<EmpresaConfig> {
    const res = await apiClient.get<EmpresaConfig>(`${PREFIX}/config`);
    return res.data;
  },

  async updateConfig(data: Partial<EmpresaConfig>): Promise<EmpresaConfig> {
    const res = await apiClient.patch<EmpresaConfig>(`${PREFIX}/config`, data);
    return res.data;
  },

  async uploadLogo(formData: FormData): Promise<{ logo_url: string }> {
    const res = await apiClient.post<{ logo_url: string }>(`${PREFIX}/config/logo`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60_000,
    });
    return res.data;
  },

  // Relatórios
  async getRelatorios(periodo: string): Promise<RelatorioData> {
    const res = await apiClient.get<RelatorioData>(`${PREFIX}/relatorios`, {
      params: { periodo },
    });
    return res.data;
  },
};
