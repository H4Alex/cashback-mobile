import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useContestacoesMerchant, useResolveContestacao } from "@/src/hooks/useMerchantManagement";
import { FilterChips } from "@/src/components/FilterChips";
import { EmptyState, Skeleton } from "@/src/components";
import { formatDate } from "@/src/utils/formatters";
import type { ContestacaoMerchant } from "@/src/types/merchant";

const STATUS_FILTERS = [
  { value: "pendente" as const, label: "Pendentes" },
  { value: "aprovada" as const, label: "Aprovadas" },
  { value: "rejeitada" as const, label: "Rejeitadas" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pendente: { bg: "bg-yellow-100", text: "text-yellow-700" },
  aprovada: { bg: "bg-green-100", text: "text-green-700" },
  rejeitada: { bg: "bg-red-100", text: "text-red-600" },
};

export default function ContestacoesMerchantScreen() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>("pendente");
  const [resolveModal, setResolveModal] = useState<ContestacaoMerchant | null>(null);
  const [resposta, setResposta] = useState("");

  const { data: contestacoes, isLoading } = useContestacoesMerchant(statusFilter);
  const resolveMutation = useResolveContestacao();

  const handleResolve = (status: "aprovada" | "rejeitada") => {
    if (!resolveModal) return;
    if (!resposta.trim()) {
      Alert.alert("Erro", "Informe uma resposta.");
      return;
    }

    resolveMutation.mutate(
      { id: resolveModal.id, data: { status, resposta: resposta.trim() } },
      {
        onSuccess: () => {
          setResolveModal(null);
          setResposta("");
        },
      },
    );
  };

  const renderItem = ({ item }: { item: ContestacaoMerchant }) => {
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

        <Text className="text-xs text-gray-400 mb-1">{item.tipo}</Text>
        <Text className="text-sm text-gray-700 mb-2">{item.descricao}</Text>

        {item.resposta && (
          <View className="bg-gray-50 rounded-lg p-2 mb-2">
            <Text className="text-xs text-gray-500">Resposta:</Text>
            <Text className="text-sm">{item.resposta}</Text>
          </View>
        )}

        <Text className="text-xs text-gray-400">{formatDate(item.created_at)}</Text>

        {item.status === "pendente" && (
          <TouchableOpacity
            className="mt-3 bg-blue-50 rounded-lg py-2 items-center"
            onPress={() => {
              setResolveModal(item);
              setResposta("");
            }}
          >
            <Text className="text-blue-600 text-sm font-medium">Responder</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FilterChips options={STATUS_FILTERS} selected={statusFilter} onSelect={setStatusFilter} />

      {isLoading ? (
        <View className="px-4">
          <Skeleton />
        </View>
      ) : !contestacoes || contestacoes.length === 0 ? (
        <EmptyState
          title="Nenhuma contestação"
          message="Contestações dos clientes aparecerão aqui."
        />
      ) : (
        <FlatList
          data={contestacoes}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        />
      )}

      {/* Resolve Modal */}
      <Modal visible={resolveModal !== null} animationType="slide" transparent>
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-2xl p-4">
            <Text className="text-lg font-bold mb-2">Responder Contestação</Text>
            {resolveModal && (
              <Text className="text-sm text-gray-500 mb-3">{resolveModal.descricao}</Text>
            )}

            <Text className="text-sm text-gray-500 mb-1">Resposta</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
              value={resposta}
              onChangeText={setResposta}
              placeholder="Escreva sua resposta..."
              multiline
              numberOfLines={3}
              style={{ minHeight: 80, textAlignVertical: "top" }}
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-lg py-3 items-center"
                onPress={() => setResolveModal(null)}
              >
                <Text className="text-gray-700 font-medium">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-red-100 rounded-lg py-3 items-center"
                onPress={() => handleResolve("rejeitada")}
                disabled={resolveMutation.isPending}
              >
                <Text className="text-red-700 font-medium">Rejeitar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-green-600 rounded-lg py-3 items-center"
                onPress={() => handleResolve("aprovada")}
                disabled={resolveMutation.isPending}
              >
                {resolveMutation.isPending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-medium">Aprovar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
