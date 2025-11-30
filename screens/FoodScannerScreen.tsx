import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { ScoreBadge } from "@/components/ScoreBadge";
import { ResultCard } from "@/components/ResultCard";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";

interface FoodAnalysisResult {
  score: number;
  summary: string;
  good: string[];
  bad: string[];
  toxins: string[];
}

export default function FoodScannerScreen() {
  const { theme, isDark } = useTheme();
  const [ingredients, setIngredients] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<FoodAnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!ingredients.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      const dummyResult: FoodAnalysisResult = {
        score: 72,
        summary:
          "This food contains mostly safe ingredients for dogs, but there are a few concerns to be aware of.",
        good: [
          "High protein content from chicken",
          "Contains beneficial omega fatty acids",
          "Includes digestible carbohydrates",
        ],
        bad: [
          "Contains some artificial preservatives",
          "Higher sodium content than recommended",
        ],
        toxins: ingredients.toLowerCase().includes("onion")
          ? ["Onion - toxic to dogs, can cause anemia"]
          : [],
      };
      setResult(dummyResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <ThemedText type="body" style={{ color: theme.textMuted }}>
        Paste an ingredient list or description of the food.
      </ThemedText>

      <View style={styles.inputContainer}>
        <ThemedText type="small" style={styles.label}>
          Ingredients
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
          placeholder="Example: chicken, rice, carrots, chicken broth, salt, preservatives..."
          placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>

      <Button
        onPress={handleAnalyze}
        disabled={!ingredients.trim() || isAnalyzing}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Food"}
      </Button>

      {result ? (
        <ResultCard style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <View style={styles.scoreSection}>
              <ScoreBadge score={result.score} />
              <ThemedText type="h4" style={styles.scoreLabel}>
                Safety Score
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
                style={{ color: Colors.light.urgentRed, marginBottom: Spacing.sm }}
              >
                Warning: Toxins Detected
              </ThemedText>
              {result.toxins.map((toxin, index) => (
                <ThemedText
                  key={index}
                  type="body"
                  style={{ color: Colors.light.urgentRed }}
                >
                  {toxin}
                </ThemedText>
              ))}
            </View>
          ) : null}

          {result.good.length > 0 ? (
            <View style={styles.listSection}>
              <ThemedText
                type="h4"
                style={{ color: Colors.light.softGreen, marginBottom: Spacing.sm }}
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
                style={{ color: Colors.light.warningYellow, marginBottom: Spacing.sm }}
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
  summary: {
    marginBottom: Spacing.lg,
  },
  toxinWarning: {
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
});
