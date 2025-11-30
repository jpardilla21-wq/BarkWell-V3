import React, { useState } from "react";
import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
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

export default function SubscriptionScreen({
  navigation,
}: SubscriptionScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("free");

  const handleSelectPlan = (planId: PlanType) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    navigation.replace("Root");
  };

  const handleSkip = () => {
    setSelectedPlan("free");
    navigation.replace("Root");
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="h1" style={styles.title}>
            Choose Your Plan
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textMuted }]}
          >
            Unlock advanced features to better care for your pup
          </ThemedText>
        </View>

        <View style={styles.plansContainer}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isHighlighted = plan.highlighted;

            return (
              <Pressable
                key={plan.id}
                onPress={() => handleSelectPlan(plan.id)}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: isSelected
                      ? Colors.light.primary + "15"
                      : theme.backgroundDefault,
                    borderColor: isSelected
                      ? Colors.light.primary
                      : theme.borderLight,
                    borderWidth: 2,
                  },
                ]}
              >
                {isHighlighted && (
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: Colors.light.primary },
                    ]}
                  >
                    <ThemedText
                      type="small"
                      style={[
                        styles.badgeText,
                        { color: "#FFFFFF", fontWeight: "700" },
                      ]}
                    >
                      Most Popular
                    </ThemedText>
                  </View>
                )}

                <View style={styles.planHeader}>
                  <View>
                    <ThemedText type="h3" style={styles.planName}>
                      {plan.name}
                    </ThemedText>
                    <ThemedText
                      type="small"
                      style={[styles.planPeriod, { color: theme.textMuted }]}
                    >
                      {plan.period}
                    </ThemedText>
                  </View>

                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Feather name="check" size={20} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                <ThemedText type="h2" style={styles.price}>
                  {plan.price}
                </ThemedText>

                <ThemedText
                  type="small"
                  style={[styles.description, { color: theme.textMuted }]}
                >
                  {plan.description}
                </ThemedText>

                <View style={styles.featuresList}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureItem}>
                      <Feather
                        name="check-circle"
                        size={16}
                        color={Colors.light.softGreen}
                        style={styles.featureIcon}
                      />
                      <ThemedText type="small" style={styles.featureText}>
                        {feature}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.disclaimer}>
          <ThemedText
            type="small"
            style={[styles.disclaimerText, { color: theme.textMuted }]}
          >
            No hidden fees. Cancel anytime. Billed securely through App Store.
          </ThemedText>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button onPress={handleContinue} style={styles.continueButton}>
          Continue with {selectedPlan === "free" ? "Free" : "This Plan"}
        </Button>
        {selectedPlan !== "free" && (
          <Pressable onPress={handleSkip}>
            <ThemedText
              type="body"
              style={[styles.skipText, { color: Colors.light.primary }]}
            >
              Or continue with free plan
            </ThemedText>
          </Pressable>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    lineHeight: 20,
  },
  plansContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  planCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    position: "relative",
    overflow: "hidden",
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  badgeText: {
    fontSize: 12,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  planName: {
    marginBottom: Spacing.xs,
  },
  planPeriod: {
    fontSize: 12,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  price: {
    marginBottom: Spacing.sm,
    color: Colors.light.primary,
  },
  description: {
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  featuresList: {
    gap: Spacing.sm,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  featureIcon: {
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    lineHeight: 18,
  },
  disclaimer: {
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  disclaimerText: {
    textAlign: "center",
    lineHeight: 18,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
  continueButton: {
    marginBottom: Spacing.sm,
  },
  skipText: {
    textAlign: "center",
    fontWeight: "600",
  },
});
