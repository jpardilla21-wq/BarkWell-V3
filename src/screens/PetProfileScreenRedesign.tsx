/**
 * PetProfileScreenRedesign
 * Complete pet profile screen with detailed health metrics
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme, CommonStyles, TextStyles } from '@/design-system';
import {
  PetAvatar,
  HealthMetricCard,
} from '@/src/components/redesign';

// Mock pet data
interface PetProfile {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: 'Male' | 'Female';
  imageUri?: string;
  healthScore: number;
  weight: {
    value: number;
    unit: string;
    status: 'excellent' | 'good' | 'attention' | 'warning' | 'critical';
  };
  coat: {
    percentage: number;
    status: 'excellent' | 'good' | 'attention' | 'warning' | 'critical';
  };
  energy: {
    percentage: number;
    status: 'excellent' | 'good' | 'attention' | 'warning' | 'critical';
  };
  face: {
    percentage: number;
    status: 'excellent' | 'good' | 'attention' | 'warning' | 'critical';
  };
}

const MOCK_PET: PetProfile = {
  id: '1',
  name: 'Max',
  breed: 'Golden Retriever',
  age: 4,
  gender: 'Male',
  imageUri: undefined,
  healthScore: 88,
  weight: {
    value: 8.3,
    unit: 'kg',
    status: 'attention',
  },
  coat: {
    percentage: 88,
    status: 'excellent',
  },
  energy: {
    percentage: 92,
    status: 'excellent',
  },
  face: {
    percentage: 85,
    status: 'excellent',
  },
};

type TabType = 'General' | 'Appointments' | 'Vaccines' | 'Meds';

export default function PetProfileScreenRedesign() {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>('General');

  // Handler functions
  const handleBack = () => {
    console.log('Back pressed');
    navigation.goBack();
  };

  const handleEdit = () => {
    console.log('Edit pressed');
  };

  const handleWeightPress = () => {
    console.log('Weight metric pressed');
  };

  const handleCoatPress = () => {
    console.log('Coat metric pressed');
  };

  const handleEnergyPress = () => {
    console.log('Energy metric pressed');
  };

  const handleFacePress = () => {
    console.log('Face metric pressed');
  };

  const handleProfileCompletion = () => {
    console.log('Profile completion pressed');
  };

  return (
    <SafeAreaView style={CommonStyles.container} edges={['top']}>
      {/* Decorative Blobs */}
      <View
        style={[
          styles.decorativeBlobTop,
          {
            backgroundColor: colors.primary[100],
            opacity: 0.1,
          },
        ]}
      />
      <View
        style={[
          styles.decorativeBlobBottom,
          {
            backgroundColor: colors.accent[100],
            opacity: 0.1,
          },
        ]}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.neutral[200],
          },
        ]}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={[
            styles.headerButton,
            {
              backgroundColor: colors.neutral[50],
              borderRadius: borderRadius.md,
            },
          ]}
          onPress={handleBack}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={[TextStyles.h3, { color: colors.neutral[900] }]}>
          Profile
        </Text>

        {/* Edit Button */}
        <TouchableOpacity
          style={[
            styles.headerButton,
            {
              backgroundColor: colors.neutral[50],
              borderRadius: borderRadius.md,
            },
          ]}
          onPress={handleEdit}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
        >
          <Text style={styles.editIcon}>✎</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing['6xl'],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Pet Info Section */}
        <View
          style={[
            styles.petInfoSection,
            {
              marginTop: spacing.xl,
              marginBottom: spacing.xl,
            },
          ]}
        >
          {/* Avatar with Health Score Badge */}
          <View style={styles.avatarContainer}>
            <PetAvatar
              imageUri={MOCK_PET.imageUri}
              size="xl"
              healthScore={MOCK_PET.healthScore}
            />

            {/* Health Score Badge */}
            <View
              style={[
                styles.healthScoreBadge,
                {
                  backgroundColor: colors.status.excellent.icon,
                  borderRadius: borderRadius.full,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderWidth: 3,
                  borderColor: colors.neutral.white,
                },
              ]}
            >
              <Text
                style={[
                  TextStyles.labelSmall,
                  {
                    color: colors.neutral.white,
                    fontWeight: typography.fontWeight.bold,
                  },
                ]}
              >
                {MOCK_PET.healthScore}%
              </Text>
            </View>
          </View>

          {/* Pet Name */}
          <Text
            style={[
              TextStyles.displaySmall,
              {
                color: colors.neutral[900],
                marginTop: spacing.md,
                textAlign: 'center',
              },
            ]}
          >
            {MOCK_PET.name}
          </Text>

          {/* Breed and Age */}
          <Text
            style={[
              TextStyles.body,
              {
                color: colors.neutral[500],
                marginTop: spacing.xs,
                textAlign: 'center',
              },
            ]}
          >
            {MOCK_PET.breed} • {MOCK_PET.age} years old
          </Text>
        </View>

        {/* Tab Navigation */}
        <View
          style={[
            styles.tabNavigation,
            {
              gap: spacing.sm,
              marginBottom: spacing.xl,
            },
          ]}
        >
          {(['General', 'Appointments', 'Vaccines', 'Meds'] as TabType[]).map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  {
                    backgroundColor:
                      activeTab === tab
                        ? colors.primary[500]
                        : colors.neutral[100],
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.lg,
                  },
                ]}
                onPress={() => setActiveTab(tab)}
                accessible={true}
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === tab }}
                accessibilityLabel={tab}
              >
                <Text
                  style={[
                    TextStyles.labelSmall,
                    {
                      color:
                        activeTab === tab
                          ? colors.neutral.white
                          : colors.neutral[700],
                      fontWeight: typography.fontWeight.semibold,
                    },
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {/* Profile Completion Banner */}
        <TouchableOpacity
          style={[
            styles.profileCompletionBanner,
            {
              backgroundColor: colors.primary[50],
              borderRadius: borderRadius.xl,
              padding: spacing.md,
              gap: spacing.md,
              marginBottom: spacing.xl,
            },
          ]}
          onPress={handleProfileCompletion}
          activeOpacity={0.7}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Complete pet profile"
        >
          {/* Icon Circle */}
          <View
            style={[
              styles.bannerIconCircle,
              {
                backgroundColor: colors.primary[900],
                borderRadius: borderRadius.full,
              },
            ]}
          >
            <Text style={styles.bannerIcon}>🐾</Text>
          </View>

          {/* Message Text */}
          <Text
            style={[
              TextStyles.bodySmall,
              {
                color: colors.primary[800],
                flex: 1,
              },
            ]}
          >
            Complete pet profile to get more personalized recommendations
          </Text>

          {/* Arrow */}
          <Text
            style={[
              styles.bannerArrow,
              {
                color: colors.primary[600],
                fontSize: typography.fontSize.xl,
              },
            ]}
          >
            ›
          </Text>
        </TouchableOpacity>

        {/* Health Metrics Grid (2x2) */}
        <View style={[styles.healthMetricsGrid, { marginBottom: spacing.xl }]}>
          {/* Row 1: Weight and Coat */}
          <View style={[styles.metricsRow, { gap: spacing.md, marginBottom: spacing.md }]}>
            <View style={styles.metricCardWrapper}>
              <HealthMetricCard
                icon={<Text style={styles.metricIcon}>⚖️</Text>}
                label="Weight"
                value={MOCK_PET.weight.value.toFixed(1).replace('.', ',')}
                unit={MOCK_PET.weight.unit}
                status={MOCK_PET.weight.status}
                variant="compact"
                onPress={handleWeightPress}
              />
            </View>
            <View style={styles.metricCardWrapper}>
              <HealthMetricCard
                icon={<Text style={styles.metricIcon}>🐾</Text>}
                label="Coat"
                value={MOCK_PET.coat.percentage}
                unit="%"
                percentage={MOCK_PET.coat.percentage}
                status={MOCK_PET.coat.status}
                variant="compact"
                onPress={handleCoatPress}
              />
            </View>
          </View>

          {/* Row 2: Energy and Face */}
          <View style={[styles.metricsRow, { gap: spacing.md }]}>
            <View style={styles.metricCardWrapper}>
              <HealthMetricCard
                icon={<Text style={styles.metricIcon}>⚡</Text>}
                label="Energy"
                value={MOCK_PET.energy.percentage}
                unit="%"
                percentage={MOCK_PET.energy.percentage}
                status={MOCK_PET.energy.status}
                variant="compact"
                onPress={handleEnergyPress}
              />
            </View>
            <View style={styles.metricCardWrapper}>
              <HealthMetricCard
                icon={<Text style={styles.metricIcon}>😊</Text>}
                label="Face"
                value={MOCK_PET.face.percentage}
                unit="%"
                percentage={MOCK_PET.face.percentage}
                status={MOCK_PET.face.status}
                variant="compact"
                onPress={handleFacePress}
              />
            </View>
          </View>
        </View>

        {/* Basic Info Cards (2 columns) */}
        <View style={[styles.basicInfoRow, { gap: spacing.md }]}>
          {/* Gender Card */}
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.neutral[50],
                padding: spacing.lg,
                borderRadius: borderRadius.xl,
              },
            ]}
          >
            <Text style={[TextStyles.h2, { marginBottom: spacing.sm }]}>
              ♂️
            </Text>
            <Text
              style={[
                TextStyles.caption,
                {
                  color: colors.neutral[500],
                  marginBottom: spacing.xs,
                },
              ]}
            >
              Gender
            </Text>
            <Text style={[TextStyles.h3, { color: colors.neutral[900] }]}>
              {MOCK_PET.gender}
            </Text>
          </View>

          {/* Age Card */}
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.neutral[50],
                padding: spacing.lg,
                borderRadius: borderRadius.xl,
              },
            ]}
          >
            <Text style={[TextStyles.h2, { marginBottom: spacing.sm }]}>
              🎂
            </Text>
            <Text
              style={[
                TextStyles.caption,
                {
                  color: colors.neutral[500],
                  marginBottom: spacing.xs,
                },
              ]}
            >
              Age
            </Text>
            <Text style={[TextStyles.h3, { color: colors.neutral[900] }]}>
              {MOCK_PET.age} y.o.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
  decorativeBlobTop: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    zIndex: -1,
  },
  decorativeBlobBottom: {
    position: 'absolute',
    bottom: 100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    fontWeight: '300',
    color: '#424242',
  },
  editIcon: {
    fontSize: 18,
    color: '#424242',
  },
  petInfoSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  healthScoreBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  tabNavigation: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCompletionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconCircle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIcon: {
    fontSize: 20,
  },
  bannerArrow: {
    lineHeight: 24,
  },
  healthMetricsGrid: {},
  metricsRow: {
    flexDirection: 'row',
  },
  metricCardWrapper: {
    flex: 1,
  },
  metricIcon: {
    fontSize: 24,
  },
  basicInfoRow: {
    flexDirection: 'row',
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
  },
});
