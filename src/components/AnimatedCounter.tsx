import { useEffect } from "react";
import { Text, type TextProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedText = Animated.createAnimatedComponent(Text);

interface AnimatedCounterProps extends Omit<TextProps, "children"> {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 800,
  decimals = 2,
  ...textProps
}: AnimatedCounterProps) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, animatedValue, duration]);

  const animatedProps = useAnimatedProps(() => {
    const formatted = animatedValue.value.toFixed(decimals);
    const [intPart, decPart] = formatted.split(".");
    const withDots = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return {
      text: `${prefix}${withDots},${decPart}${suffix}`,
      defaultValue: `${prefix}0,${"0".repeat(decimals)}${suffix}`,
    } as { text: string; defaultValue: string };
  });

  return <AnimatedText {...textProps} animatedProps={animatedProps} />;
}
