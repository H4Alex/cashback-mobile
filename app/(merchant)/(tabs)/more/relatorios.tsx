import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRelatorios } from "@/src/hooks/useMerchantManagement";
import { FilterChips } from "@/src/components/FilterChips";
import { MetricCard } from "@/src/components/MetricCard";
import { Skeleton } from "@/src/components";

const PERIODO_FILTERS = [
  { value: "7d" as const, label: "7 dias" },
  { value: "30d" as const, label: "30 dias" },
  { value: "90d" as const, label: "90 dias" },
];

export default function RelatoriosScreen() {
  const [periodo, setPeriodo] = useState("30d");
  const { data: relatorio, isLoading } = useRelatorios(periodo);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <FilterChips
        options={PERIODO_FILTERS}
        selected={periodo}
        onSelect={(v) => setPeriodo(v ?? "30d")}
      />

      {isLoading ? (
        <View className="px-4">
          <Skeleton />
        </View>
      ) : !relatorio ? (
        <View className="flex-1 items-center justify-center px-8 py-12">
          <Text className="text-gray-400">Erro ao carregar relatório.</Text>
        </View>
      ) : (
        <View className="px-4 pt-2">
          <MetricCard label="Cashback Gerado" value={relatorio.cashback_gerado} />
          <MetricCard label="Cashback Utilizado" value={relatorio.cashback_utilizado} />
          <MetricCard label="Cashback Expirado" value={relatorio.cashback_expirado} />
          <MetricCard
            label="Clientes Ativos"
            value={relatorio.clientes_ativos}
            isCurrency={false}
          />
          <MetricCard label="Ticket Médio" value={relatorio.ticket_medio} />
        </View>
      )}
    </ScrollView>
  );
}
