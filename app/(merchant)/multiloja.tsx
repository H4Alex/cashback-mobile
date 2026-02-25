import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useEmpresas, useSwitchEmpresa } from "@/src/hooks/useMerchant";
import { useMultilojaStore } from "@/src/stores/multiloja.store";
import { SkeletonCard } from "@/src/components";
import type { Empresa } from "@/src/types/merchant";

function EmpresaRow({
  empresa,
  isActive,
  onPress,
  isSwitching,
}: {
  empresa: Empresa;
  isActive: boolean;
  onPress: () => void;
  isSwitching: boolean;
}) {
  const perfilLabels: Record<string, string> = {
    proprietario: "Proprietário",
    gestor: "Gestor",
    operador: "Operador",
    vendedor: "Vendedor",
  };

  return (
    <TouchableOpacity
      className={`bg-white rounded-xl p-4 mx-4 mb-3 flex-row items-center ${isActive ? "border-2 border-green-500" : ""}`}
      style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
      onPress={onPress}
      disabled={isActive || isSwitching}
      activeOpacity={0.7}
    >
      <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
        <Text className="text-lg font-bold text-blue-600">
          {empresa.nome_fantasia.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold">{empresa.nome_fantasia}</Text>
        <Text className="text-gray-500 text-xs mt-0.5">CNPJ: {empresa.cnpj}</Text>
        <Text className="text-gray-400 text-xs">
          {perfilLabels[empresa.perfil] ?? empresa.perfil}
        </Text>
      </View>
      {isActive && <Text className="text-green-500 text-lg">✓</Text>}
      {isSwitching && <ActivityIndicator size="small" />}
    </TouchableOpacity>
  );
}

export default function MultilojaScreen() {
  const router = useRouter();
  const empresaAtiva = useMultilojaStore((s) => s.empresaAtiva);
  const { data: empresas, isLoading } = useEmpresas();
  const { mutate: switchEmpresa, isPending: isSwitching } = useSwitchEmpresa();

  const handleSwitch = (empresa: Empresa) => {
    switchEmpresa(empresa.id, {
      onSuccess: () => router.back(),
    });
  };

  return (
    <View className="flex-1 bg-gray-50 pt-4">
      {isLoading ? (
        <View className="mx-4">
          {[1, 2, 3].map((i) => (
            <View key={i} className="mb-3">
              <SkeletonCard />
            </View>
          ))}
        </View>
      ) : (
        empresas?.map((empresa) => (
          <EmpresaRow
            key={empresa.id}
            empresa={empresa}
            isActive={empresaAtiva?.id === empresa.id}
            onPress={() => handleSwitch(empresa)}
            isSwitching={isSwitching}
          />
        ))
      )}
    </View>
  );
}
