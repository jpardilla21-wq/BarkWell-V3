import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@/design-system";
import type { RootStackParamList } from "@/navigation/RootNavigator";

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Splash">;
};

export default function SplashScreen({ navigation }: SplashScreenProps) {
  const { colors, spacing } = useTheme();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigation.replace("Onboarding");
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.neutral.background }]}>
      <View style={styles.content}>
        <Image
          source={require("../assets/images/pupsense-logo-splash.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
      <View style={[styles.loadingBar, {
        backgroundColor: colors.neutral[200],
        marginBottom: spacing['6xl']
      }]}>
        <View
          style={[styles.progressBar, {
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: colors.primary[500]
          }]}
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
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
