/**
 * HistoryScreen - Redesigned
 * View history of all pet health checks and scans
 */

import React from "react";
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme, CommonStyles, TextStyles } from "@/design-system";
import { Card } from "@/src/components/redesign";

type HistoryItemType = "poop" | "food" | "behavior";

interface HistoryItem {
  id: string;
  type: HistoryItemType;
  date: string;
  summary: string;
}

const HISTORY_DATA: HistoryItem[] = [
  {
    id: "1",
    type: "poop",
    date: "Nov 30, 2025",
    summary: "Normal stool consistency - Low risk",
  },
  {
    id: "2",
    type: "food",
    date: "Nov 29, 2025",
    summary: "Chicken treats - Score: 85/100",
  },
  {
    id: "3",
    type: "behavior",
    date: "Nov 28, 2025",
    summary: "Mild anxiety detected - Recommended calming techniques",
  },
  {
    id: "4",
    type: "poop",
    date: "Nov 27, 2025",
    summary: "Soft stool with mucus - Medium risk",
  },
  {
    id: "5",
    type: "food",
    date: "Nov 26, 2025",
    summary: "New kibble brand - Score: 78/100",
  },
];

const getIconForType = (type: HistoryItemType): keyof typeof Feather.glyphMap => {
  switch (type) {
    case "poop":
      return "target";
    case "food":
      return "search";
    case "behavior":
      return "activity";
    default:
      return "circle";
  }
};

const getColorForType = (type: HistoryItemType, colors: any): string => {
  switch (type) {
    case "poop":
      return colors.accent[500];
    case "food":
      return colors.secondary[500];
    case "behavior":
      return colors.primary[500];
    default:
      return colors.primary[500];
  }
};

const getLabelForType = (type: HistoryItemType): string => {
  switch (type) {
    case "poop":
      return "Poop Check";
    case "food":
      return "Food Scanner";
    case "behavior":
      return "Behavior Check";
    default:
      return "";
  }
};

export default function HistoryScreen() {
  const { colors, spacing, borderRadius } = useTheme();

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const iconColor = getColorForType(item.type, colors);
    const iconName = getIconForType(item.type);
    const label = getLabelForType(item.type);

    return (
      <TouchableOpacity activeOpacity={0.7} style={[styles.cardWrapper, { marginBottom: spacing.md }]}>
        <Card variant="elevated">
          <View style={[styles.historyCard]}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: iconColor + "20",
                  borderRadius: borderRadius.md,
                  width: 48,
                  height: 48,
                },
              ]}
            >
              <Feather name={iconName} size={22} color={iconColor} />
            </View>
            <View style={[styles.cardContent, { marginLeft: spacing.md }]}>
              <View style={styles.cardHeader}>
                <Text style={[TextStyles.h4, { color: colors.neutral[900] }]}>
                  {label}
                </Text>
                <Text style={[TextStyles.bodySmall, { color: colors.neutral[500] }]}>
                  {item.date}
                </Text>
              </View>
              <Text style={[TextStyles.body, { color: colors.neutral[600], marginTop: spacing.xs }]}>
                {item.summary}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={CommonStyles.container} edges={['top']}>
      <View style={[styles.header, { padding: spacing.xl, paddingBottom: spacing.md }]}>
        <Text style={[TextStyles.h1, { color: colors.neutral[900] }]}>
          History
        </Text>
        <Text style={[TextStyles.body, { color: colors.neutral[600], marginTop: spacing.xs }]}>
          View all your pet health checks and scans
        </Text>
      </View>

      <FlatList
        data={HISTORY_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: spacing.xl,
            paddingBottom: spacing['6xl'],
          },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={[styles.emptyState, { paddingVertical: spacing['6xl'] }]}>
            <Feather name="inbox" size={48} color={colors.neutral[400]} />
            <Text style={[TextStyles.body, { color: colors.neutral[600], marginTop: spacing.md }]}>
              No history yet
            </Text>
            <Text style={[TextStyles.bodySmall, { color: colors.neutral[500], marginTop: spacing.xs, textAlign: 'center' }]}>
              Complete your first health check to see it here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {},
  listContent: {},
  cardWrapper: {},
  historyCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
  },
});
