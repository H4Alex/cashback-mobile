import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "@/src/lib/mmkv";

type ThemeMode = "light" | "dark" | "system";

interface ThemeStoreState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStoreState>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
