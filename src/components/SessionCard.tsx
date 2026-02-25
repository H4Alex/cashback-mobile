import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import type { ActiveSession } from "@/src/services/session.service";

function formatLastActive(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMin = Math.floor((now - date) / 60_000);

  if (diffMin < 1) return "Agora";
  if (diffMin < 60) return `${diffMin}min atrás`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h atrás`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d atrás`;
}

interface SessionCardProps {
  session: ActiveSession;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
}

export function SessionCard({ session, onRevoke, isRevoking }: SessionCardProps) {
  return (
    <View
      className={`bg-white rounded-xl p-4 mb-2 border ${session.is_current ? "border-green-300" : "border-gray-200"}`}
      accessibilityLabel={`Sessão em ${session.device_name}, ${session.platform}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="font-semibold text-base">{session.device_name}</Text>
            {session.is_current && (
              <View className="bg-green-100 rounded-md px-2 py-0.5 ml-2">
                <Text className="text-green-700 text-xs font-medium">Atual</Text>
              </View>
            )}
          </View>
          <Text className="text-gray-500 text-sm mt-0.5">{session.platform}</Text>
          <Text className="text-gray-400 text-xs mt-0.5">
            {formatLastActive(session.last_active_at)}
          </Text>
        </View>

        {!session.is_current && (
          <TouchableOpacity
            className="bg-red-50 rounded-lg px-3 py-2"
            onPress={() => onRevoke(session.id)}
            disabled={isRevoking}
            accessibilityLabel={`Revogar sessão em ${session.device_name}`}
            accessibilityRole="button"
          >
            {isRevoking ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <Text className="text-red-600 text-xs font-medium">Revogar</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
