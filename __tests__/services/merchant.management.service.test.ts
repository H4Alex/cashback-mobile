import { merchantManagementService } from "@/src/services/merchant.management.service";
import { apiClient } from "@/src/lib/api-client";

jest.mock("@/src/lib/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;
const mockDelete = apiClient.delete as jest.Mock;

describe("merchantManagementService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Dashboard", () => {
    it("getStats returns dashboard stats", async () => {
      const stats = { total_cashback: 1000, total_creditado: 800, total_resgatado: 200 };
      mockGet.mockResolvedValue({ data: { status: true, data: stats, error: null, message: 'Sucesso' } });

      const result = await merchantManagementService.getStats();

      expect(mockGet).toHaveBeenCalledWith("/api/v1/dashboard/stats");
      expect(result).toEqual(stats);
    });

    it("getTransacoes returns transaction list", async () => {
      const transacoes = [{ id: "1", cliente_nome: "João", valor: 100, tipo: "gerado" }];
      mockGet.mockResolvedValue({ data: { status: true, data: transacoes, error: null, message: 'Sucesso' } });

      const result = await merchantManagementService.getTransacoes();

      expect(mockGet).toHaveBeenCalledWith("/api/v1/dashboard/transacoes");
      expect(result).toEqual(transacoes);
    });

    it("getTopClientes returns top clients", async () => {
      const clientes = [{ id: 1, nome: "Maria", saldo_total: 500 }];
      mockGet.mockResolvedValue({ data: { status: true, data: clientes, error: null, message: 'Sucesso' } });

      const result = await merchantManagementService.getTopClientes();

      expect(result).toEqual(clientes);
    });

    it("getChart passes periodo param", async () => {
      mockGet.mockResolvedValue({ data: { status: true, data: [], error: null, message: 'Sucesso' } });

      await merchantManagementService.getChart("30d");

      expect(mockGet).toHaveBeenCalledWith("/api/v1/dashboard/chart", {
        params: { periodo: "30d" },
      });
    });
  });

  describe("Clientes", () => {
    it("getClientes passes search and pagination params", async () => {
      mockGet.mockResolvedValue({ data: { status: true, data: { data: [], total: 0, total_pages: 0 }, error: null, message: 'Sucesso' } });

      await merchantManagementService.getClientes({ search: "João", page: 2, limit: 10 });

      expect(mockGet).toHaveBeenCalledWith("/api/v1/clientes", {
        params: { search: "João", page: 2, limit: 10 },
      });
    });

    it("getCliente fetches by id", async () => {
      const cliente = { id: 5, nome: "Maria", cpf: "12345678901" };
      mockGet.mockResolvedValue({ data: { status: true, data: cliente, error: null, message: 'Sucesso' } });

      const result = await merchantManagementService.getCliente(5);

      expect(mockGet).toHaveBeenCalledWith("/api/v1/clientes/5");
      expect(result).toEqual(cliente);
    });
  });

  describe("Campanhas", () => {
    it("getCampanhas with status filter", async () => {
      mockGet.mockResolvedValue({ data: { status: true, data: [], error: null, message: 'Sucesso' } });

      await merchantManagementService.getCampanhas("ativa");

      expect(mockGet).toHaveBeenCalledWith("/api/v1/campanhas", {
        params: { status: "ativa" },
      });
    });

    it("getCampanhas without filter", async () => {
      mockGet.mockResolvedValue({ data: { status: true, data: [], error: null, message: 'Sucesso' } });

      await merchantManagementService.getCampanhas();

      expect(mockGet).toHaveBeenCalledWith("/api/v1/campanhas", {
        params: undefined,
      });
    });

    it("createCampanha posts data", async () => {
      const data = {
        nome: "Black Friday",
        percentual: 10,
        validade_dias: 30,
        data_inicio: "2026-01-01",
        data_fim: "2026-01-31",
      };
      mockPost.mockResolvedValue({ data: { status: true, data: { id: 1, ...data }, error: null, message: 'Sucesso' } });

      const result = await merchantManagementService.createCampanha(data);

      expect(mockPost).toHaveBeenCalledWith("/api/v1/campanhas", data);
      expect(result.nome).toBe("Black Friday");
    });

    it("updateCampanha patches data", async () => {
      mockPatch.mockResolvedValue({ data: { status: true, data: { id: 1, nome: "Updated" }, error: null, message: 'Sucesso' } });

      await merchantManagementService.updateCampanha(1, { nome: "Updated" });

      expect(mockPatch).toHaveBeenCalledWith("/api/v1/campanhas/1", { nome: "Updated" });
    });

    it("deleteCampanha deletes by id", async () => {
      mockDelete.mockResolvedValue({});

      await merchantManagementService.deleteCampanha(1);

      expect(mockDelete).toHaveBeenCalledWith("/api/v1/campanhas/1");
    });
  });

  describe("Vendas", () => {
    it("getVendas passes filter params", async () => {
      mockGet.mockResolvedValue({ data: { status: true, data: { data: [], total: 0, total_pages: 0 }, error: null, message: 'Sucesso' } });

      await merchantManagementService.getVendas({ page: 1, status: "confirmado" });

      expect(mockGet).toHaveBeenCalledWith("/api/v1/cashback", {
        params: { page: 1, status: "confirmado" },
      });
    });
  });

  describe("Contestações", () => {
    it("getContestacoes with status filter", async () => {
      mockGet.mockResolvedValue({ data: { status: true, data: [], error: null, message: 'Sucesso' } });

      await merchantManagementService.getContestacoes("pendente");

      expect(mockGet).toHaveBeenCalledWith("/api/v1/contestacoes", {
        params: { status: "pendente" },
      });
    });

    it("resolveContestacao patches with status and response", async () => {
      mockPatch.mockResolvedValue({});

      await merchantManagementService.resolveContestacao(5, {
        status: "aprovada",
        resposta: "Aprovado pelo gestor",
      });

      expect(mockPatch).toHaveBeenCalledWith("/api/v1/contestacoes/5", {
        status: "aprovada",
        resposta: "Aprovado pelo gestor",
      });
    });
  });

  describe("Config", () => {
    it("getConfig returns empresa config", async () => {
      const config = { nome_fantasia: "Loja X", cnpj: "12345678000101" };
      mockGet.mockResolvedValue({ data: { status: true, data: config, error: null, message: 'Sucesso' } });

      const result = await merchantManagementService.getConfig();

      expect(mockGet).toHaveBeenCalledWith("/api/v1/config");
      expect(result.nome_fantasia).toBe("Loja X");
    });

    it("updateConfig patches config", async () => {
      mockPatch.mockResolvedValue({ data: { status: true, data: { percentual_cashback: 5 }, error: null, message: 'Sucesso' } });

      await merchantManagementService.updateConfig({ percentual_cashback: 5 });

      expect(mockPatch).toHaveBeenCalledWith("/api/v1/config", { percentual_cashback: 5 });
    });

    it("uploadLogo posts FormData with correct headers", async () => {
      const formData = new FormData();
      mockPost.mockResolvedValue({ data: { status: true, data: { logo_url: "https://cdn.example.com/logo.png" }, error: null, message: 'Sucesso' } });

      const result = await merchantManagementService.uploadLogo(formData);

      expect(mockPost).toHaveBeenCalledWith("/api/v1/config/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });
      expect(result.logo_url).toBe("https://cdn.example.com/logo.png");
    });
  });

  describe("Relatórios", () => {
    it("getRelatorios passes periodo param", async () => {
      const relatorio = { cashback_gerado: 5000, clientes_ativos: 100 };
      mockGet.mockResolvedValue({ data: { status: true, data: relatorio, error: null, message: 'Sucesso' } });

      const result = await merchantManagementService.getRelatorios("30d");

      expect(mockGet).toHaveBeenCalledWith("/api/v1/relatorios", {
        params: { periodo: "30d" },
      });
      expect(result.cashback_gerado).toBe(5000);
    });
  });
});
