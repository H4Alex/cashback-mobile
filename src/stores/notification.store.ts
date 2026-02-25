import { create } from 'zustand';
import type { NotificationPreferences } from '@/src/types';

interface NotificationState {
  unreadCount: number;
  preferences: NotificationPreferences | null;
  setUnreadCount: (count: number) => void;
  updatePreferences: (prefs: NotificationPreferences) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  preferences: null,

  setUnreadCount: (count) => set({ unreadCount: count }),

  updatePreferences: (prefs) => set({ preferences: prefs }),

  reset: () => set({ unreadCount: 0, preferences: null }),
}));
