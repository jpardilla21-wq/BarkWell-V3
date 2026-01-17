import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

type BehaviorState =
  | "Relaxed"
  | "Anxious"
  | "Overstimulated"
  | "Defensive"
  | "Possibly in Pain"
  | "Happy & Engaged";

interface StatePillProps {
  state: BehaviorState;
}

const getStateColor = (state: BehaviorState): string => {
  switch (state) {
    case "Relaxed":
      return Colors.light.softGreen;
    case "Happy & Engaged":
      return Colors.light.softGreen;
    case "Anxious":
      return Colors.light.warningYellow;
    case "Overstimulated":
      return Colors.light.warningYellow;
    case "Defensive":
      return Colors.light.urgentRed;
    case "Possibly in Pain":
      return Colors.light.urgentRed;
    default:
      return Colors.light.primary;
  }
};

export function StatePill({ state }: StatePillProps) {
  const backgroundColor = getStateColor(state);
  const textColor =
    state === "Anxious" || state === "Overstimulated" ? "#1E1E1E" : "#FFFFFF";

  return (
    <View style={[styles.pill, { backgroundColor }]}>
      <ThemedText type="small" style={[styles.text, { color: textColor }]}>
        {state}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  text: {
    fontWeight: "600",
  },
});
