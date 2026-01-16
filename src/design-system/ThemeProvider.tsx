/**
 * BarkWell Theme Provider
 * Provides theme context and utility styles throughout the app
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import DesignSystem, {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  ComponentTokens,
} from './DesignSystem';

// ============================================================================
// THEME CONTEXT
// ============================================================================

interface ThemeContextValue {
  colors: typeof Colors;
  typography: typeof Typography;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  shadows: typeof Shadows;
  componentTokens: typeof ComponentTokens;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// ============================================================================
// THEME PROVIDER
// ============================================================================

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const value: ThemeContextValue = {
    colors: Colors,
    typography: Typography,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    componentTokens: ComponentTokens,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// ============================================================================
// THEME HOOK
// ============================================================================

/**
 * Hook to access the theme context
 * @returns Theme context value with all design tokens
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// ============================================================================
// COMMON STYLES
// ============================================================================

export const CommonStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.cream,
  },
  containerPadded: {
    flex: 1,
    backgroundColor: Colors.neutral.cream,
    padding: Spacing.lg,
  },
  containerCentered: {
    flex: 1,
    backgroundColor: Colors.neutral.cream,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card Styles
  card: {
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.xl,
    padding: ComponentTokens.card.padding.md,
    ...Shadows.md,
  },
  cardSmall: {
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius.lg,
    padding: ComponentTokens.card.padding.sm,
    ...Shadows.sm,
  },
  cardLarge: {
    backgroundColor: Colors.neutral.white,
    borderRadius: BorderRadius['2xl'],
    padding: ComponentTokens.card.padding.lg,
    ...Shadows.lg,
  },

  // Layout Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Shadow Utilities
  shadowSm: Shadows.sm,
  shadowMd: Shadows.md,
  shadowLg: Shadows.lg,
  shadowXl: Shadows.xl,
  shadowGlowPrimary: Shadows.glow.primary,
  shadowGlowAccent: Shadows.glow.accent,

  // Border Radius Utilities
  roundedSm: { borderRadius: BorderRadius.sm },
  roundedMd: { borderRadius: BorderRadius.md },
  roundedLg: { borderRadius: BorderRadius.lg },
  roundedXl: { borderRadius: BorderRadius.xl },
  rounded2xl: { borderRadius: BorderRadius['2xl'] },
  rounded3xl: { borderRadius: BorderRadius['3xl'] },
  roundedFull: { borderRadius: BorderRadius.full },
});

// ============================================================================
// TEXT STYLES
// ============================================================================

export const TextStyles = StyleSheet.create({
  // Display Styles (Poppins)
  displayLarge: {
    fontFamily: Typography.fontFamily.display,
    fontSize: Typography.fontSize['5xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize['5xl'] * Typography.lineHeight.tight,
    color: Colors.neutral[900],
  } as TextStyle,
  displayMedium: {
    fontFamily: Typography.fontFamily.display,
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize['4xl'] * Typography.lineHeight.tight,
    color: Colors.neutral[900],
  } as TextStyle,
  displaySmall: {
    fontFamily: Typography.fontFamily.display,
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize['3xl'] * Typography.lineHeight.tight,
    color: Colors.neutral[900],
  } as TextStyle,

  // Heading Styles (Inter)
  h1: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    lineHeight: Typography.fontSize['3xl'] * Typography.lineHeight.tight,
    color: Colors.neutral[900],
  } as TextStyle,
  h2: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize['2xl'] * Typography.lineHeight.tight,
    color: Colors.neutral[900],
  } as TextStyle,
  h3: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    lineHeight: Typography.fontSize.xl * Typography.lineHeight.normal,
    color: Colors.neutral[900],
  } as TextStyle,
  h4: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.normal,
    color: Colors.neutral[900],
  } as TextStyle,

  // Body Styles (Inter)
  bodyLarge: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.lg * Typography.lineHeight.relaxed,
    color: Colors.neutral[800],
  } as TextStyle,
  body: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    color: Colors.neutral[800],
  } as TextStyle,
  bodySmall: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.relaxed,
    color: Colors.neutral[700],
  } as TextStyle,

  // Label Styles (Inter)
  label: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    color: Colors.neutral[900],
  } as TextStyle,
  labelSmall: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.sm * Typography.lineHeight.normal,
    color: Colors.neutral[800],
  } as TextStyle,

  // Caption Style
  caption: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.xs * Typography.lineHeight.normal,
    color: Colors.neutral[600],
  } as TextStyle,

  // Monospace (for numbers)
  mono: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.regular,
    lineHeight: Typography.fontSize.base * Typography.lineHeight.normal,
    color: Colors.neutral[900],
  } as TextStyle,
  monoLarge: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.medium,
    lineHeight: Typography.fontSize.xl * Typography.lineHeight.normal,
    color: Colors.neutral[900],
  } as TextStyle,
});

// ============================================================================
// BUTTON STYLES
// ============================================================================

export const ButtonStyles = StyleSheet.create({
  // Base Button Style
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ComponentTokens.button.borderRadius.md,
  } as ViewStyle,

  // Button Sizes
  sizeSmall: {
    height: ComponentTokens.button.height.sm,
    paddingHorizontal: ComponentTokens.button.padding.sm.horizontal,
    paddingVertical: ComponentTokens.button.padding.sm.vertical,
    borderRadius: ComponentTokens.button.borderRadius.sm,
  } as ViewStyle,
  sizeMedium: {
    height: ComponentTokens.button.height.md,
    paddingHorizontal: ComponentTokens.button.padding.md.horizontal,
    paddingVertical: ComponentTokens.button.padding.md.vertical,
    borderRadius: ComponentTokens.button.borderRadius.md,
  } as ViewStyle,
  sizeLarge: {
    height: ComponentTokens.button.height.lg,
    paddingHorizontal: ComponentTokens.button.padding.lg.horizontal,
    paddingVertical: ComponentTokens.button.padding.lg.vertical,
    borderRadius: ComponentTokens.button.borderRadius.lg,
  } as ViewStyle,

  // Button Variants
  primary: {
    backgroundColor: Colors.primary[500],
    ...Shadows.md,
  } as ViewStyle,
  secondary: {
    backgroundColor: Colors.secondary[500],
    ...Shadows.md,
  } as ViewStyle,
  accent: {
    backgroundColor: Colors.accent[500],
    ...Shadows.md,
  } as ViewStyle,
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primary[500],
  } as ViewStyle,
  ghost: {
    backgroundColor: 'transparent',
  } as ViewStyle,
  white: {
    backgroundColor: Colors.neutral.white,
    ...Shadows.sm,
  } as ViewStyle,

  // Button States
  disabled: {
    opacity: 0.5,
  } as ViewStyle,
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  } as ViewStyle,

  // Button Text Styles
  textSmall: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral.white,
  } as TextStyle,
  textMedium: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral.white,
  } as TextStyle,
  textLarge: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral.white,
  } as TextStyle,
  textOutline: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary[500],
  } as TextStyle,
  textGhost: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary[500],
  } as TextStyle,
  textWhite: {
    fontFamily: Typography.fontFamily.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary[500],
  } as TextStyle,
});

// ============================================================================
// EXPORTS
// ============================================================================

export { DesignSystem, Colors, Typography, Spacing, BorderRadius, Shadows, ComponentTokens };

export default {
  ThemeProvider,
  useTheme,
  CommonStyles,
  TextStyles,
  ButtonStyles,
  DesignSystem,
};
