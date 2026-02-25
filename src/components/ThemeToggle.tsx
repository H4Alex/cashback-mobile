import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/theme";

type ThemeMode = "light" | "dark" | "system";

const OPTIONS: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: "light", label: "Claro", icon: "☀️" },
  { mode: "dark", label: "Escuro", icon: "🌙" },
  { mode: "system", label: "Sistema", icon: "📱" },
];

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <View accessibilityRole="radiogroup" accessibilityLabel="Selecionar tema">
      <Text className="text-sm font-semibold text-gray-700 mb-2">Tema</Text>
      <View className="flex-row gap-2">
        {OPTIONS.map((opt) => {
          const isActive = mode === opt.mode;
          return (
            <TouchableOpacity
              key={opt.mode}
              className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border ${
                isActive ? "bg-blue-50 border-blue-300" : "bg-white border-gray-200"
              }`}
              onPress={() => setMode(opt.mode)}
              accessibilityRole="radio"
              accessibilityState={{ checked: isActive }}
              accessibilityLabel={`Tema ${opt.label}`}
            >
              <Text className="mr-1">{opt.icon}</Text>
              <Text
                className={`text-sm font-medium ${isActive ? "text-blue-700" : "text-gray-600"}`}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
