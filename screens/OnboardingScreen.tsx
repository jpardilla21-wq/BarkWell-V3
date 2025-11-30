import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Onboarding">;
};

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const handleGetStarted = () => {
    navigation.replace("MainTabs");
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.xl,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.illustrationContainer,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          <View style={styles.iconRow}>
            <View style={[styles.iconCircle, { backgroundColor: Colors.light.softGreen }]}>
              <Feather name="heart" size={28} color="#FFFFFF" />
            </View>
            <View style={[styles.iconCircle, { backgroundColor: Colors.light.primary }]}>
              <Feather name="shield" size={28} color="#FFFFFF" />
            </View>
            <View style={[styles.iconCircle, { backgroundColor: Colors.light.primaryGradientEnd }]}>
              <Feather name="eye" size={28} color="#FFFFFF" />
            </View>
          </View>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContainer}>
          <ThemedText type="h1" style={styles.title}>
            Understand your dog in seconds
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textMuted }]}
          >
            AI insights to help you act with confidence.
          </ThemedText>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={handleGetStarted}>Get Started</Button>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  illustrationContainer: {
    width: "100%",
    height: 280,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  iconRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
  },
});
