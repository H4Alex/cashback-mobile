import { View, Text } from "react-native";

type BadgeVariant = "success" | "error" | "warning" | "info" | "neutral";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: "bg-green-100", text: "text-green-800" },
  error: { bg: "bg-red-100", text: "text-red-800" },
  warning: { bg: "bg-yellow-100", text: "text-yellow-800" },
  info: { bg: "bg-blue-100", text: "text-blue-800" },
  neutral: { bg: "bg-gray-100", text: "text-gray-800" },
};

export function Badge({ label, variant = "neutral" }: BadgeProps) {
  const v = variants[variant];

  return (
    <View className={`${v.bg} rounded-lg px-2.5 py-1 self-start`}>
      <Text className={`${v.text} text-xs font-semibold`}>{label}</Text>
    </View>
  );
}
