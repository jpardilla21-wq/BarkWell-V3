import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface ResultCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function ResultCard({ children, style }: ResultCardProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: theme.cardBackground }, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
});
