/**
 * PoopCheckScreen - Redesigned
 * Analyze dog stool with AI-powered health assessment
 */

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Image,
  Platform,
  Alert,
  Text,
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
import { RiskBadge } from "@/components/RiskBadge";
import { analyzePoopWithGemini, APIKeyError } from "@/utils/apiClient";

type RiskLevel = "Low" | "Medium" | "High";

interface AnalysisResult {
  riskLevel: RiskLevel;
  summary: string;
  tips: string[];
}

export default function PoopCheckScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

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

  const photoOptions: ActionOption[] = [
    {
      icon: 'camera',
      label: 'Open Camera',
      onPress: handleTakePhoto,
    },
    {
      icon: 'image',
      label: 'Select from Photos',
      onPress: handlePickFromLibrary,
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
          Poop Check
        </Text>
        <Text style={[TextStyles.body, { color: colors.neutral[600], marginBottom: spacing.xl }]}>
          Take a photo or describe your dog's stool to get triage advice.
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
                  name="camera"
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
                  Take a Photo
                </Text>
                <Text
                  style={[
                    TextStyles.bodySmall,
                    { color: colors.neutral[600], textAlign: "center" },
                  ]}
                >
                  Tap to take a photo or choose from library
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

        {/* Description Input */}
        <Card variant="outlined" style={{ marginBottom: spacing.xl }}>
          <Text
            style={[
              TextStyles.label,
              { color: colors.neutral[900], marginBottom: spacing.sm, fontWeight: '600' },
            ]}
          >
            Additional Notes (Optional)
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
          fullWidth
          onPress={handleAnalyze}
          disabled={(!photoUri && !description.trim()) || isAnalyzing}
          style={{ marginBottom: spacing.xl }}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Poop"}
        </Button>

        {/* Results */}
        {result && (
          <Card variant="elevated">
            <View style={[styles.resultHeader, { marginBottom: spacing.md }]}>
              <Text style={[TextStyles.h3, { color: colors.neutral[900] }]}>
                Analysis Result
              </Text>
              <RiskBadge level={result.riskLevel} />
            </View>

            <Text
              style={[
                TextStyles.body,
                { color: colors.neutral[700], marginBottom: spacing.lg },
              ]}
            >
              {result.summary}
            </Text>

            <View style={styles.tipsContainer}>
              <Text
                style={[
                  TextStyles.h4,
                  { color: colors.neutral[900], marginBottom: spacing.sm },
                ]}
              >
                Tips
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
        title="Add Photo"
        options={photoOptions}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tipsContainer: {},
  tipRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
