/**
 * PetProfileScreenRedesign
 * Simplified pet profile screen with Barkwell's actual features
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
import { Feather } from '@expo/vector-icons';
import { useTheme, CommonStyles, TextStyles } from '@/design-system';
import {
  Card,
  PetAvatar,
  ProgressRing,
} from '@/src/components/redesign';

// Mock pet data - will be replaced with real data from context
interface PetProfile {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender?: 'Male' | 'Female';
  imageUri?: string;
  healthScore: number;
}

const MOCK_PET: PetProfile = {
  id: '1',
  name: 'Max',
  breed: 'Golden Retriever',
  age: 4,
  gender: 'Male',
  imageUri: undefined,
  healthScore: 88,
};

// Recent activity data
const RECENT_ACTIVITIES = [
  {
    id: '1',
    type: 'poop',
    title: 'Poop Check',
    date: 'Today, 9:30 AM',
    result: 'Normal',
    icon: 'check-circle',
  },
  {
    id: '2',
    type: 'behavior',
    title: 'Behavior Check',
    date: 'Yesterday, 4:15 PM',
    result: 'Playful',
    icon: 'activity',
  },
  {
    id: '3',
    type: 'food',
    title: 'Food Scanner',
    date: '2 days ago',
    result: 'Safe',
    icon: 'search',
  },
];

export default function PetProfileScreenRedesign() {
  const { colors, spacing, borderRadius } = useTheme();
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    console.log('Edit pressed');
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'poop':
        return colors.accent[500];
      case 'behavior':
        return colors.primary[500];
      case 'food':
        return colors.secondary[500];
      default:
        return colors.neutral[500];
    }
  };

  return (
    <SafeAreaView style={CommonStyles.container} edges={['top']}>
      {/* Decorative Blob */}
      <View
        style={[
          styles.decorativeBlob,
          {
            backgroundColor: colors.secondary[100],
            opacity: 0.3,
          },
        ]}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor: colors.neutral.white,
              borderRadius: borderRadius.lg,
            },
          ]}
          onPress={handleBack}
        >
          <Feather name="arrow-left" size={24} color={colors.neutral[900]} />
        </TouchableOpacity>

        <Text style={[TextStyles.h3, { color: colors.neutral[900] }]}>
          Pet Profile
        </Text>

        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor: colors.neutral.white,
              borderRadius: borderRadius.lg,
            },
          ]}
          onPress={handleEdit}
        >
          <Feather name="edit-2" size={20} color={colors.neutral[900]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: spacing['6xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Pet Info Section */}
        <View style={[styles.petInfoSection, { marginBottom: spacing.xl }]}>
          {/* Avatar with Health Score */}
          <View style={styles.avatarContainer}>
            <PetAvatar
              imageUri={MOCK_PET.imageUri}
              size="xl"
              healthScore={MOCK_PET.healthScore}
            />
          </View>

          {/* Pet Details */}
          <View style={[styles.petDetails, { marginTop: spacing.lg }]}>
            <Text style={[TextStyles.displaySmall, { color: colors.neutral[900], textAlign: 'center' }]}>
              {MOCK_PET.name}
            </Text>
            <Text style={[TextStyles.body, { color: colors.neutral[500], textAlign: 'center', marginTop: spacing.xs }]}>
              {MOCK_PET.breed}
            </Text>
            <View style={[styles.infoRow, { marginTop: spacing.md }]}>
              <View style={styles.infoItem}>
                <Text style={[TextStyles.bodySmall, { color: colors.neutral[500] }]}>Age</Text>
                <Text style={[TextStyles.h3, { color: colors.neutral[900], marginTop: spacing.xs }]}>
                  {MOCK_PET.age} yrs
                </Text>
              </View>
              {MOCK_PET.gender && (
                <View style={styles.infoItem}>
                  <Text style={[TextStyles.bodySmall, { color: colors.neutral[500] }]}>Gender</Text>
                  <Text style={[TextStyles.h3, { color: colors.neutral[900], marginTop: spacing.xs }]}>
                    {MOCK_PET.gender}
                  </Text>
                </View>
              )}
              <View style={styles.infoItem}>
                <Text style={[TextStyles.bodySmall, { color: colors.neutral[500] }]}>Health</Text>
                <Text style={[TextStyles.h3, { color: colors.primary[500], marginTop: spacing.xs }]}>
                  {MOCK_PET.healthScore}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Health Score Card */}
        <View style={[styles.section, { marginBottom: spacing.xl }]}>
          <Text style={[TextStyles.h2, { color: colors.neutral[900], marginBottom: spacing.md }]}>
            Overall Health
          </Text>
          <Card variant="elevated">
            <View style={styles.healthScoreContent}>
              <ProgressRing
                progress={MOCK_PET.healthScore}
                size="lg"
                showLabel={true}
                animated={true}
              />
              <Text style={[TextStyles.body, { color: colors.neutral[500], marginTop: spacing.md, textAlign: 'center' }]}>
                Based on recent checkups and activity
              </Text>
            </View>
          </Card>
        </View>

        {/* Recent Activity */}
        <View style={[styles.section, { marginBottom: spacing.xl }]}>
          <View style={[styles.sectionHeader, { marginBottom: spacing.md }]}>
            <Text style={[TextStyles.h2, { color: colors.neutral[900] }]}>
              Recent Activity
            </Text>
            <TouchableOpacity>
              <Text style={[TextStyles.label, { color: colors.neutral[900] }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {RECENT_ACTIVITIES.map((activity, index) => (
            <TouchableOpacity
              key={activity.id}
              style={[
                styles.activityItem,
                {
                  marginBottom: index < RECENT_ACTIVITIES.length - 1 ? spacing.sm : 0,
                },
              ]}
            >
              <View
                style={[
                  styles.activityIcon,
                  {
                    backgroundColor: getActivityColor(activity.type) + '20',
                    borderRadius: borderRadius.md,
                  },
                ]}
              >
                <Feather
                  name={activity.icon as any}
                  size={20}
                  color={getActivityColor(activity.type)}
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={[TextStyles.label, { color: colors.neutral[900] }]}>
                  {activity.title}
                </Text>
                <Text style={[TextStyles.bodySmall, { color: colors.neutral[500], marginTop: spacing.xs }]}>
                  {activity.date} • {activity.result}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.neutral[400]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[TextStyles.h2, { color: colors.neutral[900], marginBottom: spacing.md }]}>
            Quick Actions
          </Text>
          <View style={[styles.quickActions, { gap: spacing.sm }]}>
            <TouchableOpacity
              style={[
                styles.quickActionButton,
                {
                  backgroundColor: colors.secondary[100],
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                },
              ]}
            >
              <Feather name="camera" size={24} color={colors.neutral[900]} />
              <Text style={[TextStyles.label, { color: colors.neutral[900], marginTop: spacing.sm }]}>
                New Scan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickActionButton,
                {
                  backgroundColor: colors.secondary[50],
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                },
              ]}
            >
              <Feather name="calendar" size={24} color={colors.neutral[900]} />
              <Text style={[TextStyles.label, { color: colors.neutral[900], marginTop: spacing.sm }]}>
                Schedule
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickActionButton,
                {
                  backgroundColor: colors.secondary[100],
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                },
              ]}
            >
              <Feather name="bar-chart-2" size={24} color={colors.neutral[900]} />
              <Text style={[TextStyles.label, { color: colors.neutral[900], marginTop: spacing.sm }]}>
                Reports
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  decorativeBlob: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  petInfoSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: 16,
  },
  petDetails: {},
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  infoItem: {
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthScoreContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },
  activityIcon: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
});
