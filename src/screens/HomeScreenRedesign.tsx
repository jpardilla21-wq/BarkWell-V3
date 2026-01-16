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
import { Feather } from '@expo/vector-icons';
import { useTheme, CommonStyles, TextStyles } from '@/src/design-system';
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
  const [selectedPetId, setSelectedPetId] = useState<string>(MOCK_PETS[0].id);

  // Get selected pet
  const selectedPet = MOCK_PETS.find((pet) => pet.id === selectedPetId);

  // Handler functions
  const handleScan = () => {
    console.log('Scan my pet pressed');
  };

  const handleAppointment = () => {
    console.log('Add appointment pressed');
  };

  const handleViewDetails = () => {
    console.log('View details pressed');
  };

  const handleAddPet = () => {
    console.log('Add pet pressed');
  };

  return (
    <SafeAreaView style={CommonStyles.container} edges={['top']}>
      {/* Decorative Blob Background */}
      <View
        style={[
          styles.decorativeBlob,
          {
            backgroundColor: colors.primary[100],
            width: 250,
            height: 250,
            borderRadius: 125,
            top: -100,
            right: -80,
          },
        ]}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: spacing['3xl'] + 60 }, // Account for tab bar
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
              paddingHorizontal: spacing.lg,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <Text style={[TextStyles.displaySmall, { marginBottom: spacing.xs }]}>
              Good morning
            </Text>
            <Text style={[TextStyles.body, { color: colors.neutral[500] }]}>
              Let's check how are your pets today
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[
                styles.notificationButton,
                {
                  backgroundColor: colors.neutral.white,
                  borderRadius: borderRadius.full,
                },
              ]}
            >
              <Feather name="bell" size={20} color={colors.neutral[700]} />
              {/* Red dot indicator */}
              <View
                style={[
                  styles.notificationDot,
                  { backgroundColor: colors.semantic.error },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pet Selector */}
        <View style={{ marginBottom: spacing['2xl'] }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg }}
          >
            {MOCK_PETS.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                onPress={() => setSelectedPetId(pet.id)}
                style={[
                  styles.petItem,
                  { marginRight: spacing.lg },
                  selectedPetId === pet.id && {
                    opacity: 1,
                  },
                ]}
                activeOpacity={0.7}
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
                      textAlign: 'center',
                      color:
                        selectedPetId === pet.id
                          ? colors.neutral[900]
                          : colors.neutral[600],
                    },
                  ]}
                >
                  {pet.name}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Add Pet Button */}
            <TouchableOpacity
              onPress={handleAddPet}
              style={[styles.petItem, { marginRight: spacing.lg }]}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.addPetCircle,
                  {
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: colors.neutral[300],
                    borderStyle: 'dashed',
                    backgroundColor: colors.neutral[50],
                  },
                ]}
              >
                <Feather name="plus" size={32} color={colors.neutral[400]} />
              </View>
              <Text
                style={[
                  TextStyles.label,
                  {
                    marginTop: spacing.sm,
                    textAlign: 'center',
                    color: colors.neutral[600],
                  },
                ]}
              >
                Add
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View
          style={[
            styles.quickActions,
            {
              paddingHorizontal: spacing.lg,
              marginBottom: spacing['2xl'],
            },
          ]}
        >
          {/* Scan Button */}
          <TouchableOpacity
            onPress={handleScan}
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.primary[100],
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                minHeight: 100,
                flex: 1,
                marginRight: spacing.md,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>📷</Text>
            <Text
              style={[
                TextStyles.label,
                {
                  color: colors.primary[700],
                  marginTop: spacing.sm,
                },
              ]}
            >
              Scan my pet
            </Text>
          </TouchableOpacity>

          {/* Appointment Button */}
          <TouchableOpacity
            onPress={handleAppointment}
            style={[
              styles.actionCard,
              {
                backgroundColor: colors.secondary[50],
                borderRadius: borderRadius.xl,
                padding: spacing.lg,
                minHeight: 100,
                flex: 1,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.actionEmoji}>📅</Text>
            <Text
              style={[
                TextStyles.label,
                {
                  color: colors.secondary[700],
                  marginTop: spacing.sm,
                },
              ]}
            >
              Add appointment
            </Text>
          </TouchableOpacity>
        </View>

        {/* Latest Scan Section */}
        <View style={{ paddingHorizontal: spacing.lg }}>
          {/* Section Header */}
          <View
            style={[
              styles.sectionHeader,
              { marginBottom: spacing.lg },
            ]}
          >
            <Text style={TextStyles.h2}>Latest scan</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text
                style={[
                  TextStyles.label,
                  {
                    color: colors.primary[500],
                  },
                ]}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Scan Card */}
          {selectedPet && (
            <Card variant="elevated" style={{ alignItems: 'center' }}>
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
                <View style={{ marginLeft: spacing.md, flex: 1 }}>
                  <Text style={TextStyles.label}>{selectedPet.name}</Text>
                  <Text
                    style={[
                      TextStyles.bodySmall,
                      { color: colors.neutral[500] },
                    ]}
                  >
                    2 hours ago
                  </Text>
                </View>
              </View>

              {/* Progress Ring */}
              <ProgressRing
                progress={selectedPet.healthScore}
                size="lg"
                animated={true}
              />

              {/* View Details Button */}
              <Button
                onPress={handleViewDetails}
                variant="primary"
                size="md"
                style={{ marginTop: spacing.xl, width: '100%' }}
                rightIcon={<Feather name="arrow-right" size={18} color={colors.neutral.white} />}
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
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    marginLeft: 16,
  },
  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  petItem: {
    alignItems: 'center',
    opacity: 0.6,
  },
  addPetCircle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActions: {
    flexDirection: 'row',
  },
  actionCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  petInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
});
