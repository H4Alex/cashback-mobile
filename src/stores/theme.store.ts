import { create } from "zustand";

type ThemeMode = "light" | "dark" | "system";

interface ThemeStoreState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

/**
 * Persistent theme store.
 * In production, persist mode to MMKV so it survives app restart.
 */
export const useThemeStore = create<ThemeStoreState>((set) => ({
  mode: "system",
  setMode: (mode) => set({ mode }),
}));
