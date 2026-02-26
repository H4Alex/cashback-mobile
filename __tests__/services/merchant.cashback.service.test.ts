import { merchantCashbackService } from "@/src/services/merchant.cashback.service";
import { apiClient } from "@/src/lib/api-client";

jest.mock("@/src/lib/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;

describe("merchantCashbackService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("searchCliente", () => {
    it("searches by CPF", async () => {
      const clientes = [{ id: 1, nome: "João", cpf: "12345678901" }];
      mockGet.mockResolvedValue({ data: { data: clientes } });

      const result = await merchantCashbackService.searchCliente("12345678901");

      expect(mockGet).toHaveBeenCalledWith("/api/v1/clientes", {
        params: { search: "12345678901" },
      });
      expect(result).toHaveLength(1);
      expect(result[0].nome).toBe("João");
    });
  });

  describe("getClienteSaldo", () => {
    it("fetches client balance", async () => {
      const saldo = { cliente: { id: 1 }, saldo: 250, max_utilizacao_percentual: 100 };
      mockGet.mockResolvedValue({ data: saldo });

      const result = await merchantCashbackService.getClienteSaldo(1);

      expect(mockGet).toHaveBeenCalledWith("/api/v1/clientes/1/saldo");
      expect(result.saldo).toBe(250);
    });
  });

  describe("getCampanhas", () => {
    it("fetches active campaigns", async () => {
      mockGet.mockResolvedValue({ data: { data: [{ id: 1, nome: "Promo" }] } });

      const result = await merchantCashbackService.getCampanhas();

      expect(mockGet).toHaveBeenCalledWith("/api/v1/campanhas", {
        params: { status: "ativa" },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe("gerarCashback", () => {
    it("sends request with idempotency key", async () => {
      const response = { id: "cb-1", valor_compra: 100, cashback_gerado: 5 };
      mockPost.mockResolvedValue({ data: response });

      const result = await merchantCashbackService.gerarCashback(
        { cliente_id: 1, valor: 100 },
        "idempotency-key-123",
      );

      expect(mockPost).toHaveBeenCalledWith(
        "/api/v1/cashback",
        { cliente_id: 1, valor: 100 },
        { headers: { "Idempotency-Key": "idempotency-key-123" } },
      );
      expect(result.cashback_gerado).toBe(5);
    });
  });

  describe("utilizarCashback", () => {
    it("sends utilization request with idempotency key", async () => {
      const response = { id: "ut-1", cashback_usado: 50, novo_saldo: 200 };
      mockPost.mockResolvedValue({ data: response });

      const result = await merchantCashbackService.utilizarCashback(
        { cliente_id: 1, valor: 50 },
        "idempotency-key-456",
      );

      expect(mockPost).toHaveBeenCalledWith(
        "/api/v1/cashback/utilizar",
        { cliente_id: 1, valor: 50 },
        { headers: { "Idempotency-Key": "idempotency-key-456" } },
      );
      expect(result.cashback_usado).toBe(50);
    });
  });
});
