import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { RiskBadge } from "@/components/RiskBadge";
import { ResultCard } from "@/components/ResultCard";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";

type RiskLevel = "Low" | "Medium" | "High";

interface AnalysisResult {
  riskLevel: RiskLevel;
  summary: string;
  tips: string[];
}

export default function PoopCheckScreen() {
  const { theme, isDark } = useTheme();
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!description.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const dummyResult: AnalysisResult = {
        riskLevel: "Low",
        summary:
          "Based on your description, your dog's stool appears to be within normal range. The consistency and color you described are typical for a healthy dog.",
        tips: [
          "Continue monitoring for any changes in frequency or consistency",
          "Ensure your dog stays hydrated throughout the day",
          "Maintain a consistent feeding schedule",
          "If symptoms persist for more than 48 hours, consult your vet",
        ],
      };
      setResult(dummyResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <ThemedText type="body" style={{ color: theme.textMuted }}>
        Describe your dog's stool to get triage advice.
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText type="small" style={styles.label}>
          Description
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
          placeholder="Example: soft, light brown, some mucus, no visible blood, started this morning."
          placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>

      <Button
        onPress={handleAnalyze}
        disabled={!description.trim() || isAnalyzing}
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
  inputContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  textInput: {
    minHeight: 120,
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
