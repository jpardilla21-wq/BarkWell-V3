import React from "react";
import { StyleSheet, View, Pressable, Image, Platform, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useDogs } from "@/contexts/DogContext";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import type { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";
import RevenueCatUI from "react-native-purchases-ui";

type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, "Profile">;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { theme } = useTheme();
  const { dogs, selectedDogId } = useDogs();
  const [showCustomerCenter, setShowCustomerCenter] = React.useState(false);

  const selectedDog = dogs.find((dog) => dog.id === selectedDogId);

  const handleManageSubscription = () => {
    // Check if on mobile
    if (Platform.OS === 'web') {
      Alert.alert("Manage Subscription", "Please manage your subscription via the store you purchased it from.");
      return;
    }
    setShowCustomerCenter(true);
  };

  if (showCustomerCenter) {
    // Using CustomerCenterView instead of CustomerCenter as per recent SDK type definition or renaming
    return (
      <View style={{ flex: 1 }}>
        <RevenueCatUI.CustomerCenter
          onDismiss={() => setShowCustomerCenter(false)}
        />
      </View>
    );
  }

  if (!selectedDog) {
    return (
      <ScreenScrollView>
        <View style={styles.profileSection}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <Feather name="smile" size={48} color={Colors.light.primary} />
          </View>
          <ThemedText type="h2" style={styles.dogName}>
            No Dog Selected
          </ThemedText>
          <ThemedText type="body" style={{ color: theme.textMuted }}>
            Please select a dog from the home screen
          </ThemedText>
        </View>
      </ScreenScrollView>
    );
  }

  return (
    <ScreenScrollView>
      <View style={styles.profileSection}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: theme.backgroundDefault },
          ]}
        >
          {selectedDog.photo ? (
            <Image source={{ uri: selectedDog.photo }} style={styles.avatarImage} />
          ) : (
            <Feather name="smile" size={48} color={Colors.light.primary} />
          )}
        </View>
        <ThemedText type="h2" style={styles.dogName}>
          {selectedDog.name}
        </ThemedText>
        {selectedDog.nickname ? (
          <ThemedText type="body" style={{ color: theme.textMuted, marginBottom: Spacing.xs }}>
            "{selectedDog.nickname}"
          </ThemedText>
        ) : null}
        <ThemedText type="body" style={{ color: theme.textMuted }}>
          {selectedDog.age} {parseInt(selectedDog.age) === 1 ? "year" : "years"} old • {selectedDog.breed}
        </ThemedText>
      </View>

      <View style={styles.menuSection}>
        <Pressable
          onPress={() => navigation.navigate("History")}
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <View style={styles.menuItemLeft}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: Colors.light.primary + "20" },
              ]}
            >
              <Feather name="clock" size={20} color={Colors.light.primary} />
            </View>
            <ThemedText type="body">View History</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textMuted} />
        </Pressable>

        <Pressable
          onPress={handleManageSubscription}
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <View style={styles.menuItemLeft}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: Colors.light.warningYellow + "20" },
              ]}
            >
              <Feather name="credit-card" size={20} color={Colors.light.warningYellow} />
            </View>
            <ThemedText type="body">Manage Subscription</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textMuted} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("Referral")}
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <View style={styles.menuItemLeft}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: Colors.light.softGreen + "20" },
              ]}
            >
              <Feather name="gift" size={20} color={Colors.light.softGreen} />
            </View>
            <ThemedText type="body">Refer a Friend</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textMuted} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            { backgroundColor: theme.backgroundDefault, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <View style={styles.menuItemLeft}>
            <View
              style={[
                styles.menuIcon,
                { backgroundColor: Colors.light.softGreen + "20" },
              ]}
            >
              <Feather name="info" size={20} color={Colors.light.softGreen} />
            </View>
            <ThemedText type="body">App Info</ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={theme.textMuted} />
        </Pressable>
      </View>

      <View
        style={[
          styles.disclaimerCard,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <Feather
          name="alert-circle"
          size={20}
          color={theme.textMuted}
          style={styles.disclaimerIcon}
        />
        <ThemedText type="small" style={{ color: theme.textMuted }}>
          PupSense does not replace a veterinarian. Always consult a licensed
          vet if you're unsure.
        </ThemedText>
      </View>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    overflow: "hidden",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  dogName: {
    marginBottom: Spacing.xs,
  },
  menuSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  disclaimerCard: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  disclaimerIcon: {
    marginTop: 2,
  },
});
