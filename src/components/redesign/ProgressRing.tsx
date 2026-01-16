/**
 * ProgressRing Component
 * Circular progress indicator with health score visualization
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/src/design-system';
import { getHealthScoreColor, getHealthScoreLabel } from '@/src/design-system/DesignSystem';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export default function ProgressRing({
  progress,
  size = 'md',
  strokeWidth,
  showLabel = true,
  label,
  animated = true,
}: ProgressRingProps) {
  const { colors, typography, spacing, componentTokens } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Get ring size
  const getRingSize = (): number => {
    switch (size) {
      case 'sm':
        return componentTokens.progressRing.size.sm;
      case 'md':
        return componentTokens.progressRing.size.md;
      case 'lg':
        return componentTokens.progressRing.size.lg;
      default:
        return componentTokens.progressRing.size.md;
    }
  };

  // Get stroke width
  const getStrokeWidth = (): number => {
    if (strokeWidth) return strokeWidth;
    switch (size) {
      case 'sm':
        return componentTokens.progressRing.strokeWidth.sm;
      case 'md':
        return componentTokens.progressRing.strokeWidth.md;
      case 'lg':
        return componentTokens.progressRing.strokeWidth.lg;
      default:
        return componentTokens.progressRing.strokeWidth.md;
    }
  };

  const ringSize = getRingSize();
  const stroke = getStrokeWidth();
  const radius = (ringSize - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const center = ringSize / 2;

  // Get color based on health score
  const healthColor = getHealthScoreColor(progress);
  const statusLabel = label || getHealthScoreLabel(progress);

  // Animate progress
  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      animatedValue.setValue(progress);
    }
  }, [progress, animated, animatedValue]);

  // Calculate stroke dash offset
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={[styles.container, { width: ringSize, height: ringSize }]}>
      <Svg width={ringSize} height={ringSize} style={styles.svg}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.neutral[200]}
          strokeWidth={stroke}
          fill="none"
        />

        {/* Progress Circle */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={healthColor.border}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      {/* Center Content */}
      <View style={styles.centerContent}>
        <Text
          style={[
            styles.progressNumber,
            {
              fontSize: size === 'sm' ? typography.fontSize['2xl'] : typography.fontSize['3xl'],
              fontFamily: typography.fontFamily.mono,
              fontWeight: typography.fontWeight.bold,
              color: colors.neutral[900],
            },
          ]}
        >
          {Math.round(progress)}
        </Text>
        {showLabel && (
          <Text
            style={[
              styles.label,
              {
                fontSize: size === 'sm' ? typography.fontSize.xs : typography.fontSize.sm,
                fontFamily: typography.fontFamily.primary,
                fontWeight: typography.fontWeight.medium,
                color: colors.neutral[600],
                marginTop: size === 'sm' ? spacing.xs / 2 : spacing.xs,
              },
            ]}
          >
            {statusLabel}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressNumber: {
    textAlign: 'center',
  },
  label: {
    textAlign: 'center',
  },
});
