import { View, Text, ActivityIndicator } from "react-native";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: "small" | "large";
  color?: string;
}

export function Loading({
  message,
  fullScreen = false,
  size = "large",
  color = "#22c55e",
}: LoadingProps) {
  if (fullScreen) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={size} color={color} />
        {message && <Text className="text-gray-500 text-sm mt-3">{message}</Text>}
      </View>
    );
  }

  return (
    <View className="items-center justify-center py-8">
      <ActivityIndicator size={size} color={color} />
      {message && <Text className="text-gray-500 text-sm mt-3">{message}</Text>}
    </View>
  );
}
