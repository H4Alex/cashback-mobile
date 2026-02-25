import { View, Text } from "react-native";

interface OfflineBannerProps {
  visible: boolean;
}

export function OfflineBanner({ visible }: OfflineBannerProps) {
  if (!visible) return null;

  return (
    <View className="bg-yellow-500 px-4 py-2">
      <Text className="text-yellow-900 text-xs text-center font-medium">
        Sem conexão — exibindo dados em cache
      </Text>
    </View>
  );
}
