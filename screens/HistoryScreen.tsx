import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";

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

const getColorForType = (type: HistoryItemType): string => {
  switch (type) {
    case "poop":
      return Colors.light.warningYellow;
    case "food":
      return Colors.light.softGreen;
    case "behavior":
      return Colors.light.primary;
    default:
      return Colors.light.primary;
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
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const iconColor = getColorForType(item.type);
    const iconName = getIconForType(item.type);
    const label = getLabelForType(item.type);

    return (
      <View
        style={[
          styles.historyCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: iconColor + "20" },
          ]}
        >
          <Feather name={iconName} size={22} color={iconColor} />
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <ThemedText type="h4">{label}</ThemedText>
            <ThemedText type="small" style={{ color: theme.textMuted }}>
              {item.date}
            </ThemedText>
          </View>
          <ThemedText type="body" style={{ color: theme.textMuted }}>
            {item.summary}
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={HISTORY_DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom + 16 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={theme.textMuted} />
            <ThemedText type="body" style={{ color: theme.textMuted }}>
              No history yet
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
  },
  historyCard: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  separator: {
    height: Spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.md,
  },
});
