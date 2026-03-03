import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/src/schemas";
import { useLogin } from "@/src/hooks";

export default function LoginScreen() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: () => router.replace("/"),
      onError: (err) => Alert.alert("Erro", err.message || "Credenciais inválidas"),
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-center mb-8">Entrar</Text>

        {/* Email */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              testID="input-email"
              className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && <Text className="text-red-500 text-xs mb-3">{errors.email.message}</Text>}

        {/* Password */}
        <Text className="text-sm font-medium text-gray-700 mb-1 mt-3">Senha</Text>
        <Controller
          control={control}
          name="senha"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              testID="input-password"
              className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
              placeholder="Sua senha"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.senha && <Text className="text-red-500 text-xs mb-3">{errors.senha.message}</Text>}

        {/* Forgot password link */}
        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          className="self-end mt-1 mb-6"
        >
          <Text className="text-blue-600 text-sm">Esqueceu a senha?</Text>
        </TouchableOpacity>

        {/* Login button */}
        <TouchableOpacity
          className="bg-blue-600 rounded-lg py-4 items-center mb-4"
          onPress={handleSubmit(onSubmit)}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Register link */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600">Não tem conta? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="text-blue-600 font-semibold">Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
