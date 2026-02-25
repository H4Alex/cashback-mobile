import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useValidarQRCode } from "@/src/hooks";
import { useCashbackUtilizar } from "@/src/hooks/useMerchant";
import { useCamera } from "@/src/hooks/useCamera";
import { PermissionRequest } from "@/src/components/PermissionRequest";
import { CountdownTimer } from "@/src/components/CountdownTimer";
import { formatCurrency } from "@/src/utils/formatters";
import type { ValidarQRCodeResponse } from "@/src/types";

type Step = "scan" | "result" | "success";

export default function QRScanScreen() {
  const router = useRouter();
  const { status, requestPermission } = useCamera();
  const validateMutation = useValidarQRCode();
  const utilizarMutation = useCashbackUtilizar();

  const [step, setStep] = useState<Step>("scan");
  const [validationResult, setValidationResult] = useState<ValidarQRCodeResponse | null>(null);

  // Simulate scanning a QR code (in production: expo-camera barcode scan)
  const handleScan = (token: string) => {
    validateMutation.mutate(
      { qr_token: token },
      {
        onSuccess: (data) => {
          setValidationResult(data);
          setStep("result");
        },
        onError: () => Alert.alert("QR Inválido", "O código não é válido ou já expirou."),
      },
    );
  };

  const handleConfirmResgate = () => {
    if (!validationResult) return;
    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    utilizarMutation.mutate(
      {
        data: {
          cliente_id: validationResult.cliente.id,
          valor: validationResult.valor,
        },
        idempotencyKey,
      },
      {
        onSuccess: () => setStep("success"),
        onError: () => Alert.alert("Erro", "Não foi possível confirmar o resgate."),
      },
    );
  };

  const handleReset = () => {
    setStep("scan");
    setValidationResult(null);
  };

  // Permission not granted
  if (status !== "granted") {
    return (
      <PermissionRequest
        icon="📷"
        title="Permissão da Câmera"
        description="Precisamos acessar sua câmera para escanear o QR Code do cliente."
        buttonLabel="Permitir Câmera"
        onRequest={requestPermission}
      />
    );
  }

  // Success
  if (step === "success" && validationResult) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center px-8">
        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
          <Text className="text-4xl">✓</Text>
        </View>
        <Text className="text-2xl font-bold mb-2">Resgate realizado!</Text>
        <Text className="text-green-600 text-xl font-bold mb-1">
          {formatCurrency(validationResult.valor)}
        </Text>
        <Text className="text-gray-500">Cliente: {validationResult.cliente.nome}</Text>
        <View className="flex-row gap-3 mt-8">
          <TouchableOpacity className="bg-blue-50 rounded-xl py-3 px-6" onPress={handleReset}>
            <Text className="text-blue-600 font-semibold">Escanear outro</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-gray-100 rounded-xl py-3 px-6"
            onPress={() => router.back()}
          >
            <Text className="text-gray-600 font-semibold">Voltar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Validation result
  if (step === "result" && validationResult) {
    return (
      <View className="flex-1 bg-gray-50 justify-center px-4">
        <View className="bg-white rounded-2xl p-6">
          <View className="items-center mb-4">
            <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
              <Text className="text-2xl">✓</Text>
            </View>
            <Text className="text-lg font-bold">QR Válido</Text>
          </View>

          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Cliente</Text>
              <Text className="font-medium">{validationResult.cliente.nome}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Valor</Text>
              <Text className="font-bold text-green-600">
                {formatCurrency(validationResult.valor)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Saldo</Text>
              <Text className="font-medium">{formatCurrency(validationResult.saldo)}</Text>
            </View>
          </View>

          <CountdownTimer expiresAt={validationResult.expira_em} onExpire={handleReset} />

          <TouchableOpacity
            className={`rounded-xl py-4 items-center mt-4 ${utilizarMutation.isPending ? "bg-green-400" : "bg-green-600"}`}
            onPress={handleConfirmResgate}
            disabled={utilizarMutation.isPending}
          >
            {utilizarMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">CONFIRMAR RESGATE</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 items-center mt-2"
            onPress={handleReset}
            disabled={utilizarMutation.isPending}
          >
            <Text className="text-gray-500 font-medium">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Camera scan view
  return (
    <View className="flex-1 bg-black">
      {/* Camera preview placeholder */}
      <View className="flex-1 items-center justify-center">
        <View className="w-64 h-64 border-2 border-white rounded-2xl items-center justify-center">
          <Text className="text-white text-lg mb-4">📷</Text>
          <Text className="text-white text-sm text-center px-4">
            Aponte para o QR Code do cliente
          </Text>
        </View>
      </View>

      {/* Simulated scan button (in production camera auto-scans) */}
      <View className="px-6 pb-8">
        {validateMutation.isPending ? (
          <View className="bg-white/20 rounded-xl py-4 items-center">
            <ActivityIndicator color="white" />
          </View>
        ) : (
          <TouchableOpacity
            className="bg-white rounded-xl py-4 items-center"
            onPress={() => handleScan("simulated-qr-token-" + Date.now())}
          >
            <Text className="font-semibold text-base">Simular Scan</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
