import React, { useState, useMemo, useRef } from "react";
import { StyleSheet, View, TextInput, FlatList, Pressable, Modal } from "react-native";
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
  const inputRef = useRef<TextInput>(null);

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
    setShowDropdown(text.length > 0);
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
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
        onFocus={() => setShowDropdown(value.length > 0)}
        placeholder="Start typing a breed..."
        placeholderTextColor={isDark ? "#9BA1A6" : "#6E6E6E"}
        autoCapitalize="words"
        editable={true}
      />

      {showDropdown && (
        <Modal
          transparent
          visible={showDropdown}
          onRequestClose={() => setShowDropdown(false)}
        >
          <Pressable
            style={styles.overlay}
            onPress={() => setShowDropdown(false)}
          >
            <View
              style={[
                styles.dropdown,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.borderLight,
                },
              ]}
            >
              {filteredBreeds.length > 0 ? (
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
              ) : (
                <View style={styles.emptyState}>
                  <ThemedText type="body" style={{ color: theme.textMuted }}>
                    No breeds found
                  </ThemedText>
                </View>
              )}
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    fontSize: Typography.bodyM.fontSize,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    width: "80%",
    maxWidth: 300,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    maxHeight: 300,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
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
