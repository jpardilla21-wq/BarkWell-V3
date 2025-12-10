import React, { useState } from "react";
import { StyleSheet, View, Image, TextInput, ScrollView, Platform, Linking, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  KeyboardAwareScrollView,
} from "react-native-keyboard-controller";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useCameraPermissions, useMediaLibraryPermissions } from "expo-image-picker";
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

type FormStep = "intro" | "owner" | "dogs";
type Language = "eng" | "esp";

interface DogProfile {
  id: string;
  name: string;
  nickname: string;
  breed: string;
  age: string;
  photo: string | null;
}

const translations = {
  eng: {
    getStarted: "Get Started",
    title: "AI-powered answers for everyday dog problems",
    subtitle: "Your all-in-one pet wellness assistant",
    ownerFormTitle: "Tell us about you",
    ownerFormSubtitle: "We'll use this to personalize your experience",
    dogsFormTitle: "Add your dogs",
    dogsFormSubtitle: "Create profiles for each of your furry friends",
    yourName: "Your Name",
    namePlaceholder: "Enter your name",
    emailLabel: "Email Address",
    emailPlaceholder: "your.email@example.com",
    dogName: "Name",
    dogNamePlaceholder: "e.g., Max, Bella",
    nickname: "Nickname",
    nicknamePlaceholder: "e.g., Buddy, Sweetie",
    breed: "Breed",
    age: "Age (years)",
    agePlaceholder: "e.g., 3",
    addPhoto: "Add Photo",
    changePhoto: "Change",
    addAnotherDog: "Add Another Dog",
    removeDog: "Remove",
    back: "Back",
    continue: "Continue",
    termsLink: "Terms of Service",
    privacyLink: "Privacy Policy",
    disclaimer: "By clicking Continue, you agree to our Terms of Service and Privacy Policy.",
    atLeastOneDog: "Please add at least one dog profile",
    fillAllFields: "Please fill in all required fields for each dog",
    takePhoto: "Take Photo",
    chooseFromLibrary: "Choose from Library",
    cancel: "Cancel",
  },
  esp: {
    getStarted: "Comenzar",
    title: "Respuestas impulsadas por IA para los problemas cotidianos de tu perro",
    subtitle: "Tu asistente integral de bienestar para mascotas",
    ownerFormTitle: "Cuéntanos sobre ti",
    ownerFormSubtitle: "Usaremos esto para personalizar tu experiencia",
    dogsFormTitle: "Agrega tus perros",
    dogsFormSubtitle: "Crea perfiles para cada uno de tus amigos peludos",
    yourName: "Tu Nombre",
    namePlaceholder: "Ingresa tu nombre",
    emailLabel: "Correo Electrónico",
    emailPlaceholder: "tu.correo@ejemplo.com",
    dogName: "Nombre",
    dogNamePlaceholder: "Por ej., Max, Bella",
    nickname: "Apodo",
    nicknamePlaceholder: "Por ej., Amigo, Cariño",
    breed: "Raza",
    age: "Edad (años)",
    agePlaceholder: "Por ej., 3",
    addPhoto: "Agregar Foto",
    changePhoto: "Cambiar",
    addAnotherDog: "Agregar Otro Perro",
    removeDog: "Eliminar",
    back: "Atrás",
    continue: "Continuar",
    termsLink: "Términos de Servicio",
    privacyLink: "Política de Privacidad",
    disclaimer: "Al hacer clic en Continuar, aceptas nuestros Términos de Servicio y Política de Privacidad.",
    atLeastOneDog: "Por favor agrega al menos un perfil de perro",
    fillAllFields: "Por favor completa todos los campos requeridos para cada perro",
    takePhoto: "Tomar Foto",
    chooseFromLibrary: "Elegir de la Galería",
    cancel: "Cancelar",
  },
};

const createEmptyDog = (): DogProfile => ({
  id: Date.now().toString(),
  name: "",
  nickname: "",
  breed: "",
  age: "",
  photo: null,
});

export default function OnboardingScreen({ navigation }: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { language } = useLanguage();
  const [step, setStep] = useState<FormStep>("intro");
  const [ownerData, setOwnerData] = useState({
    name: "",
    email: "",
  });
  const [dogs, setDogs] = useState<DogProfile[]>([createEmptyDog()]);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = useMediaLibraryPermissions();

  const t = translations[language];

  const handleIntroNext = () => {
    setStep("owner");
  };

  const handleOwnerNext = () => {
    if (ownerData.name.trim() && ownerData.email.trim()) {
      setStep("dogs");
    }
  };

  const handleFormSubmit = () => {
    if (dogs.length === 0) {
      Alert.alert("", t.atLeastOneDog);
      return;
    }
    const allDogsValid = dogs.every(
      (dog) => dog.name.trim() && dog.breed.trim() && dog.age.trim()
    );
    if (!allDogsValid) {
      Alert.alert("", t.fillAllFields);
      return;
    }
    navigation.replace("Subscription");
  };

  const updateOwnerField = (field: keyof typeof ownerData, value: string) => {
    setOwnerData((prev) => ({ ...prev, [field]: value }));
  };

  const updateDogField = (dogId: string, field: keyof DogProfile, value: string | null) => {
    setDogs((prev) =>
      prev.map((dog) =>
        dog.id === dogId ? { ...dog, [field]: value } : dog
      )
    );
  };

  const addDog = () => {
    setDogs((prev) => [...prev, createEmptyDog()]);
  };

  const removeDog = (dogId: string) => {
    if (dogs.length > 1) {
      setDogs((prev) => prev.filter((dog) => dog.id !== dogId));
    }
  };

  const openSettings = async () => {
    if (Platform.OS !== "web") {
      try {
        await Linking.openSettings();
      } catch (error) {
        // openSettings not supported
      }
    }
  };

  const pickImage = async (dogId: string) => {
    if (Platform.OS === "web") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        updateDogField(dogId, "photo", result.assets[0].uri);
      }
    } else {
      const openSettingsText = language === "eng" ? "Open Settings" : "Abrir Configuración";
      const cameraPermissionDeniedText = language === "eng" 
        ? "Camera permission was denied. Please enable it in settings." 
        : "El permiso de cámara fue denegado. Por favor habilítalo en configuración.";
      const libraryPermissionDeniedText = language === "eng" 
        ? "Photo library permission was denied. Please enable it in settings." 
        : "El permiso de la galería fue denegado. Por favor habilítalo en configuración.";
      
      Alert.alert(
        "",
        t.addPhoto,
        [
          {
            text: t.takePhoto,
            onPress: async () => {
              if (cameraPermission?.granted) {
                const result = await ImagePicker.launchCameraAsync({
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });
                if (!result.canceled && result.assets[0]) {
                  updateDogField(dogId, "photo", result.assets[0].uri);
                }
              } else if (cameraPermission?.status === "denied" && !cameraPermission?.canAskAgain) {
                Alert.alert(
                  "",
                  cameraPermissionDeniedText,
                  [
                    { text: openSettingsText, onPress: openSettings },
                    { text: t.cancel, style: "cancel" },
                  ]
                );
              } else {
                const { granted } = await requestCameraPermission();
                if (granted) {
                  const result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                  });
                  if (!result.canceled && result.assets[0]) {
                    updateDogField(dogId, "photo", result.assets[0].uri);
                  }
                }
              }
            },
          },
          {
            text: t.chooseFromLibrary,
            onPress: async () => {
              if (mediaLibraryPermission?.granted) {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });
                if (!result.canceled && result.assets[0]) {
                  updateDogField(dogId, "photo", result.assets[0].uri);
                }
              } else if (mediaLibraryPermission?.status === "denied" && !mediaLibraryPermission?.canAskAgain) {
                Alert.alert(
                  "",
                  libraryPermissionDeniedText,
                  [
                    { text: openSettingsText, onPress: openSettings },
                    { text: t.cancel, style: "cancel" },
                  ]
                );
              } else {
                const { granted } = await requestMediaLibraryPermission();
                if (granted) {
                  const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                  });
                  if (!result.canceled && result.assets[0]) {
                    updateDogField(dogId, "photo", result.assets[0].uri);
                  }
                }
              }
            },
          },
          { text: t.cancel, style: "cancel" },
        ]
      );
    }
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
    if (step === "dogs") {
      setStep("owner");
    } else if (step === "owner") {
      setStep("intro");
    }
  };

  const handleTermsPress = () => {
    Linking.openURL("https://pupsense.elmtstudio.xyz/terms").catch(() => {});
  };

  const handlePrivacyPress = () => {
    Linking.openURL("https://pupsense.elmtstudio.xyz/privacy").catch(() => {});
  };

  const isOwnerFormValid = ownerData.name.trim() && ownerData.email.trim();
  const isDogsFormValid = dogs.length > 0 && dogs.every(
    (dog) => dog.name.trim() && dog.breed.trim() && dog.age.trim()
  );

  const renderDogCard = (dog: DogProfile, index: number) => (
    <View
      key={dog.id}
      style={[
        styles.dogCard,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.borderLight },
      ]}
    >
      <View style={styles.dogCardHeader}>
        <ThemedText type="h4" style={styles.dogCardTitle}>
          {language === "eng" ? `Dog ${index + 1}` : `Perro ${index + 1}`}
        </ThemedText>
        {dogs.length > 1 && (
          <Pressable onPress={() => removeDog(dog.id)} style={styles.removeButton}>
            <Feather name="trash-2" size={18} color={Colors.light.urgentRed} />
            <ThemedText type="small" style={{ color: Colors.light.urgentRed, marginLeft: 4 }}>
              {t.removeDog}
            </ThemedText>
          </Pressable>
        )}
      </View>

      <View style={styles.photoRow}>
        <Pressable
          onPress={() => pickImage(dog.id)}
          style={[
            styles.photoContainer,
            { backgroundColor: theme.backgroundRoot, borderColor: theme.borderLight },
          ]}
        >
          {dog.photo ? (
            <Image source={{ uri: dog.photo }} style={styles.dogPhoto} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Feather name="camera" size={28} color={theme.textMuted} />
              <ThemedText type="small" style={{ color: theme.textMuted, marginTop: 4 }}>
                {t.addPhoto}
              </ThemedText>
            </View>
          )}
        </Pressable>

        <View style={styles.photoFieldsColumn}>
          <View style={styles.compactField}>
            <ThemedText type="small" style={styles.label}>
              {t.dogName} *
            </ThemedText>
            <TextInput
              style={[inputStyle, styles.compactInput]}
              value={dog.name}
              onChangeText={(value) => updateDogField(dog.id, "name", value)}
              placeholder={t.dogNamePlaceholder}
              placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
              autoCapitalize="words"
            />
          </View>
          <View style={styles.compactField}>
            <ThemedText type="small" style={styles.label}>
              {t.nickname}
            </ThemedText>
            <TextInput
              style={[inputStyle, styles.compactInput]}
              value={dog.nickname}
              onChangeText={(value) => updateDogField(dog.id, "nickname", value)}
              placeholder={t.nicknamePlaceholder}
              placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
              autoCapitalize="words"
            />
          </View>
        </View>
      </View>

      <View style={styles.dogFieldsRow}>
        <View style={[styles.fieldContainer, { flex: 2 }]}>
          <ThemedText type="small" style={styles.label}>
            {t.breed} *
          </ThemedText>
          <DogBreedDropdown
            value={dog.breed}
            onSelect={(breed) => updateDogField(dog.id, "breed", breed)}
            isDark={isDark}
          />
        </View>
        <View style={[styles.fieldContainer, { flex: 1 }]}>
          <ThemedText type="small" style={styles.label}>
            {t.age} *
          </ThemedText>
          <TextInput
            style={inputStyle}
            value={dog.age}
            onChangeText={(value) => updateDogField(dog.id, "age", value)}
            placeholder={t.agePlaceholder}
            placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
            keyboardType="decimal-pad"
          />
        </View>
      </View>
    </View>
  );

  const ScrollComponent = Platform.OS === "web" ? ScrollView : KeyboardAwareScrollView;

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

      {step === "owner" && (
        <ScrollComponent
          style={[styles.scrollView, { backgroundColor: theme.backgroundRoot }]}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.stepContainer}>
            <ThemedText type="h2" style={styles.stepTitle}>
              {t.ownerFormTitle}
            </ThemedText>
            <ThemedText type="body" style={[styles.stepSubtitle, { color: theme.textMuted }]}>
              {t.ownerFormSubtitle}
            </ThemedText>

            <View style={styles.fieldContainer}>
              <ThemedText type="small" style={styles.label}>
                {t.yourName}
              </ThemedText>
              <TextInput
                style={inputStyle}
                value={ownerData.name}
                onChangeText={(value) => updateOwnerField("name", value)}
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
                value={ownerData.email}
                onChangeText={(value) => updateOwnerField("email", value)}
                placeholder={t.emailPlaceholder}
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
                {t.back}
              </ThemedText>
            </Button>
            <Button
              onPress={handleOwnerNext}
              disabled={!isOwnerFormValid}
              style={styles.flexButton}
            >
              {t.continue}
            </Button>
          </View>
        </ScrollComponent>
      )}

      {step === "dogs" && (
        <ScrollComponent
          style={[styles.scrollView, { backgroundColor: theme.backgroundRoot }]}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.stepContainer}>
            <ThemedText type="h2" style={styles.stepTitle}>
              {t.dogsFormTitle}
            </ThemedText>
            <ThemedText type="body" style={[styles.stepSubtitle, { color: theme.textMuted }]}>
              {t.dogsFormSubtitle}
            </ThemedText>

            {dogs.map((dog, index) => renderDogCard(dog, index))}

            <Pressable
              onPress={addDog}
              style={[
                styles.addDogButton,
                { borderColor: Colors.light.primary },
              ]}
            >
              <Feather name="plus-circle" size={20} color={Colors.light.primary} />
              <ThemedText type="body" style={{ color: Colors.light.primary, marginLeft: 8, fontWeight: "600" }}>
                {t.addAnotherDog}
              </ThemedText>
            </Pressable>

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
              disabled={!isDogsFormValid}
              style={styles.flexButton}
            >
              {t.continue}
            </Button>
          </View>
        </ScrollComponent>
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
  compactInput: {
    height: 44,
  },
  compactField: {
    flex: 1,
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
  dogCard: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  dogCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  dogCardTitle: {
    marginBottom: 0,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.xs,
  },
  photoRow: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  photoContainer: {
    width: 110,
    height: 110,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  dogPhoto: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  photoFieldsColumn: {
    flex: 1,
    gap: Spacing.md,
  },
  dogFieldsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  addDogButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xl,
  },
});
