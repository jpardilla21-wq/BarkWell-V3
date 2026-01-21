import React, { forwardRef } from "react";
import { View, StyleSheet, Image } from "react-native";
import Svg, { Polyline, Circle, Line, Text as SvgText } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { WeeklySnapshotData } from "@/services/weeklySnapshot";

interface WeeklySnapshotCardProps {
  snapshot: WeeklySnapshotData;
}

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const getTrendIcon = (trend: WeeklySnapshotData["digestiveTrend"]) => {
  switch (trend) {
    case "Improving":
      return { name: "trending-up" as const, color: "#22C55E" };
    case "Stable":
      return { name: "minus" as const, color: "#3B82F6" };
    case "Needs Attention":
      return { name: "trending-down" as const, color: "#EF4444" };
  }
};

const getTrendColor = (trend: WeeklySnapshotData["digestiveTrend"]) => {
  switch (trend) {
    case "Improving":
      return "#22C55E";
    case "Stable":
      return "#3B82F6";
    case "Needs Attention":
      return "#EF4444";
  }
};

export const WeeklySnapshotCard = forwardRef<View, WeeklySnapshotCardProps>(
  ({ snapshot }, ref) => {
    const trendIcon = getTrendIcon(snapshot.digestiveTrend);
    const trendColor = getTrendColor(snapshot.digestiveTrend);

    const chartWidth = 280;
    const chartHeight = 100;
    const chartPadding = 20;
    const pointSpacing = (chartWidth - chartPadding * 2) / 6;

    const minScore = Math.min(...snapshot.dailyScores) - 10;
    const maxScore = Math.max(...snapshot.dailyScores) + 10;
    const scoreRange = maxScore - minScore;

    const getY = (score: number) => {
      const normalized = (score - minScore) / scoreRange;
      return (
        chartHeight -
        chartPadding -
        normalized * (chartHeight - chartPadding * 2)
      );
    };

    const points = snapshot.dailyScores
      .map((score, i) => `${chartPadding + i * pointSpacing},${getY(score)}`)
      .join(" ");

    return (
      <View ref={ref} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {snapshot.dogPhoto ? (
              <Image
                source={{ uri: snapshot.dogPhoto }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Feather name="smile" size={24} color={Colors.light.primary} />
              </View>
            )}
          </View>
          <View style={styles.headerText}>
            <ThemedText type="h3" style={styles.title}>
              {snapshot.dogName} Weekly Snapshot
            </ThemedText>
            <ThemedText type="small" style={styles.subtitle}>
              {snapshot.weekStart} – {snapshot.weekEnd}
            </ThemedText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.kpiRow}>
          <View style={styles.kpiBlock}>
            <ThemedText type="small" style={styles.kpiLabel}>
              Digestive Trend
            </ThemedText>
            <View style={styles.kpiValueRow}>
              <Feather name={trendIcon.name} size={18} color={trendColor} />
              <ThemedText
                type="body"
                style={[styles.kpiValue, { color: trendColor }]}
              >
                {snapshot.digestiveTrend}
              </ThemedText>
            </View>
          </View>

          <View style={styles.kpiDivider} />

          <View style={styles.kpiBlock}>
            <ThemedText type="small" style={styles.kpiLabel}>
              Avg Poop Score
            </ThemedText>
            <ThemedText type="h2" style={styles.bigNumber}>
              {snapshot.avgPoopScore}
            </ThemedText>
          </View>

          <View style={styles.kpiDivider} />

          <View style={styles.kpiBlock}>
            <ThemedText type="small" style={styles.kpiLabel}>
              Top Suspects
            </ThemedText>
            <ThemedText type="body" style={styles.kpiValue}>
              {snapshot.topSuspects.join(", ")}
            </ThemedText>
            <ThemedText type="small" style={styles.consistencyText}>
              {snapshot.consistencyPct}% consistent
            </ThemedText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.chartSection}>
          <ThemedText type="h4" style={styles.chartTitle}>
            Poop Score This Week
          </ThemedText>
          <View style={styles.chartContainer}>
            <Svg width={chartWidth} height={chartHeight}>
              {DAYS.map((day, i) => (
                <SvgText
                  key={i}
                  x={chartPadding + i * pointSpacing}
                  y={chartHeight - 4}
                  fontSize="10"
                  fill="#9CA3AF"
                  textAnchor="middle"
                >
                  {day}
                </SvgText>
              ))}

              {[0, 1, 2].map((i) => (
                <Line
                  key={i}
                  x1={chartPadding}
                  y1={chartPadding + i * ((chartHeight - chartPadding * 2) / 2)}
                  x2={chartWidth - chartPadding}
                  y2={chartPadding + i * ((chartHeight - chartPadding * 2) / 2)}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
              ))}

              <Polyline
                points={points}
                fill="none"
                stroke={Colors.light.primary}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {snapshot.dailyScores.map((score, i) => (
                <Circle
                  key={i}
                  cx={chartPadding + i * pointSpacing}
                  cy={getY(score)}
                  r="4"
                  fill={Colors.light.primary}
                />
              ))}
            </Svg>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.behaviorSection}>
          <ThemedText type="h4" style={styles.behaviorTitle}>
            Behavior Notes
          </ThemedText>
          <View style={styles.tagsContainer}>
            {snapshot.behaviorTags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <ThemedText type="small" style={styles.tagText}>
                  {tag}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <ThemedText type="small" style={styles.brandText}>
            PupSense
          </ThemedText>
          <ThemedText type="small" style={styles.disclaimerText}>
            Not veterinary advice.
          </ThemedText>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    margin: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  avatarContainer: {},
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    backgroundColor: "#EBF4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: "#1F2937",
    marginBottom: 2,
  },
  subtitle: {
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: Spacing.md,
  },
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  kpiBlock: {
    flex: 1,
    alignItems: "center",
  },
  kpiDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: Spacing.sm,
  },
  kpiLabel: {
    color: "#6B7280",
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  kpiValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  kpiValue: {
    color: "#1F2937",
    fontWeight: "600",
    textAlign: "center",
  },
  bigNumber: {
    color: Colors.light.primary,
    fontSize: 32,
    fontWeight: "700",
  },
  consistencyText: {
    color: "#9CA3AF",
    marginTop: 2,
  },
  chartSection: {
    alignItems: "center",
  },
  chartTitle: {
    color: "#1F2937",
    marginBottom: Spacing.sm,
    alignSelf: "flex-start",
  },
  chartContainer: {
    alignItems: "center",
  },
  behaviorSection: {},
  behaviorTitle: {
    color: "#1F2937",
    marginBottom: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  tagText: {
    color: "#4B5563",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandText: {
    color: Colors.light.primary,
    fontWeight: "700",
  },
  disclaimerText: {
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});
