import { renderHook, waitFor } from "@testing-library/react-native";
import { createWrapper } from "@/src/testing/hook-test-helpers";
import { useSaldo, useLojasComSaldo, useExtrato, useExtratoInfinite } from "@/src/hooks/useCashback";

jest.mock("@/src/services", () => ({
  mobileCashbackService: {
    getSaldo: jest.fn().mockResolvedValue({ saldo_total: 150.5, por_empresa: [] }),
    getLojasComSaldo: jest.fn().mockResolvedValue([{ empresa_id: 1, nome: "Loja" }]),
    getExtrato: jest.fn().mockResolvedValue({
      data: [],
      meta: { has_more_pages: false, next_cursor: null },
    }),
  },
}));

describe("useCashback hooks", () => {
  describe("useSaldo", () => {
    it("fetches saldo data", async () => {
      const { result } = renderHook(() => useSaldo(), { wrapper: createWrapper() });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual({ saldo_total: 150.5, por_empresa: [] });
    });
  });

  describe("useLojasComSaldo", () => {
    it("fetches lojas", async () => {
      const { result } = renderHook(() => useLojasComSaldo(), { wrapper: createWrapper() });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(1);
    });
  });

  describe("useExtrato", () => {
    it("returns infinite query with fetchNextPage", () => {
      const { result } = renderHook(() => useExtrato(), { wrapper: createWrapper() });
      expect(result.current.fetchNextPage).toBeDefined();
    });

    it("accepts empresa_id parameter", () => {
      const { result } = renderHook(() => useExtrato({ empresa_id: "1" }), {
        wrapper: createWrapper(),
      });
      expect(result.current.fetchNextPage).toBeDefined();
    });
  });

  describe("useExtratoInfinite", () => {
    it("returns infinite query with filters", () => {
      const { result } = renderHook(
        () => useExtratoInfinite({ tipo: "credito", empresa_id: "1" }),
        { wrapper: createWrapper() },
      );
      expect(result.current.fetchNextPage).toBeDefined();
    });

    it("works with empty filters", () => {
      const { result } = renderHook(() => useExtratoInfinite({}), {
        wrapper: createWrapper(),
      });
      expect(result.current.isLoading).toBeDefined();
    });
  });
});
