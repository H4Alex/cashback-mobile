import { View, Text, TouchableOpacity } from "react-native";

interface PermissionRequestProps {
  icon: string;
  title: string;
  description: string;
  buttonLabel: string;
  onRequest: () => void;
}

export function PermissionRequest({
  icon,
  title,
  description,
  buttonLabel,
  onRequest,
}: PermissionRequestProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="text-6xl mb-6">{icon}</Text>
      <Text className="text-xl font-bold text-center mb-2">{title}</Text>
      <Text className="text-gray-500 text-center mb-8">{description}</Text>
      <TouchableOpacity className="bg-blue-600 rounded-xl py-4 px-10" onPress={onRequest}>
        <Text className="text-white font-semibold text-base">{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
