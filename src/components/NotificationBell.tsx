import { View, Text, TouchableOpacity } from "react-native";
import { useNotificationStore } from "@/src/stores";

interface NotificationBellProps {
  onPress: () => void;
}

export function NotificationBell({ onPress }: NotificationBellProps) {
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <TouchableOpacity onPress={onPress} className="relative p-2" hitSlop={8}>
      <Text className="text-2xl">🔔</Text>
      {unreadCount > 0 && (
        <View className="absolute top-0 right-0 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
          <Text className="text-white text-[10px] font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
