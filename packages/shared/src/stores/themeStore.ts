/**
 * Zustand store for theme state (light / dark).
 * Works alongside `src/utils/theme.ts` which handles DOM class toggling
 * and localStorage persistence. The store provides reactive state for
 * components (see ADR-006).
 *
 * @example
 * const { theme, toggleTheme } = useThemeStore()
 * toggleTheme() // switches between 'light' and 'dark'
 */
import { create } from 'zustand'

export type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'light',
  setTheme: (theme: Theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}))

export default useThemeStore
