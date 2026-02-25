import { TouchableOpacity, Text } from "react-native";

interface FABProps {
  label: string;
  onPress: () => void;
}

export function FAB({ label, onPress }: FABProps) {
  return (
    <TouchableOpacity
      className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center"
      style={{
        shadowColor: "#2563eb",
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text className="text-white text-2xl font-bold">{label}</Text>
    </TouchableOpacity>
  );
}
