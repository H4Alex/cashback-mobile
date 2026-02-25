import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { mobileNotificationService } from "@/src/services";
import { useNotificationStore } from "@/src/stores";

const KEYS = {
  list: ["notifications"] as const,
  preferences: ["notifications", "preferences"] as const,
};

export function useNotifications(params?: { unread_only?: boolean }) {
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  return useInfiniteQuery({
    queryKey: [...KEYS.list, params],
    queryFn: ({ pageParam }) =>
      mobileNotificationService.getNotifications({
        cursor: pageParam as string | undefined,
        limit: 20,
        unread_only: params?.unread_only,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_more ? lastPage.meta.next_cursor : undefined,
    select: (data) => {
      const firstPage = data.pages[0];
      if (firstPage) {
        setUnreadCount(firstPage.meta.total_unread);
      }
      return data;
    },
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => mobileNotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.list });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  return useMutation({
    mutationFn: () => mobileNotificationService.markAllAsRead(),
    onSuccess: () => {
      setUnreadCount(0);
      queryClient.invalidateQueries({ queryKey: KEYS.list });
    },
  });
}

export function useNotificationPreferences() {
  const updatePreferences = useNotificationStore((s) => s.updatePreferences);

  return useQuery({
    queryKey: KEYS.preferences,
    queryFn: async () => {
      const prefs = await mobileNotificationService.getPreferences();
      updatePreferences(prefs);
      return prefs;
    },
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mobileNotificationService.updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.preferences });
    },
  });
}
