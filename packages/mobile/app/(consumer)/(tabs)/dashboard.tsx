import { View, Text, ScrollView } from "react-native";

export default function ConsumerDashboard() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 gap-4">
        {/* Saldo Card placeholder */}
        <View className="bg-green-600 rounded-2xl p-6">
          <Text className="text-white text-sm">Saldo disponível</Text>
          <Text className="text-white text-3xl font-bold mt-1">R$ 0,00</Text>
          <Text className="text-green-200 text-xs mt-2">
            Sprint 2 — A implementar
          </Text>
        </View>

        {/* Recent transactions placeholder */}
        <View className="bg-white rounded-2xl p-4">
          <Text className="text-lg font-semibold mb-3">
            Últimas transações
          </Text>
          <Text className="text-gray-400 text-center py-8">
            Nenhuma transação ainda
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
