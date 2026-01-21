import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RevenueCatUI from "react-native-purchases-ui";
import { useSubscription } from "@/contexts/SubscriptionContext";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type SubscriptionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Subscription">;
};

export default function SubscriptionScreen({
  navigation,
}: SubscriptionScreenProps) {
  const { refreshStatus } = useSubscription();

  const handlePurchaseCompleted = async (customerInfo: any) => {
    console.log("Purchase completed", customerInfo);
    await refreshStatus();
    navigation.goBack();
  };

  const handleRestoreCompleted = async (customerInfo: any) => {
    console.log("Restore completed", customerInfo);
    await refreshStatus();
    Alert.alert("Purchases Restored", "Your purchases have been restored.");
  };

  return (
    <View style={styles.container}>
      <RevenueCatUI.Paywall
        onPurchaseCompleted={handlePurchaseCompleted}
        onRestoreCompleted={handleRestoreCompleted}
        onDismiss={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
