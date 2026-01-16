/**
 * PetProfileScreenRedesign
 * Complete pet profile screen with health metrics and detailed information
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
import { Feather } from '@expo/vector-icons';
import { useTheme, CommonStyles, TextStyles } from '@/src/design-system';
import {
  PetAvatar,
  HealthMetricCard,
} from '@/src/components/redesign';

// Mock pet data
const MOCK_PET = {
  id: '1',
  name: 'Max',
  breed: 'Golden Retriever',
  age: 4,
  gender: 'Male',
  imageUri: undefined,
  healthScore: 92,
  metrics: {
    weight: { value: '8,3', unit: 'kg', status: 'attention' as const, percentage: 65 },
    coat: { value: '88', unit: '%', status: 'excellent' as const, percentage: 88 },
    energy: { value: '92', unit: '%', status: 'excellent' as const, percentage: 92 },
    face: { value: '85', unit: '%', status: 'excellent' as const, percentage: 85 },
  },
};

export default function PetProfileScreenRedesign() {
  const { colors, spacing, borderRadius } = useTheme();
  const [activeTab, setActiveTab] = useState<string>('General');

  const tabs = ['General', 'Appointments', 'Vaccines', 'Meds'];

  // Handler functions
  const handleBack = () => {
    console.log('Back pressed');
  };

  const handleEdit = () => {
    console.log('Edit pressed');
  };

  const handleMetricTap = (metric: string) => {
    console.log(`${metric} metric tapped`);
  };

  const handleProfileCompletion = () => {
    console.log('Profile completion banner tapped');
  };

  return (
    <SafeAreaView style={CommonStyles.container} edges={['top']}>
      {/* Decorative Blobs */}
      <View
        style={[
          styles.decorativeBlob,
          {
            backgroundColor: colors.primary[100],
            width: 200,
            height: 200,
            borderRadius: 100,
            top: -50,
            left: -70,
          },
        ]}
      />
      <View
        style={[
          styles.decorativeBlob,
          {
            backgroundColor: colors.accent[100],
            width: 250,
            height: 250,
            borderRadius: 125,
            bottom: 100,
            right: -100,
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
        <TouchableOpacity
          onPress={handleBack}
          style={[
            styles.headerButton,
            {
              backgroundColor: colors.neutral[50],
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Feather name="chevron-left" size={24} color={colors.neutral[700]} />
        </TouchableOpacity>

        <Text style={TextStyles.h3}>Profile</Text>

        <TouchableOpacity
          onPress={handleEdit}
          style={[
            styles.headerButton,
            {
              backgroundColor: colors.neutral[50],
              borderRadius: borderRadius.md,
            },
          ]}
        >
          <Feather name="edit-2" size={20} color={colors.neutral[700]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing['3xl'] + 60, // Account for tab bar
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Pet Info Section */}
        <View
          style={[
            styles.petInfoSection,
            { marginTop: spacing.xl, marginBottom: spacing.xl },
          ]}
        >
          {/* Pet Avatar with Health Badge */}
          <View style={styles.avatarContainer}>
            <PetAvatar
              imageUri={MOCK_PET.imageUri}
              size="xl"
              healthScore={MOCK_PET.healthScore}
            />
            {/* Health Score Badge */}
            <View
              style={[
                styles.healthBadge,
                {
                  backgroundColor: colors.primary[500],
                  paddingHorizontal: spacing.sm,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.full,
                  borderWidth: 3,
                  borderColor: colors.neutral.white,
                },
              ]}
            >
              <Text
                style={[
                  TextStyles.labelSmall,
                  { color: colors.neutral.white, fontWeight: '700' },
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
              { marginTop: spacing.md, textAlign: 'center' },
            ]}
          >
            {MOCK_PET.name}
          </Text>

          {/* Breed and Age */}
          <Text
            style={[
              TextStyles.body,
              { color: colors.neutral[500], textAlign: 'center', marginTop: spacing.xs },
            ]}
          >
            {MOCK_PET.breed} • {MOCK_PET.age} years old
          </Text>
        </View>

        {/* Tab Navigation */}
        <View
          style={[
            styles.tabNavigation,
            { marginBottom: spacing.xl, gap: spacing.sm },
          ]}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    activeTab === tab ? colors.primary[500] : colors.neutral[100],
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: borderRadius.lg,
                },
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  TextStyles.labelSmall,
                  {
                    color: activeTab === tab ? colors.neutral.white : colors.neutral[700],
                  },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Profile Completion Banner */}
        <TouchableOpacity
          onPress={handleProfileCompletion}
          style={[
            styles.completionBanner,
            {
              backgroundColor: colors.primary[50],
              borderRadius: borderRadius.xl,
              padding: spacing.md,
              marginBottom: spacing.xl,
            },
          ]}
          activeOpacity={0.7}
        >
          {/* Icon Circle */}
          <View
            style={[
              styles.bannerIcon,
              {
                backgroundColor: colors.primary[900],
                width: 40,
                height: 40,
                borderRadius: 20,
              },
            ]}
          >
            <Text style={styles.bannerEmoji}>🐾</Text>
          </View>

          {/* Message */}
          <Text
            style={[
              TextStyles.bodySmall,
              {
                color: colors.primary[900],
                flex: 1,
                marginHorizontal: spacing.md,
              },
            ]}
          >
            Complete pet profile to get more personalized recommendations
          </Text>

          {/* Arrow */}
          <Feather name="chevron-right" size={20} color={colors.primary[900]} />
        </TouchableOpacity>

        {/* Health Metrics Grid (2x2) */}
        <View style={[styles.metricsGrid, { marginBottom: spacing.xl }]}>
          {/* Row 1 */}
          <View style={[styles.metricsRow, { gap: spacing.md, marginBottom: spacing.md }]}>
            <View style={styles.metricCardWrapper}>
              <HealthMetricCard
                icon={<Text style={styles.metricEmoji}>⚖️</Text>}
                label="Weight"
                value={MOCK_PET.metrics.weight.value}
                unit={MOCK_PET.metrics.weight.unit}
                status={MOCK_PET.metrics.weight.status}
                percentage={MOCK_PET.metrics.weight.percentage}
                variant="compact"
                onPress={() => handleMetricTap('Weight')}
              />
            </View>
            <View style={styles.metricCardWrapper}>
              <HealthMetricCard
                icon={<Text style={styles.metricEmoji}>🐾</Text>}
                label="Coat"
                value={MOCK_PET.metrics.coat.value}
                unit={MOCK_PET.metrics.coat.unit}
                status={MOCK_PET.metrics.coat.status}
                percentage={MOCK_PET.metrics.coat.percentage}
                variant="compact"
                onPress={() => handleMetricTap('Coat')}
              />
            </View>
          </View>

          {/* Row 2 */}
          <View style={[styles.metricsRow, { gap: spacing.md }]}>
            <View style={styles.metricCardWrapper}>
              <HealthMetricCard
                icon={<Text style={styles.metricEmoji}>⚡</Text>}
                label="Energy"
                value={MOCK_PET.metrics.energy.value}
                unit={MOCK_PET.metrics.energy.unit}
                status={MOCK_PET.metrics.energy.status}
                percentage={MOCK_PET.metrics.energy.percentage}
                variant="compact"
                onPress={() => handleMetricTap('Energy')}
              />
            </View>
            <View style={styles.metricCardWrapper}>
              <HealthMetricCard
                icon={<Text style={styles.metricEmoji}>😊</Text>}
                label="Face"
                value={MOCK_PET.metrics.face.value}
                unit={MOCK_PET.metrics.face.unit}
                status={MOCK_PET.metrics.face.status}
                percentage={MOCK_PET.metrics.face.percentage}
                variant="compact"
                onPress={() => handleMetricTap('Face')}
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
                flex: 1,
              },
            ]}
          >
            <Text style={[TextStyles.h2, { marginBottom: spacing.sm }]}>♂️</Text>
            <Text
              style={[
                TextStyles.caption,
                { color: colors.neutral[500], marginBottom: spacing.xs },
              ]}
            >
              Gender
            </Text>
            <Text style={TextStyles.h3}>{MOCK_PET.gender}</Text>
          </View>

          {/* Age Card */}
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.neutral[50],
                padding: spacing.lg,
                borderRadius: borderRadius.xl,
                flex: 1,
              },
            ]}
          >
            <Text style={[TextStyles.h2, { marginBottom: spacing.sm }]}>🎂</Text>
            <Text
              style={[
                TextStyles.caption,
                { color: colors.neutral[500], marginBottom: spacing.xs },
              ]}
            >
              Age
            </Text>
            <Text style={TextStyles.h3}>{MOCK_PET.age} y.o.</Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  decorativeBlob: {
    position: 'absolute',
    opacity: 0.1,
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
  petInfoSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  healthBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  tabNavigation: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tab: {},
  completionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerEmoji: {
    fontSize: 20,
  },
  metricsGrid: {},
  metricsRow: {
    flexDirection: 'row',
  },
  metricCardWrapper: {
    flex: 1,
  },
  metricEmoji: {
    fontSize: 24,
  },
  basicInfoRow: {
    flexDirection: 'row',
  },
  infoCard: {},
});
