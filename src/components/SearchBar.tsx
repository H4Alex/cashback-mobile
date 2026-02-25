import { View, TextInput } from "react-native";
import { useRef, useCallback } from "react";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Buscar...",
  debounceMs = 300,
}: SearchBarProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (text: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => onChangeText(text), debounceMs);
    },
    [onChangeText, debounceMs],
  );

  return (
    <View className="bg-white border border-gray-200 rounded-xl px-4 flex-row items-center">
      <TextInput
        className="flex-1 py-3 text-base"
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        defaultValue={value}
        onChangeText={handleChange}
        accessibilityLabel={placeholder}
        returnKeyType="search"
      />
    </View>
  );
}
