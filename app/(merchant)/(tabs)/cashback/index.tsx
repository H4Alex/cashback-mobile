import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const MENU_ITEMS = [
  {
    icon: "💚",
    title: "Gerar Cashback",
    description: "Registrar nova venda e gerar cashback para o cliente",
    route: "/(merchant)/(tabs)/cashback/gerar" as const,
  },
  {
    icon: "💜",
    title: "Utilizar Cashback",
    description: "Cliente resgata cashback na compra",
    route: "/(merchant)/(tabs)/cashback/utilizar" as const,
  },
];

export default function CashbackMenuScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50 px-4 pt-6">
      <Text className="text-2xl font-bold mb-6">Cashback</Text>

      {MENU_ITEMS.map((item) => (
        <TouchableOpacity
          key={item.title}
          className="bg-white rounded-2xl p-5 mb-4 flex-row items-center"
          style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}
          onPress={() => router.push(item.route)}
          activeOpacity={0.7}
        >
          <Text className="text-3xl mr-4">{item.icon}</Text>
          <View className="flex-1">
            <Text className="text-base font-semibold">{item.title}</Text>
            <Text className="text-gray-500 text-sm mt-0.5">{item.description}</Text>
          </View>
          <Text className="text-gray-300 text-xl">›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
