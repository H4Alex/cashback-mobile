import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useClienteDetail } from "@/src/hooks/useMerchantManagement";
import { MetricCard } from "@/src/components/MetricCard";
import { formatCPF, formatDate } from "@/src/utils/formatters";

export default function ClienteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clienteId = Number(id) || 0;
  const { data: cliente, isLoading, error } = useClienteDetail(clienteId);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error || !cliente) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-8">
        <Text className="text-lg font-bold text-gray-700 mb-2">Cliente não encontrado</Text>
        <Text className="text-gray-400 text-center">
          Não foi possível carregar os dados deste cliente.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-6 pb-4 items-center">
        <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-3">
          <Text className="text-blue-700 text-2xl font-bold">
            {cliente.nome.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="text-lg font-bold">{cliente.nome}</Text>
        <Text className="text-sm text-gray-400">{formatCPF(cliente.cpf)}</Text>
        {cliente.email && <Text className="text-sm text-gray-400 mt-1">{cliente.email}</Text>}
        {cliente.telefone && (
          <Text className="text-sm text-gray-400 mt-0.5">{cliente.telefone}</Text>
        )}
      </View>

      {/* Metrics */}
      <View className="px-4 mt-4">
        <MetricCard label="Saldo Atual" value={cliente.saldo} />
        <MetricCard label="Cashbacks Ativos" value={cliente.cashbacks_ativos} isCurrency={false} />
      </View>

      {/* Info */}
      <View className="mx-4 mt-2 bg-white rounded-xl p-4">
        <Text className="text-sm font-semibold text-gray-700 mb-3">Informações</Text>
        <InfoRow label="Cliente desde" value={formatDate(cliente.created_at)} />
        <InfoRow label="ID" value={String(cliente.id)} />
      </View>

      <View className="h-8" />
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2 border-b border-gray-50">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-medium">{value}</Text>
    </View>
  );
}
