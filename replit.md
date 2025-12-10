# PupSense - Dog Health Assistant

## Overview

PupSense is a React Native mobile application built with Expo that serves as an AI-powered dog health assistant. The app helps pet owners monitor their dog's health through three main features: poop analysis, food safety scanning, and behavior checking. It supports iOS, Android, and web platforms through Expo's managed workflow.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Framework
- **React Native with Expo**: Uses the managed workflow with TypeScript for cross-platform mobile development (iOS, Android, web)
- **New Architecture Enabled**: React 19.1 with the React Compiler experiment enabled for performance optimization
- **Module Path Aliases**: Uses `@/` prefix for imports via babel-plugin-module-resolver, mapping to the project root

### Navigation Structure
- **React Navigation v7**: Implements a hierarchical navigation pattern
  - Root Stack Navigator: Handles app flow (Splash → Onboarding → Subscription → MainTabs)
  - Bottom Tab Navigator: Four main tabs (Home, Poop, Behavior, Profile)
  - Nested Stack Navigators: Each tab has its own stack for screen management (HomeStackNavigator, PoopStackNavigator, BehaviorStackNavigator, ProfileStackNavigator)

### Component Architecture
- **Themed Components**: `ThemedText` and `ThemedView` provide consistent styling with automatic dark/light mode support
- **Custom Hooks**: 
  - `useTheme`: Returns current theme colors and dark mode state
  - `useScreenInsets`: Calculates safe area padding with navigation headers/tab bars
- **Screen Components**: Specialized scroll views (`ScreenScrollView`, `ScreenKeyboardAwareScrollView`, `ScreenFlatList`) handle platform-specific keyboard behavior and insets

### Design System
- **Theme Constants** (`constants/theme.ts`): Centralized colors, spacing, border radius, and typography tokens
- **Color Palette**: Primary blue (#4A7BFF), status colors (green/yellow/red for Low/Medium/High risk)
- **Dark Mode**: Full dark theme support with automatic color switching based on system preference

### State Management
- **Context API**: Language context for internationalization (English/Spanish support)
- **Local Component State**: Feature screens manage their own analysis state using React useState

### Animation & Gestures
- **React Native Reanimated**: Powers smooth animations with spring configurations for button presses and card interactions
- **React Native Gesture Handler**: Enables native gesture handling for improved touch responsiveness
- **Keyboard Controller**: Platform-aware keyboard handling with web fallback

### Platform Considerations
- **iOS**: Blur effects for tab bar and headers using expo-blur
- **Android**: Edge-to-edge enabled, solid backgrounds instead of blur effects
- **Web**: Fallback implementations for native-only features

## External Dependencies

### Expo SDK Packages
- `expo-image-picker`: Camera and photo library access for analyzing dog photos/food images
- `expo-haptics`: Tactile feedback for button presses
- `expo-linear-gradient`: Gradient backgrounds for splash screen and UI elements
- `expo-blur`: Glass effect headers and tab bars (iOS)
- `expo-glass-effect`: Liquid glass UI detection for iOS 26+
- `expo-web-browser`: External link handling
- `expo-splash-screen`: Native splash screen configuration

### Navigation
- `@react-navigation/native`: Core navigation
- `@react-navigation/native-stack`: Native stack navigator with platform animations
- `@react-navigation/bottom-tabs`: Tab bar navigation
- `@react-navigation/elements`: Shared navigation UI components

### UI Libraries
- `@expo/vector-icons`: Feather icon set for consistent iconography
- `react-native-safe-area-context`: Safe area inset handling
- `react-native-screens`: Native screen containers for performance

### Development Tools
- TypeScript with strict mode
- ESLint with Expo and Prettier configurations
- Babel with module-resolver for path aliases

### No Backend Integration
The current implementation is frontend-only with mock/placeholder AI analysis. Future integration would likely require:
- AI/ML API for image analysis (poop, behavior, food scanning)
- User authentication service
- Database for user profiles, dog profiles, and analysis history
- Subscription/payment processing