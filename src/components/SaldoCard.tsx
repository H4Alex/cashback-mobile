import { View, Text, TouchableOpacity } from "react-native";
import type { CashbackSaldo } from "@/src/types";
import { formatCurrency } from "@/src/utils/formatters";

interface SaldoCardProps {
  saldo: CashbackSaldo;
  onPress?: () => void;
}

export function SaldoCard({ saldo, onPress }: SaldoCardProps) {
  return (
    <TouchableOpacity
      className="bg-blue-600 rounded-2xl p-6 mx-4 mt-4"
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!onPress}
    >
      <Text className="text-blue-200 text-sm mb-1">Saldo disponível</Text>
      <Text className="text-white text-3xl font-bold mb-4">{formatCurrency(saldo.saldo_total)}</Text>

      {saldo.por_empresa.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-2">
          {saldo.por_empresa.slice(0, 3).map((e) => (
            <View key={e.empresa_id} className="bg-blue-500/30 rounded-lg px-2 py-1">
              <Text className="text-blue-100 text-xs">{e.nome_fantasia ?? "Loja"}</Text>
              <Text className="text-white text-xs font-semibold">{formatCurrency(Number(e.saldo))}</Text>
            </View>
          ))}
        </View>
      )}

      {saldo.proximo_a_expirar && saldo.proximo_a_expirar.valor > 0 && (
        <View className="bg-yellow-500/20 rounded-lg px-3 py-2 mt-4 flex-row items-center">
          <Text className="text-yellow-200 text-xs flex-1">
            {formatCurrency(saldo.proximo_a_expirar.valor)} expirando em 7 dias (
            {saldo.proximo_a_expirar.quantidade} cashback
            {saldo.proximo_a_expirar.quantidade > 1 ? "s" : ""})
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
