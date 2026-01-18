import React from "react";
import {
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  Text,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface FeatureCardProps {
  title: string;
  subtitle: string;
  iconName?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  emoji?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FeatureCard({
  title,
  subtitle,
  iconName,
  iconColor,
  emoji,
  onPress,
  style,
  backgroundColor,
}: FeatureCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: backgroundColor || theme.cardBackground },
        style,
        animatedStyle,
      ]}
    >
      {emoji ? (
        <Text style={styles.emoji}>{emoji}</Text>
      ) : (
        <Feather
          name={iconName!}
          size={36}
          color={iconColor}
          style={styles.icon}
        />
      )}
      <ThemedText type="h4" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="small" style={{ color: theme.textMuted }}>
        {subtitle}
      </ThemedText>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  icon: {
    marginBottom: Spacing.sm,
  },
  emoji: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  title: {
    marginBottom: Spacing.xs,
  },
});
