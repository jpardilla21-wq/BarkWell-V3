import React, { useState, useMemo } from "react";
import { StyleSheet, View, TextInput, FlatList, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
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

  return (
    <View style={styles.container}>
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
        onChangeText={(text) => {
          onSelect(text);
          setShowDropdown(text.length > 0);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        placeholder="Start typing a breed..."
        placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
        autoCapitalize="words"
        editable={true}
      />

      {showDropdown && filteredBreeds.length > 0 && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.borderLight,
            },
          ]}
        >
          <FlatList
            data={filteredBreeds}
            keyExtractor={(item) => item}
            scrollEnabled={filteredBreeds.length > 6}
            nestedScrollEnabled={true}
            style={{ maxHeight: 220 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectBreed(item)}
                style={[
                  styles.option,
                  {
                    backgroundColor:
                      value === item
                        ? Colors.light.primary + "20"
                        : "transparent",
                  },
                ]}
              >
                <ThemedText type="body" style={styles.optionText}>
                  {item}
                </ThemedText>
              </Pressable>
            )}
          />
        </View>
      )}

      {showDropdown && filteredBreeds.length === 0 && value.length > 0 && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.borderLight,
            },
          ]}
        >
          <View style={styles.emptyState}>
            <ThemedText type="body" style={{ color: theme.textMuted }}>
              No breeds found
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 10,
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.bodyM.fontSize,
  },
  dropdown: {
    position: "absolute",
    top: Spacing.inputHeight + 4,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xs,
    zIndex: 1000,
    maxHeight: 220,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  option: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  optionText: {
    fontSize: Typography.bodyM.fontSize,
  },
  emptyState: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    alignItems: "center",
  },
});
