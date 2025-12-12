import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  Platform,
  Pressable,
  Alert,
  Text,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { RiskBadge } from "@/components/RiskBadge";
import { ResultCard } from "@/components/ResultCard";
import { useTheme } from "@/hooks/useTheme";
import {
  Spacing,
  BorderRadius,
  Typography,
  Colors,
} from "@/constants/theme";
import { analyzePoopWithGemini, APIKeyError } from "@/utils/apiClient";

type RiskLevel = "Low" | "Medium" | "High";

interface AnalysisResult {
  riskLevel: RiskLevel;
  summary: string;
  tips: string[];
}

export default function PoopCheckScreen() {
  const { theme, isDark } = useTheme();
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
                  // For web, this won't work, but we handle the error gracefully
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

  return (
    <ScreenKeyboardAwareScrollView>
      <ThemedText type="body" style={{ color: theme.textMuted }}>
        Take a photo or describe your dog's stool to get triage advice.
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
              name="camera"
              size={48}
              color={Colors.light.primary}
              style={{ marginBottom: Spacing.md }}
            />
            <ThemedText type="body" style={{ textAlign: "center" }}>
              Take a photo of your dog's poop
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
                <Text style={styles.buttonText}>Take Photo</Text>
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
                <Text style={styles.buttonText}>Choose Photo</Text>
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
          Additional Notes (Optional)
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
          value={description}
          onChangeText={setDescription}
          placeholder="Example: soft, light brown, some mucus, no visible blood"
          placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <Button
        onPress={handleAnalyze}
        disabled={!photoUri && !description.trim() && !isAnalyzing}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Poop"}
      </Button>

      {result ? (
        <ResultCard style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <ThemedText type="h4">Analysis Result</ThemedText>
            <RiskBadge level={result.riskLevel} />
          </View>

          <ThemedText type="body" style={styles.summary}>
            {result.summary}
          </ThemedText>

          <View style={styles.tipsContainer}>
            <ThemedText type="h4" style={styles.tipsTitle}>
              Tips
            </ThemedText>
            {result.tips.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <ThemedText type="body" style={styles.bullet}>
                  •
                </ThemedText>
                <ThemedText type="body" style={styles.tipText}>
                  {tip}
                </ThemedText>
              </View>
            ))}
          </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  summary: {
    marginBottom: Spacing.lg,
  },
  tipsContainer: {
    gap: Spacing.sm,
  },
  tipsTitle: {
    marginBottom: Spacing.xs,
  },
  tipRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  bullet: {
    width: 16,
  },
  tipText: {
    flex: 1,
  },
});
