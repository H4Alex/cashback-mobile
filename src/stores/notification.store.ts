import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "@/src/lib/mmkv";
import type { NotificationPreferences } from "@/src/types";

interface NotificationState {
  unreadCount: number;
  preferences: NotificationPreferences | null;
  setUnreadCount: (count: number) => void;
  updatePreferences: (prefs: NotificationPreferences) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      unreadCount: 0,
      preferences: null,

      setUnreadCount: (count) => set({ unreadCount: count }),

      updatePreferences: (prefs) => set({ preferences: prefs }),

      reset: () => set({ unreadCount: 0, preferences: null }),
    }),
    {
      name: "notification-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
