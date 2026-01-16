/**
 * HealthMetricCard Component
 * Displays individual health metrics with status indicators
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/src/design-system';
import { getHealthScoreColor } from '@/src/design-system/DesignSystem';

type HealthStatus = 'excellent' | 'good' | 'attention' | 'warning' | 'critical';

interface HealthMetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  status: HealthStatus;
  statusLabel?: string;
  percentage?: number;
  onPress?: () => void;
  variant?: 'compact' | 'detailed';
}

export default function HealthMetricCard({
  icon,
  label,
  value,
  unit,
  status,
  statusLabel,
  percentage,
  onPress,
  variant = 'compact',
}: HealthMetricCardProps) {
  const { colors, typography, spacing, borderRadius } = useTheme();

  // Get status colors
  const getStatusScore = (): number => {
    switch (status) {
      case 'excellent':
        return 95;
      case 'good':
        return 80;
      case 'attention':
        return 60;
      case 'warning':
        return 40;
      case 'critical':
        return 20;
      default:
        return 50;
    }
  };

  const statusScore = getStatusScore();
  const statusColors = getHealthScoreColor(statusScore);

  // Auto-generate status label if not provided
  const displayStatusLabel = statusLabel || status.charAt(0).toUpperCase() + status.slice(1);

  const content =
    variant === 'compact' ? (
      <View style={styles.compactContainer}>
        {/* Icon Circle */}
        <View
          style={[
            styles.iconCircle,
            {
              backgroundColor: statusColors.background,
              marginBottom: spacing.md,
            },
          ]}
        >
          {icon}
        </View>

        {/* Label */}
        <Text
          style={[
            styles.label,
            {
              fontSize: typography.fontSize.sm,
              fontFamily: typography.fontFamily.primary,
              fontWeight: typography.fontWeight.medium,
              color: colors.neutral[700],
              marginBottom: spacing.xs,
            },
          ]}
        >
          {label}
        </Text>

        {/* Value with Unit */}
        <View style={styles.valueRow}>
          <Text
            style={[
              styles.value,
              {
                fontSize: typography.fontSize.xl,
                fontFamily: typography.fontFamily.mono,
                fontWeight: typography.fontWeight.bold,
                color: colors.neutral[900],
              },
            ]}
          >
            {value}
          </Text>
          {unit && (
            <Text
              style={[
                styles.unit,
                {
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.primary,
                  color: colors.neutral[600],
                  marginLeft: spacing.xs / 2,
                },
              ]}
            >
              {unit}
            </Text>
          )}
        </View>

        {/* Percentage if provided */}
        {percentage !== undefined && (
          <Text
            style={[
              styles.percentage,
              {
                fontSize: typography.fontSize.xs,
                fontFamily: typography.fontFamily.primary,
                color: colors.neutral[500],
                marginTop: spacing.xs / 2,
              },
            ]}
          >
            {percentage}%
          </Text>
        )}

        {/* Status Label */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusColors.background,
              borderColor: statusColors.border,
              marginTop: spacing.sm,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                fontSize: typography.fontSize.xs,
                fontFamily: typography.fontFamily.primary,
                fontWeight: typography.fontWeight.medium,
                color: statusColors.text,
              },
            ]}
          >
            {displayStatusLabel}
          </Text>
        </View>
      </View>
    ) : (
      <View style={styles.detailedContainer}>
        {/* Left Side: Icon + Label */}
        <View style={styles.detailedLeft}>
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: statusColors.background,
                marginRight: spacing.md,
              },
            ]}
          >
            {icon}
          </View>
          <View>
            <Text
              style={[
                styles.label,
                {
                  fontSize: typography.fontSize.base,
                  fontFamily: typography.fontFamily.primary,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.neutral[900],
                  marginBottom: spacing.xs / 2,
                },
              ]}
            >
              {label}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: statusColors.background,
                  borderColor: statusColors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    fontSize: typography.fontSize.xs,
                    fontFamily: typography.fontFamily.primary,
                    fontWeight: typography.fontWeight.medium,
                    color: statusColors.text,
                  },
                ]}
              >
                {displayStatusLabel}
              </Text>
            </View>
          </View>
        </View>

        {/* Right Side: Value + Percentage */}
        <View style={styles.detailedRight}>
          <View style={styles.valueRow}>
            <Text
              style={[
                styles.value,
                {
                  fontSize: typography.fontSize['2xl'],
                  fontFamily: typography.fontFamily.mono,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                },
              ]}
            >
              {value}
            </Text>
            {unit && (
              <Text
                style={[
                  styles.unit,
                  {
                    fontSize: typography.fontSize.base,
                    fontFamily: typography.fontFamily.primary,
                    color: colors.neutral[600],
                    marginLeft: spacing.xs,
                  },
                ]}
              >
                {unit}
              </Text>
            )}
          </View>
          {percentage !== undefined && (
            <Text
              style={[
                styles.percentage,
                {
                  fontSize: typography.fontSize.sm,
                  fontFamily: typography.fontFamily.primary,
                  color: colors.neutral[500],
                  marginTop: spacing.xs / 2,
                },
              ]}
            >
              {percentage}%
            </Text>
          )}
        </View>

        {/* Arrow Indicator */}
        {onPress && (
          <Text
            style={[
              styles.arrow,
              {
                fontSize: typography.fontSize['2xl'],
                color: colors.neutral[400],
                marginLeft: spacing.md,
              },
            ]}
          >
            ›
          </Text>
        )}
      </View>
    );

  const containerStyle: ViewStyle =
    variant === 'compact'
      ? {
          minHeight: 120,
          padding: spacing.md,
          backgroundColor: colors.neutral[50],
          borderRadius: borderRadius.xl,
        }
      : {
          padding: spacing.lg,
          backgroundColor: colors.neutral.white,
          borderRadius: borderRadius.lg,
        };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.touchable, containerStyle]}
        accessibilityRole="button"
        accessibilityLabel={`${label} metric`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  touchable: {
    overflow: 'hidden',
  },
  compactContainer: {
    alignItems: 'center',
  },
  detailedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailedRight: {
    alignItems: 'flex-end',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {},
  unit: {},
  percentage: {},
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {},
  arrow: {
    fontWeight: '300',
  },
});
