import { useState } from "react";
import {
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
import { registerSchema, type RegisterFormData } from "@/src/schemas";
import { useRegister } from "@/src/hooks";

export default function RegisterScreen() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [step, setStep] = useState<"form" | "submitting">("form");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      email: "",
      cpf: "",
      senha: "",
      senha_confirmation: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setStep("submitting");
    registerMutation.mutate(data, {
      onSuccess: () => router.replace("/"),
      onError: (err) => {
        setStep("form");
        Alert.alert("Erro", err.message || "Não foi possível criar a conta.");
      },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-8"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-center mb-8">Criar Conta</Text>

        {/* Nome */}
        <Text className="text-sm font-medium text-gray-700 mb-1">Nome completo</Text>
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
              placeholder="Seu nome completo"
              autoCapitalize="words"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.nome && <Text className="text-red-500 text-xs mb-3">{errors.nome.message}</Text>}

        {/* Email */}
        <Text className="text-sm font-medium text-gray-700 mb-1 mt-3">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
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

        {/* CPF */}
        <Text className="text-sm font-medium text-gray-700 mb-1 mt-3">CPF</Text>
        <Controller
          control={control}
          name="cpf"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
              placeholder="00000000000"
              keyboardType="numeric"
              maxLength={11}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.cpf && <Text className="text-red-500 text-xs mb-3">{errors.cpf.message}</Text>}

        {/* Senha */}
        <Text className="text-sm font-medium text-gray-700 mb-1 mt-3">Senha</Text>
        <Controller
          control={control}
          name="senha"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.senha && <Text className="text-red-500 text-xs mb-3">{errors.senha.message}</Text>}

        {/* Confirmar Senha */}
        <Text className="text-sm font-medium text-gray-700 mb-1 mt-3">Confirmar Senha</Text>
        <Controller
          control={control}
          name="senha_confirmation"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
              placeholder="Repita a senha"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.senha_confirmation && (
          <Text className="text-red-500 text-xs mb-3">{errors.senha_confirmation.message}</Text>
        )}

        {/* Submit */}
        <TouchableOpacity
          className="bg-blue-600 rounded-lg py-4 items-center mt-6"
          onPress={handleSubmit(onSubmit)}
          disabled={step === "submitting"}
        >
          {step === "submitting" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">Cadastrar</Text>
          )}
        </TouchableOpacity>

        {/* Login link */}
        <TouchableOpacity onPress={() => router.back()} className="mt-6 items-center">
          <Text className="text-blue-600">Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
