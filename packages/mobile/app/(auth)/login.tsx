import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";

export default function LoginScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-3xl font-bold text-green-600 mb-2">
        H4 Cashback
      </Text>
      <Text className="text-base text-gray-500 mb-8">
        Faça login para continuar
      </Text>

      {/* Placeholder — Sprint 1 implementa o form completo */}
      <View className="w-full gap-4">
        <View className="h-12 bg-gray-100 rounded-xl" />
        <View className="h-12 bg-gray-100 rounded-xl" />
        <Pressable className="h-12 bg-green-600 rounded-xl items-center justify-center">
          <Text className="text-white font-semibold text-base">ENTRAR</Text>
        </Pressable>
      </View>

      <Link href="/(auth)/register" asChild>
        <Pressable className="mt-6">
          <Text className="text-green-600">
            Não tem conta? <Text className="font-bold">Cadastre-se</Text>
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
