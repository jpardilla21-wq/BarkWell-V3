import React, { useRef, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { WeeklySnapshotCard } from "@/components/WeeklySnapshotCard";
import { useTheme } from "@/hooks/useTheme";
import { useDogs } from "@/contexts/DogContext";
import { getWeeklySnapshot } from "@/services/weeklySnapshot";
import { shareCardImage, saveCardToPhotos } from "@/utils/shareCard";
import { Colors, Spacing } from "@/constants/theme";
import type { HomeStackParamList } from "@/navigation/HomeStackNavigator";

type WeeklySnapshotScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  "WeeklySnapshot"
>;

type WeeklySnapshotScreenProps = {
  navigation: WeeklySnapshotScreenNavigationProp;
};

export default function WeeklySnapshotScreen({
  navigation,
}: WeeklySnapshotScreenProps) {
  const { theme } = useTheme();
  const { dogs, selectedDogId } = useDogs();
  const cardRef = useRef<View>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedDog = dogs.find((dog) => dog.id === selectedDogId) || dogs[0];

  if (!selectedDog) {
    return (
      <ScreenScrollView>
        <View style={styles.emptyState}>
          <ThemedText type="h3">No Dog Selected</ThemedText>
          <ThemedText type="body" style={{ color: theme.textMuted }}>
            Please add a dog profile first.
          </ThemedText>
        </View>
      </ScreenScrollView>
    );
  }

  const snapshot = getWeeklySnapshot(
    selectedDog.id,
    selectedDog.name,
    selectedDog.photo
  );

  const handleShare = async () => {
    await shareCardImage(
      cardRef,
      () => setIsSharing(true),
      () => setIsSharing(false)
    );
  };

  const handleSave = async () => {
    await saveCardToPhotos(
      cardRef,
      () => setIsSaving(true),
      () => setIsSaving(false)
    );
  };

  return (
    <ScreenScrollView>
      <View style={styles.cardWrapper}>
        <WeeklySnapshotCard ref={cardRef} snapshot={snapshot} />
      </View>

      <View style={styles.buttonContainer}>
        <Button onPress={handleShare} disabled={isSharing}>
          {isSharing ? (
            <View style={styles.loadingButton}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <ThemedText style={styles.loadingText}>Generating...</ThemedText>
            </View>
          ) : (
            "Share Weekly Snapshot"
          )}
        </Button>

        {Platform.OS !== "web" ? (
          <Button
            onPress={handleSave}
            disabled={isSaving}
            style={[
              styles.secondaryButton,
              { backgroundColor: theme.backgroundDefault, borderColor: Colors.light.primary },
            ]}
          >
            {isSaving ? (
              <View style={styles.loadingButton}>
                <ActivityIndicator size="small" color={Colors.light.primary} />
                <ThemedText style={[styles.loadingText, { color: Colors.light.primary }]}>
                  Saving...
                </ThemedText>
              </View>
            ) : (
              <ThemedText style={{ color: Colors.light.primary, fontWeight: "600" }}>
                Save to Photos
              </ThemedText>
            )}
          </Button>
        ) : null}
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.md,
  },
  buttonContainer: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xl,
  },
  secondaryButton: {
    borderWidth: 2,
  },
  loadingButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  loadingText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
