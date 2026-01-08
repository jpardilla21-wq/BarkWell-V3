import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FoodScannerScreen from "@/screens/FoodScannerScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type FoodStackParamList = {
  FoodScanner: undefined;
};

const Stack = createNativeStackNavigator<FoodStackParamList>();

export default function FoodStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="FoodScanner"
        component={FoodScannerScreen}
        options={{
          title: "Food Scanner",
        }}
      />
    </Stack.Navigator>
  );
}
