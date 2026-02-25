import { useCallback } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSaldo, useExtrato, useRefreshOnFocus } from "@/src/hooks";
import { useAuthStore } from "@/src/stores";
import {
  SaldoCard,
  CashbackTimeline,
  EmptyState,
  PullToRefresh,
  SkeletonCard,
  SkeletonTransaction,
  NotificationBell,
} from "@/src/components";

export default function DashboardScreen() {
  const router = useRouter();
  const cliente = useAuthStore((s) => s.cliente);
  const { data: saldo, isLoading: saldoLoading, refetch: refetchSaldo } = useSaldo();
  const { data: extratoData, isLoading: extratoLoading, refetch: refetchExtrato } = useExtrato();

  const isRefreshing = false;
  const recentEntries = extratoData?.pages.flatMap((p) => p.extrato).slice(0, 5) ?? [];

  const handleRefresh = useCallback(() => {
    refetchSaldo();
    refetchExtrato();
  }, [refetchSaldo, refetchExtrato]);

  useRefreshOnFocus(handleRefresh);

  return (
    <PullToRefresh
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      className="flex-1 bg-gray-50"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
        <View>
          <Text className="text-gray-500 text-sm">Olá,</Text>
          <Text className="text-xl font-bold">{cliente?.nome?.split(" ")[0] ?? "—"}</Text>
        </View>
        <NotificationBell onPress={() => router.push("/(consumer)/(tabs)/notifications")} />
      </View>

      {/* Saldo Card */}
      {saldoLoading ? (
        <View className="mx-4 mt-4">
          <SkeletonCard />
        </View>
      ) : saldo ? (
        <SaldoCard saldo={saldo} onPress={() => router.push("/(consumer)/(tabs)/saldo")} />
      ) : null}

      {/* Quick actions */}
      <View className="flex-row px-4 mt-4 gap-3">
        <TouchableOpacity
          className="flex-1 bg-white rounded-xl p-3 items-center"
          style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
          onPress={() => router.push("/(consumer)/(tabs)/home/extrato")}
        >
          <Text className="text-lg">📋</Text>
          <Text className="text-xs font-medium text-gray-700 mt-1">Extrato</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-white rounded-xl p-3 items-center"
          style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
          onPress={() => router.push("/(consumer)/(tabs)/home/historico")}
        >
          <Text className="text-lg">🔄</Text>
          <Text className="text-xs font-medium text-gray-700 mt-1">Histórico</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-white rounded-xl p-3 items-center"
          style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
          onPress={() => router.push("/(consumer)/contestacao")}
        >
          <Text className="text-lg">⚠️</Text>
          <Text className="text-xs font-medium text-gray-700 mt-1">Contestações</Text>
        </TouchableOpacity>
      </View>

      {/* Recent transactions */}
      <View className="mt-6 px-4">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold">Últimas transações</Text>
          {recentEntries.length > 0 && (
            <TouchableOpacity onPress={() => router.push("/(consumer)/(tabs)/home/extrato")}>
              <Text className="text-blue-600 text-sm">Ver tudo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {extratoLoading ? (
        <View>
          {[1, 2, 3].map((i) => (
            <SkeletonTransaction key={i} />
          ))}
        </View>
      ) : recentEntries.length === 0 ? (
        <EmptyState title="Sem transações" message="Suas transações de cashback aparecerão aqui." />
      ) : (
        <CashbackTimeline entries={recentEntries} />
      )}
    </PullToRefresh>
  );
}
