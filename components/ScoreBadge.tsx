import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing } from "@/constants/theme";

interface ScoreBadgeProps {
  score: number;
}

const getScoreColor = (score: number): string => {
  if (score <= 50) {
    return Colors.light.urgentRed;
  } else if (score <= 75) {
    return Colors.light.warningYellow;
  } else {
    return Colors.light.softGreen;
  }
};

export function ScoreBadge({ score }: ScoreBadgeProps) {
  const backgroundColor = getScoreColor(score);
  const textColor = score > 50 && score <= 75 ? "#1E1E1E" : "#FFFFFF";

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <ThemedText type="h1" style={[styles.score, { color: textColor }]}>
        {score}
      </ThemedText>
      <ThemedText type="small" style={[styles.label, { color: textColor }]}>
        / 100
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  score: {
    fontWeight: "700",
  },
  label: {
    marginTop: -Spacing.xs,
    opacity: 0.8,
  },
});
