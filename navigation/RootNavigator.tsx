import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "@/screens/SplashScreen";
import OnboardingScreen from "@/screens/OnboardingScreen";
import SubscriptionScreen from "@/screens/SubscriptionScreen";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import { trackScreenView } from "@/services/analytics";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Subscription: undefined;
  MainTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
      screenListeners={{
        state: (e) => {
          // Basic screen tracking
          const route = e.data.state?.routes[e.data.state.index];
          if (route) {
            trackScreenView(route.name);
          }
        },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
