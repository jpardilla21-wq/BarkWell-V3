# PupSense - Dog Health Assistant

## Overview

PupSense is a React Native mobile application built with Expo that serves as an AI-powered dog health assistant. The app helps pet owners monitor their dog's health through three main features: poop analysis, food safety scanning, and behavior checking. It supports iOS, Android, and web platforms through Expo's managed workflow.

## Latest Updates - AI Integration (December 11, 2025)

### AI Services Integrated
- **OpenAI API (GPT-4 Vision)**: 
  - Poop Check Screen: Image analysis for stool health assessment
  - Behavior Check Screen: Video frame analysis for emotional state detection
  
- **Gemini API (Google's Vision AI)**:
  - Food Scanner Screen: OCR text extraction and ingredient safety analysis

### Implementation Details

#### 1. **Poop Check Screen** (`screens/PoopCheckScreen.tsx`)
- Uses `analyzePoopWithOpenAI()` from `utils/apiClient.ts`
- Accepts photo or text description
- Returns: risk level (Low/Medium/High), summary, and actionable tips
- Converts image to base64 and sends to OpenAI GPT-4 Vision API

#### 2. **Food Scanner Screen** (`screens/FoodScannerScreen.tsx`)
- Uses `analyzeIngredientWithGemini()` from `utils/apiClient.ts`
- Accepts photo or manually entered ingredient list
- Returns: safety score (0-100), ingredient breakdown, toxin warnings, recommendations
- Supports OCR via Gemini for extracting text from food labels

#### 3. **Behavior Check Screen** (`screens/BehaviorCheckScreen.tsx`)
- Uses `analyzeBehaviorWithOpenAI()` from `utils/apiClient.ts`
- Records or selects video of dog behavior
- Returns: emotional state classification, body language observations, contextual tips
- Analyzes: tail position, body posture, facial expression, mouth position

### API Configuration
- **Environment Variables Required**:
  - `OPENAI_API_KEY`: For poop analysis and behavior analysis
  - `GEMINI_API_KEY`: For food ingredient analysis
- Both keys are stored as Replit Secrets and accessed via `process.env`

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
  - Nested Stack Navigators: Each tab has its own stack for screen management

### Component Architecture
- **Themed Components**: `ThemedText` and `ThemedView` provide consistent styling with automatic dark/light mode support
- **Custom Hooks**: 
  - `useTheme`: Returns current theme colors and dark mode state
  - `useScreenInsets`: Calculates safe area padding with navigation headers/tab bars
- **Screen Components**: Specialized scroll views for platform-specific keyboard behavior

### Design System
- **Theme Constants** (`constants/theme.ts`): Centralized colors, spacing, border radius, and typography tokens
- **Color Palette**: Primary blue (#4A7BFF), status colors (green/yellow/red for risk levels)
- **Dark Mode**: Full dark theme support with automatic color switching

### State Management
- **Context API**: Language context for internationalization (English/Spanish support)
- **Local Component State**: Feature screens manage their own analysis state using React useState

### Animation & Gestures
- **React Native Reanimated**: Powers smooth animations with spring configurations
- **React Native Gesture Handler**: Enables native gesture handling for improved touch responsiveness
- **Keyboard Controller**: Platform-aware keyboard handling with web fallback

## External Dependencies

### Expo SDK Packages
- `expo-image-picker`: Camera and photo library access for analyzing dog photos/food images
- `expo-haptics`: Tactile feedback for button presses
- `expo-linear-gradient`: Gradient backgrounds for splash screen and UI elements
- `expo-blur`: Glass effect headers and tab bars (iOS)
- `expo-glass-effect`: Liquid glass UI detection for iOS 26+
- `expo-web-browser`: External link handling
- `expo-splash-screen`: Native splash screen configuration
- `expo-file-system`: File system access for image/video encoding (AI API support)

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

## Onboarding & Profile Management

### 3-Step Onboarding Flow
1. **Intro Screen**: App introduction with "Get Started" button
2. **Owner Information**: Collect name and email
3. **Dog Profiles**: Add multiple dog profiles with:
   - Photo (optional, uses native camera/gallery)
   - Name (required)
   - Nickname (optional)
   - Breed (required)
   - Age (required)

### Features
- Device language detection (English by default, Spanish support)
- Multi-dog profile management with add/remove functionality
- Proper permission handling for camera and photo library
- Bilingual UI with translated text throughout

## Known Issues & TODOs

### Current Limitations
- Video analysis in Behavior Check may have limitations with base64 encoding of large video files
- Some TypeScript type definitions for API responses may need refinement
- Error handling for API failures could be more granular

### Potential Improvements
- Add retry logic for failed API calls
- Implement request caching to reduce API calls
- Add usage analytics and cost tracking
- Support for more dog-specific AI models as they become available

## Testing Notes

The app has been tested with:
- Mock data for initial feature validation
- Real OpenAI and Gemini API integration
- Permission handling for camera and photo library access
- Dark mode and light mode themes
- Multiple screen sizes (mobile-first design)
