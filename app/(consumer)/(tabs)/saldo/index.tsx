import { useCallback } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useSaldo, useExtrato, useRefreshOnFocus } from "@/src/hooks";
import { SaldoCard, EmptyState, SkeletonCard, SkeletonTransaction } from "@/src/components";
import type { EmpresaSaldo, ExtratoEntry } from "@/src/types";
import { formatCurrency, formatDate } from "@/src/utils/formatters";

function EmpresaRow({ empresa }: { empresa: EmpresaSaldo }) {
  const displayName = empresa.nome_fantasia ?? "Empresa";
  return (
    <View className="flex-row items-center py-3 px-4 border-b border-gray-100">
      <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
        <Text className="text-base font-bold text-blue-600">
          {displayName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-medium">{displayName}</Text>
      </View>
      <Text className="text-green-600 font-semibold">{formatCurrency(Number(empresa.saldo))}</Text>
    </View>
  );
}

function TransactionRow({ entry }: { entry: ExtratoEntry }) {
  const isNegative = entry.status_cashback === "expirado" || entry.status_cashback === "utilizado";
  return (
    <View className="flex-row items-center py-3 px-4 border-b border-gray-100">
      <View className="flex-1">
        <Text className="text-sm font-medium">{entry.empresa?.nome_fantasia ?? "Empresa"}</Text>
        <Text className="text-gray-400 text-xs mt-0.5">{formatDate(entry.created_at)}</Text>
      </View>
      <Text className={`font-semibold ${isNegative ? "text-gray-400" : "text-green-600"}`}>
        {isNegative ? "-" : "+"}
        {formatCurrency(entry.valor_cashback)}
      </Text>
    </View>
  );
}

export default function SaldoDetailScreen() {
  const { data: saldo, isLoading: saldoLoading, refetch: refetchSaldo } = useSaldo();
  const {
    data: extratoData,
    isLoading: extratoLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchExtrato,
  } = useExtrato();

  const allEntries = extratoData?.pages.flatMap((p) => p.data) ?? [];

  const handleRefresh = useCallback(() => {
    refetchSaldo();
    refetchExtrato();
  }, [refetchSaldo, refetchExtrato]);

  useRefreshOnFocus(handleRefresh);

  const ListHeader = () => (
    <>
      {/* Saldo card */}
      {saldoLoading ? (
        <View className="mx-4 mt-2">
          <SkeletonCard />
        </View>
      ) : saldo ? (
        <SaldoCard saldo={saldo} />
      ) : null}

      {/* Empresas breakdown */}
      {saldo && saldo.por_empresa.length > 0 && (
        <View className="mt-6">
          <Text className="text-lg font-bold px-4 mb-2">Saldo por empresa</Text>
          {saldo.por_empresa.map((e) => (
            <EmpresaRow key={e.empresa_id} empresa={e} />
          ))}
        </View>
      )}

      {/* Extrato header */}
      <Text className="text-lg font-bold px-4 mt-6 mb-2">Extrato completo</Text>

      {extratoLoading && (
        <View>
          {[1, 2, 3, 4].map((i) => (
            <SkeletonTransaction key={i} />
          ))}
        </View>
      )}
    </>
  );

  if (!extratoLoading && allEntries.length === 0) {
    return (
      <View className="flex-1 bg-gray-50">
        <ListHeader />
        <EmptyState title="Sem movimentações" message="Seu extrato de cashback aparecerá aqui." />
      </View>
    );
  }

  return (
    <FlatList
      className="flex-1 bg-gray-50"
      data={allEntries}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <TransactionRow entry={item} />}
      ListHeaderComponent={ListHeader}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator className="py-4" /> : null}
    />
  );
}
