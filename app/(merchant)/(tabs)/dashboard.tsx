import { View, Text } from "react-native";
import { useMultilojaStore } from "@/src/stores/multiloja.store";

export default function MerchantDashboardScreen() {
  const empresaAtiva = useMultilojaStore((s) => s.empresaAtiva);

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center px-8">
      <Text className="text-4xl mb-4">📊</Text>
      <Text className="text-xl font-bold text-center">
        {empresaAtiva?.nome_fantasia ?? "Dashboard"}
      </Text>
      <Text className="text-gray-500 text-center mt-2">
        Dashboard completo do lojista com métricas, gráfico e top clientes será implementado no
        Sprint 7.
      </Text>
    </View>
  );
}
