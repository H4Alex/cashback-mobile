import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: 'Recuperar Senha' }}
      />
      <Stack.Screen name="register" options={{ title: 'Cadastro' }} />
    </Stack>
  );
}
