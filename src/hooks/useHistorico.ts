import { useInfiniteQuery } from "@tanstack/react-query";
import { mobileCashbackService } from "@/src/services";

const KEYS = {
  historico: ["cashback", "historico"] as const,
};

export function useHistorico(params?: { data_inicio?: string; data_fim?: string }) {
  return useInfiniteQuery({
    queryKey: [...KEYS.historico, params],
    queryFn: ({ pageParam }) =>
      mobileCashbackService.getHistorico({
        cursor: pageParam as string | undefined,
        limit: 20,
        data_inicio: params?.data_inicio,
        data_fim: params?.data_fim,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_more_pages ? lastPage.meta.next_cursor : undefined,
  });
}
