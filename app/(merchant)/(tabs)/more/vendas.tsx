import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useVendas } from "@/src/hooks/useMerchantManagement";
import { FilterChips } from "@/src/components/FilterChips";
import { EmptyState, Skeleton } from "@/src/components";
import { formatCurrency, formatDateTime } from "@/src/utils/formatters";
import type { VendaResource } from "@/src/types/merchant";

const STATUS_FILTERS = [
  { value: "confirmado" as const, label: "Confirmadas" },
  { value: "pendente" as const, label: "Pendentes" },
  { value: "cancelado" as const, label: "Canceladas" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  confirmado: { bg: "bg-green-100", text: "text-green-700" },
  pendente: { bg: "bg-yellow-100", text: "text-yellow-700" },
  cancelado: { bg: "bg-red-100", text: "text-red-600" },
};

export default function VendasScreen() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useVendas({ page, status: statusFilter });
  const vendas = data?.data ?? [];
  const totalPages = data?.total_pages ?? 1;

  const renderItem = ({ item }: { item: VendaResource }) => {
    const colors = STATUS_COLORS[item.status] ?? STATUS_COLORS.pendente;
    return (
      <View className="bg-white mx-4 mb-3 rounded-xl p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-semibold flex-1 mr-2" numberOfLines={1}>
            {item.cliente_nome}
          </Text>
          <View className={`rounded-full px-2.5 py-1 ${colors.bg}`}>
            <Text className={`text-xs font-medium ${colors.text}`}>{item.status}</Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-500">Valor compra</Text>
          <Text className="text-sm font-medium">{formatCurrency(item.valor_compra)}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-500">Cashback</Text>
          <Text className="text-sm font-medium text-green-600">
            {formatCurrency(item.valor_cashback)}
          </Text>
        </View>
        <Text className="text-xs text-gray-400 mt-1">{formatDateTime(item.created_at)}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FilterChips
        options={STATUS_FILTERS}
        selected={statusFilter}
        onSelect={(v) => {
          setStatusFilter(v);
          setPage(1);
        }}
      />

      {isLoading ? (
        <View className="px-4">
          <Skeleton />
        </View>
      ) : vendas.length === 0 ? (
        <EmptyState title="Nenhuma venda" message="Suas vendas aparecerão aqui." />
      ) : (
        <FlatList
          data={vendas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
          ListFooterComponent={
            totalPages > 1 ? (
              <View className="flex-row justify-center items-center py-4 gap-4">
                <TouchableOpacity
                  disabled={page <= 1}
                  onPress={() => setPage(page - 1)}
                  className={`px-4 py-2 rounded-lg ${page <= 1 ? "bg-gray-100" : "bg-blue-600"}`}
                >
                  <Text className={page <= 1 ? "text-gray-400" : "text-white"}>Anterior</Text>
                </TouchableOpacity>
                <Text className="text-sm text-gray-500">
                  {page} / {totalPages}
                </Text>
                <TouchableOpacity
                  disabled={page >= totalPages}
                  onPress={() => setPage(page + 1)}
                  className={`px-4 py-2 rounded-lg ${page >= totalPages ? "bg-gray-100" : "bg-blue-600"}`}
                >
                  <Text className={page >= totalPages ? "text-gray-400" : "text-white"}>
                    Próxima
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}
