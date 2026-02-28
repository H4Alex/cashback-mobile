import { View, Text } from "react-native";
import type { ContestacaoStatus } from "@/src/types/contestacao";

const BADGE_CONFIG: Record<ContestacaoStatus, { bg: string; text: string; label: string }> = {
  pendente: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pendente" },
  aprovada: { bg: "bg-green-100", text: "text-green-700", label: "Aprovada" },
  rejeitada: { bg: "bg-red-100", text: "text-red-700", label: "Rejeitada" },
};

interface StatusBadgeProps {
  status: ContestacaoStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = BADGE_CONFIG[status];
  return (
    <View className={`rounded-full px-2.5 py-1 ${config.bg}`}>
      <Text className={`text-xs font-medium ${config.text}`}>{config.label}</Text>
    </View>
  );
}
