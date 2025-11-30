import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

type RiskLevel = "Low" | "Medium" | "High";

interface RiskBadgeProps {
  level: RiskLevel;
}

const getRiskColor = (level: RiskLevel): string => {
  switch (level) {
    case "Low":
      return Colors.light.softGreen;
    case "Medium":
      return Colors.light.warningYellow;
    case "High":
      return Colors.light.urgentRed;
    default:
      return Colors.light.softGreen;
  }
};

export function RiskBadge({ level }: RiskBadgeProps) {
  const backgroundColor = getRiskColor(level);
  const textColor = level === "Medium" ? "#1E1E1E" : "#FFFFFF";

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <ThemedText type="small" style={[styles.text, { color: textColor }]}>
        {level} Risk
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  text: {
    fontWeight: "600",
  },
});
