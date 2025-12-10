import React, { useState } from "react";
import { StyleSheet, View, Image, TextInput, ScrollView, Platform, Linking, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DogBreedDropdown } from "@/components/DogBreedDropdown";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/contexts/LanguageContext";
import { Colors, Spacing, BorderRadius, Typography } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Onboarding">;
};

type FormStep = "intro" | "form";
type Language = "eng" | "esp";

const translations = {
  eng: {
    getStarted: "Get Started",
    title: "AI-powered answers for everyday dog problems",
    subtitle: "Your all-in-one pet wellness assistant",
    formTitle: "Tell us about you and your pup",
    formSubtitle: "We'll use this to personalize your experience",
    yourName: "Your Name",
    namePlaceholder: "Enter your name",
    emailLabel: "Email Address",
    emailPlaceholder: "your.email@example.com",
    dogName: "Dog's Name",
    dogNamePlaceholder: "e.g., Max, Bella, Charlie",
    breed: "Breed",
    age: "Age (in years)",
    agePlaceholder: "e.g., 3",
    back: "Back",
    continue: "Continue",
    termsLink: "Terms of Service",
    privacyLink: "Privacy Policy",
    disclaimer: "By clicking Continue, you agree to our Terms of Service and Privacy Policy.",
  },
  esp: {
    getStarted: "Comenzar",
    title: "Respuestas impulsadas por IA para los problemas cotidianos de tu perro",
    subtitle: "Tu asistente integral de bienestar para mascotas",
    formTitle: "Cuéntanos sobre ti y tu perro",
    formSubtitle: "Usaremos esto para personalizar tu experiencia",
    yourName: "Tu Nombre",
    namePlaceholder: "Ingresa tu nombre",
    emailLabel: "Correo Electrónico",
    emailPlaceholder: "tu.correo@ejemplo.com",
    dogName: "Nombre del Perro",
    dogNamePlaceholder: "Por ej., Max, Bella, Charlie",
    breed: "Raza",
    age: "Edad (en años)",
    agePlaceholder: "Por ej., 3",
    back: "Atrás",
    continue: "Continuar",
    termsLink: "Términos de Servicio",
    privacyLink: "Política de Privacidad",
    disclaimer: "Al hacer clic en Continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.",
  },
};

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [step, setStep] = useState<FormStep>("intro");
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    dogName: "",
    dogBreed: "",
    dogAge: "",
  });

  const t = translations[language];

  const handleIntroNext = () => {
    setStep("form");
  };

  const handleFormSubmit = () => {
    if (
      formData.ownerName.trim() &&
      formData.email.trim() &&
      formData.dogName.trim() &&
      formData.dogBreed.trim() &&
      formData.dogAge.trim()
    ) {
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
    if (step === "form") {
      setStep("intro");
    }
  };

  const handleTermsPress = () => {
    Linking.openURL("https://pupsense.elmtstudio.xyz/terms").catch(() => {});
  };

  const handlePrivacyPress = () => {
    Linking.openURL("https://pupsense.elmtstudio.xyz/privacy").catch(() => {});
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
      <View style={styles.languageSelector}>
        <Pressable
          onPress={() => setLanguage("eng")}
          style={[
            styles.languageButton,
            language === "eng" && styles.languageButtonActive,
          ]}
        >
          <ThemedText type="small" style={language === "eng" ? styles.languageButtonTextActive : {}}>
            English
          </ThemedText>
        </Pressable>
        <Pressable
          onPress={() => setLanguage("esp")}
          style={[
            styles.languageButton,
            language === "esp" && styles.languageButtonActive,
          ]}
        >
          <ThemedText type="small" style={language === "esp" ? styles.languageButtonTextActive : {}}>
            Español
          </ThemedText>
        </Pressable>
      </View>

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
            </View>

            <View style={styles.textContainer}>
              <ThemedText type="h1" style={styles.title}>
                {t.title}
              </ThemedText>
              <ThemedText
                type="body"
                style={[styles.subtitle, { color: theme.textMuted }]}
              >
                {t.subtitle}
              </ThemedText>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button onPress={handleIntroNext}>{t.getStarted}</Button>
          </View>
        </ScrollView>
      )}

      {step === "form" && (
        Platform.OS === "web" ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.stepContainer}>
              <ThemedText type="h2" style={styles.stepTitle}>
                {t.formTitle}
              </ThemedText>
              <ThemedText type="body" style={[styles.stepSubtitle, { color: theme.textMuted }]}>
                {t.formSubtitle}
              </ThemedText>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  {t.yourName}
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.ownerName}
                  onChangeText={(value) => updateField("ownerName", value)}
                  placeholder={t.namePlaceholder}
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  {t.emailLabel}
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.email}
                  onChangeText={(value) => updateField("email", value)}
                  placeholder={t.emailPlaceholder}
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  {t.dogName}
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.dogName}
                  onChangeText={(value) => updateField("dogName", value)}
                  placeholder={t.dogNamePlaceholder}
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  {t.breed}
                </ThemedText>
                <DogBreedDropdown
                  value={formData.dogBreed}
                  onSelect={(breed) => updateField("dogBreed", breed)}
                  isDark={isDark}
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  {t.age}
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.dogAge}
                  onChangeText={(value) => updateField("dogAge", value)}
                  placeholder={t.agePlaceholder}
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
              </View>

              <View style={styles.linksContainer}>
                <Pressable onPress={handleTermsPress}>
                  <ThemedText type="small" style={[styles.link, { color: Colors.light.primary }]}>
                    {t.termsLink}
                  </ThemedText>
                </Pressable>
                <ThemedText type="small" style={{ color: theme.textMuted }}>
                  {" • "}
                </ThemedText>
                <Pressable onPress={handlePrivacyPress}>
                  <ThemedText type="small" style={[styles.link, { color: Colors.light.primary }]}>
                    {t.privacyLink}
                  </ThemedText>
                </Pressable>
              </View>

              <View style={styles.disclaimerContainer}>
                <ThemedText type="small" style={{ color: theme.textMuted, textAlign: "center", lineHeight: 18 }}>
                  {t.disclaimer}
                </ThemedText>
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
                  {t.back}
                </ThemedText>
              </Button>
              <Button
                onPress={handleFormSubmit}
                disabled={
                  !formData.ownerName.trim() ||
                  !formData.email.trim() ||
                  !formData.dogName.trim() ||
                  !formData.dogBreed.trim() ||
                  !formData.dogAge.trim()
                }
                style={styles.flexButton}
              >
                {t.continue}
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
                {t.formTitle}
              </ThemedText>
              <ThemedText type="body" style={[styles.stepSubtitle, { color: theme.textMuted }]}>
                {t.formSubtitle}
              </ThemedText>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  {t.yourName}
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.ownerName}
                  onChangeText={(value) => updateField("ownerName", value)}
                  placeholder={t.namePlaceholder}
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  {t.emailLabel}
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.email}
                  onChangeText={(value) => updateField("email", value)}
                  placeholder={t.emailPlaceholder}
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  {t.dogName}
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.dogName}
                  onChangeText={(value) => updateField("dogName", value)}
                  placeholder={t.dogNamePlaceholder}
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  {t.breed}
                </ThemedText>
                <DogBreedDropdown
                  value={formData.dogBreed}
                  onSelect={(breed) => updateField("dogBreed", breed)}
                  isDark={isDark}
                />
              </View>

              <View style={styles.fieldContainer}>
                <ThemedText type="small" style={styles.label}>
                  {t.age}
                </ThemedText>
                <TextInput
                  style={inputStyle}
                  value={formData.dogAge}
                  onChangeText={(value) => updateField("dogAge", value)}
                  placeholder={t.agePlaceholder}
                  placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                />
              </View>

              <View style={styles.linksContainer}>
                <Pressable onPress={handleTermsPress}>
                  <ThemedText type="small" style={[styles.link, { color: Colors.light.primary }]}>
                    {t.termsLink}
                  </ThemedText>
                </Pressable>
                <ThemedText type="small" style={{ color: theme.textMuted }}>
                  {" • "}
                </ThemedText>
                <Pressable onPress={handlePrivacyPress}>
                  <ThemedText type="small" style={[styles.link, { color: Colors.light.primary }]}>
                    {t.privacyLink}
                  </ThemedText>
                </Pressable>
              </View>

              <View style={styles.disclaimerContainer}>
                <ThemedText type="small" style={{ color: theme.textMuted, textAlign: "center", lineHeight: 18 }}>
                  {t.disclaimer}
                </ThemedText>
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
                  {t.back}
                </ThemedText>
              </Button>
              <Button
                onPress={handleFormSubmit}
                disabled={
                  !formData.ownerName.trim() ||
                  !formData.email.trim() ||
                  !formData.dogName.trim() ||
                  !formData.dogBreed.trim() ||
                  !formData.dogAge.trim()
                }
                style={styles.flexButton}
              >
                {t.continue}
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
  languageSelector: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingTop: Spacing.md,
  },
  languageButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.primary + "40",
  },
  languageButtonActive: {
    backgroundColor: Colors.light.primary + "20",
    borderColor: Colors.light.primary,
  },
  languageButtonTextActive: {
    color: Colors.light.primary,
    fontWeight: "600",
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
  },
  splashImage: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.lg,
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
  linksContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  link: {
    textDecorationLine: "underline",
  },
  disclaimerContainer: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
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
