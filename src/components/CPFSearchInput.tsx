import { View, Text, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import type { ClienteSearchResult } from "@/src/types/merchant";

interface CPFSearchInputProps {
  cpf: string;
  onChangeCpf: (value: string) => void;
  isSearching: boolean;
  results: ClienteSearchResult[] | undefined;
  selectedCliente: ClienteSearchResult | null;
  onSelectCliente: (cliente: ClienteSearchResult) => void;
}

function maskCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function CPFSearchInput({
  cpf,
  onChangeCpf,
  isSearching,
  results,
  selectedCliente,
  onSelectCliente,
}: CPFSearchInputProps) {
  const handleChange = (text: string) => {
    onChangeCpf(maskCpf(text));
  };

  return (
    <View>
      <Text className="text-sm font-semibold text-gray-700 mb-2">CPF do cliente</Text>
      <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4">
        <TextInput
          className="flex-1 py-3 text-base"
          placeholder="000.000.000-00"
          placeholderTextColor="#9ca3af"
          value={cpf}
          onChangeText={handleChange}
          keyboardType="numeric"
          maxLength={14}
        />
        {isSearching && <ActivityIndicator size="small" />}
      </View>

      {/* Selected cliente */}
      {selectedCliente && (
        <View className="bg-green-50 border border-green-200 rounded-xl p-3 mt-2 flex-row items-center">
          <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
            <Text className="text-green-700 font-bold">
              {selectedCliente.nome.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-medium text-green-800">{selectedCliente.nome}</Text>
            <Text className="text-xs text-green-600">{selectedCliente.email}</Text>
          </View>
        </View>
      )}

      {/* Search results */}
      {!selectedCliente && results && results.length > 0 && (
        <View className="bg-white border border-gray-200 rounded-xl mt-2 overflow-hidden">
          {results.map((cliente) => (
            <TouchableOpacity
              key={cliente.id}
              className="flex-row items-center p-3 border-b border-gray-100"
              onPress={() => onSelectCliente(cliente)}
            >
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Text className="text-blue-700 font-bold">
                  {cliente.nome.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text className="text-sm font-medium">{cliente.nome}</Text>
                <Text className="text-xs text-gray-500">{cliente.email}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* No results */}
      {!selectedCliente &&
        results &&
        results.length === 0 &&
        cpf.replace(/\D/g, "").length === 11 && (
          <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-2">
            <Text className="text-sm text-yellow-800">Nenhum cliente encontrado com este CPF.</Text>
          </View>
        )}
    </View>
  );
}
