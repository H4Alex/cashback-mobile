import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { mobileCashbackService } from "@/src/services";

const KEYS = {
  saldo: ["cashback", "saldo"] as const,
  extrato: ["cashback", "extrato"] as const,
};

export function useSaldo() {
  return useQuery({
    queryKey: KEYS.saldo,
    queryFn: () => mobileCashbackService.getSaldo(),
    staleTime: 30_000, // 30 seconds — financial data must stay fresh
  });
}

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
