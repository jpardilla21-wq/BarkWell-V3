import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#1E1E1E",
    textMuted: "#6E6E6E",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6E6E6E",
    tabIconSelected: "#4A7BFF",
    link: "#4A7BFF",
    backgroundRoot: "#FDFDFD",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#FDFDFD",
    backgroundTertiary: "#F0F0F0",
    primary: "#4A7BFF",
    primaryGradientStart: "#4A7BFF",
    primaryGradientEnd: "#6ED2FF",
    softGreen: "#6ED29B",
    warningYellow: "#FFD95F",
    urgentRed: "#FF6B6B",
    cardBackground: "#FFFFFF",
    borderLight: "#E5E5E5",
    // Custom action button colors
    actionButton1: "#EDF9D4",
    actionButton2: "#CEB1FB",
    actionButton3: "#BEEC7E",
  },
  dark: {
    text: "#ECEDEE",
    textMuted: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#6ED2FF",
    link: "#6ED2FF",
    backgroundRoot: "#1A1A1A",
    backgroundDefault: "#2A2A2A",
    backgroundSecondary: "#353535",
    backgroundTertiary: "#404040",
    primary: "#4A7BFF",
    primaryGradientStart: "#4A7BFF",
    primaryGradientEnd: "#6ED2FF",
    softGreen: "#6ED29B",
    warningYellow: "#FFD95F",
    urgentRed: "#FF6B6B",
    cardBackground: "#2A2A2A",
    borderLight: "#404040",
    // Custom action button colors (darker versions for dark mode)
    actionButton1: "#3A4A2D",
    actionButton2: "#4A3A5A",
    actionButton3: "#4A5A3A",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  full: 9999,
};

export const Typography = {
  headingL: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  headingM: {
    fontSize: 22,
    fontWeight: "600" as const,
  },
  headingS: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  bodyM: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  bodyS: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  label: {
    fontSize: 13,
    fontWeight: "500" as const,
  },
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 22,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
