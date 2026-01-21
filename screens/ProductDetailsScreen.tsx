import React from "react";
import { StyleSheet, View, Image, ScrollView, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { trackAffiliateClick } from "@/services/api";
import { ShopStackParamList } from "@/navigation/ShopStackNavigator";
import { useDogs } from "@/contexts/DogContext";

type ProductDetailsScreenRouteProp = RouteProp<ShopStackParamList, "ProductDetails">;

export default function ProductDetailsScreen() {
  const { theme } = useTheme();
  const route = useRoute<ProductDetailsScreenRouteProp>();
  const navigation = useNavigation();
  const { product } = route.params;
  const { selectedDogId } = useDogs();

  const handleBuyNow = async () => {
    try {
      // Track the click
      await trackAffiliateClick(product.id, selectedDogId || undefined, "amazon");

      // Open the URL
      const supported = await Linking.canOpenURL(product.affiliate_link);
      if (supported) {
        await Linking.openURL(product.affiliate_link);
      } else {
        console.error("Don't know how to open URI: " + product.affiliate_link);
      }
    } catch (error) {
      console.error("Error handling buy now:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView>
        <Image source={{ uri: product.image_url }} style={styles.image} />

        <View style={[styles.content, { backgroundColor: theme.backgroundRoot }]}>
          <View style={styles.header}>
            <View>
              <ThemedText type="small" style={{ color: theme.textMuted }}>
                {product.category}
              </ThemedText>
              <ThemedText type="h2" style={styles.title}>
                {product.name}
              </ThemedText>
            </View>
            <ThemedText type="h2" style={{ color: Colors.light.primary }}>
              {product.average_price}
            </ThemedText>
          </View>

          <View style={[styles.section, { borderBottomColor: theme.borderLight }]}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Description
            </ThemedText>
            <ThemedText type="body" style={{ color: theme.textMuted }}>
              {product.description}
            </ThemedText>
          </View>

          {product.features && product.features.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="h4" style={styles.sectionTitle}>
                Key Features
              </ThemedText>
              {product.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Feather name="check" size={20} color={Colors.light.softGreen} />
                  <ThemedText type="body" style={{ flex: 1, color: theme.textMuted }}>
                    {feature}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.backgroundDefault, borderTopColor: theme.borderLight }]}>
        <Button onPress={handleBuyNow} style={styles.button}>
          Buy on Amazon
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  content: {
    padding: Spacing.lg,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -Spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  title: {
    marginTop: Spacing.xs,
    maxWidth: 250,
  },
  section: {
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  featureItem: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
  },
  button: {
    width: "100%",
  },
});
