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

// Clean dog breed list - legitimate breeds only
const POPULAR_BREEDS = [
  "Affenpinscher",
  "Afghan Hound",
  "Airedale Terrier",
  "Akita",
  "Alaskan Malamute",
  "American Cocker Spaniel",
  "American Foxhound",
  "American Staffordshire Terrier",
  "American Water Spaniel",
  "Anatolian Shepherd Dog",
  "Australian Cattle Dog",
  "Australian Kelpie",
  "Australian Shepherd",
  "Australian Terrier",
  "Basenji",
  "Basset Hound",
  "Beagle",
  "Bearded Collie",
  "Bedlington Terrier",
  "Belgian Shepherd",
  "Belgian Sheepdog",
  "Bernese Mountain Dog",
  "Bichon Frise",
  "Bloodhound",
  "Bluetick Coonhound",
  "Border Collie",
  "Border Terrier",
  "Borzoi",
  "Boston Terrier",
  "Bouvier des Flandres",
  "Boxer",
  "Boykin Spaniel",
  "Briard",
  "Brittany",
  "Brussels Griffon",
  "Bulldog",
  "Bull Mastiff",
  "Bull Terrier",
  "Cairn Terrier",
  "Canaan Dog",
  "Cane Corso",
  "Catahoula Leopard Dog",
  "Cavalier King Charles Spaniel",
  "Chesapeake Bay Retriever",
  "Chihuahua",
  "Chinese Crested",
  "Chinese Shar-Pei",
  "Chow Chow",
  "Clumber Spaniel",
  "Cockapoo",
  "Cocker Spaniel",
  "Collie",
  "Corgi",
  "Coton de Tulear",
  "Curly Coated Retriever",
  "Dachshund",
  "Dalmatian",
  "Dandie Dinmont Terrier",
  "Deerhound",
  "Doberman Pinscher",
  "Dogo Argentino",
  "Dogue de Bordeaux",
  "Dutch Shepherd",
  "East Siberian Laika",
  "English Bulldog",
  "English Cocker Spaniel",
  "English Coonhound",
  "English Foxhound",
  "English Mastiff",
  "English Pointer",
  "English Setter",
  "English Springer Spaniel",
  "English Toy Terrier",
  "English Toy Spaniel",
  "Entlebucher Mountain Dog",
  "Estrela Mountain Dog",
  "Eurasier",
  "Field Spaniel",
  "Fila Brasileiro",
  "Finnish Lapphund",
  "Finnish Spitz",
  "Flat Coated Retriever",
  "French Bulldog",
  "French Mastiff",
  "German Bracke",
  "German Pinscher",
  "German Pointer",
  "German Shepherd",
  "German Shorthaired Pointer",
  "German Spitz",
  "German Wirehaired Pointer",
  "Giant Schnauzer",
  "Glen of Imaal Terrier",
  "Goldendoodle",
  "Golden Retriever",
  "Great Dane",
  "Great Pyrenees",
  "Greater Swiss Mountain Dog",
  "Greek Harehound",
  "Greyhound",
  "Gross Münsterlander",
  "Harrier",
  "Havanese",
  "Hawaiian Poi Dog",
  "Hokkaido Inu",
  "Irish Red and White Setter",
  "Irish Red Setter",
  "Irish Setter",
  "Irish Terrier",
  "Irish Water Spaniel",
  "Irish Wolfhound",
  "Italian Greyhound",
  "Japanese Chin",
  "Keeshond",
  "Kerry Blue Terrier",
  "Kerry Beagle",
  "King Charles Spaniel",
  "Komondor",
  "Kuvasz",
  "Labrador Retriever",
  "Labradoodle",
  "Lagotto Romagnolo",
  "Lakeland Terrier",
  "Lancashire Heeler",
  "Lhasa Apso",
  "Lhasa Lion Dog",
  "Lowchen",
  "Maltese",
  "Manchester Terrier",
  "Maremma Sheepdog",
  "Mastiff",
  "Miniature American Shepherd",
  "Miniature Bull Terrier",
  "Miniature Pinscher",
  "Miniature Schnauzer",
  "Mixed Breed",
  "Molossus",
  "Mudi",
  "Neapolitan Mastiff",
  "Newfoundland",
  "Norfolk Terrier",
  "Norrbottenspitz",
  "Norwegian Buhund",
  "Norwegian Elkhound",
  "Norwegian Lundehund",
  "Norwich Terrier",
  "Nova Scotia Duck Tolling Retriever",
  "Old English Sheepdog",
  "Olde English Bulldogge",
  "Otterhound",
  "Papillon",
  "Parson Russell Terrier",
  "Patterdale Terrier",
  "Pekingese",
  "Pembroke Welsh Corgi",
  "Pharaoh Hound",
  "Pointer",
  "Polish Lowland Sheepdog",
  "Pomeranian",
  "Poodle",
  "Poodle Mix",
  "Portuguese Podengo",
  "Portuguese Water Dog",
  "Presa Canario",
  "Pug",
  "Puli",
  "Pulik",
  "Pyrenean Mastiff",
  "Pyrenean Shepherd",
  "Rottweiler",
  "Rough Collie",
  "Russian Terrier",
  "Russian Toy",
  "Russo-European Laika",
  "Saluki",
  "Samoyed",
  "Schipperke",
  "Schnauzer",
  "Scottish Deerhound",
  "Scottish Terrier",
  "Sealyham Terrier",
  "Setter",
  "Shar Pei",
  "Shiba Inu",
  "Shih Apso",
  "Shih Tzu",
  "Shih Tzu Mix",
  "Shikoku",
  "Shiloh Shepherd",
  "Silken Windhound",
  "Silky Terrier",
  "Skye Terrier",
  "Sloughi",
  "Soft Coated Wheaten Terrier",
  "Small Munsterlander Pointer",
  "Small Swiss Hound",
  "Smooth Coat Chihuahua",
  "Smooth Collie",
  "Smooth Fox Terrier",
  "Soft Coated Wheaten Terrier",
  "Spaniel",
  "Spanish Mastiff",
  "Spanish Pointer",
  "Spanish Water Dog",
  "Spinone Italiano",
  "Spitz",
  "St. Bernard",
  "Staffordshire Bull Terrier",
  "Staffordshire Terrier",
  "Standard Schnauzer",
  "Stichelhaar",
  "Styrian Coarse-Haired Hound",
  "Sussex Spaniel",
  "Swedish Elkhound",
  "Swedish Lapphund",
  "Swedish Vallhund",
  "Swiss Mountain Dog",
  "Tamaskan Dog",
  "Teddy Roosevelt Terrier",
  "Telomian",
  "Tennessee Treeing Brindle",
  "Terrier",
  "Texas Heeler",
  "Thai Bangkaew Dog",
  "Thai Ridgeback",
  "Tibetan Mastiff",
  "Tibetan Spaniel",
  "Tibetan Terrier",
  "Ticking Hound",
  "Toy Manchester Terrier",
  "Toy Poodle",
  "Toy Spaniel",
  "Toy Terrier",
  "Transylvanian Hound",
  "Treeing Cur",
  "Treeing Feist",
  "Treeing Tennessee Brindle",
  "Treeing Walker Coonhound",
  "Trigg Hound",
  "Triton Hound",
  "Vizsla",
  "Weimaraner",
  "Welsh Springer Spaniel",
  "Welsh Terrier",
  "West Highland White Terrier",
  "Wetterhoun",
  "Wheaten Terrier",
  "Whippet",
  "Whippet Mix",
  "Wire Fox Terrier",
  "Wirehaired Pointing Griffon",
  "Wirehaired Terrier",
  "Wirehaired Vizsla",
  "Wire-Haired Dachshund",
  "Xoloitzcuintli",
  "Yorkshire Terrier",
  "Yugoslav Shepherd",
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

  const handleBlur = () => {
    // Delay hiding dropdown to allow onPressIn to fire first
    setTimeout(() => {
      setShowDropdown(false);
    }, 150);
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
        onBlur={handleBlur}
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
              onPressIn={() => handleSelectBreed(breed)}
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
    outlineWidth: 0, // Remove web focus outline (black line)
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
