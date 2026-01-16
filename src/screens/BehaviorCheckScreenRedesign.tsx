import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  Platform,
  Linking,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/design-system";
import Card from "@/src/components/redesign/Card";
import Button from "@/src/components/redesign/Button";
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

export default function BehaviorCheckScreenRedesign() {
  const { colors, spacing, typography, shadows } = useTheme();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BehaviorAnalysisResult | null>(null);

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

  const getStateColor = (state: BehaviorState) => {
    switch (state) {
      case "Relaxed":
        return colors.status.excellent;
      case "Happy & Engaged":
        return colors.primary[500];
      case "Anxious":
        return colors.accent[500];
      case "Overstimulated":
        return colors.secondary[500];
      case "Defensive":
        return colors.status.warning;
      case "Possibly in Pain":
        return colors.status.critical;
      default:
        return colors.neutral[400];
    }
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
            <Feather name="activity" size={32} color={colors.primary[500]} />
          </View>
          <Text style={{ fontSize: typography.h2.fontSize, fontFamily: typography.display.fontFamily, fontWeight: "700", color: colors.neutral[900], marginTop: spacing.md }}>
            Behavior Check
          </Text>
          <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[600], textAlign: "center", marginTop: spacing.xs }}>
            Record a 30-60 second video of your dog's body language and behavior
          </Text>
        </View>

        {/* Video Section */}
        {!videoUri ? (
          <Card variant="elevated" style={styles.videoCard}>
            <View style={[styles.videoPlaceholder, { borderColor: colors.primary[300] }]}>
              <Feather name="video" size={48} color={colors.primary[500]} />
              <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[700], marginTop: spacing.md, textAlign: "center" }}>
                Record your dog's behavior
              </Text>
              <Text style={{ fontSize: typography.bodyS.fontSize, color: colors.neutral[500], marginTop: spacing.xs, textAlign: "center" }}>
                30-60 seconds recommended
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <Button
                variant="outline"
                size="md"
                leftIcon={<Feather name="video" size={18} color={colors.primary[500]} />}
                onPress={handleRecordVideo}
                style={{ flex: 1 }}
              >
                Record
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={<Feather name="film" size={18} color={colors.primary[500]} />}
                onPress={handlePickVideo}
                style={{ flex: 1 }}
              >
                Browse
              </Button>
            </View>
          </Card>
        ) : (
          <Card variant="elevated" style={styles.videoCard}>
            <View style={[styles.videoPreview, { backgroundColor: colors.primary[50] }]}>
              <Feather name="check-circle" size={48} color={colors.primary[500]} />
              <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[700], marginTop: spacing.md }}>
                Video Ready
              </Text>
            </View>
            <Pressable
              onPress={handleClearVideo}
              style={[styles.clearButton, { backgroundColor: colors.primary[500], ...shadows.md }]}
            >
              <Feather name="x" size={20} color={colors.neutral.white} />
            </Pressable>
          </Card>
        )}

        {/* Analyze Button */}
        <Button
          variant="primary"
          size="lg"
          onPress={analyzeVideo}
          disabled={!videoUri}
          loading={isAnalyzing}
          style={styles.analyzeButton}
        >
          {isAnalyzing ? "Analyzing Behavior..." : "Analyze Behavior"}
        </Button>

        {/* Results */}
        {result && (
          <Card variant="elevated" style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <View>
                <Text style={{ fontSize: typography.h3.fontSize, fontWeight: "700", color: colors.neutral[900] }}>
                  Emotional State
                </Text>
                <Text style={{ fontSize: typography.bodyS.fontSize, color: colors.neutral[500], marginTop: spacing.xs }}>
                  Based on body language analysis
                </Text>
              </View>
              <View
                style={[
                  styles.stateBadge,
                  { backgroundColor: getStateColor(result.state) }
                ]}
              >
                <Text style={{ fontSize: typography.bodyS.fontSize, fontWeight: "700", color: colors.neutral.white }}>
                  {result.state}
                </Text>
              </View>
            </View>

            <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[700], marginTop: spacing.md, lineHeight: typography.bodyM.lineHeight }}>
              {result.explanation}
            </Text>

            <View style={[styles.divider, { backgroundColor: colors.neutral[200] }]} />

            {/* Observations */}
            <Text style={{ fontSize: typography.h4.fontSize, fontWeight: "600", color: colors.neutral[900], marginBottom: spacing.md }}>
              Observations
            </Text>

            <View style={styles.observationItem}>
              <View style={[styles.observationIcon, { backgroundColor: colors.primary[100] }]}>
                <Feather name="move" size={18} color={colors.primary[500]} />
              </View>
              <View style={styles.observationContent}>
                <Text style={{ fontSize: typography.bodyS.fontSize, fontWeight: "600", color: colors.neutral[900] }}>
                  Tail
                </Text>
                <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[600], marginTop: 2 }}>
                  {result.observations.tail}
                </Text>
              </View>
            </View>

            <View style={styles.observationItem}>
              <View style={[styles.observationIcon, { backgroundColor: colors.primary[100] }]}>
                <Feather name="square" size={18} color={colors.primary[500]} />
              </View>
              <View style={styles.observationContent}>
                <Text style={{ fontSize: typography.bodyS.fontSize, fontWeight: "600", color: colors.neutral[900] }}>
                  Body
                </Text>
                <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[600], marginTop: 2 }}>
                  {result.observations.body}
                </Text>
              </View>
            </View>

            <View style={styles.observationItem}>
              <View style={[styles.observationIcon, { backgroundColor: colors.primary[100] }]}>
                <Feather name="eye" size={18} color={colors.primary[500]} />
              </View>
              <View style={styles.observationContent}>
                <Text style={{ fontSize: typography.bodyS.fontSize, fontWeight: "600", color: colors.neutral[900] }}>
                  Face
                </Text>
                <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[600], marginTop: 2 }}>
                  {result.observations.face}
                </Text>
              </View>
            </View>

            <View style={styles.observationItem}>
              <View style={[styles.observationIcon, { backgroundColor: colors.primary[100] }]}>
                <Feather name="smile" size={18} color={colors.primary[500]} />
              </View>
              <View style={styles.observationContent}>
                <Text style={{ fontSize: typography.bodyS.fontSize, fontWeight: "600", color: colors.neutral[900] }}>
                  Mouth
                </Text>
                <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[600], marginTop: 2 }}>
                  {result.observations.mouth}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.neutral[200] }]} />

            {/* Recommendations */}
            <Text style={{ fontSize: typography.h4.fontSize, fontWeight: "600", color: colors.neutral[900], marginBottom: spacing.sm }}>
              Recommendations
            </Text>
            {result.tips.map((tip, index) => (
              <View key={index} style={styles.tipRow}>
                <View style={[styles.bulletPoint, { backgroundColor: colors.primary[500] }]} />
                <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[700], flex: 1, lineHeight: typography.bodyM.lineHeight }}>
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
  videoCard: {
    marginBottom: 16,
  },
  videoPlaceholder: {
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
  videoPreview: {
    height: 250,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
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
  analyzeButton: {
    marginBottom: 16,
  },
  resultCard: {
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  stateBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  observationItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  observationIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  observationContent: {
    flex: 1,
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
