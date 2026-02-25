import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { formatCurrency } from "@/src/utils/formatters";

interface ConfirmationItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface CashbackConfirmationProps {
  title: string;
  items: ConfirmationItem[];
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export function CashbackConfirmation({
  title,
  items,
  confirmLabel,
  onConfirm,
  onCancel,
  isPending,
}: CashbackConfirmationProps) {
  return (
    <View className="bg-white rounded-2xl p-6 mx-4">
      <Text className="text-lg font-bold text-center mb-4">{title}</Text>

      <View className="bg-gray-50 rounded-xl p-4 mb-6">
        {items.map((item, i) => (
          <View
            key={item.label}
            className={`flex-row justify-between py-2 ${i < items.length - 1 ? "border-b border-gray-200" : ""}`}
          >
            <Text className="text-gray-600 text-sm">{item.label}</Text>
            <Text
              className={`font-semibold text-sm ${item.highlight ? "text-green-600" : "text-gray-900"}`}
            >
              {item.value}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        className={`rounded-xl py-4 items-center mb-3 ${isPending ? "bg-blue-400" : "bg-blue-600"}`}
        onPress={onConfirm}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">{confirmLabel}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity className="py-3 items-center" onPress={onCancel} disabled={isPending}>
        <Text className="text-gray-500 font-medium">Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

/** Reusable helper to format confirmation items */
export function makeConfirmationItems(
  entries: { label: string; value: number; highlight?: boolean }[],
): ConfirmationItem[] {
  return entries.map((e) => ({
    label: e.label,
    value: formatCurrency(e.value),
    highlight: e.highlight,
  }));
}
