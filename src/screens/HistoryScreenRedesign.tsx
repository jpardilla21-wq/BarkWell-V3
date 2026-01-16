import React from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/design-system";
import Card from "@/src/components/redesign/Card";

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

export default function HistoryScreenRedesign() {
  const { colors, spacing, typography, shadows } = useTheme();

  const getColorForType = (type: HistoryItemType) => {
    switch (type) {
      case "poop":
        return colors.accent[500];
      case "food":
        return colors.primary[500];
      case "behavior":
        return colors.secondary[500];
      default:
        return colors.neutral[400];
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const iconColor = getColorForType(item.type);
    const iconName = getIconForType(item.type);
    const label = getLabelForType(item.type);

    return (
      <Card variant="elevated" style={styles.historyCard}>
        <View style={[styles.iconContainer, { backgroundColor: iconColor + "20" }]}>
          <Feather name={iconName} size={22} color={iconColor} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={{ fontSize: typography.bodyM.fontSize, fontWeight: "600", color: colors.neutral[900] }}>
              {label}
            </Text>
            <Text style={{ fontSize: typography.bodyS.fontSize, color: colors.neutral[500] }}>
              {item.date}
            </Text>
          </View>
          <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[600], marginTop: 4 }}>
            {item.summary}
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.neutral.cream }]} edges={["top"]}>
      <View style={styles.header}>
        <Text style={{ fontSize: typography.h2.fontSize, fontFamily: typography.display.fontFamily, fontWeight: "700", color: colors.neutral[900] }}>
          History
        </Text>
        <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[600], marginTop: spacing.xs }}>
          Your recent scans and checks
        </Text>
      </View>

      <FlatList
        data={HISTORY_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: colors.neutral[200] }]}>
              <Feather name="inbox" size={48} color={colors.neutral[400]} />
            </View>
            <Text style={{ fontSize: typography.bodyL.fontSize, color: colors.neutral[600], marginTop: spacing.md }}>
              No history yet
            </Text>
            <Text style={{ fontSize: typography.bodyM.fontSize, color: colors.neutral[500], marginTop: spacing.xs, textAlign: "center" }}>
              Your scans and checks will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  historyCard: {
    flexDirection: "row",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
