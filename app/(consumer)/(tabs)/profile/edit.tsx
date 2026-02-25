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
import { updateProfileSchema, type UpdateProfileFormData } from '@/src/schemas';
import { useUpdateProfile } from '@/src/hooks';
import { useAuthStore } from '@/src/stores';

export default function EditProfileScreen() {
  const router = useRouter();
  const cliente = useAuthStore((s) => s.cliente);
  const updateMutation = useUpdateProfile();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      nome: cliente?.nome ?? '',
      email: cliente?.email ?? '',
      telefone: cliente?.telefone ?? '',
    },
  });

  const onSubmit = (data: UpdateProfileFormData) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        router.back();
      },
      onError: () =>
        Alert.alert('Erro', 'Não foi possível atualizar o perfil.'),
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-6 pt-6"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text className="text-2xl font-bold mb-6">Editar Perfil</Text>

      <Text className="text-sm font-medium text-gray-700 mb-1">Nome</Text>
      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
            placeholder="Seu nome"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.nome && (
        <Text className="text-red-500 text-xs mb-3">
          {errors.nome.message}
        </Text>
      )}

      <Text className="text-sm font-medium text-gray-700 mb-1 mt-3">
        Email
      </Text>
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
      {errors.email && (
        <Text className="text-red-500 text-xs mb-3">
          {errors.email.message}
        </Text>
      )}

      <Text className="text-sm font-medium text-gray-700 mb-1 mt-3">
        Telefone
      </Text>
      <Controller
        control={control}
        name="telefone"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-1 text-base"
            placeholder="(00) 00000-0000"
            keyboardType="phone-pad"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />

      <TouchableOpacity
        className="bg-blue-600 rounded-lg py-4 items-center mt-6"
        onPress={handleSubmit(onSubmit)}
        disabled={updateMutation.isPending}
      >
        {updateMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">Salvar</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
