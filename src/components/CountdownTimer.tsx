import { View, Text } from "react-native";
import { useCountdown } from "@/src/hooks/useCountdown";

interface CountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
}

export function CountdownTimer({ expiresAt, onExpire }: CountdownTimerProps) {
  const { formatted, isUrgent, isExpired } = useCountdown({ expiresAt, onExpire });

  if (isExpired) {
    return (
      <View className="items-center py-2">
        <Text className="text-red-500 font-bold text-lg">Expirado</Text>
      </View>
    );
  }

  return (
    <View className="items-center py-2">
      <Text className="text-gray-500 text-xs">Expira em</Text>
      <Text className={`text-3xl font-bold ${isUrgent ? "text-red-500" : "text-blue-600"}`}>
        {formatted}
      </Text>
    </View>
  );
}
