import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShopScreen from "@/screens/ShopScreen";
import ProductDetailsScreen from "@/screens/ProductDetailsScreen";
import { Product } from "@/services/api";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type ShopStackParamList = {
  Shop: undefined;
  ProductDetails: { product: Product };
};

const Stack = createNativeStackNavigator<ShopStackParamList>();

export default function ShopStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Shop"
        component={ShopScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={{ headerTitle: "Details" }}
      />
    </Stack.Navigator>
  );
}
