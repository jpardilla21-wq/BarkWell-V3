import React, { useState } from "react";
import { StyleSheet, View, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { FeatureCard } from "@/components/FeatureCard";
import { useTheme } from "@/hooks/useTheme";
import { useDogs } from "@/contexts/DogContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import type { MainTabParamList } from "@/navigation/MainTabNavigator";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, "Home">,
  BottomTabNavigationProp<MainTabParamList>
>;

interface HistoryItem {
  id: string;
  type: "poop" | "food" | "behavior";
  title: string;
  date: string;
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { dogs, selectedDogId, setSelectedDogId } = useDogs();
  const [history] = useState<HistoryItem[]>([
    { id: "1", type: "poop", title: "Poop Check - Healthy", date: "Today, 2:30 PM" },
    { id: "2", type: "food", title: "Food Scanner - Chicken Meal", date: "Yesterday" },
    { id: "3", type: "behavior", title: "Behavior Check - Relaxed", date: "2 days ago" },
  ]);

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case "poop":
        return "💩";
      case "food":
        return "🦴";
      case "behavior":
        return "🐕";
      default:
        return "📋";
    }
  };

  return (
    <ScreenScrollView>
      <View style={styles.headerTop}>
        <ThemedText type="h3" style={styles.headerTitle}>
          PupSense
        </ThemedText>
        <Pressable
          style={({ pressed }) => [
            styles.bellButton,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="bell" size={22} color={theme.text} />
        </Pressable>
      </View>

      {dogs.length > 0 && (
        <View style={styles.dogsContainer}>
          <View style={styles.dogsScroll}>
            <View style={[styles.dogCircle, styles.logoCircle]}>
              <Image
                source={require("../assets/images/pupsense-logo-full.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            {dogs.map((dog) => (
              <Pressable
                key={dog.id}
                onPress={() => {
                  setSelectedDogId(dog.id);
                  navigation.navigate("ProfileTab");
                }}
                style={({ pressed }) => [
                  styles.dogCircle,
                  {
                    backgroundColor:
                      selectedDogId === dog.id
                        ? Colors.light.primary
                        : theme.backgroundDefault,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                {dog.photo ? (
                  <Image
                    source={{ uri: dog.photo }}
                    style={styles.dogPhoto}
                  />
                ) : (
                  <Feather
                    name="smile"
                    size={28}
                    color={
                      selectedDogId === dog.id
                        ? "#FFFFFF"
                        : Colors.light.primary
                    }
                  />
                )}
              </Pressable>
            ))}
          </View>
          {dogs.length > 0 && (
            <ThemedText type="small" style={styles.dogNameLabel}>
              {dogs.find((d) => d.id === selectedDogId)?.name || ""}
            </ThemedText>
          )}
        </View>
      )}

      <View style={styles.greetingContainer}>
        <ThemedText type="h2">Hi Juan</ThemedText>
        <ThemedText type="body" style={{ color: theme.textMuted }}>
          How's your pup today?
        </ThemedText>
      </View>

      <View style={styles.cardsGrid}>
        <View style={styles.cardsRow}>
          <FeatureCard
            title="Poop Check"
            subtitle="Analyze stool instantly"
            emoji="💩"
            onPress={() => navigation.navigate("PoopTab")}
            style={styles.cardHalf}
          />
          <FeatureCard
            title="Food Scanner"
            subtitle="Is this safe for your dog?"
            emoji="🦴"
            onPress={() => navigation.navigate("FoodScanner")}
            style={styles.cardHalf}
          />
        </View>
        <FeatureCard
          title="Behavior Check"
          subtitle="Is your dog stressed?"
          iconName="activity"
          iconColor={Colors.light.primary}
          onPress={() => navigation.navigate("BehaviorTab")}
          style={styles.cardFull}
        />
      </View>

      <View style={styles.historySection}>
        <ThemedText type="h4" style={styles.historyTitle}>
          Recent Activity
        </ThemedText>
        {history.map((item) => (
          <Pressable
            key={item.id}
            style={[
              styles.historyItem,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <ThemedText style={styles.historyIcon}>
              {getHistoryIcon(item.type)}
            </ThemedText>
            <View style={styles.historyContent}>
              <ThemedText type="body">{item.title}</ThemedText>
              <ThemedText
                type="small"
                style={{ color: theme.textMuted, marginTop: Spacing.xs }}
              >
                {item.date}
              </ThemedText>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={theme.textMuted}
            />
          </Pressable>
        ))}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  dogsContainer: {
    alignItems: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  dogsScroll: {
    flexDirection: "row",
    gap: Spacing.md,
    justifyContent: "center",
  },
  dogCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  logoCircle: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  dogPhoto: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },
  dogNameLabel: {
    marginTop: Spacing.xs,
    fontWeight: "600",
  },
  greetingContainer: {
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  cardsGrid: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  cardsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  cardHalf: {
    flex: 1,
  },
  cardFull: {
    width: "100%",
  },
  historySection: {
    gap: Spacing.md,
  },
  historyTitle: {
    marginBottom: Spacing.sm,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  historyIcon: {
    fontSize: 24,
  },
  historyContent: {
    flex: 1,
  },
});
