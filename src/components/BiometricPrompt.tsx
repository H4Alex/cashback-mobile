import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";

interface BiometricPromptProps {
  onAuthenticate: () => Promise<boolean>;
  onFallback: () => void;
  maxAttempts?: number;
}

export function BiometricPrompt({
  onAuthenticate,
  onFallback,
  maxAttempts = 3,
}: BiometricPromptProps) {
  const [attempts, setAttempts] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    setIsPending(true);
    setError(null);
    try {
      const success = await onAuthenticate();
      if (!success) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= maxAttempts) {
          setError("Tentativas esgotadas. Use sua senha.");
          onFallback();
          return;
        }
        setError(`Falha na autenticação. ${maxAttempts - newAttempts} tentativa(s) restante(s).`);
      }
    } catch {
      setError("Erro na autenticação biométrica.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View className="items-center px-8">
      <View
        className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-6"
        accessibilityLabel="Autenticação biométrica"
      >
        <Text className="text-4xl">🔐</Text>
      </View>

      <Text className="text-xl font-bold text-center mb-2">Autenticação Biométrica</Text>
      <Text className="text-gray-500 text-center mb-6">
        Use sua impressão digital ou reconhecimento facial para entrar.
      </Text>

      {error && (
        <View className="bg-red-50 rounded-xl p-3 mb-4 w-full">
          <Text className="text-red-600 text-sm text-center">{error}</Text>
        </View>
      )}

      <TouchableOpacity
        className={`rounded-xl py-4 px-10 w-full items-center mb-3 ${isPending ? "bg-blue-400" : "bg-blue-600"}`}
        onPress={handleAuth}
        disabled={isPending}
        accessibilityLabel="Autenticar com biometria"
        accessibilityRole="button"
      >
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">Autenticar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="py-3"
        onPress={onFallback}
        accessibilityLabel="Usar senha em vez de biometria"
        accessibilityRole="button"
      >
        <Text className="text-gray-500 font-medium">Usar senha</Text>
      </TouchableOpacity>
    </View>
  );
}
