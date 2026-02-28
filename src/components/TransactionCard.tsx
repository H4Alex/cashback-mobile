import { View, Text, TouchableOpacity } from "react-native";
import type { ExtratoEntry } from "@/src/types";
import { formatCurrency, formatDateTime } from "@/src/utils/formatters";

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  pendente: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pendente" },
  confirmado: { bg: "bg-green-100", text: "text-green-700", label: "Confirmado" },
  utilizado: { bg: "bg-blue-100", text: "text-blue-700", label: "Utilizado" },
  rejeitado: { bg: "bg-red-100", text: "text-red-700", label: "Rejeitado" },
  expirado: { bg: "bg-gray-100", text: "text-gray-500", label: "Expirado" },
  congelado: { bg: "bg-orange-100", text: "text-orange-700", label: "Congelado" },
};

interface TransactionCardProps {
  entry: ExtratoEntry;
  onPress?: () => void;
}

export function TransactionCard({ entry, onPress }: TransactionCardProps) {
  const statusKey = entry.status_cashback;
  const config = STATUS_CONFIG[statusKey] ?? {
    bg: "bg-gray-100",
    text: "text-gray-500",
    label: statusKey,
  };
  const isNegative = statusKey === "expirado" || statusKey === "utilizado" || statusKey === "rejeitado";
  const empresaNome = entry.empresa?.nome_fantasia ?? "";

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mx-4 mb-3"
      style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center">
            <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-2">
              <Text className="text-sm font-bold text-blue-600">
                {empresaNome.charAt(0).toUpperCase() || "?"}
              </Text>
            </View>
            <Text className="text-base font-semibold flex-shrink" numberOfLines={1}>
              {empresaNome}
            </Text>
          </View>
          {entry.campanha?.nome && (
            <Text className="text-gray-500 text-xs mt-1 ml-10" numberOfLines={2}>
              {entry.campanha.nome}
            </Text>
          )}
        </View>
        <Text className={`text-base font-bold ${isNegative ? "text-gray-400" : "text-green-600"}`}>
          {isNegative ? "-" : "+"}
          {formatCurrency(entry.valor_cashback)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between mt-3 ml-10">
        <View className={`rounded-full px-2.5 py-1 ${config.bg}`}>
          <Text className={`text-xs font-medium ${config.text}`}>{config.label}</Text>
        </View>
        <Text className="text-gray-400 text-xs">{formatDateTime(entry.created_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}
