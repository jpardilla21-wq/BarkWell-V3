/**
 * PetAvatar Component
 * Circular pet image with health score indicator
 */

import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { useTheme } from '@/design-system';
import { getHealthScoreColor } from '@/design-system/DesignSystem';

interface PetAvatarProps {
  imageUri?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  healthScore?: number;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
}

export default function PetAvatar({
  imageUri,
  size = 'md',
  healthScore,
  selected = false,
  onPress,
  style,
}: PetAvatarProps) {
  const { colors, borderRadius } = useTheme();

  // Size configurations (diameter in pixels)
  const sizeConfig = {
    sm: { diameter: 40, borderWidth: 2, badgeSize: 12 },
    md: { diameter: 60, borderWidth: 3, badgeSize: 16 },
    lg: { diameter: 100, borderWidth: 4, badgeSize: 20 },
    xl: { diameter: 140, borderWidth: 5, badgeSize: 24 },
  };

  const config = sizeConfig[size];

  // Get border color based on health score
  const getBorderColor = (): string => {
    if (healthScore !== undefined) {
      const healthColors = getHealthScoreColor(healthScore);
      return healthColors.border;
    }
    return colors.neutral[300];
  };

  // Get badge background color based on health score
  const getBadgeColor = (): string => {
    if (healthScore !== undefined) {
      const healthColors = getHealthScoreColor(healthScore);
      return healthColors.icon;
    }
    return colors.neutral[400];
  };

  const avatarStyles: ViewStyle = {
    width: config.diameter,
    height: config.diameter,
    borderRadius: borderRadius.full,
    borderWidth: selected ? config.borderWidth * 1.5 : config.borderWidth,
    borderColor: getBorderColor(),
  };

  const imageStyles: ImageStyle = {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.full,
  };

  const badgeStyles: ViewStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: config.badgeSize,
    height: config.badgeSize,
    borderRadius: borderRadius.full,
    backgroundColor: getBadgeColor(),
    borderWidth: 2,
    borderColor: colors.neutral.white,
  };

  const content = (
    <View
      style={[styles.container, avatarStyles, style]}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel="Pet avatar"
    >
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={imageStyles}
          resizeMode="cover"
          accessible={true}
          accessibilityIgnoresInvertColors={true}
        />
      ) : (
        <View
          style={[
            imageStyles,
            {
              backgroundColor: colors.neutral[200],
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          {/* Placeholder icon or text could go here */}
        </View>
      )}

      {healthScore !== undefined && (
        <View
          style={badgeStyles}
          accessible={true}
          accessibilityLabel={`Health score: ${healthScore}`}
        />
      )}
    </View>
  );

  // If onPress is provided, wrap in TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Select pet"
        accessibilityState={{ selected }}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
});
