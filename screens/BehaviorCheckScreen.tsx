import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  Text,
  Platform,
  Linking,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { StatePill } from "@/components/StatePill";
import { ResultCard } from "@/components/ResultCard";
import { useTheme } from "@/hooks/useTheme";
import {
  Colors,
  Spacing,
  BorderRadius,
  Typography,
} from "@/constants/theme";
import { analyzeBehaviorWithGemini, APIKeyError } from "@/utils/apiClient";

type BehaviorState =
  | "Relaxed"
  | "Anxious"
  | "Overstimulated"
  | "Defensive"
  | "Possibly in Pain"
  | "Happy & Engaged";

interface BehaviorAnalysisResult {
  state: BehaviorState;
  explanation: string;
  observations: {
    tail: string;
    body: string;
    face: string;
    mouth: string;
  };
  tips: string[];
}

const BEHAVIOR_GUIDELINES = {
  Relaxed: {
    emoji: "😌",
    tips: [
      "Your dog is calm and content - great! Maintain this peaceful environment",
      "Keep current routines and activities that promote relaxation",
      "Good time for training sessions as your dog is receptive",
      "Monitor for any changes in behavior that might indicate stress",
    ],
  },
  "Happy & Engaged": {
    emoji: "😊",
    tips: [
      "Your dog is happy and enjoying interaction - wonderful!",
      "Continue positive activities and playtime your dog enjoys",
      "This is an excellent time to practice commands and training",
      "Maintain healthy exercise and socialization routines",
    ],
  },
  Anxious: {
    emoji: "😟",
    tips: [
      "Create a quiet, safe space where your dog can retreat",
      "Maintain a consistent daily routine for feeding and walks",
      "Use calming aids like anxiety wraps or pheromone diffusers",
      "Avoid reinforcing anxious behavior with excessive attention",
      "Consult a veterinary behaviorist if symptoms persist",
    ],
  },
  Overstimulated: {
    emoji: "😵",
    tips: [
      "Give your dog a break and a quiet space to cool down",
      "Remove triggering stimuli (loud noises, excessive activity)",
      "Provide calm activities like gentle petting or puzzle toys",
      "Practice breathing exercises alongside your dog",
      "Reduce exercise intensity and take more frequent breaks",
    ],
  },
  Defensive: {
    emoji: "😠",
    tips: [
      "Give your dog space and avoid direct interaction right now",
      "Remove any perceived threats or stressors",
      "Use positive reinforcement when your dog displays calm behavior",
      "Never punish defensive behavior - seek professional help",
      "Contact a certified dog behaviorist immediately",
    ],
  },
  "Possibly in Pain": {
    emoji: "🤕",
    tips: [
      "Your dog may be uncomfortable - contact your vet immediately",
      "Avoid rough play or activities that might worsen the issue",
      "Provide a comfortable resting area with supportive bedding",
      "Monitor for additional symptoms like limping or appetite changes",
      "Get a professional veterinary evaluation as soon as possible",
    ],
  },
};

export default function BehaviorCheckScreen() {
  const { theme, isDark } = useTheme();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BehaviorAnalysisResult | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Camera Permission",
        "We need camera permission to record your dog. Please enable it in settings.",
        Platform.OS !== "web"
          ? [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: async () => {
                  if (Platform.OS !== "web") {
                    try {
                      await Linking.openSettings();
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

  const handleRecordVideo = async () => {
    if (Platform.OS === "web") {
      Alert.alert(
        "Not Available on Web",
        "Run in Expo Go to record videos of your dog"
      );
      return;
    }

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);
        setResult(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to record video. Please try again.");
    }
  };

  const handlePickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 0.8,
      });

      if (!result.canceled) {
        setVideoUri(result.assets[0].uri);
        setResult(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick video. Please try again.");
    }
  };

  const analyzeVideo = async () => {
    if (!videoUri) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const result = await analyzeBehaviorWithGemini(videoUri);
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

  const handleClearVideo = () => {
    setVideoUri(null);
    setResult(null);
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <ThemedText type="body" style={{ color: theme.textMuted }}>
        Record a 30-60 second video of your dog's body language and behavior
        for AI analysis.
      </ThemedText>

      {!videoUri ? (
        <View style={styles.videoSection}>
          <ThemedView
            style={[
              styles.videoPlaceholder,
              { borderColor: Colors.light.primary },
            ]}
          >
            <Feather
              name="video"
              size={48}
              color={Colors.light.primary}
              style={{ marginBottom: Spacing.md }}
            />
            <ThemedText type="body" style={{ textAlign: "center" }}>
              Record your dog's behavior
            </ThemedText>
            <ThemedText
              type="small"
              style={{
                color: theme.textMuted,
                marginTop: Spacing.sm,
                textAlign: "center",
              }}
            >
              30-60 seconds recommended
            </ThemedText>
          </ThemedView>

          <View style={styles.buttonGroup}>
            <Pressable
              onPress={handleRecordVideo}
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
                <Feather
                  name="video"
                  size={18}
                  color={Colors.light.primary}
                />
                <Text style={styles.buttonText}>Record</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handlePickVideo}
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
                <Feather
                  name="film"
                  size={18}
                  color={Colors.light.primary}
                />
                <Text style={styles.buttonText}>Browse</Text>
              </View>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.videoContainer}>
          <ThemedView
            style={[
              styles.videoPreview,
              { backgroundColor: Colors.light.backgroundDark },
            ]}
          >
            <Feather name="check-circle" size={48} color={Colors.light.softGreen} />
            <ThemedText type="body" style={{ marginTop: Spacing.md }}>
              Video Ready
            </ThemedText>
          </ThemedView>
          <Pressable
            onPress={handleClearVideo}
            style={[styles.clearButton, { backgroundColor: Colors.light.primary }]}
          >
            <Feather name="x" size={20} color="white" />
          </Pressable>
        </View>
      )}

      <Button
        onPress={analyzeVideo}
        disabled={!videoUri || isAnalyzing}
      >
        {isAnalyzing ? "Analyzing Behavior..." : "Analyze Behavior"}
      </Button>

      {result ? (
        <ResultCard style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View>
              <ThemedText type="h4">Emotional State</ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textMuted, marginTop: Spacing.xs }}
              >
                Based on body language analysis
              </ThemedText>
            </View>
            <StatePill state={result.state} />
          </View>

          <ThemedText type="body" style={styles.explanation}>
            {result.explanation}
          </ThemedText>

          <View style={styles.observationsSection}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Observations
            </ThemedText>

            <View style={styles.observationItem}>
              <Feather
                name="move"
                size={18}
                color={Colors.light.primary}
                style={{ marginRight: Spacing.sm }}
              />
              <View style={styles.observationContent}>
                <ThemedText type="small" style={{ fontWeight: "600" }}>
                  Tail
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textMuted }}>
                  {result.observations.tail}
                </ThemedText>
              </View>
            </View>

            <View style={styles.observationItem}>
              <Feather
                name="square"
                size={18}
                color={Colors.light.primary}
                style={{ marginRight: Spacing.sm }}
              />
              <View style={styles.observationContent}>
                <ThemedText type="small" style={{ fontWeight: "600" }}>
                  Body
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textMuted }}>
                  {result.observations.body}
                </ThemedText>
              </View>
            </View>

            <View style={styles.observationItem}>
              <Feather
                name="eye"
                size={18}
                color={Colors.light.primary}
                style={{ marginRight: Spacing.sm }}
              />
              <View style={styles.observationContent}>
                <ThemedText type="small" style={{ fontWeight: "600" }}>
                  Face
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textMuted }}>
                  {result.observations.face}
                </ThemedText>
              </View>
            </View>

            <View style={styles.observationItem}>
              <Feather
                name="smile"
                size={18}
                color={Colors.light.primary}
                style={{ marginRight: Spacing.sm }}
              />
              <View style={styles.observationContent}>
                <ThemedText type="small" style={{ fontWeight: "600" }}>
                  Mouth
                </ThemedText>
                <ThemedText type="body" style={{ color: theme.textMuted }}>
                  {result.observations.mouth}
                </ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.tipsContainer}>
            <ThemedText type="h4" style={styles.tipsTitle}>
              Recommendations
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
  videoSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  videoPlaceholder: {
    height: 220,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  videoContainer: {
    position: "relative",
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  videoPreview: {
    height: 250,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
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
  resultCard: {
    marginTop: Spacing.lg,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },
  explanation: {
    marginBottom: Spacing.lg,
  },
  observationsSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  observationItem: {
    flexDirection: "row",
    marginBottom: Spacing.md,
  },
  observationContent: {
    flex: 1,
  },
  tipsContainer: {
    gap: Spacing.sm,
  },
  tipsTitle: {
    marginBottom: Spacing.md,
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
