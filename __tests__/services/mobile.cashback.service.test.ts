import { mobileCashbackService } from "@/src/services/mobile.cashback.service";
import { apiClient } from "@/src/lib/api-client";
import {
  buildCashbackSaldo,
  buildExtratoEntry,
  buildEmpresaSaldo,
  buildApiResponse,
  buildCursorPaginated,
  resetFixtureSequence,
} from "../fixtures";

jest.mock("@/src/lib/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
  saveTokens: jest.fn(),
  clearTokens: jest.fn(),
  getToken: jest.fn(),
}));

jest.mock("@/src/schemas/validateResponse", () => ({
  validateResponse: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { validateResponse } = require("@/src/schemas/validateResponse") as {
  validateResponse: jest.Mock;
};

const mockGet = apiClient.get as jest.Mock;

describe("mobileCashbackService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetFixtureSequence();
  });

  describe("getSaldo", () => {
    it("fetches saldo and returns data", async () => {
      const saldo = buildCashbackSaldo();
      mockGet.mockResolvedValue({ data: buildApiResponse(saldo) });

      const result = await mobileCashbackService.getSaldo();

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/saldo");
      expect(result.saldo_total).toBe(150.0);
      expect(result.por_empresa).toHaveLength(1);
      expect(result.proximo_a_expirar.valor).toBe(20.0);
    });

    it("calls validateResponse with saldoResponseSchema", async () => {
      const saldo = buildCashbackSaldo();
      const envelope = buildApiResponse(saldo);
      mockGet.mockResolvedValue({ data: envelope });

      await mobileCashbackService.getSaldo();

      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        envelope,
        "GET /saldo",
      );
    });

    it("propagates network errors", async () => {
      mockGet.mockRejectedValue(new Error("Network Error"));

      await expect(mobileCashbackService.getSaldo()).rejects.toThrow(
        "Network Error",
      );
    });

    it("propagates 401 unauthorized error", async () => {
      const error = Object.assign(new Error("Unauthorized"), {
        response: { status: 401 },
      });
      mockGet.mockRejectedValue(error);

      await expect(mobileCashbackService.getSaldo()).rejects.toThrow(
        "Unauthorized",
      );
    });

    it("propagates 500 server error", async () => {
      const error = Object.assign(new Error("Internal Server Error"), {
        response: { status: 500 },
      });
      mockGet.mockRejectedValue(error);

      await expect(mobileCashbackService.getSaldo()).rejects.toThrow(
        "Internal Server Error",
      );
    });
  });

  describe("getExtrato", () => {
    it("fetches extrato without params", async () => {
      const entries = [buildExtratoEntry(), buildExtratoEntry()];
      const paginated = buildCursorPaginated(entries);
      mockGet.mockResolvedValue({ data: paginated });

      const result = await mobileCashbackService.getExtrato();

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/extrato", {
        params: undefined,
      });
      expect(result.data).toHaveLength(2);
      expect(result.meta.has_more_pages).toBe(false);
    });

    it("fetches extrato with filter params", async () => {
      const entries = [buildExtratoEntry({ status_cashback: "pendente" })];
      const paginated = buildCursorPaginated(entries, {
        next_cursor: "cursor_abc",
        has_more_pages: true,
      });
      mockGet.mockResolvedValue({ data: paginated });

      const params = {
        cursor: "prev_cursor",
        limit: 10,
        empresa_id: "5",
        status: "pendente" as const,
      };
      const result = await mobileCashbackService.getExtrato(params);

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/extrato", {
        params,
      });
      expect(result.data).toHaveLength(1);
      expect(result.meta.next_cursor).toBe("cursor_abc");
      expect(result.meta.has_more_pages).toBe(true);
    });

    it("calls validateResponse with extratoResponseSchema", async () => {
      const paginated = buildCursorPaginated([buildExtratoEntry()]);
      mockGet.mockResolvedValue({ data: paginated });

      await mobileCashbackService.getExtrato();

      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        paginated,
        "GET /extrato",
      );
    });

    it("propagates network errors", async () => {
      mockGet.mockRejectedValue(new Error("Network Error"));

      await expect(mobileCashbackService.getExtrato()).rejects.toThrow(
        "Network Error",
      );
    });
  });

  describe("getLojasComSaldo", () => {
    it("fetches lojas with saldo", async () => {
      const lojas = [
        buildEmpresaSaldo({ empresa_id: 1, nome_fantasia: "Loja A", saldo: "100.00" }),
        buildEmpresaSaldo({ empresa_id: 2, nome_fantasia: "Loja B", saldo: "50.00" }),
      ];
      mockGet.mockResolvedValue({ data: buildApiResponse(lojas) });

      const result = await mobileCashbackService.getLojasComSaldo();

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/utilizacao/lojas");
      expect(result).toHaveLength(2);
      expect(result[0].nome_fantasia).toBe("Loja A");
    });

    it("propagates errors", async () => {
      mockGet.mockRejectedValue(new Error("Server Error"));

      await expect(mobileCashbackService.getLojasComSaldo()).rejects.toThrow(
        "Server Error",
      );
    });
  });

  describe("getHistorico", () => {
    it("fetches historico without params", async () => {
      const historico = {
        historico: [
          {
            id: 1,
            empresa_nome: "Loja A",
            empresa_id: 1,
            valor_original: 200,
            cashback_usado: 20,
            created_at: "2025-06-01T10:00:00Z",
          },
        ],
        meta: { next_cursor: null, has_more_pages: false },
      };
      mockGet.mockResolvedValue({ data: buildApiResponse(historico) });

      const result = await mobileCashbackService.getHistorico();

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/historico", {
        params: undefined,
      });
      expect(result.historico).toHaveLength(1);
      expect(result.meta.has_more_pages).toBe(false);
    });

    it("fetches historico with params", async () => {
      const historico = { historico: [], meta: { next_cursor: null, has_more_pages: false } };
      mockGet.mockResolvedValue({ data: buildApiResponse(historico) });

      const params = { cursor: "abc", limit: 5, data_inicio: "2025-01-01", data_fim: "2025-06-01" };
      await mobileCashbackService.getHistorico(params);

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/historico", {
        params,
      });
    });

    it("propagates errors", async () => {
      mockGet.mockRejectedValue(new Error("Network Error"));

      await expect(mobileCashbackService.getHistorico()).rejects.toThrow(
        "Network Error",
      );
    });
  });
});
