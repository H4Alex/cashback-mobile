import { useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useHistorico } from "@/src/hooks/useHistorico";
import { useRefreshOnFocus } from "@/src/hooks";
import { EmptyState, SkeletonTransaction } from "@/src/components";
import { formatCurrency, formatDateTime } from "@/src/utils/formatters";
import type { HistoricoUso } from "@/src/types/historico";

function HistoricoRow({ item }: { item: HistoricoUso }) {
  return (
    <View
      className="bg-white rounded-xl p-4 mx-4 mb-3"
      style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center flex-1 mr-3">
          <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-2">
            <Text className="text-sm font-bold text-purple-600">
              {item.empresa_nome.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold" numberOfLines={1}>
              {item.empresa_nome}
            </Text>
            {item.descricao && (
              <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>
                {item.descricao}
              </Text>
            )}
          </View>
        </View>
        <View className="items-end">
          <Text className="text-sm text-gray-500">
            Compra: {formatCurrency(item.valor_original)}
          </Text>
          <Text className="text-base font-bold text-green-600">
            -{formatCurrency(item.cashback_usado)}
          </Text>
        </View>
      </View>
      <Text className="text-gray-400 text-xs mt-2 ml-10">{formatDateTime(item.created_at)}</Text>
    </View>
  );
}

export default function HistoricoScreen() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useHistorico();

  const allItems = data?.pages.flatMap((p) => p.historico) ?? [];

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  useRefreshOnFocus(handleRefresh);

  const ListHeader = () => (
    <View className="px-4 pt-4 pb-4">
      <Text className="text-2xl font-bold">Histórico de Uso</Text>
      <Text className="text-gray-500 text-sm mt-1">Suas utilizações de cashback em compras</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50">
        <ListHeader />
        {[1, 2, 3, 4].map((i) => (
          <SkeletonTransaction key={i} />
        ))}
      </View>
    );
  }

  if (allItems.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <ListHeader />
        <EmptyState
          title="Sem utilizações"
          message="Quando você usar cashback em compras, o histórico aparecerá aqui."
        />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-gray-50"
      data={allItems}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <HistoricoRow item={item} />}
      ListHeaderComponent={ListHeader}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <ActivityIndicator className="py-4" /> : <View className="h-4" />
      }
    />
  );
}
