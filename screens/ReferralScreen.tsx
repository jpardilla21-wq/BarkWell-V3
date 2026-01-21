import React, { useState, useEffect } from "react";
import { StyleSheet, View, TextInput, Share, Alert, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { ScreenScrollView } from "@/components/ScreenScrollView";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { getReferralCode, redeemReferralCode, getReferralStats } from "@/services/api";

export default function ReferralScreen() {
  const { theme } = useTheme();
  const [myCode, setMyCode] = useState<string>("");
  const [inputCode, setInputCode] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  // Hardcoded userId for prototype
  const userId = 1;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [codeRes, statsRes] = await Promise.all([
        getReferralCode(userId),
        getReferralStats(userId),
      ]);

      if (codeRes.success && codeRes.code) {
        setMyCode(codeRes.code);
      }
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (error) {
      console.error("Failed to load referral data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(myCode);
    Alert.alert("Copied!", "Referral code copied to clipboard.");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on PupSense! Use my code ${myCode} to get 1 month free!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedeem = async () => {
    if (!inputCode.trim()) return;
    setRedeeming(true);
    try {
      const result = await redeemReferralCode(userId, inputCode.trim());
      if (result.success) {
        Alert.alert("Success!", result.message);
        setInputCode("");
        loadData(); // Refresh stats maybe?
      } else {
        Alert.alert("Error", result.error || "Failed to redeem code");
      }
    } catch (error) {
      Alert.alert("Error", "Network error");
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <ScreenScrollView>
      <View style={styles.header}>
        <ThemedText type="h1" style={styles.title}>Invite Friends</ThemedText>
        <ThemedText type="body" style={{ color: theme.textMuted, textAlign: 'center' }}>
          Share the love! Give friends a free month of PupSense Pro, and earn rewards for yourself.
        </ThemedText>
      </View>

      <ThemedView style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText type="h3" style={styles.cardTitle}>Your Referral Code</ThemedText>

        <View style={[styles.codeContainer, { backgroundColor: theme.backgroundSecondary }]}>
          <ThemedText type="h2" style={styles.codeText}>{myCode || "Loading..."}</ThemedText>
          <Pressable onPress={handleCopy} style={styles.copyButton}>
            <Feather name="copy" size={20} color={Colors.light.primary} />
          </Pressable>
        </View>

        <Button onPress={handleShare} style={styles.shareButton}>
          <Feather name="share" size={18} color="#FFF" style={{ marginRight: 8 }} />
          Share Code
        </Button>
      </ThemedView>

      {stats && (
        <ThemedView style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
          <ThemedText type="h3" style={styles.cardTitle}>Your Progress</ThemedText>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <ThemedText type="h2" style={{ color: Colors.light.primary }}>{stats.referralCount}</ThemedText>
              <ThemedText type="small" style={{ color: theme.textMuted }}>Friends Joined</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText type="h2" style={{ color: Colors.light.softGreen }}>{stats.rewardsEarned}</ThemedText>
              <ThemedText type="small" style={{ color: theme.textMuted }}>Months Earned</ThemedText>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <ThemedText type="small" style={{ marginBottom: Spacing.xs }}>
              {stats.progressToNextReward} / {stats.target} to next reward
            </ThemedText>
            <View style={[styles.progressBarBg, { backgroundColor: theme.backgroundSecondary }]}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: Colors.light.primary,
                    width: `${(stats.progressToNextReward / stats.target) * 100}%`
                  }
                ]}
              />
            </View>
          </View>
        </ThemedView>
      )}

      <ThemedView style={[styles.card, { backgroundColor: theme.backgroundDefault }]}>
        <ThemedText type="h3" style={styles.cardTitle}>Redeem a Code</ThemedText>
        <ThemedText type="body" style={{ color: theme.textMuted, marginBottom: Spacing.md }}>
          Have a code from a friend? Enter it here.
        </ThemedText>

        <TextInput
          style={[styles.input, {
            backgroundColor: theme.backgroundSecondary,
            color: theme.text,
            borderColor: theme.borderLight
          }]}
          placeholder="Enter referral code"
          placeholderTextColor={theme.textMuted}
          value={inputCode}
          onChangeText={setInputCode}
          autoCapitalize="characters"
        />

        <Button
          onPress={handleRedeem}
          disabled={redeeming || !inputCode}
          style={styles.redeemButton}
        >
          {redeeming ? "Redeeming..." : "Redeem Code"}
        </Button>
      </ThemedView>
    </ScreenScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  title: {
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    position: 'relative'
  },
  codeText: {
    letterSpacing: 2,
    fontWeight: "700",
  },
  copyButton: {
    position: "absolute",
    right: Spacing.md,
    padding: Spacing.sm,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: "center",
  },
  progressContainer: {
    marginTop: Spacing.sm,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  input: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    fontSize: 16,
    marginBottom: Spacing.md,
    textAlign: "center",
    fontWeight: "600",
  },
  redeemButton: {
    backgroundColor: Colors.light.softGreen,
  }
});
