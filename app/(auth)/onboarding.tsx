import { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  type ViewToken,
} from "react-native";
import { useRouter } from "expo-router";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();
const ONBOARDING_KEY = "onboarding_completed";

export function hasCompletedOnboarding(): boolean {
  return storage.getBoolean(ONBOARDING_KEY) === true;
}

const slides = [
  {
    id: "1",
    icon: "💰",
    title: "Cashback de verdade",
    description:
      "Receba dinheiro de volta a cada compra em lojas parceiras. Sem complicação, sem pegadinha.",
  },
  {
    id: "2",
    icon: "📱",
    title: "Resgate fácil",
    description:
      "Use seu saldo direto no app com QR Code. Rápido, seguro e sem burocracia.",
  },
  {
    id: "3",
    icon: "🔔",
    title: "Fique por dentro",
    description:
      "Receba notificações de cashback, promoções exclusivas e acompanhe seu saldo em tempo real.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const finishOnboarding = () => {
    storage.set(ONBOARDING_KEY, true);
    router.replace("/(auth)/login");
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      finishOnboarding();
    }
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View className="flex-1 bg-white">
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 items-center justify-center px-10">
            <Text className="text-7xl mb-8">{item.icon}</Text>
            <Text className="text-2xl font-bold text-center mb-4">{item.title}</Text>
            <Text className="text-base text-gray-600 text-center leading-6">
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Dots */}
      <View className="flex-row justify-center mb-8">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`w-2.5 h-2.5 rounded-full mx-1.5 ${
              index === currentIndex ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        ))}
      </View>

      {/* Buttons */}
      <View className="px-6 pb-12 flex-row justify-between items-center">
        <TouchableOpacity onPress={finishOnboarding} className="py-3 px-4">
          <Text className="text-gray-500 text-base">Pular</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="bg-green-500 rounded-xl py-4 px-8"
          accessibilityLabel={
            currentIndex === slides.length - 1 ? "Começar a usar o app" : "Próximo slide"
          }
          accessibilityRole="button"
        >
          <Text className="text-white font-semibold text-base">
            {currentIndex === slides.length - 1 ? "Começar" : "Próximo"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
