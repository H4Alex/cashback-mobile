import { View, Text, type ViewProps } from "react-native";
import { Platform } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  android: { elevation: 4 },
  default: {},
});

export function Card({ children, className = "", style, ...props }: CardProps) {
  return (
    <View className={`bg-white rounded-2xl ${className}`} style={[shadow, style]} {...props}>
      {children}
    </View>
  );
}

export function CardHeader({ title, subtitle, right }: CardHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
      <View className="flex-1">
        <Text className="text-lg font-bold">{title}</Text>
        {subtitle && <Text className="text-sm text-gray-500 mt-0.5">{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}

export function CardContent({ children, className = "", ...props }: CardProps) {
  return (
    <View className={`px-4 pb-4 ${className}`} {...props}>
      {children}
    </View>
  );
}
