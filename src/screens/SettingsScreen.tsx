/**
 * SettingsScreen
 * Enhanced settings screen with Whisker design
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme, CommonStyles, TextStyles } from '@/design-system';
import { Card } from '@/src/components/redesign';

export default function SettingsScreen() {
  const { colors, spacing, borderRadius } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: 'user', label: 'Profile Settings', onPress: () => console.log('Profile') },
        { icon: 'shield', label: 'Privacy', onPress: () => console.log('Privacy') },
        { icon: 'lock', label: 'Security', onPress: () => console.log('Security') },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'bell',
          label: 'Notifications',
          toggle: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: 'moon',
          label: 'Dark Mode',
          toggle: true,
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled,
        },
        { icon: 'globe', label: 'Language', onPress: () => console.log('Language'), subtitle: 'English' },
      ],
    },
    {
      title: 'Pet Care',
      items: [
        { icon: 'calendar', label: 'Reminders', onPress: () => console.log('Reminders') },
        { icon: 'activity', label: 'Health Goals', onPress: () => console.log('Goals') },
        { icon: 'database', label: 'Backup Data', onPress: () => console.log('Backup') },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle', label: 'Help Center', onPress: () => console.log('Help') },
        { icon: 'mail', label: 'Contact Us', onPress: () => console.log('Contact') },
        { icon: 'star', label: 'Rate App', onPress: () => console.log('Rate') },
      ],
    },
    {
      title: 'About',
      items: [
        { icon: 'info', label: 'About Barkwell', onPress: () => console.log('About') },
        { icon: 'file-text', label: 'Terms of Service', onPress: () => console.log('Terms') },
        { icon: 'shield', label: 'Privacy Policy', onPress: () => console.log('Privacy Policy') },
        { icon: 'tag', label: 'Version', subtitle: '1.0.0', disabled: true },
      ],
    },
  ];

  return (
    <SafeAreaView style={CommonStyles.container} edges={['top']}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.neutral[200],
          },
        ]}
      >
        <Text style={[TextStyles.displaySmall, { color: colors.neutral[900] }]}>
          Settings
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: spacing['6xl'] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {settingsSections.map((section, sectionIndex) => (
          <View
            key={section.title}
            style={[
              styles.section,
              {
                marginBottom: spacing.xl,
              },
            ]}
          >
            <Text
              style={[
                TextStyles.label,
                {
                  color: colors.neutral[500],
                  marginBottom: spacing.md,
                  paddingHorizontal: spacing.xs,
                },
              ]}
            >
              {section.title.toUpperCase()}
            </Text>

            <Card variant="flat">
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.settingItem,
                    {
                      borderBottomWidth:
                        itemIndex < section.items.length - 1 ? 1 : 0,
                      borderBottomColor: colors.neutral[200],
                      paddingVertical: spacing.md,
                    },
                  ]}
                  onPress={item.onPress}
                  disabled={item.disabled || item.toggle}
                >
                  <View style={styles.settingLeft}>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor: colors.primary[500] + '15',
                          borderRadius: borderRadius.md,
                        },
                      ]}
                    >
                      <Feather
                        name={item.icon as any}
                        size={20}
                        color={colors.primary[500]}
                      />
                    </View>
                    <View style={styles.settingTextContainer}>
                      <Text
                        style={[
                          TextStyles.body,
                          {
                            color: item.disabled
                              ? colors.neutral[400]
                              : colors.neutral[900],
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {item.subtitle && (
                        <Text
                          style={[
                            TextStyles.bodySmall,
                            {
                              color: colors.neutral[500],
                              marginTop: spacing.xs,
                            },
                          ]}
                        >
                          {item.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>

                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{
                        false: colors.neutral[300],
                        true: colors.primary[500],
                      }}
                      thumbColor={colors.neutral.white}
                    />
                  ) : !item.disabled ? (
                    <Feather
                      name="chevron-right"
                      size={20}
                      color={colors.neutral[400]}
                    />
                  ) : null}
                </TouchableOpacity>
              ))}
            </Card>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: colors.semantic.error + '10',
              borderRadius: borderRadius.xl,
              padding: spacing.lg,
              marginTop: spacing.lg,
            },
          ]}
          onPress={() => console.log('Logout')}
        >
          <Feather name="log-out" size={20} color={colors.semantic.error} />
          <Text
            style={[
              TextStyles.label,
              {
                color: colors.semantic.error,
                marginLeft: spacing.sm,
              },
            ]}
          >
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  section: {},
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
