import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import PoopCheckScreen from "@/screens/PoopCheckScreen"; // Old screen
import PoopCheckScreenRedesign from "@/src/screens/PoopCheckScreenRedesign"; // New redesigned screen
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type PoopStackParamList = {
  PoopCheck: undefined;
};

const Stack = createNativeStackNavigator<PoopStackParamList>();

export default function PoopStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="PoopCheck"
        component={PoopCheckScreenRedesign}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
