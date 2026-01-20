/**
 * RevenueCat Configuration
 * Centralized configuration for RevenueCat SDK
 */

import { Platform } from 'react-native';

export const RevenueCatConfig = {
  // API Keys
  apiKey: Platform.select({
    ios: 'test_MXWebbdbJtwxgRMVXlCHkssmRQQ', // iOS API key
    android: 'test_MXWebbdbJtwxgRMVXlCHkssmRQQ', // Android API key (replace with actual key if different)
  }) as string,

  // Entitlement identifiers (must match RevenueCat dashboard)
  entitlements: {
    pro: 'pawer Pro', // Premium entitlement identifier
  },

  // Product identifiers (must match App Store Connect / Google Play Console)
  products: {
    monthly: 'monthly',
    yearly: 'yearly',
    lifetime: 'lifetime',
  },

  // Offering identifier (optional, 'default' offering used if not specified)
  defaultOffering: 'default',

  // Enable debug logging in development
  enableDebugLogging: __DEV__,

  // User attributes to sync with RevenueCat
  userAttributes: {
    syncOnPurchase: true,
    customAttributes: [
      'email',
      'displayName',
      'appVersion',
    ],
  },
} as const;

// Type definitions for better TypeScript support
export type EntitlementIdentifier = keyof typeof RevenueCatConfig.entitlements;
export type ProductIdentifier = keyof typeof RevenueCatConfig.products;
