import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, type TextInputProps } from "react-native";

type InputType = "text" | "email" | "password" | "cpf" | "cnpj" | "phone" | "currency" | "cep";

interface InputProps extends Omit<TextInputProps, "secureTextEntry"> {
  label?: string;
  error?: string;
  type?: InputType;
}

const masks: Partial<Record<InputType, (value: string) => string>> = {
  cpf: (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  },
  cnpj: (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 14);
    return digits
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  },
  phone: (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  },
  currency: (v) => {
    const digits = v.replace(/\D/g, "");
    if (!digits) return "R$ 0,00";
    const cents = parseInt(digits, 10);
    const reais = (cents / 100).toFixed(2);
    const [intPart, decPart] = reais.split(".");
    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `R$ ${formatted},${decPart}`;
  },
  cep: (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    return digits.replace(/(\d{5})(\d)/, "$1-$2");
  },
};

const keyboardTypes: Partial<Record<InputType, TextInputProps["keyboardType"]>> = {
  email: "email-address",
  cpf: "numeric",
  cnpj: "numeric",
  phone: "phone-pad",
  currency: "numeric",
  cep: "numeric",
};

export function Input({
  label,
  error,
  type = "text",
  onChangeText,
  className = "",
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const maskFn = masks[type];

  const handleChange = (text: string) => {
    const value = maskFn ? maskFn(text) : text;
    onChangeText?.(value);
  };

  return (
    <View className="mb-3">
      {label && <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>}
      <View className="relative">
        <TextInput
          className={`border rounded-lg px-4 py-3 text-base ${
            error ? "border-red-400" : "border-gray-300"
          } ${isPassword ? "pr-12" : ""} ${className}`}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardTypes[type] ?? "default"}
          autoCapitalize={type === "email" ? "none" : type === "text" ? "sentences" : "none"}
          onChangeText={handleChange}
          accessibilityLabel={label}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={() => setShowPassword(!showPassword)}
            accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            <Text className="text-gray-500 text-sm">{showPassword ? "Ocultar" : "Mostrar"}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}
