import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BehaviorCheckScreen from "@/screens/BehaviorCheckScreen";
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
        component={BehaviorCheckScreen}
        options={{
          title: "Behavior Check",
        }}
      />
    </Stack.Navigator>
  );
}
