import { View, Text } from "react-native";

export default function ClientesPlaceholderScreen() {
  return (
    <View className="flex-1 bg-gray-50 items-center justify-center px-8">
      <Text className="text-4xl mb-4">👥</Text>
      <Text className="text-xl font-bold text-center">Clientes</Text>
      <Text className="text-gray-500 text-center mt-2">
        Listagem de clientes com busca e detalhe será implementada no Sprint 7.
      </Text>
    </View>
  );
}
