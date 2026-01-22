import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type PaywallProps = {
  minTier: "plus" | "pro";
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export function Paywall({
  minTier,
  children,
  title = "Unlock Premium Features",
  description = "Upgrade to access this feature and more!",
}: PaywallProps) {
  const { theme, isDark } = useTheme();
  const { checkPermission, isLoading } = useSubscription();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const hasAccess = checkPermission(minTier);

  // If loading, show content but maybe dimmed? Or just wait?
  // For better UX, we might want to wait or show a skeleton.
  // For now, let's assume if it's loading we render children (optimistic)
  // or show nothing to prevent flashes.
  // Let's render children if loading to avoid layout shifts, but checking permission might return false.

  if (isLoading) {
    return <View>{children}</View>;
  }

  if (hasAccess) {
    return <View>{children}</View>;
  }

  return (
    <View style={styles.container}>
      {/* We render children with a blur overlay */}
      <View style={styles.contentContainer} pointerEvents="none">
        {children}
      </View>

      <BlurView
        intensity={20}
        tint={isDark ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.overlay}>
        <View
          style={[styles.card, { backgroundColor: theme.backgroundDefault }]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: Colors.light.primary + "20" },
            ]}
          >
            <Feather name="lock" size={32} color={Colors.light.primary} />
          </View>

          <ThemedText type="h3" style={styles.title}>
            {title}
          </ThemedText>

          <ThemedText
            type="body"
            style={[styles.description, { color: theme.textMuted }]}
          >
            {description}
          </ThemedText>

          <Pressable
            onPress={() => navigation.navigate("Subscription")}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: Colors.light.primary,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <ThemedText type="body" style={styles.buttonText}>
              Upgrade Now
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate("Subscription")}
            style={styles.linkButton}
          >
            <ThemedText
              type="small"
              style={{ color: Colors.light.primary, fontWeight: "600" }}
            >
              View Plans
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
  },
  contentContainer: {
    opacity: 0.3, // Dim the content
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
    zIndex: 10,
  },
  card: {
    width: "100%",
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  description: {
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  button: {
    width: "100%",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  linkButton: {
    padding: Spacing.xs,
  },
});
