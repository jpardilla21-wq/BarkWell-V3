import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { StatePill } from "@/components/StatePill";
import { ResultCard } from "@/components/ResultCard";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";

type BehaviorState =
  | "Relaxed"
  | "Anxious"
  | "Overstimulated"
  | "Defensive"
  | "Possibly in Pain";

interface BehaviorAnalysisResult {
  state: BehaviorState;
  explanation: string;
  tips: string[];
}

export default function BehaviorCheckScreen() {
  const { theme, isDark } = useTheme();
  const [description, setDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BehaviorAnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!description.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const dummyResult: BehaviorAnalysisResult = {
        state: "Anxious",
        explanation:
          "Based on your description, your dog appears to be showing signs of anxiety. Common triggers include changes in environment, loud noises, or separation from family members. The behaviors you described - pacing, panting, and avoiding eye contact - are typical anxiety indicators.",
        tips: [
          "Create a quiet, safe space where your dog can retreat",
          "Maintain a consistent daily routine for feeding and walks",
          "Consider calming aids like anxiety wraps or pheromone diffusers",
          "Avoid reinforcing anxious behavior with excessive attention",
          "If symptoms persist, consult a veterinary behaviorist",
        ],
      };
      setResult(dummyResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <ThemedText type="body" style={{ color: theme.textMuted }}>
        Describe your dog's body language or recent behavior.
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
          placeholder="Example: tail tucked, ears back, pacing around the room, won't make eye contact, panting heavily..."
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
        {isAnalyzing ? "Analyzing..." : "Analyze Behavior"}
      </Button>

      {result ? (
        <ResultCard style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <ThemedText type="h4">Emotional State</ThemedText>
            <StatePill state={result.state} />
          </View>

          <ThemedText type="body" style={styles.explanation}>
            {result.explanation}
          </ThemedText>

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
    marginBottom: Spacing.lg,
  },
  explanation: {
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
