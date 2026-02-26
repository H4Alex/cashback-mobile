import { View, Text, TouchableOpacity } from "react-native";

type ErrorType = "network" | "server" | "timeout" | "session" | "unknown";

interface ErrorScreenProps {
  type?: ErrorType;
  message?: string;
  onRetry?: () => void;
}

const errorConfig: Record<ErrorType, { icon: string; title: string; message: string }> = {
  network: {
    icon: "!",
    title: "Sem conexão",
    message: "Verifique sua internet e tente novamente.",
  },
  server: {
    icon: "!",
    title: "Erro no servidor",
    message: "Estamos com problemas. Tente novamente em alguns instantes.",
  },
  timeout: {
    icon: "!",
    title: "Conexão lenta",
    message: "A requisição demorou muito. Tente novamente.",
  },
  session: {
    icon: "!",
    title: "Sessão expirada",
    message: "Faça login novamente para continuar.",
  },
  unknown: {
    icon: "!",
    title: "Erro inesperado",
    message: "Algo deu errado. Tente novamente.",
  },
};

export function ErrorScreen({ type = "unknown", message, onRetry }: ErrorScreenProps) {
  const config = errorConfig[type];

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
        <Text className="text-red-500 text-2xl font-bold">{config.icon}</Text>
      </View>
      <Text className="text-xl font-bold text-center mb-2">{config.title}</Text>
      <Text className="text-gray-500 text-center mb-6">{message ?? config.message}</Text>

      {onRetry && (
        <TouchableOpacity
          className="bg-green-500 rounded-xl py-3.5 px-8"
          onPress={onRetry}
          accessibilityLabel="Tentar novamente"
          accessibilityRole="button"
        >
          <Text className="text-white font-semibold text-base">Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

/**
 * Determines ErrorScreen type from an API error.
 */
export function getErrorType(error: unknown): ErrorType {
  if (!error || typeof error !== "object") return "unknown";
  const err = error as { message?: string; status?: number; code?: string };

  if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) return "timeout";
  if (err.message?.includes("Network Error") || err.code === "ERR_NETWORK") return "network";
  if (err.status === 401) return "session";
  if (err.status && err.status >= 500) return "server";
  return "unknown";
}
