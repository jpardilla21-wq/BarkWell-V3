/**
 * ActionDialog Component
 * Flexible modal dialog for action selection
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme, TextStyles } from '@/design-system';

export interface ActionOption {
  icon: string;
  label: string;
  onPress: () => void;
}

interface ActionDialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: ActionOption[];
}

export default function ActionDialog({
  visible,
  onClose,
  title,
  options,
}: ActionDialogProps) {
  const { colors, spacing, borderRadius } = useTheme();

  const getBackgroundColor = (index: number) => {
    // Alternate between light green and light purple
    return index % 2 === 0 ? colors.secondary[100] : colors.secondary[50];
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.dialogContainer}>
          <Pressable
            style={[
              styles.dialog,
              {
                backgroundColor: colors.neutral.white,
                borderRadius: borderRadius['2xl'],
                padding: spacing.xl,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <Text
              style={[
                TextStyles.h3,
                {
                  color: colors.neutral[900],
                  marginBottom: spacing.lg,
                  textAlign: 'center',
                },
              ]}
            >
              {title}
            </Text>

            {/* Options */}
            {options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.option,
                  {
                    backgroundColor: getBackgroundColor(index),
                    borderRadius: borderRadius.xl,
                    padding: spacing.lg,
                    marginBottom: index < options.length - 1 ? spacing.md : spacing.lg,
                  },
                ]}
                onPress={() => {
                  option.onPress();
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Feather
                  name={option.icon as any}
                  size={24}
                  color={colors.neutral[900]}
                  style={{ marginRight: spacing.md }}
                />
                <Text
                  style={[
                    TextStyles.h4,
                    {
                      color: colors.neutral[900],
                      flex: 1,
                    },
                  ]}
                >
                  {option.label}
                </Text>
                <Feather
                  name="chevron-right"
                  size={24}
                  color={colors.neutral[400]}
                />
              </TouchableOpacity>
            ))}

            {/* Cancel Button */}
            <TouchableOpacity
              style={[
                styles.cancelButton,
                {
                  padding: spacing.md,
                },
              ]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  TextStyles.label,
                  {
                    color: colors.neutral[500],
                    textAlign: 'center',
                  },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '85%',
    maxWidth: 400,
  },
  dialog: {
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {},
});
