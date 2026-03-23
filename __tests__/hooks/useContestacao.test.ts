import { renderHook, act, waitFor } from "@testing-library/react-native";
import { createWrapper } from "@/src/testing/hook-test-helpers";
import { useContestacoes, useContestacaoCreate } from "@/src/hooks/useContestacao";

jest.mock("@/src/services/mobile.contestacao.service", () => ({
  mobileContestacaoService: {
    list: jest.fn().mockResolvedValue({
      data: [],
      pagination: { current_page: 1, last_page: 1 },
    }),
    create: jest.fn().mockResolvedValue({ id: 1 }),
  },
}));

describe("useContestacao hooks", () => {
  describe("useContestacoes", () => {
    it("returns query with fetchNextPage", () => {
      const { result } = renderHook(() => useContestacoes(), { wrapper: createWrapper() });
      expect(result.current.fetchNextPage).toBeDefined();
      expect(result.current.hasNextPage).toBeDefined();
    });
  });

  describe("useContestacaoCreate", () => {
    it("returns mutate function", () => {
      const { result } = renderHook(() => useContestacaoCreate(), { wrapper: createWrapper() });
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
    });

    it("calls create service on mutate and invalidates queries on success", async () => {
      const { mobileContestacaoService } = require("@/src/services/mobile.contestacao.service");
      const { result } = renderHook(() => useContestacaoCreate(), { wrapper: createWrapper() });

      act(() => {
        result.current.mutate({
          transacao_id: 1,
          tipo: "valor_incorreto",
          descricao: "Valor veio errado no app",
        });
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(mobileContestacaoService.create).toHaveBeenCalledWith(
        expect.objectContaining({ transacao_id: 1, tipo: "valor_incorreto" }),
      );
    });
  });
});
