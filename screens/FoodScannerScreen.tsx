/**
 * FoodScannerScreen - Redesigned
 * Analyze dog food ingredients with AI-powered nutritional assessment
 */

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Alert,
  Text,
  Linking,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useTheme, CommonStyles, TextStyles } from "@/design-system";
import { Card, Button } from "@/src/components/redesign";
import ActionDialog, { ActionOption } from "@/src/components/redesign/ActionDialog";
import { ScoreBadge } from "@/components/ScoreBadge";
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

const getRatingColor = (rating: FoodAnalysisResult["rating"], colors: any) => {
  switch (rating) {
    case "Elite":
      return colors.semantic.success;
    case "Excellent":
      return colors.primary[500];
    case "Good":
      return colors.primary[400];
    case "Fair":
      return colors.semantic.warning;
    case "Borderline":
      return colors.semantic.warning;
    case "Poor":
      return colors.semantic.error;
    default:
      return colors.neutral[500];
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

export default function FoodScannerScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [scanMode, setScanMode] = useState<'barcode' | 'ingredients' | null>(null);

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
          : [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const handleScanBarcode = async () => {
    Alert.alert("Barcode Scanner", "Barcode scanning feature coming soon!");
    setScanMode('barcode');
  };

  const handleScanIngredients = async () => {
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
        setScanMode('ingredients');
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const handleManualEntry = () => {
    setScanMode(null);
    setPhotoUri(null);
    setResult(null);
    // Auto-focus on text input would go here
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
                    "Open this link in your browser:\nhttp://localhost:8081"
                  );
                });
              },
            },
          ]
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
    setScanMode(null);
  };

  const handleRecommendationPress = (link: string) => {
    Linking.openURL(link).catch(() => {
      Alert.alert("Error", "Could not open link. Please try again later.");
    });
  };

  const foodScannerOptions: ActionOption[] = [
    {
      icon: 'maximize',
      label: 'Scan Barcode',
      onPress: handleScanBarcode,
    },
    {
      icon: 'camera',
      label: 'Scan Ingredients',
      onPress: handleScanIngredients,
    },
    {
      icon: 'edit-3',
      label: 'Enter Brand and Product',
      onPress: handleManualEntry,
    },
  ];

  return (
    <SafeAreaView style={CommonStyles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { padding: spacing.xl, paddingBottom: spacing['6xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[TextStyles.h1, { color: colors.neutral[900], marginBottom: spacing.md }]}>
          Food Scanner
        </Text>
        <Text style={[TextStyles.body, { color: colors.neutral[600], marginBottom: spacing.xl }]}>
          Scan your dog food label or manually enter ingredients to analyze nutrition quality.
        </Text>

        {/* Photo Section */}
        {!photoUri ? (
          <Card variant="outlined" style={{ marginBottom: spacing.xl }}>
            <TouchableOpacity
              style={[
                styles.photoPlaceholder,
                {
                  borderColor: colors.primary[300],
                  backgroundColor: colors.secondary[100],
                  borderRadius: borderRadius.lg,
                  padding: spacing.xl,
                },
              ]}
              onPress={() => setDialogVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.placeholderContent}>
                <Feather
                  name="tag"
                  size={48}
                  color={colors.primary[500]}
                  style={{ marginBottom: spacing.md }}
                />
                <Text
                  style={[
                    TextStyles.h4,
                    { color: colors.neutral[900], textAlign: "center", marginBottom: spacing.sm },
                  ]}
                >
                  Scan Food Label
                </Text>
                <Text
                  style={[
                    TextStyles.bodySmall,
                    { color: colors.neutral[600], textAlign: "center" },
                  ]}
                >
                  Tap to scan barcode, ingredients, or enter manually
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        ) : (
          <Card variant="elevated" style={{ marginBottom: spacing.xl }}>
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: photoUri }}
                style={[
                  styles.photoImage,
                  { borderRadius: borderRadius.lg },
                ]}
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={handleClearPhoto}
                style={[
                  styles.clearButton,
                  { backgroundColor: colors.semantic.error },
                ]}
              >
                <Feather name="x" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Ingredients Input */}
        <Card variant="outlined" style={{ marginBottom: spacing.xl }}>
          <Text
            style={[
              TextStyles.label,
              { color: colors.neutral[900], marginBottom: spacing.sm, fontWeight: '600' },
            ]}
          >
            Ingredients {photoUri ? "(Auto-detected)" : "(Manual)"}
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.neutral.white,
                color: colors.neutral[900],
                borderColor: colors.neutral[300],
                borderRadius: borderRadius.md,
                padding: spacing.md,
              },
            ]}
            value={ingredients}
            onChangeText={setIngredients}
            placeholder="e.g., chicken, rice, carrots, chicken broth, salt..."
            placeholderTextColor={colors.neutral[400]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>

        {/* Analyze Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleAnalyze}
          disabled={(!photoUri && !ingredients.trim()) || isAnalyzing}
          style={{ marginBottom: spacing.xl }}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Ingredients"}
        </Button>

        {/* Results */}
        {result && (
          <Card variant="elevated">
            <View style={[styles.resultHeader, { marginBottom: spacing.lg }]}>
              <View style={styles.scoreSection}>
                <ScoreBadge score={result.score} />
                <View
                  style={[
                    styles.ratingBadge,
                    {
                      backgroundColor: getRatingColor(result.rating, colors),
                      borderRadius: borderRadius.md,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      marginTop: spacing.sm,
                    },
                  ]}
                >
                  <Text style={[TextStyles.h4, { color: colors.neutral.white, fontWeight: "700" }]}>
                    {result.rating}
                  </Text>
                </View>
                <Text
                  style={[
                    TextStyles.bodySmall,
                    { color: colors.neutral[600], textAlign: "center", marginTop: spacing.xs },
                  ]}
                >
                  {getRatingDescription(result.rating)}
                </Text>
              </View>
            </View>

            <Text
              style={[
                TextStyles.body,
                { color: colors.neutral[700], marginBottom: spacing.lg },
              ]}
            >
              {result.summary}
            </Text>

            {result.toxins.length > 0 && (
              <View
                style={[
                  styles.warningBox,
                  {
                    backgroundColor: colors.semantic.error + "20",
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.lg,
                  },
                ]}
              >
                <Text
                  style={[
                    TextStyles.h4,
                    { color: colors.semantic.error, marginBottom: spacing.sm },
                  ]}
                >
                  Toxic Ingredients Found
                </Text>
                {result.toxins.map((toxin, index) => (
                  <Text
                    key={index}
                    style={[
                      TextStyles.body,
                      { color: colors.semantic.error, marginBottom: spacing.xs },
                    ]}
                  >
                    • {toxin}
                  </Text>
                ))}
              </View>
            )}

            {result.allergens.length > 0 && (
              <View
                style={[
                  styles.warningBox,
                  {
                    backgroundColor: colors.semantic.warning + "20",
                    borderRadius: borderRadius.md,
                    padding: spacing.md,
                    marginBottom: spacing.lg,
                  },
                ]}
              >
                <Text
                  style={[
                    TextStyles.h4,
                    { color: colors.semantic.warning, marginBottom: spacing.sm },
                  ]}
                >
                  Potential Allergens
                </Text>
                {result.allergens.map((allergen, index) => (
                  <Text
                    key={index}
                    style={[
                      TextStyles.body,
                      { color: colors.semantic.warning, marginBottom: spacing.xs },
                    ]}
                  >
                    ⚠ {allergen}
                  </Text>
                ))}
              </View>
            )}

            {result.good.length > 0 && (
              <View style={[styles.listSection, { marginBottom: spacing.lg }]}>
                <Text
                  style={[
                    TextStyles.h4,
                    { color: colors.semantic.success, marginBottom: spacing.sm },
                  ]}
                >
                  Positives
                </Text>
                {result.good.map((item, index) => (
                  <View key={index} style={[styles.listRow, { marginBottom: spacing.xs }]}>
                    <Text style={[TextStyles.body, { color: colors.semantic.success, marginRight: spacing.sm, fontWeight: "600" }]}>
                      +
                    </Text>
                    <Text style={[TextStyles.body, { color: colors.neutral[700], flex: 1 }]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {result.bad.length > 0 && (
              <View style={[styles.listSection, { marginBottom: spacing.lg }]}>
                <Text
                  style={[
                    TextStyles.h4,
                    { color: colors.semantic.warning, marginBottom: spacing.sm },
                  ]}
                >
                  Concerns
                </Text>
                {result.bad.map((item, index) => (
                  <View key={index} style={[styles.listRow, { marginBottom: spacing.xs }]}>
                    <Text style={[TextStyles.body, { color: colors.semantic.warning, marginRight: spacing.sm, fontWeight: "600" }]}>
                      -
                    </Text>
                    <Text style={[TextStyles.body, { color: colors.neutral[700], flex: 1 }]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {result.neither.length > 0 && (
              <View style={[styles.listSection, { marginBottom: spacing.lg }]}>
                <Text
                  style={[
                    TextStyles.h4,
                    { color: colors.neutral[600], marginBottom: spacing.sm },
                  ]}
                >
                  Neutral
                </Text>
                {result.neither.map((item, index) => (
                  <View key={index} style={[styles.listRow, { marginBottom: spacing.xs }]}>
                    <Text style={[TextStyles.body, { color: colors.neutral[500], marginRight: spacing.sm }]}>
                      •
                    </Text>
                    <Text style={[TextStyles.body, { color: colors.neutral[700], flex: 1 }]}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {result.recommendations.length > 0 && (
              <View
                style={[
                  styles.recommendationSection,
                  {
                    marginTop: spacing.lg,
                    paddingTop: spacing.lg,
                    borderTopWidth: 1,
                    borderTopColor: colors.neutral[200],
                  },
                ]}
              >
                <Text
                  style={[
                    TextStyles.h4,
                    { marginBottom: spacing.md, color: colors.primary[500] },
                  ]}
                >
                  Recommended Alternatives
                </Text>
                {result.recommendations.map((rec, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleRecommendationPress(rec.affiliateLink)}
                    style={[
                      styles.recommendationCard,
                      {
                        backgroundColor: colors.secondary[50],
                        borderRadius: borderRadius.md,
                        padding: spacing.md,
                        marginBottom: spacing.md,
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.recContent}>
                      <Text style={[TextStyles.h4, { color: colors.neutral[900] }]}>
                        {rec.name}
                      </Text>
                      <Text
                        style={[
                          TextStyles.body,
                          { color: colors.neutral[600], marginTop: spacing.xs },
                        ]}
                      >
                        {rec.reason}
                      </Text>
                    </View>
                    <Feather
                      name="external-link"
                      size={18}
                      color={colors.primary[500]}
                    />
                  </TouchableOpacity>
                ))}
                <Text
                  style={[
                    TextStyles.bodySmall,
                    {
                      color: colors.neutral[500],
                      marginTop: spacing.md,
                      fontStyle: "italic",
                    },
                  ]}
                >
                  * Links may contain affiliate partnerships
                </Text>
              </View>
            )}
          </Card>
        )}
      </ScrollView>

      {/* Action Dialog */}
      <ActionDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title="Scan Food"
        options={foodScannerOptions}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  photoPlaceholder: {
    minHeight: 200,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderContent: {
    alignItems: "center",
  },
  photoContainer: {
    position: "relative",
  },
  photoImage: {
    width: '100%',
    height: 250,
  },
  clearButton: {
    position: "absolute",
    top: 12,
    right: 12,
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
  textInput: {
    minHeight: 100,
    borderWidth: 1,
    fontSize: 16,
  },
  resultHeader: {
    alignItems: "center",
  },
  scoreSection: {
    alignItems: "center",
  },
  ratingBadge: {},
  warningBox: {},
  listSection: {},
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recommendationSection: {},
  recommendationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recContent: {
    flex: 1,
  },
});
