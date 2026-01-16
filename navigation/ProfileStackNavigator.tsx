import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import ProfileScreen from "@/screens/ProfileScreen"; // Old screen
import PetProfileScreenRedesign from "@/src/screens/PetProfileScreenRedesign"; // New redesigned screen
import HistoryScreen from "@/screens/HistoryScreen";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type ProfileStackParamList = {
  Profile: undefined;
  History: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator screenOptions={getCommonScreenOptions({ theme, isDark })}>
      <Stack.Screen
        name="Profile"
        component={PetProfileScreenRedesign}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "History",
        }}
      />
    </Stack.Navigator>
  );
}
