import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContestacaoSchema, type CreateContestacaoFormData } from "@/src/schemas/contestacao";
import type { ContestacaoTipo } from "@/src/types/contestacao";

const TIPO_OPTIONS: { value: ContestacaoTipo; label: string }[] = [
  { value: "valor_incorreto", label: "Valor incorreto" },
  { value: "cashback_nao_creditado", label: "Cashback não creditado" },
  { value: "empresa_errada", label: "Empresa errada" },
  { value: "outro", label: "Outro" },
];

interface ContestacaoFormProps {
  cashbackEntryId: string;
  onSubmit: (data: CreateContestacaoFormData) => void;
  isPending: boolean;
}

export function ContestacaoForm({ cashbackEntryId, onSubmit, isPending }: ContestacaoFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateContestacaoFormData>({
    resolver: zodResolver(createContestacaoSchema),
    defaultValues: {
      cashback_entry_id: cashbackEntryId,
      tipo: undefined,
      descricao: "",
    },
  });

  return (
    <View className="px-4 py-4">
      {/* Tipo */}
      <Text className="text-sm font-semibold text-gray-700 mb-2">Tipo da contestação</Text>
      <Controller
        control={control}
        name="tipo"
        render={({ field: { onChange, value } }) => (
          <View className="flex-row flex-wrap gap-2 mb-1">
            {TIPO_OPTIONS.map((option) => {
              const isSelected = value === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  className={`rounded-lg px-4 py-2.5 border ${
                    isSelected ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"
                  }`}
                  onPress={() => onChange(option.value)}
                >
                  <Text
                    className={`text-sm ${isSelected ? "text-white font-medium" : "text-gray-700"}`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      />
      {errors.tipo && <Text className="text-red-500 text-xs mt-1 mb-2">{errors.tipo.message}</Text>}

      {/* Descrição */}
      <Text className="text-sm font-semibold text-gray-700 mb-2 mt-4">Descreva o problema</Text>
      <Controller
        control={control}
        name="descricao"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="bg-white border border-gray-200 rounded-xl p-4 text-base min-h-[120px]"
            placeholder="Explique o que aconteceu..."
            placeholderTextColor="#9ca3af"
            multiline
            textAlignVertical="top"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            maxLength={500}
          />
        )}
      />
      {errors.descricao && (
        <Text className="text-red-500 text-xs mt-1">{errors.descricao.message}</Text>
      )}

      {/* Submit */}
      <TouchableOpacity
        className={`rounded-xl py-4 mt-6 items-center ${isPending ? "bg-blue-400" : "bg-blue-600"}`}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">Enviar contestação</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
