import React, { useState } from "react";
import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/contexts/LanguageContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootNavigator";

const translations = {
  eng: {
    chooseYourPlan: "Choose Your Plan",
    unlockFeatures: "Unlock advanced features to better care for your pup",
    weekly: "Weekly",
    monthly: "Monthly",
    perWeek: "Per week",
    perMonth: "Per month",
    trialDays: "3 days free",
    mostPopular: "Most Popular",
    unlimitedAnalyses: "Unlimited analyses",
    advancedPoopAnalysis: "Advanced poop analysis",
    foodToxinDetection: "Food toxin detection",
    behaviorInsights: "Behavior insights",
    weeklyHealthReport: "Weekly health report",
    prioritySupport: "Priority support",
    saveDiscount: "Save 33% vs weekly",
    perfectForTrying: "Perfect for trying advanced features",
    bestValue: "Best value for pet parents",
    continueButton: "Continue to App",
    disclaimer:
      "No hidden fees. Cancel anytime. Billed securely through App Store.",
    continueWith: "Continue with",
    weeklyPlan: "Weekly Plan",
    monthlyPlan: "Monthly Plan",
  },
  esp: {
    chooseYourPlan: "Elige Tu Plan",
    unlockFeatures:
      "Desbloquea funciones avanzadas para cuidar mejor a tu mascota",
    weekly: "Semanal",
    monthly: "Mensual",
    perWeek: "Por semana",
    perMonth: "Por mes",
    trialDays: "3 días gratis",
    mostPopular: "Más Popular",
    unlimitedAnalyses: "Análisis ilimitados",
    advancedPoopAnalysis: "Análisis avanzado de heces",
    foodToxinDetection: "Detección de toxinas en alimentos",
    behaviorInsights: "Análisis de comportamiento",
    weeklyHealthReport: "Informe de salud semanal",
    prioritySupport: "Soporte prioritario",
    saveDiscount: "Ahorrar 33% vs semanal",
    perfectForTrying: "Perfecto para probar funciones avanzadas",
    bestValue: "Mejor valor para los dueños de mascotas",
    continueButton: "Continuar a la Aplicación",
    disclaimer:
      "Sin cargos ocultos. Cancela en cualquier momento. Facturado de forma segura a través de la App Store.",
    continueWith: "Continuar con",
    weeklyPlan: "Plan Semanal",
    monthlyPlan: "Plan Mensual",
  },
};

type SubscriptionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Subscription">;
};

type PlanType = "weekly" | "monthly";

interface Plan {
  id: PlanType;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  trial?: string;
  highlighted?: boolean;
}

const getPLANS = (t: any): Plan[] => [
  {
    id: "weekly",
    name: t.weekly,
    price: "$2.99",
    period: t.perWeek,
    description: t.perfectForTrying,
    features: [
      t.unlimitedAnalyses,
      t.advancedPoopAnalysis,
      t.foodToxinDetection,
      t.behaviorInsights,
      t.weeklyHealthReport,
    ],
    highlighted: true,
  },
  {
    id: "monthly",
    name: t.monthly,
    price: "$9.99",
    period: t.perMonth,
    description: t.bestValue,
    trial: t.trialDays,
    features: [
      t.unlimitedAnalyses,
      t.advancedPoopAnalysis,
      t.foodToxinDetection,
      t.behaviorInsights,
      t.weeklyHealthReport,
      t.prioritySupport,
      t.saveDiscount,
    ],
  },
];

export default function SubscriptionScreen({
  navigation,
}: SubscriptionScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("weekly");

  const handleSelectPlan = (planId: PlanType) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    // Navigate to main app
    try {
      navigation.replace("MainTabs");
    } catch (error) {
      console.error("Navigation error:", error);
    }
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
            {t.chooseYourPlan}
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textMuted }]}
          >
            {t.unlockFeatures}
          </ThemedText>
        </View>

        <View style={styles.plansContainer}>
          {getPLANS(t).map((plan) => {
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
                      {t.mostPopular}
                    </ThemedText>
                  </View>
                )}

                {plan.trial && (
                  <View
                    style={[
                      styles.trialBadge,
                      { backgroundColor: Colors.light.softGreen },
                    ]}
                  >
                    <ThemedText
                      type="small"
                      style={[
                        styles.badgeText,
                        { color: "#FFFFFF", fontWeight: "700" },
                      ]}
                    >
                      {plan.trial}
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
            {t.disclaimer}
          </ThemedText>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.replace("MainTabs")}
          style={styles.continueButton}
        >
          {t.continueWith}{" "}
          {selectedPlan === "weekly" ? t.weeklyPlan : t.monthlyPlan}
        </Button>
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
  trialBadge: {
    alignSelf: "flex-end",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    marginTop: -Spacing.lg,
    marginRight: -Spacing.lg,
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
});
