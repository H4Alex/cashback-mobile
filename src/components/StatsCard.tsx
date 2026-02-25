import { View, Text } from "react-native";
import { formatCurrency } from "@/src/utils/formatters";

interface StatsCardProps {
  label: string;
  value: number;
  variacao?: number;
}

export function StatsCard({ label, value, variacao }: StatsCardProps) {
  const isPositive = (variacao ?? 0) >= 0;

  return (
    <View
      className="bg-white rounded-xl p-4 mr-3"
      style={{
        width: 140,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}
      accessibilityLabel={`${label}: ${formatCurrency(value)}`}
    >
      <Text className="text-gray-500 text-xs mb-1">{label}</Text>
      <Text className="text-lg font-bold" numberOfLines={1}>
        {formatCurrency(value)}
      </Text>
      {variacao !== undefined && (
        <Text className={`text-xs mt-1 ${isPositive ? "text-green-600" : "text-red-500"}`}>
          {isPositive ? "▲" : "▼"} {Math.abs(variacao).toFixed(1)}%
        </Text>
      )}
    </View>
  );
}
