import { TouchableOpacity, Text, ActivityIndicator, type TouchableOpacityProps } from "react-native";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

interface ButtonProps extends Omit<TouchableOpacityProps, "children"> {
  children: string;
  variant?: Variant;
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

const variantClasses: Record<Variant, { container: string; text: string }> = {
  primary: { container: "bg-green-500", text: "text-white" },
  secondary: { container: "bg-blue-600", text: "text-white" },
  outline: { container: "border border-gray-300 bg-transparent", text: "text-gray-800" },
  ghost: { container: "bg-transparent", text: "text-blue-600" },
  danger: { container: "bg-red-600", text: "text-white" },
};

const sizeClasses: Record<string, { container: string; text: string }> = {
  sm: { container: "py-2 px-4 rounded-lg", text: "text-sm" },
  md: { container: "py-3.5 px-6 rounded-xl", text: "text-base" },
  lg: { container: "py-4 px-8 rounded-xl", text: "text-lg" },
};

export function Button({
  children,
  variant = "primary",
  loading = false,
  size = "md",
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const v = variantClasses[variant];
  const s = sizeClasses[size];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={`items-center justify-center ${s.container} ${v.container} ${
        isDisabled ? "opacity-50" : ""
      } ${className}`}
      disabled={isDisabled}
      accessibilityRole="button"
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" || variant === "ghost" ? "#374151" : "#fff"} />
      ) : (
        <Text className={`font-semibold ${s.text} ${v.text}`}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}
