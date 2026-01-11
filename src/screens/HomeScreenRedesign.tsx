/**
 * HomeScreenRedesign
 * Complete home screen following Whisker design aesthetic
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
  Button,
  PetAvatar,
  ProgressRing,
} from '@/src/components/redesign';

// Mock data for pets
interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  imageUri?: string;
  healthScore: number;
}

const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Max',
    breed: 'Golden Retriever',
    age: 3,
    imageUri: undefined,
    healthScore: 92,
  },
  {
    id: '2',
    name: 'Bella',
    breed: 'French Bulldog',
    age: 2,
    imageUri: undefined,
    healthScore: 78,
  },
  {
    id: '3',
    name: 'Charlie',
    breed: 'Labrador',
    age: 5,
    imageUri: undefined,
    healthScore: 85,
  },
];

export default function HomeScreenRedesign() {
  const { colors, spacing, borderRadius } = useTheme();
  const navigation = useNavigation();
  const [selectedPetId, setSelectedPetId] = useState<string>(MOCK_PETS[0].id);

  // Get selected pet
  const selectedPet = MOCK_PETS.find((pet) => pet.id === selectedPetId);

  // Quick action buttons data
  const quickActions = [
    { id: 1, icon: '📷', title: 'Scan my pet', subtitle: 'Quick health check', onPress: () => console.log('Scan') },
    { id: 2, icon: '📅', title: 'Add appointment', subtitle: 'Schedule vet visit', onPress: () => console.log('Appointment') },
    { id: 3, icon: '🎥', title: 'Record video', subtitle: 'Track behavior', onPress: () => console.log('Video') },
    { id: 4, icon: '🍖', title: 'Food scanner', subtitle: 'Check ingredients', onPress: () => console.log('Food') },
    { id: 5, icon: '💊', title: 'Medications', subtitle: 'Track meds', onPress: () => console.log('Meds') },
    { id: 6, icon: '💉', title: 'Vaccines', subtitle: 'Schedule shots', onPress: () => console.log('Vaccines') },
    { id: 7, icon: '📊', title: 'Weekly report', subtitle: 'View insights', onPress: () => console.log('Report') },
    { id: 8, icon: '🐕', title: 'Add pet', subtitle: 'New companion', onPress: () => console.log('Add pet') },
  ];

  // Handler functions
  const handleViewDetails = () => {
    console.log('View details pressed for pet:', selectedPetId);
    // Navigate to Pet Profile screen for testing
    navigation.navigate('PetProfileNew' as never);
  };

  const handleAddPet = () => {
    console.log('Add pet pressed');
  };

  return (
    <SafeAreaView style={CommonStyles.container} edges={['top']}>
      {/* Decorative Background Blob */}
      <View
        style={[
          styles.decorativeBlob,
          {
            backgroundColor: colors.secondary[100], // Light green accent
            opacity: 0.3,
          },
        ]}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: spacing['6xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View
          style={[
            styles.header,
            {
              marginTop: spacing.lg,
              marginBottom: spacing.xl,
            },
          ]}
        >
          <View style={styles.headerText}>
            <Text style={[TextStyles.displaySmall, { color: colors.neutral[900] }]}>
              Good morning
            </Text>
            <Text
              style={[
                TextStyles.body,
                {
                  color: colors.neutral[900], // All text same color
                  marginTop: spacing.xs,
                },
              ]}
            >
              Let's check how are your pets today
            </Text>
          </View>

          {/* Notification Button */}
          <TouchableOpacity
            style={[
              styles.notificationButton,
              {
                backgroundColor: colors.neutral.white,
                borderRadius: borderRadius.lg,
              },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Feather name="bell" size={24} color={colors.neutral[900]} />
            {/* Red dot indicator */}
            <View
              style={[
                styles.notificationDot,
                { backgroundColor: colors.semantic.error },
              ]}
            />
          </TouchableOpacity>
        </View>

        {/* Pet Selector */}
        <View
          style={[
            styles.petSelectorContainer,
            { marginBottom: spacing.xl },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.petSelectorContent}
          >
            {MOCK_PETS.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={[styles.petItem, { marginRight: spacing.lg }]}
                onPress={() => setSelectedPetId(pet.id)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={`Select ${pet.name}`}
                accessibilityState={{ selected: selectedPetId === pet.id }}
              >
                <PetAvatar
                  imageUri={pet.imageUri}
                  size="lg"
                  healthScore={pet.healthScore}
                  selected={selectedPetId === pet.id}
                />
                <Text
                  style={[
                    TextStyles.label,
                    {
                      marginTop: spacing.sm,
                      color: colors.neutral[900], // All text same color
                      fontWeight: selectedPetId === pet.id ? '600' : '400',
                    },
                  ]}
                >
                  {pet.name}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Add Pet Button */}
            <TouchableOpacity
              style={[styles.petItem, { marginRight: spacing.lg }]}
              onPress={handleAddPet}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Add new pet"
            >
              <View
                style={[
                  styles.addPetCircle,
                  {
                    borderColor: colors.neutral[300],
                    borderRadius: borderRadius.full,
                  },
                ]}
              >
                <Text style={[styles.addIcon, { color: colors.neutral[400] }]}>
                  +
                </Text>
              </View>
              <Text
                style={[
                  TextStyles.label,
                  {
                    marginTop: spacing.sm,
                    color: colors.neutral[900], // All text same color
                  },
                ]}
              >
                Add
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Quick Action Cards - Horizontal Scroll */}
        <View style={[styles.quickActionsContainer, { marginBottom: spacing.xl }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContent}
          >
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.quickActionCard,
                  {
                    backgroundColor: index % 2 === 0
                      ? colors.secondary[100] // EDF9D4 - light green (even index)
                      : colors.secondary[50],  // F3ECFE - light purple (odd index)
                    borderRadius: borderRadius.xl,
                    padding: spacing.lg,
                    marginRight: spacing.md,
                  },
                ]}
                onPress={action.onPress}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={action.title}
              >
                <Text style={styles.actionIcon}>{action.icon}</Text>
                <Text
                  style={[
                    TextStyles.h4,
                    {
                      color: colors.neutral[900],
                      marginTop: spacing.sm,
                    },
                  ]}
                >
                  {action.title}
                </Text>
                <Text
                  style={[
                    TextStyles.bodySmall,
                    {
                      color: colors.neutral[900],
                      marginTop: spacing.xs,
                    },
                  ]}
                >
                  {action.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Latest Scan Section */}
        <View style={[styles.latestScanContainer, { marginBottom: spacing.xl }]}>
          {/* Section Header */}
          <View style={[styles.sectionHeader, { marginBottom: spacing.md }]}>
            <Text style={[TextStyles.h2, { color: colors.neutral[900] }]}>
              Latest scan
            </Text>
            <TouchableOpacity
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="See all scans"
            >
              <Text
                style={[
                  TextStyles.label,
                  {
                    color: colors.neutral[900], // All text same color
                  },
                ]}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Latest Scan Card */}
          {selectedPet && (
            <Card variant="elevated">
              {/* Pet Info Row */}
              <View
                style={[
                  styles.petInfoRow,
                  { marginBottom: spacing.lg },
                ]}
              >
                <PetAvatar
                  imageUri={selectedPet.imageUri}
                  size="sm"
                  healthScore={selectedPet.healthScore}
                />
                <View style={[styles.petInfo, { marginLeft: spacing.md }]}>
                  <Text style={[TextStyles.label, { color: colors.neutral[900] }]}>
                    {selectedPet.name}
                  </Text>
                  <Text
                    style={[TextStyles.bodySmall, { color: colors.neutral[900] }]} // All text same color
                  >
                    Today, 09:30 AM
                  </Text>
                </View>
              </View>

              {/* Progress Ring */}
              <View style={[styles.progressRingContainer, { marginBottom: spacing.lg }]}>
                <ProgressRing
                  progress={selectedPet.healthScore}
                  size="lg"
                  showLabel={true}
                  animated={true}
                />
              </View>

              {/* View Details Button */}
              <Button
                variant="primary"
                size="md"
                fullWidth
                onPress={handleViewDetails}
                rightIcon={<Text style={styles.arrowIcon}>→</Text>}
              >
                View details
              </Button>
            </Card>
          )}
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
    paddingHorizontal: 24,
  },
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
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  notificationButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 24,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  petSelectorContainer: {},
  petSelectorContent: {
    paddingRight: 24,
  },
  petItem: {
    alignItems: 'center',
  },
  addPetCircle: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 40,
    fontWeight: '300',
  },
  quickActionsContainer: {},
  quickActionsContent: {
    paddingRight: 24,
  },
  quickActionCard: {
    width: 180,
    minHeight: 120,
  },
  actionIcon: {
    fontSize: 32,
  },
  latestScanContainer: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petInfo: {
    flex: 1,
  },
  progressRingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});
