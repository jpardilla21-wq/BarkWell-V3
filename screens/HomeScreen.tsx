import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { FeatureCard } from "@/components/FeatureCard";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";
import type { MainTabParamList } from "@/navigation/MainTabNavigator";
import type { CompositeNavigationProp } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, "Home">,
  BottomTabNavigationProp<MainTabParamList>
>;

export default function HomeScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <Feather name="github" size={28} color={Colors.light.primary} />
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.bellButton,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="bell" size={22} color={theme.text} />
        </Pressable>
      </View>

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
            iconName="target"
            iconColor={Colors.light.warningYellow}
            onPress={() => navigation.navigate("PoopTab")}
            style={styles.cardHalf}
          />
          <FeatureCard
            title="Food Scanner"
            subtitle="Is this safe for your dog?"
            iconName="search"
            iconColor={Colors.light.softGreen}
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
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  greetingContainer: {
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  cardsGrid: {
    gap: Spacing.md,
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
});
