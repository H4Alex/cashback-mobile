import { View, Text, TouchableOpacity } from "react-native";
import type { MobileNotification } from "@/src/types";

interface NotificationItemProps {
  item: MobileNotification;
  onPress: () => void;
}

const TYPE_ICONS: Record<string, string> = {
  cashback_recebido: "🟢",
  cashback_expirado: "⚠️",
  resgate_confirmado: "🟣",
  campanha: "📢",
  sistema: "ℹ️",
};

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `há ${diffMin} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays === 1) return "ontem";
  if (diffDays < 7) return `há ${diffDays} dias`;
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export function formatDateGroup(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const todayStr = now.toDateString();
  const dateStrDay = date.toDateString();

  if (todayStr === dateStrDay) return "Hoje";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (yesterday.toDateString() === dateStrDay) return "Ontem";

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
}

export function NotificationItem({ item, onPress }: NotificationItemProps) {
  const icon = TYPE_ICONS[item.tipo] ?? "🔔";

  return (
    <TouchableOpacity
      className={`px-4 py-3 border-b border-gray-100 ${item.lida ? "bg-white" : "bg-blue-50"}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        <Text className="text-lg mr-3 mt-0.5">{icon}</Text>
        <View className="flex-1">
          <View className="flex-row items-center">
            {!item.lida && <View className="w-2 h-2 rounded-full bg-blue-600 mr-2" />}
            <Text className="font-semibold text-base flex-1" numberOfLines={1}>
              {item.titulo}
            </Text>
          </View>
          <Text className="text-gray-600 text-sm mt-1" numberOfLines={2}>
            {item.mensagem}
          </Text>
          <Text className="text-gray-400 text-xs mt-1">{formatRelativeTime(item.created_at)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
