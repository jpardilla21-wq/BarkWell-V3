import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Platform,
  Pressable,
  Alert,
  Linking,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/design-system";
import Card from "@/src/components/redesign/Card";
import Button from "@/src/components/redesign/Button";
import { analyzePoopWithGemini, APIKeyError } from "@/utils/apiClient";

type RiskLevel = "Low" | "Medium" | "High";

interface AnalysisResult {
  riskLevel: RiskLevel;
  summary: string;
  tips: string[];
}

export default function PoopCheckScreenRedesign() {
  const { colors, spacing, typography, shadows } = useTheme();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission",
        "We need camera permission to take photos. Please enable it in settings.",
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
                      // Linking not supported on this platform
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

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
        setDescription("");
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
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
        setDescription("");
        setResult(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleAnalyze = async () => {
    if (!photoUri && !description.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const result = await analyzePoopWithGemini(photoUri, description);
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
    setDescription("");
    setResult(null);
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "Low":
        return colors.status.excellent;
      case "Medium":
        return colors.accent[500];
      case "High":
        return colors.status.critical;
      default:
        return colors.neutral[400];
    }
  };

  // Dynamic styles that use theme values
  const dynamicStyles = {
    headerTitle: {
      fontSize: typography.h2.fontSize,
      fontFamily: typography.display.fontFamily,
      fontWeight: "700" as const,
      color: colors.neutral[900],
      marginTop: spacing.md,
    },
    headerSubtitle: {
      fontSize: typography.bodyM.fontSize,
      color: colors.neutral[600],
      textAlign: "center" as const,
      marginTop: spacing.xs,
    },
    placeholderText: {
      fontSize: typography.bodyM.fontSize,
      color: colors.neutral[700],
      marginTop: spacing.md,
      textAlign: "center" as const,
    },
    sectionLabel: {
      fontSize: typography.bodyS.fontSize,
      fontWeight: "600" as const,
      color: colors.neutral[900],
      marginBottom: spacing.sm,
    },
    resultTitle: {
      fontSize: typography.h3.fontSize,
      fontWeight: "700" as const,
      color: colors.neutral[900],
    },
    riskBadgeText: {
      fontSize: typography.bodyS.fontSize,
      fontWeight: "700" as const,
      color: colors.neutral.white,
    },
    resultSummary: {
      fontSize: typography.bodyM.fontSize,
      color: colors.neutral[700],
      marginTop: spacing.md,
      lineHeight: typography.bodyM.lineHeight,
    },
    recommendationTitle: {
      fontSize: typography.h4.fontSize,
      fontWeight: "600" as const,
      color: colors.neutral[900],
      marginBottom: spacing.sm,
    },
    tipText: {
      fontSize: typography.bodyM.fontSize,
      color: colors.neutral[700],
      flex: 1,
      lineHeight: typography.bodyM.lineHeight,
    },
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.neutral.cream }]} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primary[100] }]}>
            <Feather name="target" size={32} color={colors.primary[500]} />
          </View>
          <Text style={dynamicStyles.headerTitle}>
            Poop Check
          </Text>
          <Text style={dynamicStyles.headerSubtitle}>
            Take a photo or describe your dog's stool to get triage advice
          </Text>
        </View>

        {/* Photo Section */}
        {!photoUri ? (
          <Card variant="elevated" style={styles.photoCard}>
            <View style={[styles.photoPlaceholder, { borderColor: colors.primary[300] }]}>
              <Feather name="camera" size={48} color={colors.primary[500]} />
              <Text style={dynamicStyles.placeholderText}>
                Take a photo of your dog's poop
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <Button
                variant="outline"
                size="md"
                leftIcon={<Feather name="camera" size={18} color={colors.primary[500]} />}
                onPress={handleTakePhoto}
                style={{ flex: 1 }}
              >
                Take Photo
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={<Feather name="image" size={18} color={colors.primary[500]} />}
                onPress={handlePickFromLibrary}
                style={{ flex: 1 }}
              >
                Choose Photo
              </Button>
            </View>
          </Card>
        ) : (
          <Card variant="elevated" style={styles.photoCard}>
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: photoUri }}
                style={styles.photoImage}
                resizeMode="cover"
              />
              <Pressable
                onPress={handleClearPhoto}
                style={[styles.clearButton, { backgroundColor: colors.primary[500], ...shadows.md }]}
              >
                <Feather name="x" size={20} color={colors.neutral.white} />
              </Pressable>
            </View>
          </Card>
        )}

        {/* Description Input */}
        <Card variant="flat" style={styles.inputCard}>
          <Text style={dynamicStyles.sectionLabel}>
            Additional Notes (Optional)
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.neutral.white,
                color: colors.neutral[900],
                borderColor: colors.neutral[300],
                fontFamily: typography.body.fontFamily,
                fontSize: typography.bodyM.fontSize,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Example: soft, light brown, some mucus, no visible blood"
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
          onPress={handleAnalyze}
          disabled={!photoUri && !description.trim()}
          loading={isAnalyzing}
          style={styles.analyzeButton}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Poop"}
        </Button>

        {/* Results */}
        {result && (
          <Card variant="elevated" style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={dynamicStyles.resultTitle}>
                Analysis Result
              </Text>
              <View
                style={[
                  styles.riskBadge,
                  { backgroundColor: getRiskColor(result.riskLevel) }
                ]}
              >
                <Text style={dynamicStyles.riskBadgeText}>
                  {result.riskLevel} Risk
                </Text>
              </View>
            </View>

            <Text style={dynamicStyles.resultSummary}>
              {result.summary}
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.neutral[200] }]} />

            <Text style={dynamicStyles.recommendationTitle}>
              Recommendations
            </Text>
            {result.tips.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <View style={[styles.bulletPoint, { backgroundColor: colors.primary[500] }]} />
                <Text style={dynamicStyles.tipText}>
                  {tip}
                </Text>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  photoCard: {
    marginBottom: 16,
  },
  photoPlaceholder: {
    height: 200,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  photoContainer: {
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
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
  },
  inputCard: {
    marginBottom: 16,
  },
  textInput: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  analyzeButton: {
    marginBottom: 16,
  },
  resultCard: {
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  tipRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    marginRight: 12,
  },
});
