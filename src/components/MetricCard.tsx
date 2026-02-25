import { View, Text } from "react-native";
import { formatCurrency } from "@/src/utils/formatters";

interface MetricCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
}

export function MetricCard({ label, value, isCurrency = true }: MetricCardProps) {
  return (
    <View
      className="bg-white rounded-xl p-4 mb-3"
      style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
      accessibilityLabel={`${label}: ${isCurrency ? formatCurrency(value) : value}`}
    >
      <Text className="text-gray-500 text-sm">{label}</Text>
      <Text className="text-xl font-bold mt-1">
        {isCurrency ? formatCurrency(value) : value.toLocaleString("pt-BR")}
      </Text>
    </View>
  );
}
