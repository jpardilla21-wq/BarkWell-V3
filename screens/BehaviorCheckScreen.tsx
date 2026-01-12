/**
 * BehaviorCheckScreen - Redesigned
 * Analyze dog behavior with AI-powered emotional state assessment
 */

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Platform,
  Linking,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { useTheme, CommonStyles, TextStyles } from "@/design-system";
import { Card, Button } from "@/src/components/redesign";
import ActionDialog, { ActionOption } from "@/src/components/redesign/ActionDialog";
import { StatePill } from "@/components/StatePill";
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

export default function BehaviorCheckScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BehaviorAnalysisResult | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

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

  const videoOptions: ActionOption[] = [
    {
      icon: 'video',
      label: 'Record Video',
      onPress: handleRecordVideo,
    },
    {
      icon: 'film',
      label: 'Recorded Video from Photos',
      onPress: handlePickVideo,
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
          Behavior Check
        </Text>
        <Text style={[TextStyles.body, { color: colors.neutral[600], marginBottom: spacing.xl }]}>
          Record a 30-60 second video of your dog's body language and behavior for AI analysis.
        </Text>

        {/* Video Section */}
        {!videoUri ? (
          <Card variant="outlined" style={{ marginBottom: spacing.xl }}>
            <TouchableOpacity
              style={[
                styles.videoPlaceholder,
                {
                  borderColor: colors.primary[300],
                  backgroundColor: colors.secondary[50],
                  borderRadius: borderRadius.lg,
                  padding: spacing.xl,
                },
              ]}
              onPress={() => setDialogVisible(true)}
              activeOpacity={0.7}
            >
              <View style={styles.placeholderContent}>
                <Feather
                  name="video"
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
                  Record Behavior
                </Text>
                <Text
                  style={[
                    TextStyles.bodySmall,
                    { color: colors.neutral[600], textAlign: "center" },
                  ]}
                >
                  Tap to record or choose from library
                </Text>
                <Text
                  style={[
                    TextStyles.bodySmall,
                    { color: colors.neutral[500], textAlign: "center", marginTop: spacing.xs },
                  ]}
                >
                  30-60 seconds recommended
                </Text>
              </View>
            </TouchableOpacity>
          </Card>
        ) : (
          <Card variant="elevated" style={{ marginBottom: spacing.xl }}>
            <View style={styles.videoContainer}>
              <View
                style={[
                  styles.videoPreview,
                  {
                    backgroundColor: colors.secondary[100],
                    borderRadius: borderRadius.lg,
                  },
                ]}
              >
                <Feather name="check-circle" size={48} color={colors.primary[500]} />
                <Text
                  style={[
                    TextStyles.h4,
                    { color: colors.neutral[900], marginTop: spacing.md },
                  ]}
                >
                  Video Ready
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleClearVideo}
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

        {/* Analyze Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onPress={analyzeVideo}
          disabled={!videoUri || isAnalyzing}
          style={{ marginBottom: spacing.xl }}
        >
          {isAnalyzing ? "Analyzing Behavior..." : "Analyze Behavior"}
        </Button>

        {/* Results */}
        {result && (
          <Card variant="elevated">
            <View style={[styles.resultHeader, { marginBottom: spacing.md }]}>
              <View>
                <Text style={[TextStyles.h3, { color: colors.neutral[900] }]}>
                  Emotional State
                </Text>
                <Text
                  style={[
                    TextStyles.bodySmall,
                    { color: colors.neutral[500], marginTop: spacing.xs },
                  ]}
                >
                  Based on body language analysis
                </Text>
              </View>
              <StatePill state={result.state} />
            </View>

            <Text
              style={[
                TextStyles.body,
                { color: colors.neutral[700], marginBottom: spacing.lg },
              ]}
            >
              {result.explanation}
            </Text>

            <View
              style={[
                styles.observationsSection,
                {
                  marginBottom: spacing.lg,
                  paddingBottom: spacing.lg,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.neutral[200],
                },
              ]}
            >
              <Text
                style={[
                  TextStyles.h4,
                  { color: colors.neutral[900], marginBottom: spacing.md },
                ]}
              >
                Observations
              </Text>

              <View style={[styles.observationItem, { marginBottom: spacing.md }]}>
                <Feather
                  name="move"
                  size={18}
                  color={colors.primary[500]}
                  style={{ marginRight: spacing.sm }}
                />
                <View style={styles.observationContent}>
                  <Text style={[TextStyles.label, { color: colors.neutral[900], fontWeight: "600" }]}>
                    Tail
                  </Text>
                  <Text style={[TextStyles.body, { color: colors.neutral[600] }]}>
                    {result.observations.tail}
                  </Text>
                </View>
              </View>

              <View style={[styles.observationItem, { marginBottom: spacing.md }]}>
                <Feather
                  name="square"
                  size={18}
                  color={colors.primary[500]}
                  style={{ marginRight: spacing.sm }}
                />
                <View style={styles.observationContent}>
                  <Text style={[TextStyles.label, { color: colors.neutral[900], fontWeight: "600" }]}>
                    Body
                  </Text>
                  <Text style={[TextStyles.body, { color: colors.neutral[600] }]}>
                    {result.observations.body}
                  </Text>
                </View>
              </View>

              <View style={[styles.observationItem, { marginBottom: spacing.md }]}>
                <Feather
                  name="eye"
                  size={18}
                  color={colors.primary[500]}
                  style={{ marginRight: spacing.sm }}
                />
                <View style={styles.observationContent}>
                  <Text style={[TextStyles.label, { color: colors.neutral[900], fontWeight: "600" }]}>
                    Face
                  </Text>
                  <Text style={[TextStyles.body, { color: colors.neutral[600] }]}>
                    {result.observations.face}
                  </Text>
                </View>
              </View>

              <View style={[styles.observationItem, { marginBottom: spacing.md }]}>
                <Feather
                  name="smile"
                  size={18}
                  color={colors.primary[500]}
                  style={{ marginRight: spacing.sm }}
                />
                <View style={styles.observationContent}>
                  <Text style={[TextStyles.label, { color: colors.neutral[900], fontWeight: "600" }]}>
                    Mouth
                  </Text>
                  <Text style={[TextStyles.body, { color: colors.neutral[600] }]}>
                    {result.observations.mouth}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.tipsContainer}>
              <Text
                style={[
                  TextStyles.h4,
                  { color: colors.neutral[900], marginBottom: spacing.sm },
                ]}
              >
                Recommendations
              </Text>
              {result.tips.map((tip, index) => (
                <View key={index} style={[styles.tipRow, { marginBottom: spacing.sm }]}>
                  <Text style={[TextStyles.body, { color: colors.primary[500], marginRight: spacing.sm }]}>
                    •
                  </Text>
                  <Text style={[TextStyles.body, { color: colors.neutral[700], flex: 1 }]}>
                    {tip}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Action Dialog */}
      <ActionDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title="Add Video"
        options={videoOptions}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  videoPlaceholder: {
    minHeight: 200,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderContent: {
    alignItems: "center",
  },
  videoContainer: {
    position: "relative",
  },
  videoPreview: {
    width: '100%',
    height: 250,
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
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  observationsSection: {},
  observationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  observationContent: {
    flex: 1,
  },
  tipsContainer: {},
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
