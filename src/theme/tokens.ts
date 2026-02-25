export const colors = {
  background: {
    default: { light: "#FFFFFF", dark: "#0A0A0A" },
    surface: { light: "#F8F9FA", dark: "#1A1A1A" },
    hover: { light: "#F1F3F5", dark: "#2A2A2A" },
  },
  text: {
    primary: { light: "#1A1A1A", dark: "#FFFFFF" },
    secondary: { light: "#6B7280", dark: "#A1A1A1" },
    disabled: { light: "#9CA3AF", dark: "#717171" },
  },
  border: {
    default: { light: "#E5E7EB", dark: "#272727" },
    hover: { light: "#D1D5DB", dark: "#3F3F46" },
  },
  primary: {
    main: "#22C55E",
    dark: { light: "#16A34A", dark: "#4ADE80" },
    surface: { light: "#F0FDF4", dark: "#14532D" },
  },
  semantic: {
    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#3B82F6",
  },
  cashback: {
    credited: "#10B981",
    pending: "#F59E0B",
    redeemed: "#6366F1",
    expired: "#EF4444",
    processing: "#3B82F6",
  },
} as const;

export const typography = {
  pageTitle: { size: 24, lineHeight: 32, weight: "700" as const },
  valueCard: { size: 30, lineHeight: 36, weight: "700" as const },
  valueTable: { size: 16, lineHeight: 24, weight: "700" as const },
  label: { size: 12, lineHeight: 16, weight: "600" as const },
  body: { size: 14, lineHeight: 20, weight: "500" as const },
  caption: { size: 12, lineHeight: 16, weight: "400" as const },
  badge: { size: 10, lineHeight: 14, weight: "700" as const },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  checkbox: 4,
  badge: 8,
  button: 12,
  container: 16,
  full: 9999,
} as const;

export const shadows = {
  card: {
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
  },
  cardHover: {
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    android: { elevation: 8 },
  },
  fab: {
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 10,
    },
    android: { elevation: 6 },
  },
  toast: {
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 24,
    },
    android: { elevation: 12 },
  },
} as const;

export const fonts = {
  sans: "DMSans",
  mono: "SpaceMono",
} as const;
