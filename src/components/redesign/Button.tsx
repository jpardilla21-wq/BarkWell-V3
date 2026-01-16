/**
 * Button Component
 * Reusable button with multiple variants, sizes, and loading states
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { useTheme } from '@/src/design-system';

interface ButtonProps {
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  fullWidth?: boolean;
  onPress?: () => void;
}

export default function Button({
  children,
  leftIcon,
  rightIcon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  fullWidth = false,
  onPress,
}: ButtonProps) {
  const { colors, typography, spacing, componentTokens, shadows } = useTheme();

  // Get button styles based on variant
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary[500],
          ...shadows.md,
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary[500],
          ...shadows.md,
        };
      case 'accent':
        return {
          backgroundColor: colors.accent[500],
          ...shadows.md,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary[500],
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.primary[500],
          ...shadows.md,
        };
    }
  };

  // Get button size styles
  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return {
          height: componentTokens.button.height.sm,
          paddingHorizontal: componentTokens.button.padding.sm.horizontal,
          borderRadius: componentTokens.button.borderRadius.sm,
        };
      case 'md':
        return {
          height: componentTokens.button.height.md,
          paddingHorizontal: componentTokens.button.padding.md.horizontal,
          borderRadius: componentTokens.button.borderRadius.md,
        };
      case 'lg':
        return {
          height: componentTokens.button.height.lg,
          paddingHorizontal: componentTokens.button.padding.lg.horizontal,
          borderRadius: componentTokens.button.borderRadius.lg,
        };
      default:
        return {
          height: componentTokens.button.height.md,
          paddingHorizontal: componentTokens.button.padding.md.horizontal,
          borderRadius: componentTokens.button.borderRadius.md,
        };
    }
  };

  // Get text color based on variant
  const getTextColor = (): string => {
    if (variant === 'outline' || variant === 'ghost') {
      return colors.primary[500];
    }
    return colors.neutral.white;
  };

  // Get text size based on button size
  const getTextSize = (): number => {
    switch (size) {
      case 'sm':
        return typography.fontSize.sm;
      case 'md':
        return typography.fontSize.base;
      case 'lg':
        return typography.fontSize.lg;
      default:
        return typography.fontSize.base;
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.base,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={{ marginRight: spacing.sm }}
        />
      )}

      {!loading && leftIcon && (
        <View style={{ marginRight: spacing.sm }}>{leftIcon}</View>
      )}

      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            fontSize: getTextSize(),
            fontFamily: typography.fontFamily.primary,
            fontWeight: typography.fontWeight.semibold,
          },
          textStyle,
        ]}
      >
        {children}
      </Text>

      {!loading && rightIcon && (
        <View style={{ marginLeft: spacing.sm }}>{rightIcon}</View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    textAlign: 'center',
  },
});
