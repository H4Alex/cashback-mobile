import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  useCampanhasList,
  useCreateCampanha,
  useUpdateCampanha,
  useDeleteCampanha,
} from "@/src/hooks/useMerchantManagement";
import { FilterChips } from "@/src/components/FilterChips";
import { EmptyState, Skeleton } from "@/src/components";
import type { CampanhaFull, CreateCampanhaRequest } from "@/src/types/merchant";
import { formatDate } from "@/src/utils/formatters";

const STATUS_FILTERS = [
  { value: "ativa" as const, label: "Ativas" },
  { value: "inativa" as const, label: "Inativas" },
  { value: "expirada" as const, label: "Expiradas" },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  ativa: { bg: "bg-green-100", text: "text-green-700" },
  inativa: { bg: "bg-gray-100", text: "text-gray-600" },
  expirada: { bg: "bg-red-100", text: "text-red-600" },
};

const EMPTY_FORM: CreateCampanhaRequest = {
  nome: "",
  percentual: 0,
  validade_dias: 30,
  data_inicio: new Date().toISOString().split("T")[0],
  data_fim: "",
};

export default function CampanhasScreen() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateCampanhaRequest>(EMPTY_FORM);

  const { data: campanhas, isLoading } = useCampanhasList(statusFilter);
  const createMutation = useCreateCampanha();
  const updateMutation = useUpdateCampanha();
  const deleteMutation = useDeleteCampanha();

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEdit = (c: CampanhaFull) => {
    setEditingId(c.id);
    setForm({
      nome: c.nome,
      percentual: c.percentual,
      validade_dias: c.validade_padrao,
      data_inicio: c.data_inicio,
      data_fim: c.data_fim,
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) {
      Alert.alert("Erro", "Nome é obrigatório.");
      return;
    }
    if (form.percentual <= 0 || form.percentual > 100) {
      Alert.alert("Erro", "Percentual deve ser entre 1 e 100.");
      return;
    }

    if (editingId) {
      await updateMutation.mutateAsync({ id: editingId, data: form });
    } else {
      await createMutation.mutateAsync(form);
    }
    setModalVisible(false);
  };

  const handleDelete = (id: number, nome: string) => {
    Alert.alert("Excluir campanha", `Deseja excluir "${nome}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => deleteMutation.mutate(id),
      },
    ]);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const renderItem = ({ item }: { item: CampanhaFull }) => {
    const colors = STATUS_COLORS[item.status] ?? STATUS_COLORS.inativa;
    return (
      <View className="bg-white mx-4 mb-3 rounded-xl p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-semibold flex-1 mr-2" numberOfLines={1}>
            {item.nome}
          </Text>
          <View className={`rounded-full px-2.5 py-1 ${colors.bg}`}>
            <Text className={`text-xs font-medium ${colors.text}`}>{item.status}</Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-500">Percentual</Text>
          <Text className="text-sm font-medium">{item.percentual}%</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-500">Validade</Text>
          <Text className="text-sm font-medium">{item.validade_padrao} dias</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-sm text-gray-500">Período</Text>
          <Text className="text-sm font-medium">
            {formatDate(item.data_inicio)} - {formatDate(item.data_fim)}
          </Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-500">Transações</Text>
          <Text className="text-sm font-medium">{item.transacoes_count}</Text>
        </View>

        <View className="flex-row gap-2 pt-2 border-t border-gray-100">
          <TouchableOpacity
            className="flex-1 bg-blue-50 rounded-lg py-2 items-center"
            onPress={() => openEdit(item)}
          >
            <Text className="text-blue-600 text-sm font-medium">Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-red-50 rounded-lg py-2 items-center"
            onPress={() => handleDelete(item.id, item.nome)}
          >
            <Text className="text-red-600 text-sm font-medium">Excluir</Text>
          </TouchableOpacity>
        </View>
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
      ) : !campanhas || campanhas.length === 0 ? (
        <EmptyState
          title="Nenhuma campanha"
          message="Crie sua primeira campanha de cashback."
          actionLabel="Nova Campanha"
          onAction={openCreate}
        />
      ) : (
        <FlatList
          data={campanhas}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        />
      )}

      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-green-600 rounded-full items-center justify-center"
        style={{ elevation: 4, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 6 }}
        onPress={openCreate}
        accessibilityLabel="Nova campanha"
      >
        <Text className="text-white text-2xl font-light">+</Text>
      </TouchableOpacity>

      {/* Create/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-end"
        >
          <View className="bg-white rounded-t-2xl p-4" style={{ maxHeight: "80%" }}>
            <Text className="text-lg font-bold mb-4">
              {editingId ? "Editar Campanha" : "Nova Campanha"}
            </Text>

            <Text className="text-sm text-gray-500 mb-1">Nome</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-2 mb-3"
              value={form.nome}
              onChangeText={(t) => setForm((f) => ({ ...f, nome: t }))}
              placeholder="Nome da campanha"
            />

            <Text className="text-sm text-gray-500 mb-1">Percentual (%)</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-2 mb-3"
              value={form.percentual ? String(form.percentual) : ""}
              onChangeText={(t) => setForm((f) => ({ ...f, percentual: Number(t) || 0 }))}
              keyboardType="numeric"
              placeholder="Ex: 5"
            />

            <Text className="text-sm text-gray-500 mb-1">Validade (dias)</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-2 mb-3"
              value={form.validade_dias ? String(form.validade_dias) : ""}
              onChangeText={(t) => setForm((f) => ({ ...f, validade_dias: Number(t) || 0 }))}
              keyboardType="numeric"
              placeholder="Ex: 30"
            />

            <Text className="text-sm text-gray-500 mb-1">Data Fim (YYYY-MM-DD)</Text>
            <TextInput
              className="border border-gray-200 rounded-lg px-3 py-2 mb-4"
              value={form.data_fim}
              onChangeText={(t) => setForm((f) => ({ ...f, data_fim: t }))}
              placeholder="2025-12-31"
            />

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-lg py-3 items-center"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-gray-700 font-medium">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-green-600 rounded-lg py-3 items-center"
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text className="text-white font-medium">Salvar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
