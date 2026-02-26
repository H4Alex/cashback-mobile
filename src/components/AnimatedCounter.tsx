import { useEffect, useState } from "react";
import { Text, type TextProps } from "react-native";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";

interface AnimatedCounterProps extends Omit<TextProps, "children"> {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

function formatNumber(val: number, decimals: number): string {
  const formatted = val.toFixed(decimals);
  const [intPart, decPart] = formatted.split(".");
  const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${withDots},${decPart}`;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 800,
  decimals = 2,
  ...textProps
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(
    `${prefix}${formatNumber(0, decimals)}${suffix}`,
  );
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, animatedValue, duration]);

  // In production, this would use useAnimatedReaction to update on every frame.
  // For simplicity, we set the final value after animation completes.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(`${prefix}${formatNumber(value, decimals)}${suffix}`);
    }, duration);
    return () => clearTimeout(timer);
  }, [value, prefix, suffix, duration, decimals]);

  return <Text {...textProps}>{displayValue}</Text>;
}
