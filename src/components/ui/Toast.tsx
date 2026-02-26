import { useEffect, useRef } from "react";
import { View, Text, Animated, TouchableOpacity, Platform } from "react-native";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onDismiss: () => void;
}

const config: Record<ToastType, { bg: string; text: string; icon: string }> = {
  success: { bg: "bg-green-600", text: "text-white", icon: "✓" },
  error: { bg: "bg-red-600", text: "text-white", icon: "✕" },
  warning: { bg: "bg-yellow-500", text: "text-yellow-900", icon: "!" },
  info: { bg: "bg-blue-600", text: "text-white", icon: "i" },
};

const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
  },
  android: { elevation: 12 },
  default: {},
});

export function Toast({ visible, message, type = "info", duration = 3000, onDismiss }: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const { bg, text, icon } = config[type];

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();

      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY, duration, onDismiss]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[{ transform: [{ translateY }] }, shadow]}
      className="absolute top-12 left-4 right-4 z-50"
    >
      <TouchableOpacity
        onPress={onDismiss}
        className={`${bg} rounded-xl px-4 py-3 flex-row items-center`}
        activeOpacity={0.9}
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
      >
        <View className="w-6 h-6 rounded-full bg-white/20 items-center justify-center mr-3">
          <Text className={`${text} text-xs font-bold`}>{icon}</Text>
        </View>
        <Text className={`${text} text-sm font-medium flex-1`}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
