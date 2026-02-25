import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEmpresaConfig, useUpdateConfig } from "@/src/hooks/useMerchantManagement";
import { Skeleton } from "@/src/components";

export default function ConfigScreen() {
  const { data: config, isLoading } = useEmpresaConfig();
  const updateMutation = useUpdateConfig();

  const [form, setForm] = useState({
    telefone: "",
    email: "",
    percentual_cashback: 0,
    validade_cashback: 0,
    max_utilizacao: 0,
  });

  useEffect(() => {
    if (config) {
      setForm({
        telefone: config.telefone,
        email: config.email,
        percentual_cashback: config.percentual_cashback,
        validade_cashback: config.validade_cashback,
        max_utilizacao: config.max_utilizacao,
      });
    }
  }, [config]);

  const handleSave = () => {
    updateMutation.mutate(form, {
      onSuccess: () => Alert.alert("Sucesso", "Configurações atualizadas."),
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 px-4 pt-4">
        <Skeleton />
      </View>
    );
  }

  if (!config) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-8">
        <Text className="text-lg font-bold text-gray-700">Erro ao carregar configurações</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Company info (read-only) */}
      <View className="mx-4 mt-4 bg-white rounded-xl p-4">
        <Text className="text-base font-semibold mb-3">Dados da Empresa</Text>
        <ReadOnlyRow label="Nome Fantasia" value={config.nome_fantasia} />
        <ReadOnlyRow label="CNPJ" value={config.cnpj} />
        <ReadOnlyRow label="Plano" value={`${config.plano} (${config.plano_status})`} />
        {config.proxima_cobranca && (
          <ReadOnlyRow label="Próxima cobrança" value={config.proxima_cobranca} />
        )}
      </View>

      {/* Editable fields */}
      <View className="mx-4 mt-4 bg-white rounded-xl p-4">
        <Text className="text-base font-semibold mb-3">Contato</Text>

        <Text className="text-sm text-gray-500 mb-1">Telefone</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-3"
          value={form.telefone}
          onChangeText={(t) => setForm((f) => ({ ...f, telefone: t }))}
          keyboardType="phone-pad"
        />

        <Text className="text-sm text-gray-500 mb-1">E-mail</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2"
          value={form.email}
          onChangeText={(t) => setForm((f) => ({ ...f, email: t }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View className="mx-4 mt-4 bg-white rounded-xl p-4">
        <Text className="text-base font-semibold mb-3">Regras de Cashback</Text>

        <Text className="text-sm text-gray-500 mb-1">Percentual Cashback (%)</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-3"
          value={form.percentual_cashback ? String(form.percentual_cashback) : ""}
          onChangeText={(t) => setForm((f) => ({ ...f, percentual_cashback: Number(t) || 0 }))}
          keyboardType="numeric"
        />

        <Text className="text-sm text-gray-500 mb-1">Validade Cashback (dias)</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2 mb-3"
          value={form.validade_cashback ? String(form.validade_cashback) : ""}
          onChangeText={(t) => setForm((f) => ({ ...f, validade_cashback: Number(t) || 0 }))}
          keyboardType="numeric"
        />

        <Text className="text-sm text-gray-500 mb-1">Máx. Utilização (%)</Text>
        <TextInput
          className="border border-gray-200 rounded-lg px-3 py-2"
          value={form.max_utilizacao ? String(form.max_utilizacao) : ""}
          onChangeText={(t) => setForm((f) => ({ ...f, max_utilizacao: Number(t) || 0 }))}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity
        className="mx-4 mt-4 bg-green-600 rounded-xl py-4 items-center"
        onPress={handleSave}
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">Salvar Configurações</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2 border-b border-gray-50">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-medium">{value}</Text>
    </View>
  );
}
