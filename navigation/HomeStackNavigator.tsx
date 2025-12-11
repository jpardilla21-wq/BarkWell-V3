import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/screens/HomeScreen";
import FoodScannerScreen from "@/screens/FoodScannerScreen";
import AddDogScreen from "@/screens/AddDogScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type HomeStackParamList = {
  Home: undefined;
  FoodScanner: undefined;
  AddDog: undefined;
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
    </Stack.Navigator>
  );
}
