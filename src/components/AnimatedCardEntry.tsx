import { useEffect } from "react";
import { type ViewProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from "react-native-reanimated";

interface AnimatedCardEntryProps extends ViewProps {
  index?: number;
  delay?: number;
  children: React.ReactNode;
}

/**
 * Wraps children with a fade-in + translateY animation.
 * Stagger multiple cards by passing an index (50ms delay each).
 */
export function AnimatedCardEntry({
  index = 0,
  delay = 50,
  children,
  style,
  ...props
}: AnimatedCardEntryProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const entryDelay = index * delay;
    opacity.value = withDelay(entryDelay, withSpring(1, { damping: 20, stiffness: 200 }));
    translateY.value = withDelay(entryDelay, withSpring(0, { damping: 20, stiffness: 200 }));
  }, [index, delay, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}
