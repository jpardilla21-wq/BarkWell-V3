import React, { useEffect } from "react";
import { StyleSheet, View, Image, Pressable, ScrollView, Linking, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { Button } from "@/components/Button";
import type { RootStackParamList } from "@/navigation/RootNavigator";

WebBrowser.maybeCompleteAuthSession();

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Splash">;
};

// Your actual Google Client ID
const GOOGLE_CLIENT_ID = "909160715250-1v7k6t355drgr0ra99132os5e9pts7hn.apps.googleusercontent.com";

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = React.useState(false);

  // Google OAuth Setup
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    scopes: ["profile", "email"],
  });

  // Handle Google OAuth response
  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { authentication } = googleResponse;
      handleGoogleSuccess(authentication?.accessToken);
    } else if (googleResponse?.type === "error") {
      Alert.alert("Google Login Error", googleResponse.error?.message || "Unknown error");
      setIsLoading(false);
    }
  }, [googleResponse]);

  const handleGoogleSuccess = async (token?: string) => {
    try {
      setIsLoading(true);
      if (!token) {
        Alert.alert("Error", "Failed to get Google token");
        setIsLoading(false);
        return;
      }

      console.log("Google Auth Token:", token);

      // TODO: Send token to your backend
      // const response = await fetch('YOUR_BACKEND_URL/auth/google', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token }),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   navigation.replace("Onboarding");
      // }

      // For now, just proceed to onboarding
      navigation.replace("Onboarding");
    } catch (error) {
      Alert.alert("Login Failed", String(error));
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      if (!googleRequest) {
        Alert.alert("Error", "Google OAuth not initialized. Please restart the app.");
        setIsLoading(false);
        return;
      }

      const result = await googlePromptAsync();
      console.log("Google Auth Result:", result);

      if (result?.type !== "success") {
        setIsLoading(false);
      }
    } catch (error) {
      Alert.alert("Google Login Error", String(error));
      setIsLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("Apple Auth Credential:", credential);

      // TODO: Send credential to your backend
      // const response = await fetch('YOUR_BACKEND_URL/auth/apple', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     identityToken: credential.identityToken,
      //     user: credential.user,
      //   }),
      // });
      // const data = await response.json();
      // if (data.success) {
      //   navigation.replace("Onboarding");
      // }

      // For now, just proceed to onboarding
      navigation.replace("Onboarding");
    } catch (error) {
      const errorMsg = String(error);
      if (errorMsg.includes("canceled")) {
        setIsLoading(false);
        return; // User cancelled, don't show error
      }
      Alert.alert("Apple Login Error", errorMsg);
      setIsLoading(false);
    }
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
            disabled={!googleRequest || isLoading}
            style={({ pressed }) => [
              styles.socialButton,
              { opacity: pressed && !isLoading ? 0.8 : 1 },
            ]}
          >
            <Feather name="mail" size={20} color={Colors.light.primary} />
            <ThemedText type="body" style={styles.socialButtonText}>
              {isLoading ? "Signing in..." : "Continue with Google"}
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={handleAppleLogin}
            disabled={isLoading}
            style={({ pressed }) => [
              styles.socialButton,
              { opacity: pressed && !isLoading ? 0.8 : 1 },
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

          <Button onPress={handleEmailLogin} disabled={isLoading}>
            Continue with Email
          </Button>
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
