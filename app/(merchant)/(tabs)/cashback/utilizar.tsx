import { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useClienteSearch, useClienteSaldo, useCashbackUtilizar } from "@/src/hooks/useMerchant";
import { CPFSearchInput } from "@/src/components/CPFSearchInput";
import { CashbackConfirmation, makeConfirmationItems } from "@/src/components/CashbackConfirmation";
import { formatCurrency } from "@/src/utils/formatters";

type Step = "form" | "confirm" | "success";

export default function UtilizarCashbackScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [valor, setValor] = useState("");

  const {
    cpf,
    setCpf,
    query: clienteQuery,
    selectedCliente,
    selectCliente,
    reset: resetCliente,
  } = useClienteSearch();
  const { data: saldoData } = useClienteSaldo(selectedCliente?.id);
  const { mutate: utilizar, isPending, data: result } = useCashbackUtilizar();

  const valorNum = parseFloat(valor) || 0;
  const saldoDisponivel = saldoData?.saldo ?? 0;
  const cashbackUsado = Math.min(valorNum, saldoDisponivel);
  const valorDinheiro = Math.max(0, valorNum - cashbackUsado);

  const canConfirm = selectedCliente && valorNum > 0 && saldoDisponivel > 0;

  const handleConfirm = () => {
    if (!selectedCliente) return;

    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    utilizar(
      {
        data: { cliente_id: selectedCliente.id, valor: valorNum },
        idempotencyKey,
      },
      {
        onSuccess: () => setStep("success"),
        onError: () =>
          Alert.alert("Erro", "Não foi possível utilizar o cashback. Tente novamente."),
      },
    );
  };

  const handleReset = () => {
    setStep("form");
    setValor("");
    resetCliente();
  };

  if (step === "success" && result) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-8">
        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
          <Text className="text-4xl">✓</Text>
        </View>
        <Text className="text-2xl font-bold mb-2">Resgate realizado!</Text>
        <Text className="text-green-600 text-xl font-bold mb-1">
          {formatCurrency(result.cashback_usado)}
        </Text>
        <Text className="text-gray-500 text-center mb-2">usado por {result.cliente_nome}</Text>
        <Text className="text-gray-400 text-sm mb-8">
          Novo saldo: {formatCurrency(result.novo_saldo)}
        </Text>
        <View className="flex-row gap-3 w-full">
          <View className="flex-1">
            <Text
              className="text-blue-600 font-semibold text-center py-3 bg-blue-50 rounded-xl"
              onPress={handleReset}
            >
              Nova operação
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
          title="Confirmar Resgate"
          items={makeConfirmationItems([
            { label: "Valor da compra", value: valorNum },
            { label: "Cashback usado", value: cashbackUsado, highlight: true },
            { label: "Pago em dinheiro", value: valorDinheiro },
          ])}
          confirmLabel="CONFIRMAR RESGATE"
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
        <Text className="text-2xl font-bold">Utilizar Cashback</Text>
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

      {selectedCliente && saldoData && (
        <>
          {/* Client saldo */}
          <View className="mx-4 mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <View className="flex-row justify-between">
              <Text className="text-blue-700 font-medium">Saldo disponível</Text>
              <Text className="text-blue-700 font-bold">{formatCurrency(saldoData.saldo)}</Text>
            </View>
          </View>

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

          {/* Summary */}
          {valorNum > 0 && (
            <View className="mx-4 mt-6 bg-gray-100 rounded-xl p-4">
              <Text className="text-sm font-semibold mb-2">Resumo FEFO</Text>
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600 text-sm">Valor compra</Text>
                <Text className="text-sm">{formatCurrency(valorNum)}</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600 text-sm">Cashback usado</Text>
                <Text className="text-green-600 font-bold">{formatCurrency(cashbackUsado)}</Text>
              </View>
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600 text-sm">Pago em dinheiro</Text>
                <Text className="text-sm">{formatCurrency(valorDinheiro)}</Text>
              </View>
              <View className="flex-row justify-between border-t border-gray-200 pt-2 mt-2">
                <Text className="text-gray-600 text-sm font-medium">Novo saldo</Text>
                <Text className="font-bold">
                  {formatCurrency(Math.max(0, saldoDisponivel - cashbackUsado))}
                </Text>
              </View>
            </View>
          )}

          {/* Submit */}
          <View className="px-4 mt-6 mb-8">
            <Text
              className={`text-center py-4 rounded-xl font-semibold text-base ${
                canConfirm ? "bg-green-600 text-white" : "bg-gray-200 text-gray-400"
              }`}
              onPress={() => canConfirm && setStep("confirm")}
            >
              CONFIRMAR RESGATE
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}
