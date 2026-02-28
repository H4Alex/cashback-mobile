import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mobileContestacaoService } from "@/src/services/mobile.contestacao.service";
import type { CreateContestacaoRequest } from "@/src/types/contestacao";

const KEYS = {
  contestacoes: ["contestacoes"] as const,
};

export function useContestacoes() {
  return useInfiniteQuery({
    queryKey: KEYS.contestacoes,
    queryFn: ({ pageParam }) =>
      mobileContestacaoService.list({
        cursor: pageParam as string | undefined,
        limit: 20,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_more_pages ? lastPage.meta.next_cursor : undefined,
  });
}

export function useContestacaoCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContestacaoRequest) => mobileContestacaoService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.contestacoes });
    },
  });
}
