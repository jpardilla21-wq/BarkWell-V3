/**
 * ActionDialog Component
 * Modal dialog for camera/photo selection
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

interface ActionDialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  onCamera: () => void;
  onGallery: () => void;
}

export default function ActionDialog({
  visible,
  onClose,
  title,
  onCamera,
  onGallery,
}: ActionDialogProps) {
  const { colors, spacing, borderRadius } = useTheme();

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

            {/* Camera Option */}
            <TouchableOpacity
              style={[
                styles.option,
                {
                  backgroundColor: colors.secondary[100], // Light green
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                  marginBottom: spacing.md,
                },
              ]}
              onPress={() => {
                onCamera();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Feather
                name="camera"
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
                Open Camera
              </Text>
              <Feather
                name="chevron-right"
                size={24}
                color={colors.neutral[400]}
              />
            </TouchableOpacity>

            {/* Gallery Option */}
            <TouchableOpacity
              style={[
                styles.option,
                {
                  backgroundColor: colors.secondary[50], // Light purple
                  borderRadius: borderRadius.xl,
                  padding: spacing.lg,
                  marginBottom: spacing.lg,
                },
              ]}
              onPress={() => {
                onGallery();
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Feather
                name="image"
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
                Select from Photos
              </Text>
              <Feather
                name="chevron-right"
                size={24}
                color={colors.neutral[400]}
              />
            </TouchableOpacity>

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
