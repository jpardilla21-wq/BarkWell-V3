import React, { useState, useMemo } from "react";
import { StyleSheet, View, TextInput, ScrollView, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Typography, Colors } from "@/constants/theme";

interface DogBreedDropdownProps {
  value: string;
  onSelect: (breed: string) => void;
  isDark: boolean;
}

const POPULAR_BREEDS = [
  "Labrador Retriever",
  "Golden Retriever",
  "German Shepherd",
  "French Bulldog",
  "Bulldog",
  "Poodle",
  "Beagle",
  "Yorkshire Terrier",
  "Dachshund",
  "Rottweiler",
  "Boxer",
  "Great Dane",
  "Husky",
  "Chihuahua",
  "Shih Tzu",
  "Maltese",
  "Cocker Spaniel",
  "Border Collie",
  "Australian Shepherd",
  "Schnauzer",
  "Doberman",
  "Akita",
  "Dalmatian",
  "Pomeranian",
  "Corgi",
  "Setter",
  "Spaniel",
  "Terrier",
  "Retriever",
  "Mixed Breed",
];

export function DogBreedDropdown({ value, onSelect, isDark }: DogBreedDropdownProps) {
  const { theme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredBreeds = useMemo(() => {
    if (!value.trim()) return POPULAR_BREEDS;
    return POPULAR_BREEDS.filter((breed) =>
      breed.toLowerCase().includes(value.toLowerCase())
    );
  }, [value]);

  const handleSelectBreed = (breed: string) => {
    onSelect(breed);
    setShowDropdown(false);
  };

  const handleInputChange = (text: string) => {
    onSelect(text);
    if (text.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundDefault,
            color: theme.text,
            borderColor: theme.borderLight,
          },
        ]}
        value={value}
        onChangeText={handleInputChange}
        onFocus={() => value.length > 0 && setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        placeholder="Start typing a breed..."
        placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
        autoCapitalize="words"
      />

      {showDropdown && filteredBreeds.length > 0 && (
        <ScrollView
          nestedScrollEnabled={true}
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.borderLight,
            },
          ]}
          scrollEnabled={filteredBreeds.length > 6}
        >
          {filteredBreeds.map((breed, index) => (
            <Pressable
              key={breed}
              onPress={() => handleSelectBreed(breed)}
              style={[
                styles.option,
                {
                  backgroundColor:
                    value === breed ? Colors.light.primary + "20" : "transparent",
                  borderBottomColor: theme.borderLight,
                  borderBottomWidth: index < filteredBreeds.length - 1 ? 1 : 0,
                },
              ]}
            >
              <ThemedText type="body" style={styles.optionText}>
                {breed}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    zIndex: 1000,
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.bodyM.fontSize,
  },
  dropdown: {
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    maxHeight: 220,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  option: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  optionText: {
    fontSize: Typography.bodyM.fontSize,
  },
});
