import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@/src/design-system";
import Card from "@/src/components/redesign/Card";
import Button from "@/src/components/redesign/Button";
import { DogBreedDropdown } from "@/components/DogBreedDropdown";
import { useDogs, type DogProfile } from "@/contexts/DogContext";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type OnboardingScreenRedesignProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Onboarding">;
};

type OnboardingStep = "login" | "form" | "pricing";

const createEmptyDog = (): DogProfile => ({
  id: Date.now().toString(),
  name: "",
  nickname: "",
  breed: "",
  age: "",
  photo: null,
});

export default function OnboardingScreenRedesign({
  navigation,
}: OnboardingScreenRedesignProps) {
  const { colors, spacing, typography, shadows } = useTheme();
  const { addDogs } = useDogs();
  const [step, setStep] = useState<OnboardingStep>("login");
  const [ownerData, setOwnerData] = useState({
    name: "",
    email: "",
  });
  const [dogs, setDogs] = useState<DogProfile[]>([createEmptyDog()]);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");

  // Step 1: Social Login
  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Google authentication would happen here");
    setStep("form");
  };

  const handleAppleLogin = () => {
    Alert.alert("Apple Login", "Apple authentication would happen here");
    setStep("form");
  };

  const handleEmailLogin = () => {
    setStep("form");
  };

  // Step 2: Form
  const handleAddDog = () => {
    setDogs([...dogs, createEmptyDog()]);
  };

  const handleRemoveDog = (index: number) => {
    if (dogs.length > 1) {
      setDogs(dogs.filter((_, i) => i !== index));
    }
  };

  const updateDog = (index: number, field: keyof DogProfile, value: string) => {
    const newDogs = [...dogs];
    newDogs[index] = { ...newDogs[index], [field]: value };
    setDogs(newDogs);
  };

  const handlePickPhoto = async (index: number) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        updateDog(index, "photo", result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleFormNext = () => {
    if (!ownerData.name.trim() || !ownerData.email.trim()) {
      Alert.alert("Missing Information", "Please fill in your name and email");
      return;
    }

    const allDogsValid = dogs.every(
      (dog) => dog.name.trim() && dog.breed.trim() && dog.age.trim()
    );
    if (!allDogsValid) {
      Alert.alert("Missing Information", "Please complete all dog profiles");
      return;
    }

    setStep("pricing");
  };

  // Step 3: Pricing
  const handleStartTrial = async () => {
    try {
      await addDogs(dogs);
      navigation.replace("MainTabs");
    } catch (error) {
      Alert.alert("Error", "Failed to save profiles");
    }
  };

  const renderLoginStep = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={styles.heroSection}>
        {/* BarkWell Paw Logo */}
        <View style={styles.pawLogoContainer}>
          {/* Background colored dots */}
          <View style={[styles.pawDot, { top: 0, left: 20, backgroundColor: colors.primary[300] }]} />
          <View style={[styles.pawDot, { top: 10, right: 10, backgroundColor: colors.primary[400] }]} />
          <View style={[styles.pawDot, { bottom: 30, left: 10, backgroundColor: colors.accent[300], width: 20, height: 20 }]} />
          <View style={[styles.pawDot, { bottom: 30, right: 5, backgroundColor: colors.accent[300], width: 20, height: 20 }]} />
          <View style={[styles.pawDot, { bottom: 0, left: 35, backgroundColor: colors.accent[400], width: 18, height: 18 }]} />
          <View style={[styles.pawDot, { top: 35, left: 0, backgroundColor: colors.secondary[300], width: 16, height: 16 }]} />
          <View style={[styles.pawDot, { top: 40, right: 0, backgroundColor: colors.secondary[300], width: 16, height: 16 }]} />

          {/* Main Paw Print */}
          <View style={[styles.pawPrint, { backgroundColor: colors.neutral[800] }]}>
            {/* Paw Pad (main oval) */}
            <View style={[styles.pawPad, { backgroundColor: colors.neutral[800] }]} />

            {/* Toe Pads */}
            <View style={styles.toePadsContainer}>
              <View style={[styles.toePad, styles.toePadLeft, { backgroundColor: colors.neutral[800] }]} />
              <View style={[styles.toePad, styles.toePadCenterLeft, { backgroundColor: colors.neutral[800] }]} />
              <View style={[styles.toePad, styles.toePadCenterRight, { backgroundColor: colors.neutral[800] }]} />
              <View style={[styles.toePad, styles.toePadRight, { backgroundColor: colors.neutral[800] }]} />
            </View>
          </View>
        </View>

        <Text
          style={{
            fontSize: typography.h1.fontSize,
            fontFamily: typography.display.fontFamily,
            fontWeight: "700",
            color: colors.neutral[900],
            textAlign: "center",
            marginTop: spacing.lg,
          }}
        >
          Welcome to BarkWell
        </Text>
        <Text
          style={{
            fontSize: typography.bodyL.fontSize,
            color: colors.neutral[600],
            textAlign: "center",
            marginTop: spacing.sm,
            paddingHorizontal: spacing.xl,
          }}
        >
          AI-powered wellness for your furry friends
        </Text>
      </View>

      {/* Social Login Buttons */}
      <View style={styles.loginButtons}>
        <Button
          variant="outline"
          size="lg"
          leftIcon={<Feather name="mail" size={20} color={colors.primary[500]} />}
          onPress={handleGoogleLogin}
          style={styles.socialButton}
        >
          Continue with Google
        </Button>

        {Platform.OS === "ios" && (
          <Button
            variant="outline"
            size="lg"
            leftIcon={<Feather name="smartphone" size={20} color={colors.neutral[900]} />}
            onPress={handleAppleLogin}
            style={styles.socialButton}
          >
            Continue with Apple
          </Button>
        )}

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.neutral[300] }]} />
          <Text style={{ fontSize: typography.bodyS.fontSize, color: colors.neutral[500], paddingHorizontal: spacing.md }}>
            or
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.neutral[300] }]} />
        </View>

        <Button variant="primary" size="lg" onPress={handleEmailLogin}>
          Continue with Email
        </Button>
      </View>

      {/* Terms */}
      <Text
        style={{
          fontSize: typography.bodyS.fontSize,
          color: colors.neutral[500],
          textAlign: "center",
          marginTop: spacing.xl,
          paddingHorizontal: spacing.xl,
        }}
      >
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </ScrollView>
  );

  const renderFormStep = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable onPress={() => setStep("login")} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.neutral[900]} />
        </Pressable>
        <Text
          style={{
            fontSize: typography.h2.fontSize,
            fontFamily: typography.display.fontFamily,
            fontWeight: "700",
            color: colors.neutral[900],
          }}
        >
          Create Your Profile
        </Text>
      </View>

      {/* Owner Info */}
      <Card variant="flat" style={styles.section}>
        <Text style={{ fontSize: typography.h4.fontSize, fontWeight: "600", color: colors.neutral[900], marginBottom: spacing.md }}>
          About You
        </Text>
        <View style={styles.inputGroup}>
          <Text style={{ fontSize: typography.bodyS.fontSize, fontWeight: "600", color: colors.neutral[700], marginBottom: spacing.xs }}>
            Your Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.neutral.white,
                borderColor: colors.neutral[300],
                color: colors.neutral[900],
                fontFamily: typography.body.fontFamily,
                fontSize: typography.bodyM.fontSize,
              },
            ]}
            value={ownerData.name}
            onChangeText={(text) => setOwnerData({ ...ownerData, name: text })}
            placeholder="Enter your name"
            placeholderTextColor={colors.neutral[400]}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={{ fontSize: typography.bodyS.fontSize, fontWeight: "600", color: colors.neutral[700], marginBottom: spacing.xs }}>
            Email Address
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.neutral.white,
                borderColor: colors.neutral[300],
                color: colors.neutral[900],
                fontFamily: typography.body.fontFamily,
                fontSize: typography.bodyM.fontSize,
              },
            ]}
            value={ownerData.email}
            onChangeText={(text) => setOwnerData({ ...ownerData, email: text })}
            placeholder="your.email@example.com"
            placeholderTextColor={colors.neutral[400]}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </Card>

      {/* Dog Profiles */}
      <Text style={{ fontSize: typography.h4.fontSize, fontWeight: "600", color: colors.neutral[900], marginBottom: spacing.md }}>
        Your Dogs
      </Text>

      {dogs.map((dog, index) => (
        <Card key={dog.id} variant="elevated" style={styles.dogCard}>
          <View style={styles.dogCardHeader}>
            <Text style={{ fontSize: typography.bodyM.fontSize, fontWeight: "600", color: colors.neutral[900] }}>
              Dog {index + 1}
            </Text>
            {dogs.length > 1 && (
              <Pressable onPress={() => handleRemoveDog(index)}>
                <Feather name="trash-2" size={18} color={colors.status.critical} />
              </Pressable>
            )}
          </View>

          {/* Photo */}
          <Pressable
            onPress={() => handlePickPhoto(index)}
            style={[styles.photoButton, { borderColor: colors.primary[300] }]}
          >
            {dog.photo ? (
              <Image source={{ uri: dog.photo }} style={styles.dogPhoto} />
            ) : (
              <>
                <Feather name="camera" size={32} color={colors.primary[500]} />
                <Text style={{ fontSize: typography.bodyS.fontSize, color: colors.neutral[600], marginTop: spacing.xs }}>
                  Add Photo
                </Text>
              </>
            )}
          </Pressable>

          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={{ fontSize: typography.bodyS.fontSize, fontWeight: "600", color: colors.neutral[700], marginBottom: spacing.xs }}>
              Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.neutral.white,
                  borderColor: colors.neutral[300],
                  color: colors.neutral[900],
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.bodyM.fontSize,
                },
              ]}
              value={dog.name}
              onChangeText={(text) => updateDog(index, "name", text)}
              placeholder="e.g., Max, Bella"
              placeholderTextColor={colors.neutral[400]}
            />
          </View>

          {/* Breed */}
          <View style={styles.inputGroup}>
            <Text style={{ fontSize: typography.bodyS.fontSize, fontWeight: "600", color: colors.neutral[700], marginBottom: spacing.xs }}>
              Breed
            </Text>
            <DogBreedDropdown
              value={dog.breed}
              onSelect={(breed) => updateDog(index, "breed", breed)}
            />
          </View>

          {/* Age */}
          <View style={styles.inputGroup}>
            <Text style={{ fontSize: typography.bodyS.fontSize, fontWeight: "600", color: colors.neutral[700], marginBottom: spacing.xs }}>
              Age (years)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.neutral.white,
                  borderColor: colors.neutral[300],
                  color: colors.neutral[900],
                  fontFamily: typography.body.fontFamily,
                  fontSize: typography.bodyM.fontSize,
                },
              ]}
              value={dog.age}
              onChangeText={(text) => updateDog(index, "age", text)}
              placeholder="e.g., 3"
              placeholderTextColor={colors.neutral[400]}
              keyboardType="numeric"
            />
          </View>
        </Card>
      ))}

      <Button
        variant="outline"
        size="md"
        leftIcon={<Feather name="plus" size={18} color={colors.primary[500]} />}
        onPress={handleAddDog}
        style={{ marginBottom: spacing.lg }}
      >
        Add Another Dog
      </Button>

      <Button variant="primary" size="lg" onPress={handleFormNext}>
        Continue to Pricing
      </Button>
    </ScrollView>
  );

  const renderPricingStep = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable onPress={() => setStep("form")} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={colors.neutral[900]} />
        </Pressable>
        <Text
          style={{
            fontSize: typography.h2.fontSize,
            fontFamily: typography.display.fontFamily,
            fontWeight: "700",
            color: colors.neutral[900],
            textAlign: "center",
          }}
        >
          Start your 3-day FREE trial
        </Text>
      </View>

      {/* Timeline */}
      <Card variant="flat" style={styles.timeline}>
        <View style={styles.timelineItem}>
          <View style={[styles.timelineDot, { backgroundColor: colors.primary[500] }]}>
            <Feather name="unlock" size={16} color={colors.neutral.white} />
          </View>
          <View style={styles.timelineContent}>
            <Text style={{ fontSize: typography.bodyM.fontSize, fontWeight: "600", color: colors.neutral[900] }}>
              Today
            </Text>
            <Text style={{ fontSize: typography.bodyS.fontSize, color: colors.neutral[600] }}>
              Unlock all features including AI scanning and health tracking
            </Text>
          </View>
        </View>

        <View style={[styles.timelineLine, { backgroundColor: colors.primary[300] }]} />

        <View style={styles.timelineItem}>
          <View style={[styles.timelineDot, { backgroundColor: colors.accent[500] }]}>
            <Feather name="bell" size={16} color={colors.neutral.white} />
          </View>
          <View style={styles.timelineContent}>
            <Text style={{ fontSize: typography.bodyM.fontSize, fontWeight: "600", color: colors.neutral[900] }}>
              In 2 Days - Reminder
            </Text>
            <Text style={{ fontSize: typography.bodyS.fontSize, color: colors.neutral[600] }}>
              We'll send you a reminder that your trial is ending soon
            </Text>
          </View>
        </View>

        <View style={[styles.timelineLine, { backgroundColor: colors.neutral[300] }]} />

        <View style={styles.timelineItem}>
          <View style={[styles.timelineDot, { backgroundColor: colors.neutral[900] }]}>
            <Feather name="credit-card" size={16} color={colors.neutral.white} />
          </View>
          <View style={styles.timelineContent}>
            <Text style={{ fontSize: typography.bodyM.fontSize, fontWeight: "600", color: colors.neutral[900] }}>
              In 3 Days - Billing Starts
            </Text>
            <Text style={{ fontSize: typography.bodyS.fontSize, color: colors.neutral[600] }}>
              You'll be charged unless you cancel anytime before
            </Text>
          </View>
        </View>
      </Card>

      {/* Pricing Plans */}
      <Text style={{ fontSize: typography.h4.fontSize, fontWeight: "600", color: colors.neutral[900], marginTop: spacing.lg, marginBottom: spacing.md }}>
        Choose Your Plan
      </Text>

      <Pressable onPress={() => setSelectedPlan("monthly")}>
        <Card
          variant={selectedPlan === "monthly" ? "elevated" : "outlined"}
          style={[
            styles.pricingCard,
            selectedPlan === "monthly" && { borderColor: colors.primary[500], borderWidth: 2 },
          ]}
        >
          <View style={styles.pricingHeader}>
            <View>
              <Text style={{ fontSize: typography.bodyM.fontSize, fontWeight: "600", color: colors.neutral[900] }}>
                Monthly
              </Text>
              <Text style={{ fontSize: typography.h3.fontSize, fontWeight: "700", color: colors.neutral[900], marginTop: spacing.xs }}>
                $9.99<Text style={{ fontSize: typography.bodyM.fontSize, fontWeight: "400", color: colors.neutral[600] }}>/mo</Text>
              </Text>
            </View>
            <View
              style={[
                styles.radioButton,
                {
                  borderColor: selectedPlan === "monthly" ? colors.primary[500] : colors.neutral[300],
                  backgroundColor: selectedPlan === "monthly" ? colors.primary[500] : "transparent",
                },
              ]}
            >
              {selectedPlan === "monthly" && <Feather name="check" size={14} color={colors.neutral.white} />}
            </View>
          </View>
        </Card>
      </Pressable>

      <Pressable onPress={() => setSelectedPlan("yearly")} style={{ marginTop: spacing.md }}>
        <Card
          variant={selectedPlan === "yearly" ? "elevated" : "outlined"}
          style={[
            styles.pricingCard,
            selectedPlan === "yearly" && { borderColor: colors.primary[500], borderWidth: 2 },
          ]}
        >
          {selectedPlan === "yearly" && (
            <View style={[styles.badge, { backgroundColor: colors.primary[500] }]}>
              <Text style={{ fontSize: typography.bodyXS.fontSize, fontWeight: "700", color: colors.neutral.white }}>
                3 DAYS FREE
              </Text>
            </View>
          )}
          <View style={styles.pricingHeader}>
            <View>
              <Text style={{ fontSize: typography.bodyM.fontSize, fontWeight: "600", color: colors.neutral[900] }}>
                Yearly
              </Text>
              <Text style={{ fontSize: typography.h3.fontSize, fontWeight: "700", color: colors.neutral[900], marginTop: spacing.xs }}>
                $2.49<Text style={{ fontSize: typography.bodyM.fontSize, fontWeight: "400", color: colors.neutral[600] }}>/mo</Text>
              </Text>
              <Text style={{ fontSize: typography.bodyS.fontSize, color: colors.status.excellent, marginTop: 4 }}>
                Save 75% • $29.99/year
              </Text>
            </View>
            <View
              style={[
                styles.radioButton,
                {
                  borderColor: selectedPlan === "yearly" ? colors.primary[500] : colors.neutral[300],
                  backgroundColor: selectedPlan === "yearly" ? colors.primary[500] : "transparent",
                },
              ]}
            >
              {selectedPlan === "yearly" && <Feather name="check" size={14} color={colors.neutral.white} />}
            </View>
          </View>
        </Card>
      </Pressable>

      {/* No Payment Due */}
      <View style={styles.noPayment}>
        <Feather name="check-circle" size={20} color={colors.status.excellent} />
        <Text style={{ fontSize: typography.bodyM.fontSize, fontWeight: "600", color: colors.neutral[900], marginLeft: spacing.sm }}>
          No Payment Due Now
        </Text>
      </View>

      {/* CTA */}
      <Button variant="primary" size="lg" onPress={handleStartTrial} style={{ marginTop: spacing.lg }}>
        Start My 3-Day Free Trial
      </Button>

      {/* Legal */}
      <Text
        style={{
          fontSize: typography.bodyXS.fontSize,
          color: colors.neutral[500],
          textAlign: "center",
          marginTop: spacing.md,
          paddingHorizontal: spacing.lg,
        }}
      >
        3 days free, then ${selectedPlan === "monthly" ? "9.99 per month" : "29.99 per year ($2.49/mo)"}
      </Text>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.neutral.cream }]} edges={["top"]}>
      {step === "login" && renderLoginStep()}
      {step === "form" && renderFormStep()}
      {step === "pricing" && renderPricingStep()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 40,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  pawLogoContainer: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pawDot: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  pawPrint: {
    width: 70,
    height: 70,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  pawPad: {
    width: 32,
    height: 38,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    position: "absolute",
    bottom: 0,
  },
  toePadsContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 0,
    width: "100%",
    justifyContent: "space-around",
    paddingHorizontal: 4,
  },
  toePad: {
    width: 12,
    height: 16,
    borderRadius: 8,
  },
  toePadLeft: {
    transform: [{ rotate: "-15deg" }],
  },
  toePadCenterLeft: {
    marginTop: -4,
  },
  toePadCenterRight: {
    marginTop: -4,
  },
  toePadRight: {
    transform: [{ rotate: "15deg" }],
  },
  loginButtons: {
    marginTop: 40,
  },
  socialButton: {
    marginBottom: 12,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  section: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  dogCard: {
    marginBottom: 16,
  },
  dogCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  photoButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  dogPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  timeline: {
    marginTop: 24,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    height: 24,
    marginLeft: 15,
    marginVertical: 8,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },
  pricingCard: {
    position: "relative",
  },
  pricingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -8,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  noPayment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
});
