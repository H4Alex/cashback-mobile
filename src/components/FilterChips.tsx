import { ScrollView, Text, TouchableOpacity } from "react-native";

interface ChipOption<T extends string> {
  value: T;
  label: string;
}

interface FilterChipsProps<T extends string> {
  options: ChipOption<T>[];
  selected?: T;
  onSelect: (value: T | undefined) => void;
}

export function FilterChips<T extends string>({
  options,
  selected,
  onSelect,
}: FilterChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      className="py-2"
    >
      {options.map((option) => {
        const isActive = selected === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            className={`rounded-full px-4 py-2 border ${
              isActive ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"
            }`}
            onPress={() => onSelect(isActive ? undefined : option.value)}
          >
            <Text className={`text-sm font-medium ${isActive ? "text-white" : "text-gray-700"}`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
