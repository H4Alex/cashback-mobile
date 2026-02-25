import { View, Text } from "react-native";
import type { CashbackEntry } from "@/src/types";
import { formatCurrency, formatDate } from "@/src/utils/formatters";

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  creditado: { color: "bg-green-500", label: "Creditado" },
  pendente: { color: "bg-yellow-500", label: "Pendente" },
  resgatado: { color: "bg-blue-500", label: "Resgatado" },
  expirado: { color: "bg-gray-400", label: "Expirado" },
  processando: { color: "bg-orange-500", label: "Processando" },
};

interface CashbackTimelineProps {
  entries: CashbackEntry[];
}

export function CashbackTimeline({ entries }: CashbackTimelineProps) {
  return (
    <View>
      {entries.map((entry, index) => {
        const config = STATUS_CONFIG[entry.status] ?? {
          color: "bg-gray-400",
          label: entry.status,
        };
        const isLast = index === entries.length - 1;

        return (
          <View key={entry.id} className="flex-row px-4">
            {/* Timeline indicator */}
            <View className="items-center mr-3">
              <View className={`w-3 h-3 rounded-full ${config.color}`} />
              {!isLast && <View className="w-0.5 flex-1 bg-gray-200" />}
            </View>

            {/* Content */}
            <View className="flex-1 pb-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-2">
                  <Text className="text-base font-medium">{entry.empresa_nome}</Text>
                  {entry.descricao && (
                    <Text className="text-gray-500 text-xs mt-0.5">{entry.descricao}</Text>
                  )}
                </View>
                <Text
                  className={`font-semibold ${entry.status === "expirado" ? "text-gray-400" : "text-green-600"}`}
                >
                  {formatCurrency(entry.valor)}
                </Text>
              </View>
              <View className="flex-row items-center mt-1">
                <View className={`rounded-full px-2 py-0.5 ${config.color}/10`}>
                  <Text
                    className={`text-xs font-medium`}
                    style={{ color: getTextColor(config.color) }}
                  >
                    {config.label}
                  </Text>
                </View>
                <Text className="text-gray-400 text-xs ml-2">{formatDate(entry.created_at)}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function getTextColor(bgClass: string): string {
  const map: Record<string, string> = {
    "bg-green-500": "#16a34a",
    "bg-yellow-500": "#ca8a04",
    "bg-blue-500": "#2563eb",
    "bg-gray-400": "#9ca3af",
    "bg-orange-500": "#ea580c",
  };
  return map[bgClass] ?? "#6b7280";
}
