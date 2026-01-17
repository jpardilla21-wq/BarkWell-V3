import React from "react";
import { StyleSheet, View, Image, Pressable, ScrollView, Linking } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import { Button } from "@/components/Button";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Splash">;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const insets = useSafeAreaInsets();

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth with expo-auth-session
    navigation.replace("Onboarding");
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple Sign In with expo-auth-session
    navigation.replace("Onboarding");
  };

  const handleEmailLogin = () => {
    navigation.replace("Onboarding");
  };

  const handleTermsPress = () => {
    Linking.openURL("https://barkwell.app/terms").catch(() => {});
  };

  const handlePrivacyPress = () => {
    Linking.openURL("https://barkwell.app/privacy").catch(() => {});
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <Image
            source={require("../assets/images/pupsense-logo-splash.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <ThemedText type="h1" style={styles.title}>
            Welcome to BarkWell
          </ThemedText>
          <ThemedText type="body" style={styles.subtitle}>
            AI-powered wellness for your furry friends
          </ThemedText>
        </View>

        <View style={styles.buttonSection}>
          <Pressable
            onPress={handleGoogleLogin}
            style={({ pressed }) => [
              styles.socialButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="mail" size={20} color={Colors.light.primary} />
            <ThemedText type="body" style={styles.socialButtonText}>
              Continue with Google
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={handleAppleLogin}
            style={({ pressed }) => [
              styles.socialButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="smartphone" size={20} color={Colors.light.primary} />
            <ThemedText type="body" style={styles.socialButtonText}>
              Continue with Apple
            </ThemedText>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <ThemedText type="small" style={styles.dividerText}>
              or
            </ThemedText>
            <View style={styles.dividerLine} />
          </View>

          <Button onPress={handleEmailLogin}>Continue with Email</Button>
        </View>

        <View style={styles.disclaimerSection}>
          <ThemedText type="small" style={styles.disclaimerText}>
            By continuing, you agree to our{" "}
            <ThemedText
              type="small"
              onPress={handleTermsPress}
              style={styles.link}
            >
              Terms of Service
            </ThemedText>
            {" "}and{" "}
            <ThemedText
              type="small"
              onPress={handlePrivacyPress}
              style={styles.link}
            >
              Privacy Policy
            </ThemedText>
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFDFD",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  topSection: {
    alignItems: "center",
    marginVertical: Spacing.xl,
  },
  logoImage: {
    width: 150,
    height: 150,
    marginBottom: Spacing.xl,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    color: "#6E6E6E",
    lineHeight: 24,
  },
  buttonSection: {
    gap: Spacing.md,
    marginVertical: Spacing.xl,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    borderRadius: BorderRadius.lg,
    backgroundColor: "#FFFFFF",
  },
  socialButtonText: {
    marginLeft: Spacing.sm,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginVertical: Spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  dividerText: {
    color: "#6E6E6E",
  },
  disclaimerSection: {
    marginVertical: Spacing.lg,
  },
  disclaimerText: {
    textAlign: "center",
    color: "#6E6E6E",
    lineHeight: 18,
  },
  link: {
    color: Colors.light.primary,
    textDecorationLine: "underline",
  },
});
