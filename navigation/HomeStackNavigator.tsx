import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/screens/HomeScreen";
import FoodScannerScreen from "@/screens/FoodScannerScreen";
import AddDogScreen from "@/screens/AddDogScreen";
import WeeklySnapshotScreen from "@/screens/WeeklySnapshotScreen";
// New Redesigned Screens (Phase 1: Testing)
import HomeScreenRedesign from "@/src/screens/HomeScreenRedesign";
import PetProfileScreenRedesign from "@/src/screens/PetProfileScreenRedesign";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type HomeStackParamList = {
  Home: undefined;
  FoodScanner: undefined;
  AddDog: undefined;
  WeeklySnapshot: undefined;
  // New Redesigned Screens (Phase 1: Testing)
  HomeNew: undefined;
  PetProfileNew: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FoodScanner"
        component={FoodScannerScreen}
        options={{ headerTitle: "Food Scanner" }}
      />
      <Stack.Screen
        name="AddDog"
        component={AddDogScreen}
        options={{ headerTitle: "Add Dog" }}
      />
      <Stack.Screen
        name="WeeklySnapshot"
        component={WeeklySnapshotScreen}
        options={{ headerTitle: "Weekly Snapshot" }}
      />
      {/* New Redesigned Screens (Phase 1: Testing) */}
      <Stack.Screen
        name="HomeNew"
        component={HomeScreenRedesign}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PetProfileNew"
        component={PetProfileScreenRedesign}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
