import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sessionService } from "@/src/services/session.service";

const KEYS = {
  sessions: ["sessions"] as const,
};

export function useSessions() {
  return useQuery({
    queryKey: KEYS.sessions,
    queryFn: () => sessionService.getSessions(),
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionService.revokeSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.sessions });
    },
  });
}
