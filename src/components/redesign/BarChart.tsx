/**
 * BarChart Component
 * Simple column chart for displaying statistics over time
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, TextStyles } from '@/design-system';

export interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  maxValue?: number;
  height?: number;
  showValues?: boolean;
  unit?: string;
}

export default function BarChart({
  data,
  maxValue,
  height = 180,
  showValues = true,
  unit = '',
}: BarChartProps) {
  const { colors, spacing, borderRadius } = useTheme();

  // Calculate max value if not provided
  const calculatedMaxValue =
    maxValue || Math.max(...data.map((item) => item.value));

  // Calculate bar height based on value
  const getBarHeight = (value: number) => {
    const maxBarHeight = height - 40; // Reserve space for labels
    return (value / calculatedMaxValue) * maxBarHeight;
  };

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const barHeight = getBarHeight(item.value);
          const barColor = item.color || colors.primary[500];

          return (
            <View key={index} style={styles.barWrapper}>
              {/* Value Label on Top */}
              {showValues && (
                <Text
                  style={[
                    TextStyles.caption,
                    {
                      color: colors.neutral[900],
                      marginBottom: spacing.xs,
                      textAlign: 'center',
                    },
                  ]}
                >
                  {item.value}
                  {unit}
                </Text>
              )}

              {/* Bar Container */}
              <View style={[styles.barContainer, { height: height - 60 }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight,
                      backgroundColor: barColor,
                      borderRadius: borderRadius.sm,
                    },
                  ]}
                />
              </View>

              {/* Label Below Bar */}
              <Text
                style={[
                  TextStyles.caption,
                  {
                    color: colors.neutral[500],
                    marginTop: spacing.xs,
                    textAlign: 'center',
                  },
                ]}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flex: 1,
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  barContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    width: '100%',
    minHeight: 4,
  },
});
