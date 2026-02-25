import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormData,
  type ResetPasswordFormData,
} from '@/src/schemas';
import { useForgotPassword, useResetPassword } from '@/src/hooks';

type Step = 'email' | 'token' | 'done';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const forgotMutation = useForgotPassword();
  const resetMutation = useResetPassword();

  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '', token: '', senha: '' },
  });

  const onSendEmail = (data: ForgotPasswordFormData) => {
    forgotMutation.mutate(data, {
      onSuccess: () => {
        resetForm.setValue('email', data.email);
        setStep('token');
      },
      onError: () =>
        Alert.alert('Erro', 'Não foi possível enviar o email de recuperação.'),
    });
  };

  const onResetPassword = (data: ResetPasswordFormData) => {
    resetMutation.mutate(data, {
      onSuccess: () => {
        setStep('done');
        Alert.alert('Sucesso', 'Senha redefinida com sucesso!', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') },
        ]);
      },
      onError: () =>
        Alert.alert('Erro', 'Token inválido ou expirado. Tente novamente.'),
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-6 justify-center"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text className="text-2xl font-bold mb-2">Recuperar Senha</Text>

      {step === 'email' && (
        <>
          <Text className="text-gray-600 mb-6">
            Informe seu email para receber o link de recuperação.
          </Text>

          <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
          <Controller
            control={emailForm.control}
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
          {emailForm.formState.errors.email && (
            <Text className="text-red-500 text-xs mb-3">
              {emailForm.formState.errors.email.message}
            </Text>
          )}

          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-4 items-center mt-4"
            onPress={emailForm.handleSubmit(onSendEmail)}
            disabled={forgotMutation.isPending}
          >
            {forgotMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Enviar Email
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {step === 'token' && (
        <>
          <Text className="text-gray-600 mb-6">
            Insira o código recebido por email e sua nova senha.
          </Text>

          <Text className="text-sm font-medium text-gray-700 mb-1">
            Código
          </Text>
          <Controller
            control={resetForm.control}
            name="token"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
                placeholder="Código de verificação"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {resetForm.formState.errors.token && (
            <Text className="text-red-500 text-xs mb-3">
              {resetForm.formState.errors.token.message}
            </Text>
          )}

          <Text className="text-sm font-medium text-gray-700 mb-1 mt-3">
            Nova Senha
          </Text>
          <Controller
            control={resetForm.control}
            name="senha"
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
          {resetForm.formState.errors.senha && (
            <Text className="text-red-500 text-xs mb-3">
              {resetForm.formState.errors.senha.message}
            </Text>
          )}

          <TouchableOpacity
            className="bg-blue-600 rounded-lg py-4 items-center mt-4"
            onPress={resetForm.handleSubmit(onResetPassword)}
            disabled={resetMutation.isPending}
          >
            {resetMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Redefinir Senha
              </Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {step !== 'done' && (
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 items-center"
        >
          <Text className="text-blue-600">Voltar ao login</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
}
