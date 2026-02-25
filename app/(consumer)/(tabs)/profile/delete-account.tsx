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
  deleteAccountSchema,
  type DeleteAccountFormData,
} from '@/src/schemas';
import { useDeleteAccount } from '@/src/hooks';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const mutation = useDeleteAccount();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { senha: '', motivo: '' },
  });

  const onSubmit = (data: DeleteAccountFormData) => {
    // Double confirmation as required by LGPD compliance
    Alert.alert(
      'Excluir Conta',
      'Esta ação é irreversível. Todos os seus dados serão removidos permanentemente. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir Permanentemente',
          style: 'destructive',
          onPress: () => {
            mutation.mutate(data, {
              onSuccess: () => {
                Alert.alert(
                  'Conta Excluída',
                  'Sua conta foi excluída com sucesso.',
                  [
                    {
                      text: 'OK',
                      onPress: () => router.replace('/(auth)/login'),
                    },
                  ],
                );
              },
              onError: () =>
                Alert.alert(
                  'Erro',
                  'Não foi possível excluir a conta. Verifique sua senha.',
                ),
            });
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-6 pt-6"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text className="text-2xl font-bold mb-2 text-red-600">
        Excluir Conta
      </Text>
      <Text className="text-gray-600 mb-6">
        Ao excluir sua conta, todos os seus dados pessoais, saldo de cashback e
        histórico serão removidos permanentemente conforme a LGPD. Esta ação não
        pode ser desfeita.
      </Text>

      {/* Password confirmation */}
      <Text className="text-sm font-medium text-gray-700 mb-1">
        Confirme sua senha
      </Text>
      <Controller
        control={control}
        name="senha"
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
      {errors.senha && (
        <Text className="text-red-500 text-xs mb-3">
          {errors.senha.message}
        </Text>
      )}

      {/* Optional reason */}
      <Text className="text-sm font-medium text-gray-700 mb-1 mt-3">
        Motivo (opcional)
      </Text>
      <Controller
        control={control}
        name="motivo"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
            placeholder="Nos conte por que está saindo..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <View className="flex-1" />

      <TouchableOpacity
        className="bg-red-600 rounded-lg py-4 items-center mb-8"
        onPress={handleSubmit(onSubmit)}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">
            Excluir Minha Conta
          </Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
