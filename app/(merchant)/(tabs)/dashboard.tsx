import { useState } from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDashboardStats,
  useDashboardTransacoes,
  useDashboardTopClientes,
} from "@/src/hooks/useMerchantManagement";
import { StatsCard } from "@/src/components/StatsCard";
import { EmptyState, Skeleton } from "@/src/components";
import { formatCurrency } from "@/src/utils/formatters";

const TIPO_COLORS: Record<string, string> = {
  gerado: "text-green-600",
  utilizado: "text-purple-600",
  cancelado: "text-yellow-600",
};

const TIPO_PREFIX: Record<string, string> = {
  gerado: "+",
  utilizado: "-",
  cancelado: "~",
};

export default function MerchantDashboardScreen() {
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { data: stats, isLoading: loadingStats } = useDashboardStats();
  const { data: transacoes, isLoading: loadingTx } = useDashboardTransacoes();
  const { data: topClientes, isLoading: loadingTop } = useDashboardTopClientes();

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["merchant", "dashboard"] });
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Stats cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 pt-4 pb-2">
        {loadingStats ? (
          <>
            <View className="w-36 h-24 bg-gray-200 rounded-xl mr-3" />
            <View className="w-36 h-24 bg-gray-200 rounded-xl mr-3" />
            <View className="w-36 h-24 bg-gray-200 rounded-xl" />
          </>
        ) : stats ? (
          <>
            <StatsCard
              label="Total Cashback"
              value={stats.total_cashback}
              variacao={stats.variacao_cashback}
            />
            <StatsCard
              label="Creditado"
              value={stats.total_creditado}
              variacao={stats.variacao_creditado}
            />
            <StatsCard
              label="Resgatado"
              value={stats.total_resgatado}
              variacao={stats.variacao_resgatado}
            />
          </>
        ) : null}
      </ScrollView>

      {/* Chart placeholder */}
      <View className="mx-4 mt-4 bg-white rounded-xl p-4" style={{ height: 180 }}>
        <Text className="text-sm font-semibold text-gray-700 mb-2">Evolução 7 dias</Text>
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 text-sm">Gráfico disponível com react-native-svg</Text>
          <View className="flex-row mt-2 gap-4">
            <View className="flex-row items-center">
              <View className="w-3 h-0.5 bg-green-500 mr-1" />
              <Text className="text-xs text-gray-500">Gerado</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-0.5 bg-purple-500 mr-1" />
              <Text className="text-xs text-gray-500">Utilizado</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Últimas transações */}
      <View className="mx-4 mt-4">
        <Text className="text-base font-semibold mb-2">Últimas Transações</Text>
        {loadingTx ? (
          <Skeleton />
        ) : !transacoes || transacoes.length === 0 ? (
          <EmptyState title="Nenhuma transação" message="Gere seu primeiro cashback!" />
        ) : (
          <View className="bg-white rounded-xl overflow-hidden">
            {transacoes.slice(0, 5).map((tx, i) => (
              <View
                key={tx.id}
                className={`flex-row items-center px-4 py-3 ${i < Math.min(transacoes.length, 5) - 1 ? "border-b border-gray-100" : ""}`}
              >
                <View className="flex-1">
                  <Text className="text-sm font-medium">{tx.cliente_nome}</Text>
                  <Text className="text-xs text-gray-400">
                    {new Date(tx.created_at).toLocaleDateString("pt-BR")}
                  </Text>
                </View>
                <Text className={`font-bold text-sm ${TIPO_COLORS[tx.tipo] ?? "text-gray-600"}`}>
                  {TIPO_PREFIX[tx.tipo] ?? ""}
                  {formatCurrency(tx.valor)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Top clientes */}
      <View className="mx-4 mt-4 mb-8">
        <Text className="text-base font-semibold mb-2">Top Clientes</Text>
        {loadingTop ? (
          <Skeleton />
        ) : !topClientes || topClientes.length === 0 ? (
          <EmptyState title="Nenhum cliente" message="Seus top clientes aparecerão aqui." />
        ) : (
          <View className="bg-white rounded-xl overflow-hidden">
            {topClientes.slice(0, 3).map((c, i) => (
              <View
                key={c.id}
                className={`flex-row items-center px-4 py-3 ${i < Math.min(topClientes.length, 3) - 1 ? "border-b border-gray-100" : ""}`}
              >
                <View className="w-7 h-7 bg-blue-100 rounded-full items-center justify-center mr-3">
                  <Text className="text-blue-700 text-xs font-bold">{i + 1}</Text>
                </View>
                <Text className="flex-1 text-sm font-medium">{c.nome}</Text>
                <Text className="font-bold text-sm text-green-600">
                  {formatCurrency(c.saldo_total)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
