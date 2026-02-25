import { ScrollView, Text } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <ScrollView className="flex-1 bg-white px-6 pt-6">
      <Text className="text-2xl font-bold mb-4">Política de Privacidade</Text>

      <Text className="text-gray-700 text-base leading-6 mb-4">
        A H4 Cashback valoriza a privacidade dos seus dados pessoais e está
        comprometida com a Lei Geral de Proteção de Dados (LGPD - Lei nº
        13.709/2018).
      </Text>

      <Text className="text-lg font-bold mb-2">1. Dados Coletados</Text>
      <Text className="text-gray-700 text-base leading-6 mb-4">
        Coletamos apenas os dados necessários para a prestação do serviço: nome,
        email, CPF, telefone e dados de transações de cashback.
      </Text>

      <Text className="text-lg font-bold mb-2">2. Finalidade</Text>
      <Text className="text-gray-700 text-base leading-6 mb-4">
        Seus dados são utilizados exclusivamente para: gerenciamento da conta,
        processamento de cashback, envio de notificações relevantes e
        cumprimento de obrigações legais.
      </Text>

      <Text className="text-lg font-bold mb-2">3. Compartilhamento</Text>
      <Text className="text-gray-700 text-base leading-6 mb-4">
        Seus dados não são vendidos a terceiros. Compartilhamos dados apenas com
        lojistas parceiros na medida necessária para o funcionamento do programa
        de cashback.
      </Text>

      <Text className="text-lg font-bold mb-2">4. Seus Direitos</Text>
      <Text className="text-gray-700 text-base leading-6 mb-4">
        Conforme a LGPD, você tem direito a: acessar seus dados, corrigir dados
        incompletos, solicitar a exclusão dos dados, revogar consentimento e
        exportar seus dados pessoais.
      </Text>

      <Text className="text-lg font-bold mb-2">5. Exclusão de Conta</Text>
      <Text className="text-gray-700 text-base leading-6 mb-4">
        Você pode solicitar a exclusão permanente da sua conta e todos os dados
        associados a qualquer momento através da opção "Excluir Conta" no menu
        de perfil.
      </Text>

      <Text className="text-lg font-bold mb-2">6. Segurança</Text>
      <Text className="text-gray-700 text-base leading-6 mb-8">
        Utilizamos criptografia, tokens JWT seguros e armazenamento seguro
        (SecureStore) para proteger seus dados em trânsito e em repouso.
      </Text>
    </ScrollView>
  );
}
