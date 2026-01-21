import React from "react";
import { StyleSheet, View, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import RevenueCatUI from "react-native-purchases-ui";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { trackEvent } from "@/services/analytics";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type SubscriptionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Subscription">;
};

export default function SubscriptionScreen({
  navigation,
}: SubscriptionScreenProps) {
  const { refreshStatus } = useSubscription();

  React.useEffect(() => {
    trackEvent("view_paywall");
  }, []);

  const handlePurchaseCompleted = async (customerInfo: any) => {
    console.log("Purchase completed", customerInfo);
    await trackEvent("purchase_completed", {
      tier: customerInfo.entitlements.active["pawer Pro"] ? "pro" : "unknown"
    });
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
