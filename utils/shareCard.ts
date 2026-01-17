import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Alert, Platform } from "react-native";
import type { RefObject } from "react";
import type { View } from "react-native";

export async function captureCardAsImage(
  viewRef: RefObject<View | null>,
): Promise<string | null> {
  try {
    if (!viewRef.current) {
      throw new Error("View ref is not available");
    }

    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 1,
      width: 1080,
    });

    return uri;
  } catch (error) {
    console.error("Error capturing card:", error);
    return null;
  }
}

export async function shareCardImage(
  viewRef: RefObject<View | null>,
  onStart?: () => void,
  onComplete?: () => void,
): Promise<boolean> {
  try {
    onStart?.();

    const uri = await captureCardAsImage(viewRef);
    if (!uri) {
      throw new Error("Failed to capture image");
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      onComplete?.();
      Alert.alert(
        "Sharing not available",
        "Sharing is not available on this device",
      );
      return false;
    }

    await Sharing.shareAsync(uri, {
      mimeType: "image/png",
      dialogTitle: "Share Weekly Snapshot",
    });

    onComplete?.();
    return true;
  } catch (error) {
    console.error("Error sharing card:", error);
    onComplete?.();
    Alert.alert("Error", "Failed to share the snapshot. Please try again.");
    return false;
  }
}

export async function saveCardToPhotos(
  viewRef: RefObject<View | null>,
  onStart?: () => void,
  onComplete?: () => void,
): Promise<boolean> {
  try {
    onStart?.();

    if (Platform.OS === "web") {
      Alert.alert(
        "Not Available",
        "Saving to photos is not available on web. Please use Expo Go on your device.",
      );
      onComplete?.();
      return false;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photos to save the snapshot.",
      );
      onComplete?.();
      return false;
    }

    const uri = await captureCardAsImage(viewRef);
    if (!uri) {
      throw new Error("Failed to capture image");
    }

    await MediaLibrary.saveToLibraryAsync(uri);

    onComplete?.();
    Alert.alert("Saved", "Weekly Snapshot saved to your photos!");
    return true;
  } catch (error) {
    console.error("Error saving card:", error);
    onComplete?.();
    Alert.alert("Error", "Failed to save the snapshot. Please try again.");
    return false;
  }
}
