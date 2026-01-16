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
import { useTheme } from '@/src/design-system';
import { getHealthScoreColor } from '@/src/design-system/DesignSystem';

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
  const { colors, componentTokens } = useTheme();

  // Get avatar size
  const getAvatarSize = (): number => {
    switch (size) {
      case 'sm':
        return 40;
      case 'md':
        return 60;
      case 'lg':
        return 100;
      case 'xl':
        return 140;
      default:
        return 60;
    }
  };

  // Get health score color if score is provided
  const healthColor = healthScore !== undefined
    ? getHealthScoreColor(healthScore).border
    : colors.neutral[300];

  // Get border width
  const borderWidth = selected
    ? componentTokens.avatar.borderWidth + 2
    : componentTokens.avatar.borderWidth;

  // Get badge size based on avatar size
  const getBadgeSize = (): number => {
    const avatarSize = getAvatarSize();
    return Math.max(12, avatarSize * 0.2);
  };

  const avatarSize = getAvatarSize();
  const badgeSize = getBadgeSize();

  const content = (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
        },
        style,
      ]}
    >
      {/* Avatar with border */}
      <View
        style={[
          styles.avatarBorder,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            borderWidth: borderWidth,
            borderColor: healthColor,
          },
        ]}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.image,
              {
                width: avatarSize - borderWidth * 2,
                height: avatarSize - borderWidth * 2,
                borderRadius: (avatarSize - borderWidth * 2) / 2,
              },
            ] as ImageStyle}
            accessibilityLabel="Pet avatar"
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              {
                width: avatarSize - borderWidth * 2,
                height: avatarSize - borderWidth * 2,
                borderRadius: (avatarSize - borderWidth * 2) / 2,
                backgroundColor: colors.neutral[200],
              },
            ]}
          />
        )}
      </View>

      {/* Health score badge */}
      {healthScore !== undefined && (
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              backgroundColor: healthColor,
              borderColor: colors.neutral.white,
              bottom: 0,
              right: 0,
            },
          ]}
        />
      )}
    </View>
  );

  // Wrap in TouchableOpacity if onPress is provided
  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Pet avatar button"
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarBorder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    borderWidth: 2,
  },
});
