import { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { colors } from "./tokens";

type ThemeMode = "light" | "dark" | "system";

interface ThemeColors {
  background: { default: string; surface: string; hover: string };
  text: { primary: string; secondary: string; disabled: string };
  border: { default: string; hover: string };
  primary: { main: string; dark: string; surface: string };
  semantic: typeof colors.semantic;
  cashback: typeof colors.cashback;
}

interface ThemeContextValue {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveColors(isDark: boolean): ThemeColors {
  const variant = isDark ? "dark" : "light";
  return {
    background: {
      default: colors.background.default[variant],
      surface: colors.background.surface[variant],
      hover: colors.background.hover[variant],
    },
    text: {
      primary: colors.text.primary[variant],
      secondary: colors.text.secondary[variant],
      disabled: colors.text.disabled[variant],
    },
    border: {
      default: colors.border.default[variant],
      hover: colors.border.hover[variant],
    },
    primary: {
      main: colors.primary.main,
      dark: colors.primary.dark[variant],
      surface: colors.primary.surface[variant],
    },
    semantic: colors.semantic,
    cashback: colors.cashback,
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  const isDark = mode === "system" ? systemScheme === "dark" : mode === "dark";

  const resolvedColors = useMemo(() => resolveColors(isDark), [isDark]);

  const value = useMemo(
    () => ({ mode, isDark, colors: resolvedColors, setMode }),
    [mode, isDark, resolvedColors],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
