/**
 * ProgressRing Component
 * Circular progress indicator with animated health score display
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/design-system';
import { getHealthScoreColor, getHealthScoreLabel } from '@/design-system/DesignSystem';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

// Animated Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ProgressRing({
  progress,
  size = 'md',
  strokeWidth,
  showLabel = true,
  label,
  animated = true,
}: ProgressRingProps) {
  const { colors, typography, componentTokens } = useTheme();
  const animatedProgress = useRef(new Animated.Value(0)).current;

  // Size configurations
  const sizeConfig = {
    sm: { diameter: 60, defaultStrokeWidth: 4, fontSize: typography.fontSize.lg },
    md: { diameter: 100, defaultStrokeWidth: 6, fontSize: typography.fontSize['3xl'] },
    lg: { diameter: 140, defaultStrokeWidth: 8, fontSize: typography.fontSize['4xl'] },
  };

  const config = sizeConfig[size];
  const finalStrokeWidth = strokeWidth ?? config.defaultStrokeWidth;
  const radius = (config.diameter - finalStrokeWidth) / 2;
  // Semi-circle: only use 180 degrees (half the circumference)
  const circumference = Math.PI * radius;
  const center = config.diameter / 2;

  // Get health score colors
  const healthColors = getHealthScoreColor(progress);
  const healthLabel = label ?? getHealthScoreLabel(progress);

  // Animate progress on mount or when progress changes
  useEffect(() => {
    if (animated) {
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      animatedProgress.setValue(progress);
    }
  }, [progress, animated, animatedProgress]);

  // Calculate stroke dash offset for progress (semi-circle)
  const progressValue = animatedProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View
      style={[styles.container, { width: config.diameter, height: config.diameter / 1.5 }]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: progress }}
      accessibilityLabel={`Health score: ${progress}${showLabel ? `, ${healthLabel}` : ''}`}
    >
      <Svg width={config.diameter} height={config.diameter}>
        {/* Background Semi-Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.neutral[200]}
          strokeWidth={finalStrokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          rotation="-90"
          origin={`${center}, ${center}`}
        />

        {/* Progress Semi-Circle */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={healthColors.icon}
          strokeWidth={finalStrokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progressValue}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      {/* Center Content */}
      <View style={styles.centerContent}>
        <Text
          style={[
            styles.progressText,
            {
              fontSize: config.fontSize,
              fontFamily: typography.fontFamily.mono,
              fontWeight: typography.fontWeight.bold,
              color: healthColors.text,
            },
          ]}
        >
          {Math.round(progress)}
        </Text>
        {showLabel && (
          <Text
            style={[
              styles.labelText,
              {
                fontSize: typography.fontSize.xs,
                fontFamily: typography.fontFamily.primary,
                fontWeight: typography.fontWeight.medium,
                color: healthColors.text,
              },
            ]}
          >
            {healthLabel}
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
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    textAlign: 'center',
  },
  labelText: {
    textAlign: 'center',
    marginTop: 2,
  },
});
