import { View, Text, TouchableOpacity } from "react-native";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12">
      <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
        <Text className="text-3xl">📭</Text>
      </View>
      <Text className="text-xl font-bold text-gray-800 mb-2 text-center">{title}</Text>
      <Text className="text-gray-500 text-center mb-6">{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity className="bg-blue-600 rounded-lg px-6 py-3" onPress={onAction}>
          <Text className="text-white font-semibold">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
