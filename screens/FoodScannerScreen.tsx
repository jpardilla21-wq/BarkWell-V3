import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Pressable,
  Alert,
  Text,
  Linking,
  TextInput,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { ScoreBadge } from "@/components/ScoreBadge";
import { ResultCard } from "@/components/ResultCard";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { analyzeIngredientWithGemini, APIKeyError } from "@/utils/apiClient";

interface FoodAnalysisResult {
  score: number;
  rating: "Elite" | "Excellent" | "Good" | "Fair" | "Borderline" | "Poor";
  summary: string;
  good: string[];
  bad: string[];
  neither: string[];
  allergens: string[];
  toxins: string[];
  recommendations: {
    name: string;
    reason: string;
    affiliateLink: string;
  }[];
}

const getRatingColor = (rating: FoodAnalysisResult["rating"]) => {
  switch (rating) {
    case "Elite":
      return "#22C55E";
    case "Excellent":
      return "#4ADE80";
    case "Good":
      return "#84CC16";
    case "Fair":
      return "#EAB308";
    case "Borderline":
      return "#F97316";
    case "Poor":
      return "#EF4444";
    default:
      return "#6B7280";
  }
};

const getRatingDescription = (rating: FoodAnalysisResult["rating"]) => {
  switch (rating) {
    case "Elite":
      return "Outstanding ingredients with almost no red flags";
    case "Excellent":
      return "High-quality proteins and fats with minor compromises";
    case "Good":
      return "Solid nutrition, acceptable for most dogs";
    case "Fair":
      return "Noticeable fillers or vague ingredients";
    case "Borderline":
      return "Too many trade-offs to confidently recommend";
    case "Poor":
      return "Low-quality ingredients or major red flags";
    default:
      return "";
  }
};

const RECOMMENDED_FOODS = [
  {
    name: "Orijen Original Dog Food",
    reason: "High protein, grain-free, no artificial ingredients",
    affiliateLink: "https://www.amazon.com/Orijen-Original-Dog-Food/s",
  },
  {
    name: "Acana Heritage Dog Food",
    reason: "Premium ingredients, limited additives",
    affiliateLink: "https://www.amazon.com/Acana-Heritage-Dog-Food/s",
  },
  {
    name: "Stella & Chewy's Raw Diet",
    reason: "Raw, freeze-dried, natural ingredients",
    affiliateLink: "https://www.amazon.com/Stella-Chewy-Freeze-Dried-Raw/s",
  },
  {
    name: "Merrick Grain-Free Dog Food",
    reason: "No grains, real meat, no artificial preservatives",
    affiliateLink: "https://www.amazon.com/Merrick-Grain-Free-Dog-Food/s",
  },
  {
    name: "Primal Raw Dog Food",
    reason: "USDA certified, raw, balanced nutrition",
    affiliateLink: "https://www.primalpet.com/products/primal-raw-dog",
  },
];

export default function FoodScannerScreen() {
  const { theme, isDark } = useTheme();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission",
        "We need camera permission to scan food labels. Please enable it in settings.",
        Platform.OS !== "web"
          ? [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: async () => {
                  if (Platform.OS !== "web") {
                    try {
                      await require("expo-linking").default.openSettings();
                    } catch (error) {
                      // Linking not supported
                    }
                  }
                },
              },
            ]
          : [{ text: "OK" }],
      );
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
        setIngredients("");
        setResult(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const handlePickFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
        setIngredients("");
        setResult(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleAnalyze = async () => {
    if (!photoUri && !ingredients.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const result = await analyzeIngredientWithGemini(photoUri, ingredients);
      setResult(result);
    } catch (error) {
      if (error instanceof APIKeyError) {
        Alert.alert(
          "API Configuration Required",
          "This feature requires API configuration that isn't available in Expo Go. Use the web version instead.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Web Version",
              onPress: () => {
                Linking.openURL("http://localhost:8081").catch(() => {
                  Alert.alert(
                    "Link Information",
                    "Open this link in your browser:\nhttp://localhost:8081",
                  );
                });
              },
            },
          ],
        );
      } else {
        Alert.alert("Analysis Error", "Failed to analyze. Please try again.");
      }
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearPhoto = () => {
    setPhotoUri(null);
    setIngredients("");
    setResult(null);
  };

  const handleRecommendationPress = (link: string) => {
    Linking.openURL(link).catch(() => {
      Alert.alert("Error", "Could not open link. Please try again later.");
    });
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <ThemedText type="body" style={{ color: theme.textMuted }}>
        Scan your dog food label or manually enter ingredients.
      </ThemedText>

      {!photoUri ? (
        <View style={styles.photoSection}>
          <ThemedView
            style={[
              styles.photoPlaceholder,
              { borderColor: Colors.light.primary },
            ]}
          >
            <Feather
              name="tag"
              size={48}
              color={Colors.light.primary}
              style={{ marginBottom: Spacing.md }}
            />
            <ThemedText type="body" style={{ textAlign: "center" }}>
              Scan your dog's food label
            </ThemedText>
          </ThemedView>

          <View style={styles.buttonGroup}>
            <Pressable
              onPress={handleTakePhoto}
              style={[
                styles.halfButton,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: Colors.light.primary,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={styles.buttonContent}>
                <Feather name="camera" size={18} color={Colors.light.primary} />
                <Text style={styles.buttonText}>Scan</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handlePickFromLibrary}
              style={[
                styles.halfButton,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: Colors.light.primary,
                  borderWidth: 1,
                },
              ]}
            >
              <View style={styles.buttonContent}>
                <Feather name="image" size={18} color={Colors.light.primary} />
                <Text style={styles.buttonText}>Browse</Text>
              </View>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: photoUri }}
            style={styles.photoImage}
            resizeMode="cover"
          />
          <Pressable
            onPress={handleClearPhoto}
            style={[
              styles.clearButton,
              { backgroundColor: Colors.light.primary },
            ]}
          >
            <Feather name="x" size={20} color="white" />
          </Pressable>
        </View>
      )}

      <View style={styles.divider} />

      <View style={styles.inputContainer}>
        <ThemedText type="small" style={styles.label}>
          Ingredients {photoUri ? "(Auto-detected)" : "(Manual)"}
        </ThemedText>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: theme.backgroundDefault,
              color: theme.text,
              borderColor: theme.borderLight,
            },
          ]}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="chicken, rice, carrots, chicken broth, salt..."
          placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <Button
        onPress={handleAnalyze}
        disabled={!photoUri && !ingredients.trim() && !isAnalyzing}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Ingredients"}
      </Button>

      {result ? (
        <ResultCard style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.scoreSection}>
              <ScoreBadge score={result.score} />
              <View
                style={[
                  styles.ratingBadge,
                  { backgroundColor: getRatingColor(result.rating) + "20" },
                ]}
              >
                <ThemedText
                  type="h4"
                  style={{
                    color: getRatingColor(result.rating),
                    fontWeight: "700",
                  }}
                >
                  {result.rating}
                </ThemedText>
              </View>
              <ThemedText
                type="small"
                style={{
                  color: theme.textMuted,
                  textAlign: "center",
                  marginTop: Spacing.xs,
                }}
              >
                {getRatingDescription(result.rating)}
              </ThemedText>
            </View>
          </View>

          <ThemedText type="body" style={styles.summary}>
            {result.summary}
          </ThemedText>

          {result.toxins.length > 0 ? (
            <View
              style={[
                styles.toxinWarning,
                { backgroundColor: Colors.light.urgentRed + "20" },
              ]}
            >
              <ThemedText
                type="h4"
                style={{
                  color: Colors.light.urgentRed,
                  marginBottom: Spacing.sm,
                }}
              >
                Toxic Ingredients Found
              </ThemedText>
              {result.toxins.map((toxin, index) => (
                <ThemedText
                  key={index}
                  type="body"
                  style={{
                    color: Colors.light.urgentRed,
                    marginBottom: Spacing.xs,
                  }}
                >
                  • {toxin}
                </ThemedText>
              ))}
            </View>
          ) : null}

          {result.allergens.length > 0 ? (
            <View
              style={[
                styles.allergenWarning,
                { backgroundColor: Colors.light.warningYellow + "20" },
              ]}
            >
              <ThemedText
                type="h4"
                style={{
                  color: Colors.light.warningYellow,
                  marginBottom: Spacing.sm,
                }}
              >
                Potential Allergens
              </ThemedText>
              {result.allergens.map((allergen, index) => (
                <ThemedText
                  key={index}
                  type="body"
                  style={{
                    color: Colors.light.warningYellow,
                    marginBottom: Spacing.xs,
                  }}
                >
                  ⚠ {allergen}
                </ThemedText>
              ))}
            </View>
          ) : null}

          {result.good.length > 0 ? (
            <View style={styles.listSection}>
              <ThemedText
                type="h4"
                style={{
                  color: Colors.light.softGreen,
                  marginBottom: Spacing.sm,
                }}
              >
                Positives
              </ThemedText>
              {result.good.map((item, index) => (
                <View key={index} style={styles.listRow}>
                  <ThemedText type="body" style={styles.bullet}>
                    +
                  </ThemedText>
                  <ThemedText type="body" style={styles.listText}>
                    {item}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}

          {result.bad.length > 0 ? (
            <View style={styles.listSection}>
              <ThemedText
                type="h4"
                style={{
                  color: Colors.light.warningYellow,
                  marginBottom: Spacing.sm,
                }}
              >
                Concerns
              </ThemedText>
              {result.bad.map((item, index) => (
                <View key={index} style={styles.listRow}>
                  <ThemedText type="body" style={styles.bullet}>
                    -
                  </ThemedText>
                  <ThemedText type="body" style={styles.listText}>
                    {item}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}

          {result.neither.length > 0 ? (
            <View style={styles.listSection}>
              <ThemedText
                type="h4"
                style={{ color: theme.textMuted, marginBottom: Spacing.sm }}
              >
                Neutral
              </ThemedText>
              {result.neither.map((item, index) => (
                <View key={index} style={styles.listRow}>
                  <ThemedText type="body" style={styles.bullet}>
                    •
                  </ThemedText>
                  <ThemedText type="body" style={styles.listText}>
                    {item}
                  </ThemedText>
                </View>
              ))}
            </View>
          ) : null}

          {result.recommendations.length > 0 ? (
            <View style={styles.recommendationSection}>
              <ThemedText
                type="h4"
                style={{
                  marginBottom: Spacing.md,
                  color: Colors.light.primary,
                }}
              >
                Recommended Alternatives
              </ThemedText>
              {result.recommendations.map((rec, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleRecommendationPress(rec.affiliateLink)}
                  style={[
                    styles.recommendationCard,
                    { backgroundColor: theme.backgroundDefault },
                  ]}
                >
                  <View style={styles.recContent}>
                    <ThemedText type="body" style={{ fontWeight: "600" }}>
                      {rec.name}
                    </ThemedText>
                    <ThemedText
                      type="body"
                      style={{ color: theme.textMuted, marginTop: Spacing.xs }}
                    >
                      {rec.reason}
                    </ThemedText>
                  </View>
                  <Feather
                    name="external-link"
                    size={18}
                    color={Colors.light.primary}
                  />
                </Pressable>
              ))}
              <ThemedText
                type="small"
                style={{
                  color: theme.textMuted,
                  marginTop: Spacing.md,
                  fontStyle: "italic",
                }}
              >
                * Links may contain affiliate partnerships
              </ThemedText>
            </View>
          ) : null}
        </ResultCard>
      ) : null}
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  photoSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  photoPlaceholder: {
    height: 220,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  photoContainer: {
    position: "relative",
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  photoImage: {
    height: 250,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
  },
  clearButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  halfButton: {
    flex: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    justifyContent: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  buttonText: {
    color: Colors.light.primary,
    fontSize: Typography.bodyM.fontSize,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  textInput: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.bodyM.fontSize,
  },
  resultCard: {
    marginTop: Spacing.lg,
  },
  resultHeader: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  scoreSection: {
    alignItems: "center",
    gap: Spacing.sm,
  },
  scoreLabel: {
    opacity: 0.7,
  },
  ratingBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  summary: {
    marginBottom: Spacing.lg,
  },
  toxinWarning: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  allergenWarning: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  listSection: {
    marginBottom: Spacing.md,
  },
  listRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  bullet: {
    width: 16,
    fontWeight: "600",
  },
  listText: {
    flex: 1,
  },
  recommendationSection: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  recommendationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    marginBottom: Spacing.md,
  },
  recContent: {
    flex: 1,
  },
});
