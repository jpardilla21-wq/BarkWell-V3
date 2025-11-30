import React, { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type SubscriptionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Subscription">;
};

type PlanType = "weekly" | "monthly" | "free";

interface Plan {
  id: PlanType;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "Free",
    period: "Forever",
    description: "Get started with basic features",
    features: [
      "5 analyses per month",
      "Basic poop check",
      "Simple behavior insights",
    ],
  },
  {
    id: "weekly",
    name: "Weekly",
    price: "$2.99",
    period: "Per week",
    description: "Perfect for trying advanced features",
    features: [
      "Unlimited analyses",
      "Advanced poop analysis",
      "Food toxin detection",
      "Behavior insights",
      "Weekly health report",
    ],
    highlighted: true,
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "$9.99",
    period: "Per month",
    description: "Best value for pet parents",
    features: [
      "Unlimited analyses",
      "Advanced poop analysis",
      "Food toxin detection",
      "Behavior insights",
      "Weekly health report",
      "Priority support",
      "Save 33% vs weekly",
    ],
  },
];

export default function SubscriptionScreen({ navigation }: SubscriptionScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("weekly");

  const handleContinue = () => {
    // In a real app, this would process the subscription
    // For now, navigate to the main app
    navigation.replace("MainTabs");
  };

  const handleSkip = () => {
    navigation.replace("MainTabs");
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <ScreenScrollView>
        <View style={styles.header}>
          <ThemedText type="h1" style={styles.title}>
            Choose Your Plan
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textMuted }]}>
            Unlock AI-powered insights for your dog's health
          </ThemedText>
        </View>

        <View style={styles.plansContainer}>
          {PLANS.map((plan) => (
            <Pressable
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              style={({ pressed }) => [
                styles.planCard,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor:
                    selectedPlan === plan.id ? Colors.light.primary : theme.borderLight,
                  borderWidth: 2,
                  opacity: pressed ? 0.8 : 1,
                },
                plan.highlighted && styles.highlightedPlan,
              ]}
            >
              {plan.highlighted ? (
                <View
                  style={[
                    styles.badgeContainer,
                    { backgroundColor: Colors.light.softGreen },
                  ]}
                >
                  <ThemedText type="small" style={styles.badgeText}>
                    Most Popular
                  </ThemedText>
                </View>
              ) : null}

              <View style={styles.planHeader}>
                <ThemedText type="h3">{plan.name}</ThemedText>
                <View style={styles.priceContainer}>
                  <ThemedText type="h2" style={styles.price}>
                    {plan.price}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textMuted }}>
                    {plan.period}
                  </ThemedText>
                </View>
              </View>

              <ThemedText type="body" style={[styles.description, { color: theme.textMuted }]}>
                {plan.description}
              </ThemedText>

              <View style={styles.divider} />

              <View style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Feather name="check" size={18} color={Colors.light.softGreen} />
                    <ThemedText type="body" style={styles.featureText}>
                      {feature}
                    </ThemedText>
                  </View>
                ))}
              </View>

              {selectedPlan === plan.id ? (
                <View
                  style={[
                    styles.selectedIndicator,
                    { borderColor: Colors.light.primary },
                  ]}
                >
                  <Feather name="check-circle" size={20} color={Colors.light.primary} />
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>

        <View style={styles.disclaimerCard}>
          <Feather
            name="info"
            size={18}
            color={theme.textMuted}
            style={styles.disclaimerIcon}
          />
          <ThemedText type="small" style={{ color: theme.textMuted }}>
            You can cancel your subscription anytime. No hidden fees.
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <Button onPress={handleContinue}>
            Subscribe to {selectedPlan === "free" ? "Free Plan" : selectedPlan === "weekly" ? "Weekly" : "Monthly"}
          </Button>
          <Pressable onPress={handleSkip} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
            <ThemedText type="body" style={[styles.skipText, { color: theme.link }]}>
              Continue with Free Plan
            </ThemedText>
          </Pressable>
        </View>
      </ScreenScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginVertical: Spacing.lg,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
  plansContainer: {
    gap: Spacing.md,
    marginVertical: Spacing.lg,
  },
  planCard: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    position: "relative",
  },
  highlightedPlan: {
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  badgeContainer: {
    position: "absolute",
    top: -10,
    right: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontWeight: "700",
  },
  description: {
    marginBottom: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    marginVertical: Spacing.md,
  },
  featuresList: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  featureRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "flex-start",
  },
  featureText: {
    flex: 1,
  },
  selectedIndicator: {
    position: "absolute",
    bottom: Spacing.md,
    right: Spacing.md,
    borderWidth: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  disclaimerCard: {
    flexDirection: "row",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.lg,
  },
  disclaimerIcon: {
    marginTop: 2,
  },
  buttonContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  skipText: {
    textAlign: "center",
    fontWeight: "600",
    paddingVertical: Spacing.md,
  },
});
