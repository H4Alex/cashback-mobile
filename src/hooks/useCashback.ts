import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { mobileCashbackService } from "@/src/services";
import type { ExtratoFilters } from "./useExtratoFilters";

const KEYS = {
  saldo: ["cashback", "saldo"] as const,
  extrato: ["cashback", "extrato"] as const,
  lojas: ["cashback", "lojas"] as const,
};

export function useSaldo() {
  return useQuery({
    queryKey: KEYS.saldo,
    queryFn: () => mobileCashbackService.getSaldo(),
    staleTime: 30_000, // 30 seconds — financial data must stay fresh
  });
}

/** Empresas with available cashback balance (for QR Code flow) */
export function useLojasComSaldo() {
  return useQuery({
    queryKey: KEYS.lojas,
    queryFn: () => mobileCashbackService.getLojasComSaldo(),
  });
}

/** Basic extrato infinite query (used on Dashboard/Saldo screens) */
export function useExtrato(params?: { empresa_id?: string }) {
  return useInfiniteQuery({
    queryKey: [...KEYS.extrato, params],
    queryFn: ({ pageParam }) =>
      mobileCashbackService.getExtrato({
        cursor: pageParam as string | undefined,
        limit: 20,
        empresa_id: params?.empresa_id,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_more ? lastPage.meta.next_cursor : undefined,
  });
}

/** Enhanced extrato with full filter support (used on dedicated Extrato screen) */
export function useExtratoInfinite(filters: ExtratoFilters) {
  return useInfiniteQuery({
    queryKey: [...KEYS.extrato, "filtered", filters],
    queryFn: ({ pageParam, signal }) =>
      mobileCashbackService.getExtrato({
        cursor: pageParam as string | undefined,
        limit: 20,
        ...filters,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_more ? lastPage.meta.next_cursor : undefined,
  });
}
