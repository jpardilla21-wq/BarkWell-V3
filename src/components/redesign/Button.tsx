/**
 * Button Component
 * Reusable button with variants, sizes, icons, and loading states
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
import { useTheme } from '@/design-system';

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
  const { colors, typography, shadows, componentTokens, spacing } = useTheme();

  const isDisabled = disabled || loading;

  // Get button background and text colors based on variant
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'primary':
        return {
          container: {
            backgroundColor: colors.primary[500],
            ...shadows.md,
          },
          text: {
            color: colors.neutral.white,
          },
        };
      case 'secondary':
        return {
          container: {
            backgroundColor: colors.secondary[500],
            ...shadows.md,
          },
          text: {
            color: colors.neutral.white,
          },
        };
      case 'accent':
        return {
          container: {
            backgroundColor: colors.accent[500],
            ...shadows.md,
          },
          text: {
            color: colors.neutral.white,
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colors.primary[500],
          },
          text: {
            color: colors.primary[500],
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: colors.primary[500],
          },
        };
      default:
        return {
          container: {
            backgroundColor: colors.primary[500],
            ...shadows.md,
          },
          text: {
            color: colors.neutral.white,
          },
        };
    }
  };

  // Get size-specific styles
  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            height: componentTokens.button.height.sm,
            paddingHorizontal: componentTokens.button.padding.sm.horizontal,
            borderRadius: componentTokens.button.borderRadius.sm,
          },
          text: {
            fontSize: typography.fontSize.sm,
          },
        };
      case 'md':
        return {
          container: {
            height: componentTokens.button.height.md,
            paddingHorizontal: componentTokens.button.padding.md.horizontal,
            borderRadius: componentTokens.button.borderRadius.md,
          },
          text: {
            fontSize: typography.fontSize.base,
          },
        };
      case 'lg':
        return {
          container: {
            height: componentTokens.button.height.lg,
            paddingHorizontal: componentTokens.button.padding.lg.horizontal,
            borderRadius: componentTokens.button.borderRadius.lg,
          },
          text: {
            fontSize: typography.fontSize.lg,
          },
        };
      default:
        return {
          container: {
            height: componentTokens.button.height.md,
            paddingHorizontal: componentTokens.button.padding.md.horizontal,
            borderRadius: componentTokens.button.borderRadius.md,
          },
          text: {
            fontSize: typography.fontSize.base,
          },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  // Get spinner color based on variant
  const getSpinnerColor = (): string => {
    if (variant === 'outline' || variant === 'ghost') {
      return colors.primary[500];
    }
    return colors.neutral.white;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variantStyles.container,
        sizeStyles.container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={typeof children === 'string' ? children : 'Button'}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getSpinnerColor()}
          accessibilityLabel="Loading"
        />
      ) : (
        <>
          {leftIcon && (
            <View style={[styles.iconContainer, { marginRight: spacing.sm }]}>
              {leftIcon}
            </View>
          )}
          <Text
            style={[
              styles.text,
              variantStyles.text,
              sizeStyles.text,
              {
                fontFamily: typography.fontFamily.primary,
                fontWeight: typography.fontWeight.semibold,
              },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {children}
          </Text>
          {rightIcon && (
            <View style={[styles.iconContainer, { marginLeft: spacing.sm }]}>
              {rightIcon}
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
