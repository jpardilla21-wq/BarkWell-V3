import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootNavigator";
import { getSubscriptionTiers, subscribeUser, SubscriptionTier } from "@/services/api";

const translations = {
  eng: {
    chooseYourPlan: "Choose Your Plan",
    unlockFeatures: "Unlock advanced features to better care for your pup",
    trialDays: "3 days free",
    mostPopular: "Most Popular",
    continueButton: "Continue to App",
    disclaimer: "No hidden fees. Cancel anytime. Billed securely through App Store.",
    continueWith: "Continue with",
    loading: "Loading plans...",
    subscribing: "Processing...",
    successTitle: "Welcome Aboard!",
    successMessage: "You have successfully subscribed to",
    errorTitle: "Subscription Failed",
    errorMessage: "Something went wrong. Please try again.",
    weekly: "Weekly",
    monthly: "Monthly",
  },
  esp: {
    chooseYourPlan: "Elige Tu Plan",
    unlockFeatures: "Desbloquea funciones avanzadas para cuidar mejor a tu mascota",
    trialDays: "3 días gratis",
    mostPopular: "Más Popular",
    continueButton: "Continuar a la Aplicación",
    disclaimer: "Sin cargos ocultos. Cancela en cualquier momento. Facturado de forma segura a través de la App Store.",
    continueWith: "Continuar con",
    loading: "Cargando planes...",
    subscribing: "Procesando...",
    successTitle: "¡Bienvenido a Bordo!",
    successMessage: "Te has suscrito exitosamente a",
    errorTitle: "Suscripción Fallida",
    errorMessage: "Algo salió mal. Por favor intenta de nuevo.",
    weekly: "Semanal",
    monthly: "Mensual",
  },
};

type SubscriptionScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Subscription">;
};

export default function SubscriptionScreen({
  navigation,
}: SubscriptionScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { language } = useLanguage();
  const { refreshStatus } = useSubscription();
  const t = translations[language];

  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    try {
      const response = await getSubscriptionTiers();
      if (response.success && response.tiers.length > 0) {
        setTiers(response.tiers);
        // Select 'plus' or the second tier by default if available
        const defaultTier = response.tiers.find(t => t.name.toLowerCase() === 'plus') || response.tiers[1] || response.tiers[0];
        setSelectedPlanId(defaultTier.id);
      }
    } catch (error) {
      console.error("Failed to load tiers", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlanId) return;

    setProcessing(true);
    try {
      // Hardcoded userId 1 for now as per app convention
      const result = await subscribeUser(1, selectedPlanId);

      if (result.success) {
        await refreshStatus();
        Alert.alert(
          t.successTitle,
          `${t.successMessage} ${selectedPlanId}`,
          [{ text: "OK", onPress: () => navigation.replace("MainTabs") }]
        );
      } else {
        Alert.alert(t.errorTitle, result.error || t.errorMessage);
      }
    } catch (error) {
      Alert.alert(t.errorTitle, t.errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const getPlanName = (tierId: string) => {
     // Simple mapping if needed, or use tier name from API
     return tierId.charAt(0).toUpperCase() + tierId.slice(1);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <ThemedText style={{ marginTop: Spacing.md }}>{t.loading}</ThemedText>
      </View>
    );
  }

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
          {tiers.map((tier) => {
            const isSelected = selectedPlanId === tier.id;
            const isHighlighted = tier.name.toLowerCase() === "plus"; // Example logic

            return (
              <Pressable
                key={tier.id}
                onPress={() => handleSelectPlan(tier.id)}
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

                <View style={styles.planHeader}>
                  <View>
                    <ThemedText type="h3" style={styles.planName}>
                      {tier.name}
                    </ThemedText>
                    <ThemedText
                      type="small"
                      style={[styles.planPeriod, { color: theme.textMuted }]}
                    >
                      {tier.interval === 'month' ? t.monthly : t.weekly}
                    </ThemedText>
                  </View>

                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Feather name="check" size={20} color="#FFFFFF" />
                    </View>
                  )}
                </View>

                <ThemedText type="h2" style={styles.price}>
                  ${tier.price}
                </ThemedText>

                <View style={styles.featuresList}>
                  {tier.features && tier.features.map((feature, index) => (
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
          onPress={handleSubscribe}
          style={styles.continueButton}
          disabled={processing || !selectedPlanId}
        >
          {processing ? t.subscribing : `${t.continueWith} ${selectedPlanId ? getPlanName(selectedPlanId) : "..."}`}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  featuresList: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
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
