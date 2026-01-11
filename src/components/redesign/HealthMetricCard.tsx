/**
 * HealthMetricCard Component
 * Displays individual health metrics with compact and detailed variants
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/design-system';
import { getHealthScoreColor } from '@/design-system/DesignSystem';

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

  // Get status colors based on the status prop
  const getStatusColors = () => {
    // Map status to a score for color calculation
    const statusScores = {
      excellent: 95,
      good: 80,
      attention: 60,
      warning: 40,
      critical: 20,
    };
    return getHealthScoreColor(statusScores[status]);
  };

  const statusColors = getStatusColors();

  // Auto-generate status label if not provided
  const finalStatusLabel = statusLabel ?? status.charAt(0).toUpperCase() + status.slice(1);

  // Render compact variant (for grid layouts)
  const renderCompact = () => (
    <View style={[styles.compactContainer, { backgroundColor: colors.neutral[50] }]}>
      {/* Icon in colored circle */}
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: statusColors.background,
            borderColor: statusColors.border,
          },
        ]}
      >
        {icon}
      </View>

      {/* Label */}
      <Text
        style={[
          styles.compactLabel,
          {
            fontFamily: typography.fontFamily.primary,
            fontSize: typography.fontSize.sm,
            fontWeight: typography.fontWeight.medium,
            color: colors.neutral[700],
          },
        ]}
      >
        {label}
      </Text>

      {/* Value + Unit */}
      <View style={styles.valueContainer}>
        <Text
          style={[
            styles.compactValue,
            {
              fontFamily: typography.fontFamily.mono,
              fontSize: typography.fontSize['2xl'],
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
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.medium,
                color: colors.neutral[600],
              },
            ]}
          >
            {unit}
          </Text>
        )}
      </View>

      {/* Percentage (if provided) */}
      {percentage !== undefined && (
        <Text
          style={[
            styles.percentage,
            {
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.regular,
              color: statusColors.text,
            },
          ]}
        >
          {percentage > 0 ? '+' : ''}{percentage}%
        </Text>
      )}

      {/* Status Label */}
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
              fontFamily: typography.fontFamily.primary,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.semibold,
              color: statusColors.text,
            },
          ]}
        >
          {finalStatusLabel}
        </Text>
      </View>

      {/* Arrow indicator (if onPress provided) */}
      {onPress && (
        <View style={styles.arrowContainer}>
          <Text
            style={[
              styles.arrow,
              {
                color: colors.neutral[400],
                fontSize: typography.fontSize.xl,
              },
            ]}
          >
            ›
          </Text>
        </View>
      )}
    </View>
  );

  // Render detailed variant (for list layouts)
  const renderDetailed = () => (
    <View style={[styles.detailedContainer, { backgroundColor: colors.neutral.white }]}>
      {/* Left side: Icon + Label */}
      <View style={styles.detailedLeft}>
        <View
          style={[
            styles.detailedIconCircle,
            {
              backgroundColor: statusColors.background,
              borderColor: statusColors.border,
            },
          ]}
        >
          {icon}
        </View>
        <View style={styles.detailedLabelContainer}>
          <Text
            style={[
              styles.detailedLabel,
              {
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.base,
                fontWeight: typography.fontWeight.semibold,
                color: colors.neutral[900],
              },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.detailedStatus,
              {
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.medium,
                color: statusColors.text,
              },
            ]}
          >
            {finalStatusLabel}
          </Text>
        </View>
      </View>

      {/* Right side: Value + Percentage */}
      <View style={styles.detailedRight}>
        <View style={styles.detailedValueRow}>
          <Text
            style={[
              styles.detailedValue,
              {
                fontFamily: typography.fontFamily.mono,
                fontSize: typography.fontSize.xl,
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
                styles.detailedUnit,
                {
                  fontFamily: typography.fontFamily.primary,
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.medium,
                  color: colors.neutral[600],
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
              styles.detailedPercentage,
              {
                fontFamily: typography.fontFamily.primary,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.medium,
                color: statusColors.text,
              },
            ]}
          >
            {percentage > 0 ? '+' : ''}{percentage}%
          </Text>
        )}
      </View>

      {/* Arrow indicator (if onPress provided) */}
      {onPress && (
        <Text
          style={[
            styles.detailedArrow,
            {
              color: colors.neutral[400],
              fontSize: typography.fontSize['2xl'],
            },
          ]}
        >
          ›
        </Text>
      )}
    </View>
  );

  const content = variant === 'compact' ? renderCompact() : renderDetailed();

  // Wrap in TouchableOpacity if onPress is provided
  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          variant === 'compact' ? styles.compactTouchable : styles.detailedTouchable,
          { borderRadius: borderRadius.xl },
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}${unit ?? ''}, ${finalStatusLabel}`}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  // Compact variant styles
  compactContainer: {
    minHeight: 120,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compactTouchable: {
    overflow: 'hidden',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  compactLabel: {
    textAlign: 'center',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  compactValue: {
    textAlign: 'center',
  },
  unit: {
    marginLeft: 4,
  },
  percentage: {
    textAlign: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    textAlign: 'center',
  },
  arrowContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  arrow: {
    lineHeight: 20,
  },

  // Detailed variant styles
  detailedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    minHeight: 80,
  },
  detailedTouchable: {
    overflow: 'hidden',
  },
  detailedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailedIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailedLabelContainer: {
    flex: 1,
  },
  detailedLabel: {
    marginBottom: 4,
  },
  detailedStatus: {},
  detailedRight: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  detailedValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  detailedValue: {},
  detailedUnit: {
    marginLeft: 4,
  },
  detailedPercentage: {},
  detailedArrow: {
    lineHeight: 24,
  },
});
