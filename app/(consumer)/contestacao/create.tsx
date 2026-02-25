import { View, Text, ScrollView, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useContestacaoCreate } from "@/src/hooks/useContestacao";
import { ContestacaoForm } from "@/src/components/ContestacaoForm";
import type { CreateContestacaoFormData } from "@/src/schemas/contestacao";

export default function CreateContestacaoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    cashback_entry_id: string;
    empresa_nome?: string;
  }>();

  const { mutate, isPending } = useContestacaoCreate();

  const handleSubmit = (data: CreateContestacaoFormData) => {
    mutate(data, {
      onSuccess: () => {
        Alert.alert("Contestação enviada", "Acompanhe o status na lista de contestações.", [
          { text: "OK", onPress: () => router.back() },
        ]);
      },
      onError: () => {
        Alert.alert("Erro", "Não foi possível enviar a contestação. Tente novamente.");
      },
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" keyboardShouldPersistTaps="handled">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold">Nova Contestação</Text>
        {params.empresa_nome && (
          <Text className="text-gray-500 text-sm mt-1">Transação em: {params.empresa_nome}</Text>
        )}
      </View>

      <ContestacaoForm
        cashbackEntryId={params.cashback_entry_id ?? ""}
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </ScrollView>
  );
}
