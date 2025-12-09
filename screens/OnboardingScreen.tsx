import React, { useState } from "react";
import { StyleSheet, View, Image, TextInput, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { DogBreedDropdown } from "@/components/DogBreedDropdown";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Onboarding">;
};

type FormStep = "intro" | "registration" | "dogInfo";

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const [step, setStep] = useState<FormStep>("intro");
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    dogName: "",
    dogBreed: "",
    dogAge: "",
  });

  const handleIntroNext = () => {
    setStep("registration");
  };

  const handleRegistrationNext = () => {
    if (formData.ownerName.trim() && formData.email.trim()) {
      setStep("dogInfo");
    }
  };

  const handleDogInfoNext = () => {
    if (formData.dogName.trim() && formData.dogBreed.trim() && formData.dogAge.trim()) {
      navigation.replace("Subscription");
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.backgroundDefault,
      color: theme.text,
      borderColor: theme.borderLight,
    },
  ];

  const handleGoBack = () => {
    if (step === "registration") {
      setStep("intro");
    } else if (step === "dogInfo") {
      setStep("registration");
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {step === "intro" && (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <View
              style={[
                styles.illustrationContainer,
                { backgroundColor: theme.backgroundDefault },
              ]}
            >
              <Image
                source={require("../assets/images/splash-dog.png")}
                style={styles.splashImage}
                resizeMode="cover"
              />
              <Image
                source={require("../assets/images/pupsense-logo.png")}
                style={styles.logoOverlay}
                resizeMode="contain"
              />
            </View>

            <View style={styles.textContainer}>
              <ThemedText type="h1" style={styles.title}>
                AI-powered answers for everyday dog problems
              </ThemedText>
              <ThemedText
                type="body"
                style={[styles.subtitle, { color: theme.textMuted }]}
              >
                Your all-in-one pet wellness assistant
              </ThemedText>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={handleIntroNext}>Get Started</Button>
          </View>
        </ScrollView>
      )}

      {step === "registration" && (
        Platform.OS === "web" ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.stepContainer}>
              <ThemedText type="h2" style={styles.stepTitle}>
                Tell us about you
              </ThemedText>
              <ThemedText type="body" style={[styles.stepSubtitle, { color: theme.textMuted }]}>
                We'll use this to personalize your experience
              </ThemedText>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  Your Name
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.ownerName}
                  onChangeText={(value) => updateField("ownerName", value)}
                  placeholder="Enter your name"
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  Email Address
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.email}
                  onChangeText={(value) => updateField("email", value)}
                  placeholder="your.email@example.com"
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                />
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button
                onPress={handleGoBack}
                style={[
                  styles.secondaryButton,
                  { backgroundColor: theme.backgroundDefault, borderWidth: 1, borderColor: theme.borderLight },
                ]}
              >
                <ThemedText type="body" style={{ color: theme.text, fontWeight: "600" }}>
                  Back
                </ThemedText>
              </Button>
              <Button
                onPress={handleRegistrationNext}
                disabled={!formData.ownerName.trim() || !formData.email.trim()}
                style={styles.flexButton}
              >
                Continue
              </Button>
            </View>
          </ScrollView>
        ) : (
          <KeyboardAwareScrollView
            style={[styles.scrollView, { backgroundColor: theme.backgroundRoot }]}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.stepContainer}>
              <ThemedText type="h2" style={styles.stepTitle}>
                Tell us about you
              </ThemedText>
              <ThemedText type="body" style={[styles.stepSubtitle, { color: theme.textMuted }]}>
                We'll use this to personalize your experience
              </ThemedText>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  Your Name
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.ownerName}
                  onChangeText={(value) => updateField("ownerName", value)}
                  placeholder="Enter your name"
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  Email Address
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.email}
                  onChangeText={(value) => updateField("email", value)}
                  placeholder="your.email@example.com"
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                />
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button
                onPress={handleGoBack}
                style={[
                  styles.secondaryButton,
                  { backgroundColor: theme.backgroundDefault, borderWidth: 1, borderColor: theme.borderLight },
                ]}
              >
                <ThemedText type="body" style={{ color: theme.text, fontWeight: "600" }}>
                  Back
                </ThemedText>
              </Button>
              <Button
                onPress={handleRegistrationNext}
                disabled={!formData.ownerName.trim() || !formData.email.trim()}
                style={styles.flexButton}
              >
                Continue
              </Button>
            </View>
          </KeyboardAwareScrollView>
        )
      )}

      {step === "dogInfo" && (
        Platform.OS === "web" ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.stepContainer}>
              <ThemedText type="h2" style={styles.stepTitle}>
                Tell us about your pup
              </ThemedText>
              <ThemedText type="body" style={[styles.stepSubtitle, { color: theme.textMuted }]}>
                This helps us provide breed-specific insights
              </ThemedText>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  Dog's Name
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.dogName}
                  onChangeText={(value) => updateField("dogName", value)}
                  placeholder="e.g., Max, Bella, Charlie"
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  Breed
                </ThemedText>
                <DogBreedDropdown
                  value={formData.dogBreed}
                  onSelect={(breed) => updateField("dogBreed", breed)}
                  isDark={isDark}
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  Age (in years)
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.dogAge}
                  onChangeText={(value) => updateField("dogAge", value)}
                  placeholder="e.g., 3"
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button
                onPress={handleGoBack}
                style={[
                  styles.secondaryButton,
                  { backgroundColor: theme.backgroundDefault, borderWidth: 1, borderColor: theme.borderLight },
                ]}
              >
                <ThemedText type="body" style={{ color: theme.text, fontWeight: "600" }}>
                  Back
                </ThemedText>
              </Button>
              <Button
                onPress={handleDogInfoNext}
                disabled={!formData.dogName.trim() || !formData.dogBreed.trim() || !formData.dogAge.trim()}
                style={styles.flexButton}
              >
                Next
              </Button>
            </View>
          </ScrollView>
        ) : (
          <KeyboardAwareScrollView
            style={[styles.scrollView, { backgroundColor: theme.backgroundRoot }]}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.stepContainer}>
              <ThemedText type="h2" style={styles.stepTitle}>
                Tell us about your pup
              </ThemedText>
              <ThemedText type="body" style={[styles.stepSubtitle, { color: theme.textMuted }]}>
                This helps us provide breed-specific insights
              </ThemedText>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  Dog's Name
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.dogName}
                  onChangeText={(value) => updateField("dogName", value)}
                  placeholder="e.g., Max, Bella, Charlie"
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  Breed
                </ThemedText>
                <DogBreedDropdown
                  value={formData.dogBreed}
                  onSelect={(breed) => updateField("dogBreed", breed)}
                  isDark={isDark}
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  Age (in years)
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.dogAge}
                  onChangeText={(value) => updateField("dogAge", value)}
                  placeholder="e.g., 3"
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
              </View>
            </View>

            <View style={styles.buttonRow}>
              <Button
                onPress={handleGoBack}
                style={[
                  styles.secondaryButton,
                  { backgroundColor: theme.backgroundDefault, borderWidth: 1, borderColor: theme.borderLight },
                ]}
              >
                <ThemedText type="body" style={{ color: theme.text, fontWeight: "600" }}>
                  Back
                </ThemedText>
              </Button>
              <Button
                onPress={handleDogInfoNext}
                disabled={!formData.dogName.trim() || !formData.dogBreed.trim() || !formData.dogAge.trim()}
                style={styles.flexButton}
              >
                Next
              </Button>
            </View>
          </KeyboardAwareScrollView>
        )
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
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
    overflow: "hidden",
    position: "relative",
  },
  splashImage: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.lg,
  },
  logoOverlay: {
    position: "absolute",
    top: Spacing.md,
    left: Spacing.md,
    width: 120,
    height: 50,
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
  stepContainer: {
    marginVertical: Spacing.lg,
  },
  stepTitle: {
    marginBottom: Spacing.sm,
  },
  stepSubtitle: {
    marginBottom: Spacing.lg,
  },
  fieldContainer: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.bodyM.fontSize,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  buttonRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  secondaryButton: {
    flex: 1,
  },
  flexButton: {
    flex: 1,
  },
});
