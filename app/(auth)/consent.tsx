import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { useRouter } from "expo-router";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();
const CONSENT_KEY = "lgpd_consent_given";

export function hasGivenConsent(): boolean {
  return storage.getBoolean(CONSENT_KEY) === true;
}

export default function ConsentScreen() {
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const handleAccept = () => {
    storage.set(CONSENT_KEY, true);
    storage.set("lgpd_marketing_consent", marketing);
    router.replace("/");
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6" contentContainerClassName="pb-12">
      <Text className="text-2xl font-bold mb-2">Consentimento LGPD</Text>
      <Text className="text-gray-600 mb-6">
        Antes de continuar, precisamos do seu consentimento conforme a Lei Geral de Proteção de
        Dados (Lei nº 13.709/2018).
      </Text>

      {/* Data collection summary */}
      <View className="bg-gray-50 rounded-xl p-4 mb-6">
        <Text className="font-bold text-base mb-3">Dados que coletamos:</Text>
        <Text className="text-gray-700 text-sm leading-5 mb-2">
          {"\u2022"} <Text className="font-medium">Identificação:</Text> nome, CPF, email, telefone
        </Text>
        <Text className="text-gray-700 text-sm leading-5 mb-2">
          {"\u2022"} <Text className="font-medium">Transações:</Text> compras, cashback recebido e
          resgatado
        </Text>
        <Text className="text-gray-700 text-sm leading-5 mb-2">
          {"\u2022"} <Text className="font-medium">Dispositivo:</Text> token push para notificações
        </Text>
      </View>

      {/* Purpose */}
      <View className="bg-gray-50 rounded-xl p-4 mb-6">
        <Text className="font-bold text-base mb-3">Finalidade:</Text>
        <Text className="text-gray-700 text-sm leading-5 mb-2">
          {"\u2022"} Gerenciamento da sua conta e programa de cashback
        </Text>
        <Text className="text-gray-700 text-sm leading-5 mb-2">
          {"\u2022"} Processamento de transações com lojistas parceiros
        </Text>
        <Text className="text-gray-700 text-sm leading-5 mb-2">
          {"\u2022"} Envio de notificações sobre seu saldo e transações
        </Text>
      </View>

      {/* Rights */}
      <View className="bg-green-50 rounded-xl p-4 mb-6">
        <Text className="font-bold text-base mb-3 text-green-800">Seus direitos:</Text>
        <Text className="text-green-800 text-sm leading-5 mb-1">
          {"\u2022"} Acessar, corrigir e excluir seus dados a qualquer momento
        </Text>
        <Text className="text-green-800 text-sm leading-5 mb-1">
          {"\u2022"} Revogar este consentimento pelo menu Perfil
        </Text>
        <Text className="text-green-800 text-sm leading-5">
          {"\u2022"} Solicitar exportação dos seus dados pessoais
        </Text>
      </View>

      {/* Required consent */}
      <TouchableOpacity
        className="flex-row items-center py-4 border-t border-gray-100"
        onPress={() => setAccepted(!accepted)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: accepted }}
        accessibilityLabel="Aceitar termos de uso e política de privacidade"
      >
        <View
          className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
            accepted ? "bg-green-500 border-green-500" : "border-gray-300"
          }`}
        >
          {accepted && <Text className="text-white text-xs font-bold">✓</Text>}
        </View>
        <Text className="flex-1 text-sm text-gray-800">
          Li e aceito os <Text className="text-blue-600 font-medium">Termos de Uso</Text> e a{" "}
          <Text className="text-blue-600 font-medium">Política de Privacidade</Text>
        </Text>
      </TouchableOpacity>

      {/* Optional marketing */}
      <View className="flex-row items-center justify-between py-4 border-t border-gray-100">
        <Text className="flex-1 text-sm text-gray-800 mr-4">
          Aceito receber promoções e ofertas por notificação (opcional)
        </Text>
        <Switch
          value={marketing}
          onValueChange={setMarketing}
          trackColor={{ true: "#22c55e" }}
          accessibilityLabel="Receber promoções por notificação"
        />
      </View>

      {/* Accept button */}
      <TouchableOpacity
        className={`rounded-xl py-4 items-center mt-6 ${accepted ? "bg-green-500" : "bg-gray-300"}`}
        onPress={handleAccept}
        disabled={!accepted}
        accessibilityLabel="Confirmar consentimento e continuar"
        accessibilityRole="button"
      >
        <Text className={`font-semibold text-base ${accepted ? "text-white" : "text-gray-500"}`}>
          Concordar e Continuar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
