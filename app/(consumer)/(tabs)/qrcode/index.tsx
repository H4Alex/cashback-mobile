import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useGerarQRCode } from "@/src/hooks";
import { useLojasComSaldo } from "@/src/hooks/useCashback";
import { QRCodeDisplay } from "@/src/components/QRCodeDisplay";
import { EmptyState } from "@/src/components";
import { formatCurrency } from "@/src/utils/formatters";
import type { QRCodeToken, EmpresaSaldo } from "@/src/types";

type Step = "select" | "qr";

export default function QRCodeScreen() {
  const gerarMutation = useGerarQRCode();
  const { data: lojas, isLoading: isLoadingLojas } = useLojasComSaldo();
  const [step, setStep] = useState<Step>("select");
  const [selectedLoja, setSelectedLoja] = useState<EmpresaSaldo | null>(null);
  const [valor, setValor] = useState("");
  const [qrData, setQrData] = useState<QRCodeToken | null>(null);

  const valorNum = parseFloat(valor) || 0;
  const maxValor = selectedLoja?.saldo ?? 0;
  const canGenerate = selectedLoja && valorNum > 0 && valorNum <= maxValor;

  const handleGerar = () => {
    if (!selectedLoja) return;
    gerarMutation.mutate(
      { empresa_id: Number(selectedLoja.empresa_id), valor: valorNum },
      {
        onSuccess: (data) => {
          setQrData(data);
          setStep("qr");
        },
        onError: () => Alert.alert("Erro", "Não foi possível gerar o QR Code."),
      },
    );
  };

  const handleReset = () => {
    setStep("select");
    setQrData(null);
    setValor("");
    setSelectedLoja(null);
  };

  const handleExpire = () => {
    setQrData(null);
    setStep("select");
  };

  // QR Code display step
  if (step === "qr" && qrData && selectedLoja) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <QRCodeDisplay
          token={qrData.qr_token}
          valor={qrData.valor}
          empresaNome={selectedLoja.empresa_nome}
          expiresAt={qrData.expira_em}
          onExpire={handleExpire}
        />

        <TouchableOpacity className="bg-blue-600 rounded-xl py-4 px-10 mt-8" onPress={handleReset}>
          <Text className="text-white font-semibold">Gerar Novo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Selection step
  return (
    <ScrollView className="flex-1 bg-gray-50" keyboardShouldPersistTaps="handled">
      <View className="px-4 pt-6 pb-2">
        <Text className="text-2xl font-bold">Resgatar</Text>
      </View>

      {isLoadingLojas ? (
        <View className="items-center py-12">
          <ActivityIndicator size="large" />
        </View>
      ) : !lojas || lojas.length === 0 ? (
        <EmptyState
          title="Nenhuma loja com saldo"
          message="Você ainda não possui cashback disponível para resgate."
        />
      ) : (
        <>
          {/* Empresa selection */}
          <View className="px-4 mt-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Selecione a loja</Text>
            {lojas.map((loja) => {
              const isSelected = selectedLoja?.empresa_id === loja.empresa_id;
              return (
                <TouchableOpacity
                  key={loja.empresa_id}
                  className={`bg-white rounded-xl p-4 mb-2 flex-row items-center ${isSelected ? "border-2 border-blue-500" : "border border-gray-200"}`}
                  onPress={() => setSelectedLoja(loja)}
                  activeOpacity={0.7}
                >
                  <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
                    <Text className="text-blue-700 font-bold">
                      {loja.empresa_nome.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-medium">{loja.empresa_nome}</Text>
                    <Text className="text-green-600 text-sm font-semibold">
                      Saldo: {formatCurrency(loja.saldo)}
                    </Text>
                  </View>
                  {isSelected && <Text className="text-blue-500 text-lg">✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Valor input */}
          {selectedLoja && (
            <View className="px-4 mt-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Valor do resgate</Text>
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
              <Text className="text-gray-400 text-xs mt-1">
                Máx: {formatCurrency(selectedLoja.saldo)}
              </Text>
              {valorNum > maxValor && (
                <Text className="text-red-500 text-xs mt-1">Valor excede o saldo disponível</Text>
              )}
            </View>
          )}

          {/* Generate button */}
          {selectedLoja && (
            <View className="px-4 mt-8 mb-8">
              <TouchableOpacity
                className={`rounded-xl py-4 items-center ${canGenerate ? "bg-blue-600" : "bg-gray-200"}`}
                onPress={handleGerar}
                disabled={!canGenerate || gerarMutation.isPending}
              >
                {gerarMutation.isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text
                    className={`font-semibold text-base ${canGenerate ? "text-white" : "text-gray-400"}`}
                  >
                    GERAR QR CODE
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}
