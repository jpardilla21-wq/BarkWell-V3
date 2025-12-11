import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ScreenKeyboardAwareScrollView } from "@/components/ScreenKeyboardAwareScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type AddDogScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "AddDog"
>;

type AddDogScreenProps = {
  navigation: AddDogScreenNavigationProp;
};

export default function AddDogScreen({ navigation }: AddDogScreenProps) {
  const { theme } = useTheme();

  return (
    <ScreenKeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Feather name="plus-circle" size={48} color={Colors.light.primary} />
          <ThemedText type="h2" style={styles.title}>
            Add a New Dog
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textMuted }}>
            Coming soon
          </ThemedText>
        </View>

        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <ThemedText style={styles.buttonText}>Go Back</ThemedText>
        </Pressable>
      </View>
    </ScreenKeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.lg,
  },
  header: {
    alignItems: "center",
    gap: Spacing.md,
  },
  title: {
    textAlign: "center",
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.md,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
});
