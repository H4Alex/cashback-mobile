import { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useClienteSearch, useCampanhas, useCashbackCreate } from "@/src/hooks/useMerchant";
import { CPFSearchInput } from "@/src/components/CPFSearchInput";
import { CashbackConfirmation, makeConfirmationItems } from "@/src/components/CashbackConfirmation";
import type { Campanha } from "@/src/types/merchant";
import { formatCurrency } from "@/src/utils/formatters";

type Step = "form" | "confirm" | "success";

export default function GerarCashbackScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [valor, setValor] = useState("");
  const [selectedCampanha, setSelectedCampanha] = useState<Campanha | null>(null);

  const {
    cpf,
    setCpf,
    query: clienteQuery,
    selectedCliente,
    selectCliente,
    reset: resetCliente,
  } = useClienteSearch();
  const { data: campanhas } = useCampanhas();
  const { mutate: gerar, isPending, data: result } = useCashbackCreate();

  const valorNum = parseFloat(valor) || 0;
  const percentual = selectedCampanha?.percentual ?? 5;
  const cashbackValor = valorNum * (percentual / 100);

  const canConfirm = selectedCliente && valorNum > 0;

  const handleConfirm = () => {
    if (!selectedCliente) return;

    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    gerar(
      {
        data: {
          cliente_id: selectedCliente.id,
          valor: valorNum,
          campanha_id: selectedCampanha?.id,
        },
        idempotencyKey,
      },
      {
        onSuccess: () => setStep("success"),
        onError: () => Alert.alert("Erro", "Não foi possível gerar o cashback. Tente novamente."),
      },
    );
  };

  const handleReset = () => {
    setStep("form");
    setValor("");
    setSelectedCampanha(null);
    resetCliente();
  };

  if (step === "success" && result) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-8">
        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
          <Text className="text-4xl">✓</Text>
        </View>
        <Text className="text-2xl font-bold mb-2">Cashback gerado!</Text>
        <Text className="text-green-600 text-xl font-bold mb-1">
          {formatCurrency(result.cashback_gerado)}
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          para {result.cliente_nome}
          {"\n"}Confirma em ~24h
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text
              className="text-blue-600 font-semibold text-center py-3 bg-blue-50 rounded-xl"
              onPress={handleReset}
            >
              Gerar outro
            </Text>
          </View>
          <View className="flex-1">
            <Text
              className="text-gray-600 font-semibold text-center py-3 bg-gray-100 rounded-xl"
              onPress={() => router.back()}
            >
              Voltar
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (step === "confirm") {
    return (
      <View className="flex-1 bg-gray-50 justify-center">
        <CashbackConfirmation
          title="Confirmar Cashback"
          items={makeConfirmationItems([
            { label: "Valor da compra", value: valorNum },
            { label: "Percentual", value: percentual },
            { label: "Cashback", value: cashbackValor, highlight: true },
          ])}
          confirmLabel="GERAR CASHBACK"
          onConfirm={handleConfirm}
          onCancel={() => setStep("form")}
          isPending={isPending}
        />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" keyboardShouldPersistTaps="handled">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold">Gerar Cashback</Text>
      </View>

      <View className="px-4 mt-4">
        <CPFSearchInput
          cpf={cpf}
          onChangeCpf={setCpf}
          isSearching={clienteQuery.isLoading}
          results={clienteQuery.data}
          selectedCliente={selectedCliente}
          onSelectCliente={selectCliente}
        />
      </View>

      {selectedCliente && (
        <>
          {/* Valor */}
          <View className="px-4 mt-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Valor da compra</Text>
            <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4">
              <Text className="text-gray-400 text-base mr-1">R$</Text>
              <TextInput
                className="flex-1 py-3 text-base"
                placeholder="0,00"
                placeholderTextColor="#9ca3af"
                value={valor}
                onChangeText={setValor}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Campanha */}
          {campanhas && campanhas.length > 0 && (
            <View className="px-4 mt-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Campanha (opcional)</Text>
              <View className="gap-2">
                {campanhas.map((c) => {
                  const isSelected = selectedCampanha?.id === c.id;
                  return (
                    <Text
                      key={c.id}
                      className={`px-4 py-3 rounded-xl border text-sm ${
                        isSelected
                          ? "bg-blue-50 border-blue-300 text-blue-700 font-medium"
                          : "bg-white border-gray-200 text-gray-700"
                      }`}
                      onPress={() => setSelectedCampanha(isSelected ? null : c)}
                    >
                      {c.nome} ({c.percentual}%)
                    </Text>
                  );
                })}
              </View>
            </View>
          )}

          {/* Summary */}
          {valorNum > 0 && (
            <View className="mx-4 mt-6 bg-gray-100 rounded-xl p-4">
              <Text className="text-sm font-semibold mb-2">Resumo</Text>
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600 text-sm">Valor compra</Text>
                <Text className="text-sm">{formatCurrency(valorNum)}</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600 text-sm">Percentual</Text>
                <Text className="text-sm">{percentual}%</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-sm font-medium">Cashback</Text>
                <Text className="text-green-600 font-bold">{formatCurrency(cashbackValor)}</Text>
              </View>
            </View>
          )}

          {/* Submit */}
          <View className="px-4 mt-6 mb-8">
            <Text
              className={`text-center py-4 rounded-xl font-semibold text-base ${
                canConfirm ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
              }`}
              onPress={() => canConfirm && setStep("confirm")}
            >
              GERAR CASHBACK
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}
