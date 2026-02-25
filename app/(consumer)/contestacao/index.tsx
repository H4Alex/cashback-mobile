import { useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useContestacoes } from "@/src/hooks/useContestacao";
import { useRefreshOnFocus } from "@/src/hooks";
import { EmptyState, SkeletonTransaction } from "@/src/components";
import { StatusBadge } from "@/src/components/StatusBadge";
import { formatCurrency, formatDate } from "@/src/utils/formatters";
import type { Contestacao } from "@/src/types/contestacao";

function ContestacaoRow({ item }: { item: Contestacao }) {
  const tipoLabels: Record<string, string> = {
    valor_incorreto: "Valor incorreto",
    cashback_nao_creditado: "Cashback não creditado",
    empresa_errada: "Empresa errada",
    outro: "Outro",
  };

  return (
    <View
      className="bg-white rounded-xl p-4 mx-4 mb-3"
      style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold">{item.empresa_nome}</Text>
          <Text className="text-gray-500 text-xs mt-0.5">{tipoLabels[item.tipo] ?? item.tipo}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <Text className="text-gray-600 text-sm" numberOfLines={2}>
        {item.descricao}
      </Text>

      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <Text className="text-gray-400 text-xs">{formatDate(item.created_at)}</Text>
        <Text className="text-sm font-medium text-gray-700">{formatCurrency(item.valor)}</Text>
      </View>

      {item.resposta && (
        <View className="bg-gray-50 rounded-lg p-3 mt-3">
          <Text className="text-xs font-medium text-gray-500 mb-1">Resposta:</Text>
          <Text className="text-sm text-gray-700">{item.resposta}</Text>
        </View>
      )}
    </View>
  );
}

export default function ContestacaoListScreen() {
  const router = useRouter();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useContestacoes();

  const allItems = data?.pages.flatMap((p) => p.contestacoes) ?? [];

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  useRefreshOnFocus(handleRefresh);

  const ListHeader = () => (
    <View className="px-4 pt-4 pb-4 flex-row items-center justify-between">
      <View>
        <Text className="text-2xl font-bold">Contestações</Text>
        <Text className="text-gray-500 text-sm mt-1">Acompanhe suas contestações</Text>
      </View>
      <TouchableOpacity
        className="bg-blue-600 rounded-lg px-4 py-2"
        onPress={() => router.push("/(consumer)/contestacao/create")}
      >
        <Text className="text-white font-semibold text-sm">Nova</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50">
        <ListHeader />
        {[1, 2, 3].map((i) => (
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
          title="Sem contestações"
          message="Você não tem nenhuma contestação registrada."
        />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-gray-50"
      data={allItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ContestacaoRow item={item} />}
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
