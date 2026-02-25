import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useClienteSearchDebounced } from "@/src/hooks/useMerchantManagement";
import { SearchBar } from "@/src/components/SearchBar";
import { EmptyState, Skeleton } from "@/src/components";
import { formatCurrency, formatCPF } from "@/src/utils/formatters";
import type { ClienteDetail } from "@/src/types/merchant";

export default function ClientesScreen() {
  const router = useRouter();
  const { search, setSearch, page, setPage, query } = useClienteSearchDebounced();
  const { data, isLoading, isFetching } = query;

  const clientes = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.total_pages ?? 1;

  const renderItem = ({ item }: { item: ClienteDetail }) => (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 bg-white border-b border-gray-100"
      onPress={() => router.push(`/(merchant)/(tabs)/clientes/${item.id}`)}
      accessibilityLabel={`Cliente ${item.nome}`}
    >
      <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
        <Text className="text-blue-700 font-bold">{item.nome.charAt(0).toUpperCase()}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium">{item.nome}</Text>
        <Text className="text-xs text-gray-400">{formatCPF(item.cpf)}</Text>
      </View>
      <View className="items-end">
        <Text className="text-sm font-bold text-green-600">{formatCurrency(item.saldo)}</Text>
        <Text className="text-xs text-gray-400">{item.cashbacks_ativos} ativos</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2">
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nome ou CPF..."
        />
      </View>

      {search && (
        <Text className="px-4 text-xs text-gray-400 mb-1">
          {total} resultado{total !== 1 ? "s" : ""}
        </Text>
      )}

      {isLoading ? (
        <View className="px-4">
          <Skeleton />
        </View>
      ) : clientes.length === 0 ? (
        <EmptyState
          title="Nenhum cliente"
          message={search ? "Nenhum resultado para sua busca." : "Seus clientes aparecerão aqui."}
        />
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
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

      {isFetching && !isLoading && (
        <View className="absolute top-16 right-4">
          <ActivityIndicator size="small" color="#3b82f6" />
        </View>
      )}
    </View>
  );
}
