import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useCameraPermissions, useMediaLibraryPermissions } from "expo-image-picker";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme as useOldTheme } from "@/hooks/useTheme";
import { useTheme } from "@/design-system";
import { useDogs, type DogProfile } from "@/contexts/DogContext";
import { DogBreedDropdown } from "@/components/DogBreedDropdown";
import { Spacing, BorderRadius, Typography } from "@/constants/theme";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type AddDogScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "AddDog"
>;

type AddDogScreenProps = {
  navigation: AddDogScreenNavigationProp;
};

export default function AddDogScreen({ navigation }: AddDogScreenProps) {
  const { theme, isDark } = useOldTheme();
  const { colors } = useTheme();
  const { addDogs } = useDogs();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    useMediaLibraryPermissions();

  const inputStyle = [
    styles.input,
    {
      backgroundColor: theme.backgroundDefault,
      color: theme.text,
      borderColor: theme.borderLight,
    },
  ];

  const openSettings = async () => {
    if (Platform.OS !== "web") {
      try {
        await Linking.openSettings();
      } catch (error) {
        // openSettings not supported
      }
    }
  };

  const pickImage = async () => {
    if (Platform.OS === "web") {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhotoUri(result.assets[0].uri);
      }
    } else {
      const openSettingsText = "Open Settings";
      const cameraPermissionDeniedText =
        "Camera permission was denied. Please enable it in settings.";
      const libraryPermissionDeniedText =
        "Photo library permission was denied. Please enable it in settings.";

      Alert.alert("Add Photo", "", [
        {
          text: "Take Photo",
          onPress: async () => {
            if (cameraPermission?.granted) {
              const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!result.canceled && result.assets[0]) {
                setPhotoUri(result.assets[0].uri);
              }
            } else if (
              cameraPermission?.status === "denied" &&
              !cameraPermission?.canAskAgain
            ) {
              Alert.alert("", cameraPermissionDeniedText, [
                { text: openSettingsText, onPress: openSettings },
                { text: "Cancel", style: "cancel" },
              ]);
            } else {
              const { granted } = await requestCameraPermission();
              if (granted) {
                const result = await ImagePicker.launchCameraAsync({
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.8,
                });
                if (!result.canceled && result.assets[0]) {
                  setPhotoUri(result.assets[0].uri);
                }
              }
            }
          },
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            if (mediaLibraryPermission?.granted) {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
              });
              if (!result.canceled && result.assets[0]) {
                setPhotoUri(result.assets[0].uri);
              }
            } else if (
              mediaLibraryPermission?.status === "denied" &&
              !mediaLibraryPermission?.canAskAgain
            ) {
              Alert.alert("", libraryPermissionDeniedText, [
                { text: openSettingsText, onPress: openSettings },
                { text: "Cancel", style: "cancel" },
              ]);
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
                  setPhotoUri(result.assets[0].uri);
                }
              }
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim() || !breed.trim() || !age.trim()) {
      Alert.alert("", "Please fill in all required fields (Name, Breed, Age)");
      return;
    }

    setIsSubmitting(true);
    try {
      const newDog: DogProfile = {
        id: Date.now().toString(),
        name: name.trim(),
        nickname: nickname.trim(),
        breed: breed.trim(),
        age: age.trim(),
        photo: photoUri,
      };

      await addDogs([newDog]);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to add dog profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.header}>
        <ThemedText type="h3" style={styles.title}>
          Add New Dog
        </ThemedText>
      </View>

      <Pressable
        onPress={pickImage}
        style={[
          styles.photoContainer,
          { backgroundColor: theme.backgroundRoot, borderColor: theme.borderLight },
        ]}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.dogPhoto} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Feather name="camera" size={32} color={theme.textMuted} />
            <ThemedText type="small" style={{ color: theme.textMuted, marginTop: 8 }}>
              Add Photo
            </ThemedText>
          </View>
        )}
      </Pressable>

      <View style={styles.fieldContainer}>
        <ThemedText type="small" style={styles.label}>
          Name *
        </ThemedText>
        <TextInput
          style={inputStyle}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Max, Bella"
          placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText type="small" style={styles.label}>
          Nickname
        </ThemedText>
        <TextInput
          style={inputStyle}
          value={nickname}
          onChangeText={setNickname}
          placeholder="e.g., Buddy, Sweetie"
          placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText type="small" style={styles.label}>
          Breed *
        </ThemedText>
        <DogBreedDropdown
          value={breed}
          onSelect={(selectedBreed) => setBreed(selectedBreed)}
          isDark={isDark}
        />
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText type="small" style={styles.label}>
          Age (years) *
        </ThemedText>
        <TextInput
          style={inputStyle}
          value={age}
          onChangeText={setAge}
          placeholder="e.g., 3"
          placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleSubmit}
          disabled={isSubmitting || !name.trim() || !breed.trim() || !age.trim()}
        >
          {isSubmitting ? "Adding..." : "Add Dog"}
        </Button>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: "center",
  },
  photoContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: Spacing.lg,
  },
  dogPhoto: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
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
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
});
