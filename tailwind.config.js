/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/theme/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#22C55E",
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
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
        surface: {
          DEFAULT: "#F8F9FA",
          dark: "#1A1A1A",
        },
      },
      fontFamily: {
        sans: ["DMSans"],
        mono: ["SpaceMono"],
      },
      fontSize: {
        "page-title": ["24px", { lineHeight: "32px", fontWeight: "700" }],
        "value-card": ["30px", { lineHeight: "36px", fontWeight: "700" }],
        "value-table": ["16px", { lineHeight: "24px", fontWeight: "700" }],
        label: ["12px", { lineHeight: "16px", fontWeight: "600" }],
        body: ["14px", { lineHeight: "20px", fontWeight: "500" }],
        caption: ["12px", { lineHeight: "16px", fontWeight: "400" }],
        badge: ["10px", { lineHeight: "14px", fontWeight: "700" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        base: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
      },
      borderRadius: {
        checkbox: "4px",
        badge: "8px",
        button: "12px",
        container: "16px",
      },
    },
  },
  plugins: [],
};
