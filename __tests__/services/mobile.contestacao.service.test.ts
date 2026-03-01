import { mobileContestacaoService } from "@/src/services/mobile.contestacao.service";
import { apiClient } from "@/src/lib/api-client";
import {
  buildContestacao,
  buildCursorPaginated,
  buildApiResponse,
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
const mockPost = apiClient.post as jest.Mock;

describe("mobileContestacaoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetFixtureSequence();
  });

  describe("list", () => {
    it("fetches contestacoes without params", async () => {
      const contestacoes = [buildContestacao(), buildContestacao()];
      const paginated = buildCursorPaginated(contestacoes);
      mockGet.mockResolvedValue({ data: paginated });

      const result = await mobileContestacaoService.list();

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/contestacoes", {
        params: undefined,
      });
      expect(result.data).toHaveLength(2);
      expect(result.meta.has_more_pages).toBe(false);
    });

    it("fetches contestacoes with cursor and limit", async () => {
      const contestacoes = [buildContestacao()];
      const paginated = buildCursorPaginated(contestacoes, {
        next_cursor: "next_abc",
        has_more_pages: true,
      });
      mockGet.mockResolvedValue({ data: paginated });

      const params = { cursor: "prev_cursor", limit: 5 };
      const result = await mobileContestacaoService.list(params);

      expect(mockGet).toHaveBeenCalledWith("/api/mobile/v1/contestacoes", {
        params,
      });
      expect(result.data).toHaveLength(1);
      expect(result.meta.next_cursor).toBe("next_abc");
    });

    it("calls validateResponse with contestacaoListResponseSchema", async () => {
      const paginated = buildCursorPaginated([buildContestacao()]);
      mockGet.mockResolvedValue({ data: paginated });

      await mobileContestacaoService.list();

      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        paginated,
        "GET /contestacoes",
      );
    });

    it("propagates network errors", async () => {
      mockGet.mockRejectedValue(new Error("Network Error"));

      await expect(mobileContestacaoService.list()).rejects.toThrow(
        "Network Error",
      );
    });

    it("propagates 401 unauthorized error", async () => {
      const error = Object.assign(new Error("Unauthorized"), {
        response: { status: 401 },
      });
      mockGet.mockRejectedValue(error);

      await expect(mobileContestacaoService.list()).rejects.toThrow(
        "Unauthorized",
      );
    });

    it("propagates 500 server error", async () => {
      const error = Object.assign(new Error("Internal Server Error"), {
        response: { status: 500 },
      });
      mockGet.mockRejectedValue(error);

      await expect(mobileContestacaoService.list()).rejects.toThrow(
        "Internal Server Error",
      );
    });
  });

  describe("create", () => {
    it("creates a contestacao and returns the result", async () => {
      const contestacao = buildContestacao({
        tipo: "valor_incorreto",
        descricao: "Valor está incorreto",
      });
      mockPost.mockResolvedValue({
        data: buildApiResponse(contestacao),
      });

      const result = await mobileContestacaoService.create({
        cashback_entry_id: "cb_1",
        tipo: "valor_incorreto",
        descricao: "Valor está incorreto",
      });

      expect(mockPost).toHaveBeenCalledWith("/api/mobile/v1/contestacoes", {
        cashback_entry_id: "cb_1",
        tipo: "valor_incorreto",
        descricao: "Valor está incorreto",
      });
      expect(result.tipo).toBe("valor_incorreto");
      expect(result.status).toBe("pendente");
    });

    it("calls validateResponse with contestacaoSchema on response data", async () => {
      const contestacao = buildContestacao();
      mockPost.mockResolvedValue({
        data: buildApiResponse(contestacao),
      });

      await mobileContestacaoService.create({
        cashback_entry_id: "cb_1",
        tipo: "cashback_nao_gerado",
        descricao: "Cashback não foi gerado",
      });

      expect(validateResponse).toHaveBeenCalledWith(
        expect.anything(),
        contestacao,
        "POST /contestacoes",
      );
    });

    it("propagates network errors", async () => {
      mockPost.mockRejectedValue(new Error("Network Error"));

      await expect(
        mobileContestacaoService.create({
          cashback_entry_id: "cb_1",
          tipo: "valor_incorreto",
          descricao: "Teste",
        }),
      ).rejects.toThrow("Network Error");
    });

    it("propagates 422 validation error", async () => {
      const error = Object.assign(new Error("Unprocessable Entity"), {
        response: { status: 422, data: { errors: { descricao: ["Obrigatório"] } } },
      });
      mockPost.mockRejectedValue(error);

      await expect(
        mobileContestacaoService.create({
          cashback_entry_id: "cb_1",
          tipo: "valor_incorreto",
          descricao: "Teste",
        }),
      ).rejects.toThrow("Unprocessable Entity");
    });

    it("propagates 500 server error", async () => {
      const error = Object.assign(new Error("Internal Server Error"), {
        response: { status: 500 },
      });
      mockPost.mockRejectedValue(error);

      await expect(
        mobileContestacaoService.create({
          cashback_entry_id: "cb_1",
          tipo: "valor_incorreto",
          descricao: "Teste",
        }),
      ).rejects.toThrow("Internal Server Error");
    });
  });
});
