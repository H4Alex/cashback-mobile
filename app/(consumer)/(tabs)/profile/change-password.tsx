import {
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, type ChangePasswordFormData } from "@/src/schemas";
import { useChangePassword } from "@/src/hooks";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const mutation = useChangePassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { senha_atual: "", nova_senha: "" },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    mutation.mutate(data, {
      onSuccess: () => {
        Alert.alert("Sucesso", "Senha alterada com sucesso!");
        router.back();
      },
      onError: () => Alert.alert("Erro", "Senha atual incorreta."),
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-6 pt-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text className="text-2xl font-bold mb-6">Alterar Senha</Text>

      <Text className="text-sm font-medium text-gray-700 mb-1">Senha Atual</Text>
      <Controller
        control={control}
        name="senha_atual"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
            placeholder="Sua senha atual"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.senha_atual && (
        <Text className="text-red-500 text-xs mb-3">{errors.senha_atual.message}</Text>
      )}

      <Text className="text-sm font-medium text-gray-700 mb-1 mt-3">Nova Senha</Text>
      <Controller
        control={control}
        name="nova_senha"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
            placeholder="Nova senha (mínimo 6 caracteres)"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.nova_senha && (
        <Text className="text-red-500 text-xs mb-3">{errors.nova_senha.message}</Text>
      )}

      <TouchableOpacity
        className="bg-blue-600 rounded-lg py-4 items-center mt-6"
        onPress={handleSubmit(onSubmit)}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">Alterar Senha</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
