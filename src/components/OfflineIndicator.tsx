import { View, Text } from "react-native";

interface OfflineIndicatorProps {
  isStale?: boolean;
}

export function OfflineIndicator({ isStale = false }: OfflineIndicatorProps) {
  if (!isStale) return null;

  return (
    <View
      className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex-row items-center"
      accessibilityLabel="Dados possivelmente desatualizados"
      accessibilityRole="alert"
    >
      <Text className="text-yellow-600 text-xs mr-1">⚠️</Text>
      <Text className="text-yellow-700 text-xs flex-1">
        Dados possivelmente desatualizados. Conecte-se para sincronizar.
      </Text>
    </View>
  );
}
