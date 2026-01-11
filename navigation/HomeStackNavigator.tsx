import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// Import redesigned screens as defaults
import HomeScreenRedesign from "@/src/screens/HomeScreenRedesign";
import PetProfileScreenRedesign from "@/src/screens/PetProfileScreenRedesign";
import FoodScannerScreen from "@/screens/FoodScannerScreen";
import AddDogScreen from "@/screens/AddDogScreen";
import WeeklySnapshotScreen from "@/screens/WeeklySnapshotScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type HomeStackParamList = {
  Home: undefined;
  PetProfile: undefined;
  FoodScanner: undefined;
  AddDog: undefined;
  WeeklySnapshot: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreenRedesign}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PetProfile"
        component={PetProfileScreenRedesign}
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
    </Stack.Navigator>
  );
}
