/**
 * BarkWell Design System
 * Comprehensive design tokens inspired by modern pet care app design
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const Colors = {
  // Primary Color: Vibrant Green
  primary: {
    50: '#F1F8E9',
    100: '#DCEDC8',
    200: '#C5E1A5',
    300: '#AED581',
    400: '#9CCC65',
    500: '#8BC34A', // Main primary color
    600: '#7CB342',
    700: '#689F38',
    800: '#558B2F',
    900: '#33691E',
  },

  // Secondary Color: Deep Olive
  secondary: {
    50: '#F4F6F0',
    100: '#E3E9D9',
    200: '#D0DABF',
    300: '#BDCBA5',
    400: '#AEC092',
    500: '#6B9B37', // Main secondary color
    600: '#5F8B31',
    700: '#53792A',
    800: '#476823',
    900: '#354F17',
  },

  // Accent Color: Orange for warnings/attention
  accent: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800', // Main accent color
    600: '#FB8C00',
    700: '#F57C00',
    800: '#EF6C00',
    900: '#E65100',
  },

  // Neutral Colors: Warm cream and gray scale
  neutral: {
    cream: '#F5F5DC',
    creamDark: '#EEEECD',
    white: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    black: '#000000',
  },

  // Status Colors for Health Metrics
  status: {
    excellent: {
      background: '#E8F5E9',
      border: '#66BB6A',
      text: '#2E7D32',
      icon: '#4CAF50',
    },
    good: {
      background: '#F1F8E9',
      border: '#9CCC65',
      text: '#558B2F',
      icon: '#8BC34A',
    },
    attention: {
      background: '#FFF9C4',
      border: '#FDD835',
      text: '#F57F17',
      icon: '#FFEB3B',
    },
    warning: {
      background: '#FFE0B2',
      border: '#FFA726',
      text: '#E65100',
      icon: '#FF9800',
    },
    critical: {
      background: '#FFEBEE',
      border: '#EF5350',
      text: '#C62828',
      icon: '#F44336',
    },
  },

  // Semantic Colors
  semantic: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
  },
};

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const Typography = {
  // Font Families
  fontFamily: {
    primary: 'Inter',
    display: 'Poppins',
    mono: 'SF Mono',
  },

  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  // Font Weights
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  // Letter Spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },
};

// ============================================================================
// SPACING
// ============================================================================

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
  '5xl': 80,
  '6xl': 96,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// ============================================================================
// SHADOWS
// ============================================================================

export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  // Colored glows for special effects
  glow: {
    primary: {
      shadowColor: '#8BC34A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    accent: {
      shadowColor: '#FF9800',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
  },
};

// ============================================================================
// ANIMATIONS
// ============================================================================

export const Animation = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'spring',
  },
};

// ============================================================================
// COMPONENT TOKENS
// ============================================================================

export const ComponentTokens = {
  // Button Tokens
  button: {
    height: {
      sm: 32,
      md: 44,
      lg: 56,
    },
    padding: {
      sm: { horizontal: 12, vertical: 6 },
      md: { horizontal: 20, vertical: 12 },
      lg: { horizontal: 28, vertical: 16 },
    },
    borderRadius: {
      sm: BorderRadius.md,
      md: BorderRadius.lg,
      lg: BorderRadius.xl,
    },
  },

  // Card Tokens
  card: {
    padding: {
      sm: Spacing.md,
      md: Spacing.lg,
      lg: Spacing.xl,
    },
    borderRadius: BorderRadius.xl,
    gap: Spacing.md,
  },

  // Input Tokens
  input: {
    height: {
      sm: 36,
      md: 48,
      lg: 56,
    },
    padding: {
      horizontal: Spacing.md,
      vertical: Spacing.sm,
    },
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },

  // Tab Tokens
  tab: {
    height: 48,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },

  // Avatar Tokens
  avatar: {
    size: {
      xs: 24,
      sm: 32,
      md: 48,
      lg: 64,
      xl: 96,
      '2xl': 128,
    },
    borderRadius: BorderRadius.full,
    borderWidth: 2,
  },

  // Progress Ring Tokens
  progressRing: {
    size: {
      sm: 60,
      md: 80,
      lg: 120,
      xl: 160,
    },
    strokeWidth: {
      sm: 4,
      md: 6,
      lg: 8,
      xl: 10,
    },
  },
};

// ============================================================================
// HEALTH SCORE SYSTEM
// ============================================================================

export const HealthScore = {
  thresholds: {
    excellent: 85,
    good: 70,
    attention: 50,
    warning: 30,
    critical: 0,
  },
  labels: {
    excellent: 'Excellent',
    good: 'Good',
    attention: 'Needs Attention',
    warning: 'Warning',
    critical: 'Critical',
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export type HealthScoreLevel = 'excellent' | 'good' | 'attention' | 'warning' | 'critical';

/**
 * Get the health score color based on the score value
 * @param score - Health score value (0-100)
 * @returns Color object for the health score level
 */
export function getHealthScoreColor(score: number): typeof Colors.status.excellent {
  if (score >= HealthScore.thresholds.excellent) {
    return Colors.status.excellent;
  } else if (score >= HealthScore.thresholds.good) {
    return Colors.status.good;
  } else if (score >= HealthScore.thresholds.attention) {
    return Colors.status.attention;
  } else if (score >= HealthScore.thresholds.warning) {
    return Colors.status.warning;
  } else {
    return Colors.status.critical;
  }
}

/**
 * Get the health score label based on the score value
 * @param score - Health score value (0-100)
 * @returns Label string for the health score level
 */
export function getHealthScoreLabel(score: number): string {
  if (score >= HealthScore.thresholds.excellent) {
    return HealthScore.labels.excellent;
  } else if (score >= HealthScore.thresholds.good) {
    return HealthScore.labels.good;
  } else if (score >= HealthScore.thresholds.attention) {
    return HealthScore.labels.attention;
  } else if (score >= HealthScore.thresholds.warning) {
    return HealthScore.labels.warning;
  } else {
    return HealthScore.labels.critical;
  }
}

/**
 * Get the health score level based on the score value
 * @param score - Health score value (0-100)
 * @returns Health score level
 */
export function getHealthScoreLevel(score: number): HealthScoreLevel {
  if (score >= HealthScore.thresholds.excellent) {
    return 'excellent';
  } else if (score >= HealthScore.thresholds.good) {
    return 'good';
  } else if (score >= HealthScore.thresholds.attention) {
    return 'attention';
  } else if (score >= HealthScore.thresholds.warning) {
    return 'warning';
  } else {
    return 'critical';
  }
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ColorPalette = typeof Colors;
export type TypographyScale = typeof Typography;
export type SpacingScale = typeof Spacing;
export type BorderRadiusScale = typeof BorderRadius;
export type ShadowScale = typeof Shadows;
export type AnimationScale = typeof Animation;
export type ComponentTokensScale = typeof ComponentTokens;

// Default export for convenience
const DesignSystem = {
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
};

export default DesignSystem;
