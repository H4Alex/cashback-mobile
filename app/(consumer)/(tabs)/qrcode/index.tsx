import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useGerarQRCode } from '@/src/hooks';
import type { QRCodeToken } from '@/src/types';

export default function QRCodeScreen() {
  const gerarMutation = useGerarQRCode();
  const [qrData, setQrData] = useState<QRCodeToken | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!qrData) return;

    const expiresAt = new Date(qrData.expira_em).getTime();
    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.floor((expiresAt - Date.now()) / 1000),
      );
      setTimeLeft(remaining);
      if (remaining <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
        setQrData(null);
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [qrData]);

  const handleGerar = () => {
    // In production, empresa_id and valor come from user selection
    gerarMutation.mutate(
      { empresa_id: 1, valor: 0 },
      {
        onSuccess: (data) => setQrData(data),
        onError: () =>
          Alert.alert('Erro', 'Não foi possível gerar o QR Code.'),
      },
    );
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View className="flex-1 bg-white items-center justify-center px-6">
      {qrData ? (
        <>
          {/* QR Code display area */}
          <View className="w-64 h-64 bg-gray-100 rounded-2xl items-center justify-center mb-6 border-2 border-gray-200">
            <Text className="text-xs text-gray-400 mb-2">QR Token</Text>
            <Text className="text-sm font-mono text-center px-4" numberOfLines={3}>
              {qrData.qr_token}
            </Text>
          </View>

          {/* Timer */}
          <View className="items-center mb-6">
            <Text className="text-gray-500 text-sm">Expira em</Text>
            <Text
              className={`text-3xl font-bold ${
                timeLeft <= 60 ? 'text-red-500' : 'text-blue-600'
              }`}
            >
              {formatTime(timeLeft)}
            </Text>
          </View>

          <Text className="text-gray-500 text-sm text-center mb-4">
            Mostre este QR Code ao lojista para utilizar seu cashback. O token é
            armazenado com segurança e expira automaticamente.
          </Text>

          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-4 px-8"
            onPress={handleGerar}
          >
            <Text className="text-white font-semibold">Gerar Novo</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text className="text-2xl font-bold mb-2">QR Code</Text>
          <Text className="text-gray-500 text-center mb-8">
            Gere um QR Code para utilizar seu cashback em uma loja parceira. O
            código é válido por 5 minutos e protegido com criptografia.
          </Text>

          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-4 px-8"
            onPress={handleGerar}
            disabled={gerarMutation.isPending}
          >
            {gerarMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Gerar QR Code
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
