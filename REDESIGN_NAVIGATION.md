# BarkWell Redesign - Navigation Guide

This document explains how to test the new redesigned screens and eventually switch from the old screens to the new ones.

## Current Status: Phase 1 - Testing

The new redesigned screens are available alongside the old screens for testing purposes.

### New Screens Available

1. **HomeScreenRedesign** - Complete home screen with Whisker design aesthetic
   - Route name: `HomeNew`
   - Location: `src/screens/HomeScreenRedesign.tsx`

2. **PetProfileScreenRedesign** - Detailed pet profile with health metrics
   - Route name: `PetProfileNew`
   - Location: `src/screens/PetProfileScreenRedesign.tsx`

### How to Test New Screens

#### Option 1: Navigate Programmatically (Recommended for Testing)

Add temporary navigation buttons in your existing screens to test the new designs:

```typescript
import { useNavigation } from '@react-navigation/native';

// In your component
const navigation = useNavigation();

// Add test buttons
<Button onPress={() => navigation.navigate('HomeNew')}>
  Test New Home Screen
</Button>

<Button onPress={() => navigation.navigate('PetProfileNew')}>
  Test New Pet Profile Screen
</Button>
```

#### Option 2: Change Initial Route Temporarily

In `navigation/HomeStackNavigator.tsx`, temporarily change the initial screen:

```typescript
<Stack.Navigator
  initialRouteName="HomeNew" // Changed from "Home"
  screenOptions={{
    ...getCommonScreenOptions({ theme, isDark }),
  }}
>
```

**Remember to change it back before committing!**

### Testing Checklist

- [ ] Home screen displays correctly with all sections
- [ ] Pet selector works and shows selected state
- [ ] Quick action cards are tappable
- [ ] Progress ring animates correctly
- [ ] Pet profile screen shows all health metrics
- [ ] Tab navigation works between sections
- [ ] Back button navigation works
- [ ] All interactive elements have proper touch feedback
- [ ] Accessibility features work with screen readers
- [ ] Design matches the Whisker aesthetic

---

## Phase 2: Switching to New Screens (After Testing)

Once you've tested and verified the new screens work correctly, follow these steps:

### Step 1: Update Screen Imports

In `navigation/HomeStackNavigator.tsx`:

```typescript
// Comment out old imports
// import HomeScreen from "@/screens/HomeScreen";

// Rename new imports
import HomeScreen from "@/src/screens/HomeScreenRedesign";
import PetProfileScreen from "@/src/screens/PetProfileScreenRedesign";
```

### Step 2: Update Route Names

In `navigation/HomeStackNavigator.tsx`, rename the routes:

```typescript
export type HomeStackParamList = {
  Home: undefined; // Now points to HomeScreenRedesign
  FoodScanner: undefined;
  AddDog: undefined;
  WeeklySnapshot: undefined;
  PetProfile: undefined; // Now points to PetProfileScreenRedesign
  // Remove: HomeNew and PetProfileNew
};
```

And update the Stack.Screen components:

```typescript
<Stack.Screen
  name="Home"
  component={HomeScreen} // Now HomeScreenRedesign
  options={{
    headerShown: false,
  }}
/>

<Stack.Screen
  name="PetProfile"
  component={PetProfileScreen} // Now PetProfileScreenRedesign
  options={{
    headerShown: false,
  }}
/>
```

### Step 3: Update Tab Bar Colors

In `navigation/MainTabNavigator.tsx`:

1. Uncomment the new design system import:
```typescript
import { useTheme as useDesignTheme } from "@/design-system";
```

2. Use the new colors:
```typescript
const { colors } = useDesignTheme();

// In screenOptions:
tabBarActiveTintColor: colors.primary[500],
tabBarInactiveTintColor: colors.neutral[400],
```

3. Update tab bar background:
```typescript
tabBarStyle: {
  position: "absolute",
  backgroundColor: Platform.select({
    ios: "transparent",
    android: colors.neutral.white,
  }),
  borderTopWidth: 1,
  borderTopColor: colors.neutral[200],
  // Add shadow for elevation
  shadowColor: colors.neutral.black,
  shadowOffset: { width: 0, height: -2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,
},
```

### Step 4: Update Navigation Calls

Search for all navigation calls in your codebase and update them:

```bash
# Search for old navigation calls
grep -r "navigate('Home')" --include="*.tsx" --include="*.ts"
grep -r "navigate('PetProfile')" --include="*.tsx" --include="*.ts"
```

If you find any that need updating, change them to use the new route names.

### Step 5: Clean Up

1. Remove the old screen files (optional, keep as backup initially):
   - `screens/HomeScreen.tsx`
   - `screens/ProfileScreen.tsx` (if replaced)

2. Remove Phase 1 testing routes from `HomeStackNavigator.tsx`:
   - Remove `HomeNew` and `PetProfileNew` from type definitions
   - Remove their Stack.Screen components

3. Remove all Phase 2 comments from navigation files

---

## Design System Integration

### Color Mapping

| Old Theme | New Design System |
|-----------|-------------------|
| `theme.tabIconSelected` | `colors.primary[500]` |
| `theme.tabIconDefault` | `colors.neutral[400]` |
| `theme.backgroundRoot` | `colors.neutral.cream` |
| `theme.backgroundDefault` | `colors.neutral.white` |

### Tab Bar Specifications

- **Active tab color**: `colors.primary[500]` (vibrant green)
- **Inactive tab color**: `colors.neutral[400]` (gray)
- **Tab bar background**: `colors.neutral.white` with top shadow
- **Icon size**: 24px (default, matches IconSizes.md)
- **Label style**: `TextStyles.caption` from design system

---

## Navigation Flow

```
RootNavigator
  ├── Splash Screen
  ├── Onboarding Screen
  ├── Subscription Screen
  └── MainTabs
       ├── HomeTab (HomeStackNavigator)
       │    ├── Home (HomeScreenRedesign) ← NEW
       │    ├── PetProfile (PetProfileScreenRedesign) ← NEW
       │    ├── FoodScanner
       │    ├── AddDog
       │    └── WeeklySnapshot
       ├── PoopTab
       ├── BehaviorTab
       └── ProfileTab
```

---

## Troubleshooting

### Issue: "Cannot find module" error

Make sure the import paths are correct:
- Old screens: `@/screens/ScreenName`
- New screens: `@/src/screens/ScreenName`

### Issue: Navigation types not working

Run TypeScript check:
```bash
npx tsc --noEmit
```

Make sure all route names in `HomeStackParamList` match the Stack.Screen names.

### Issue: Design system colors not applying

Make sure `ThemeProvider` is wrapping your app in `App.tsx`:
```typescript
<ThemeProvider>
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
</ThemeProvider>
```

---

## Rollback Plan

If you need to rollback to old screens:

1. Restore old screen imports in `HomeStackNavigator.tsx`
2. Change route components back to old screens
3. Revert tab bar color changes in `MainTabNavigator.tsx`
4. Keep the new screen files for future use

---

## Questions?

Check the design system documentation:
- `design-system/DesignSystem.ts` - All design tokens
- `design-system/ThemeProvider.tsx` - Theme context and utilities
- `src/components/redesign/` - Reusable UI components
