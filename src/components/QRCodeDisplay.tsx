import { View, Text } from "react-native";
import { CountdownTimer } from "./CountdownTimer";
import { formatCurrency } from "@/src/utils/formatters";

interface QRCodeDisplayProps {
  token: string;
  valor: number;
  empresaNome: string;
  expiresAt: string;
  onExpire?: () => void;
}

export function QRCodeDisplay({
  token,
  valor,
  empresaNome,
  expiresAt,
  onExpire,
}: QRCodeDisplayProps) {
  return (
    <View className="items-center">
      {/* QR Code visual — in production use react-native-qrcode-svg */}
      <View className="w-56 h-56 bg-white rounded-2xl items-center justify-center mb-4 border-2 border-gray-200">
        <View className="w-40 h-40 bg-gray-100 rounded-xl items-center justify-center">
          <Text className="text-5xl mb-2">📱</Text>
          <Text className="text-xs text-gray-400 text-center px-2" numberOfLines={2}>
            {token.slice(0, 20)}...
          </Text>
        </View>
      </View>

      <CountdownTimer expiresAt={expiresAt} onExpire={onExpire} />

      <Text className="text-gray-500 text-sm mt-2">Apresente ao caixa</Text>
      <Text className="text-xl font-bold mt-1">{formatCurrency(valor)}</Text>
      <Text className="text-gray-500 text-sm">{empresaNome}</Text>
    </View>
  );
}
