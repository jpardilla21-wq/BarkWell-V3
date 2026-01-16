/**
 * BarkWell Design System - Main Entry Point
 * Export all design system utilities for easy importing
 */

// Design Tokens
export {
  default as DesignSystem,
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animation,
  ComponentTokens,
  HealthScore,
  getHealthScoreColor,
  getHealthScoreLabel,
  getHealthScoreLevel,
} from './DesignSystem';

// Theme Provider and Utilities
export {
  ThemeProvider,
  useTheme,
  CommonStyles,
  TextStyles,
  ButtonStyles,
} from './ThemeProvider';

// Type Exports
export type {
  ColorPalette,
  TypographyScale,
  SpacingScale,
  BorderRadiusScale,
  ShadowScale,
  AnimationScale,
  ComponentTokensScale,
  HealthScoreLevel,
} from './DesignSystem';
