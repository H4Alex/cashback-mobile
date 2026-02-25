import { useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useExtratoInfinite } from "@/src/hooks/useCashback";
import { useExtratoFilters } from "@/src/hooks/useExtratoFilters";
import { useRefreshOnFocus } from "@/src/hooks";
import { EmptyState, SkeletonTransaction } from "@/src/components";
import { TransactionCard } from "@/src/components/TransactionCard";
import { FilterChips } from "@/src/components/FilterChips";
import type { CashbackStatus, CashbackEntry } from "@/src/types";

const STATUS_OPTIONS: { value: CashbackStatus; label: string }[] = [
  { value: "creditado", label: "Creditado" },
  { value: "pendente", label: "Pendente" },
  { value: "resgatado", label: "Resgatado" },
  { value: "expirado", label: "Expirado" },
  { value: "processando", label: "Processando" },
];

export default function ExtratoScreen() {
  const router = useRouter();
  const { filters, setStatus, clearFilters, hasActiveFilters } = useExtratoFilters();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useExtratoInfinite(filters);

  const allEntries = data?.pages.flatMap((p) => p.extrato) ?? [];

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  useRefreshOnFocus(handleRefresh);

  const handleEntryPress = (entry: CashbackEntry) => {
    router.push({
      pathname: "/(consumer)/contestacao/create",
      params: { cashback_entry_id: entry.id, empresa_nome: entry.empresa_nome },
    });
  };

  const ListHeader = () => (
    <View>
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold">Extrato</Text>
        <Text className="text-gray-500 text-sm mt-1">Todas as suas movimentações de cashback</Text>
      </View>

      <FilterChips options={STATUS_OPTIONS} selected={filters.status} onSelect={setStatus} />

      {hasActiveFilters && (
        <TouchableOpacity className="px-4 pb-2" onPress={clearFilters}>
          <Text className="text-blue-600 text-sm">Limpar filtros</Text>
        </TouchableOpacity>
      )}

      {isLoading && (
        <View>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonTransaction key={i} />
          ))}
        </View>
      )}
    </View>
  );

  if (!isLoading && allEntries.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <ListHeader />
        <EmptyState
          title={hasActiveFilters ? "Nenhum resultado" : "Sem transações"}
          message={
            hasActiveFilters
              ? "Tente alterar os filtros para ver mais resultados."
              : "Suas transações de cashback aparecerão aqui."
          }
          actionLabel={hasActiveFilters ? "Limpar filtros" : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-gray-50"
      data={allEntries}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TransactionCard entry={item} onPress={() => handleEntryPress(item)} />
      )}
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
