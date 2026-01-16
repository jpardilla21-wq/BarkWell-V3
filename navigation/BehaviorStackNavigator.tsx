import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import BehaviorCheckScreen from "@/screens/BehaviorCheckScreen"; // Old screen
import BehaviorCheckScreenRedesign from "@/src/screens/BehaviorCheckScreenRedesign"; // New redesigned screen
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type BehaviorStackParamList = {
  BehaviorCheck: undefined;
};

const Stack = createNativeStackNavigator<BehaviorStackParamList>();

export default function BehaviorStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="BehaviorCheck"
        component={BehaviorCheckScreenRedesign}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
