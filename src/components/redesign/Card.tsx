/**
 * Card Component
 * Flexible container component with multiple variants
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/design-system';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  noPadding?: boolean;
  variant?: 'elevated' | 'flat' | 'outlined';
}

export default function Card({
  children,
  style,
  noPadding = false,
  variant = 'elevated'
}: CardProps) {
  const { colors, borderRadius, shadows, componentTokens } = useTheme();

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: colors.neutral.white,
          ...shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: colors.neutral.white,
          borderWidth: 1,
          borderColor: colors.neutral[300],
        };
      case 'flat':
        return {
          backgroundColor: colors.neutral.white,
        };
      default:
        return {
          backgroundColor: colors.neutral.white,
          ...shadows.md,
        };
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: borderRadius.xl,
          padding: noPadding ? 0 : componentTokens.card.padding.md,
        },
        getVariantStyle(),
        style,
      ]}
      accessible={true}
      accessibilityRole="none"
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
