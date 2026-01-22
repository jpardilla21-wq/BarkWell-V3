import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Pressable, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { getInsurancePartners, Partner } from "@/services/api";

export function InsuranceCard() {
  const { theme } = useTheme();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    loadPartner();
  }, []);

  const loadPartner = async () => {
    try {
      const response = await getInsurancePartners();
      if (response.success && response.partners.length > 0) {
        // Pick a random partner
        const random =
          response.partners[
            Math.floor(Math.random() * response.partners.length)
          ];
        setPartner(random);
      }
    } catch (error) {
      console.error("Failed to load insurance partner", error);
    }
  };

  const handleGetQuote = async () => {
    if (partner) {
      await Linking.openURL(partner.referral_link);
    }
  };

  if (!partner || !isVisible) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
      <View style={styles.header}>
        <View style={styles.partnerInfo}>
          <Image
            source={{ uri: partner.logo_url }}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <ThemedText type="h4">{partner.partner_name}</ThemedText>
            <ThemedText
              type="small"
              style={{ color: Colors.light.softGreen, fontWeight: "700" }}
            >
              {partner.discount_offer}
            </ThemedText>
          </View>
        </View>
        <Pressable onPress={() => setIsVisible(false)} hitSlop={10}>
          <Feather name="x" size={18} color={theme.textMuted} />
        </Pressable>
      </View>

      <ThemedText
        type="body"
        style={[styles.description, { color: theme.textMuted }]}
      >
        {partner.description}
      </ThemedText>

      <Pressable
        onPress={handleGetQuote}
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.8 : 1 }]}
      >
        <ThemedText type="body" style={styles.buttonText}>
          Get a Free Quote
        </ThemedText>
        <Feather name="external-link" size={16} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.sm,
  },
  partnerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
  },
  description: {
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.light.softGreen,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
