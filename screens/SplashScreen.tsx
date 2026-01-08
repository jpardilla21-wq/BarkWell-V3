import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Colors, Spacing } from "@/constants/theme";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Splash">;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Navigate when progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        navigation.replace("Onboarding");
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [progress, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require("../assets/images/pupsense-logo-splash.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.loadingBar}>
        <View
          style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 150,
    height: 150,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginBottom: Spacing.xl + 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.light.primary,
    borderRadius: 2,
  },
});
