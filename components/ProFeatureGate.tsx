/**
 * Pro Feature Gate Component
 * Wraps premium features and shows paywall if user doesn't have access
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRevenueCatContext } from '../contexts/RevenueCatContext';
import PaywallScreen from '../screens/PaywallScreen';

interface ProFeatureGateProps {
  children: React.ReactNode;
  feature: string; // Name of the feature (for analytics/display)
  fallback?: React.ReactNode; // Optional custom fallback UI
}

/**
 * Wraps children with Pro access check
 * Shows paywall if user doesn't have Pro access
 */
export const ProFeatureGate: React.FC<ProFeatureGateProps> = ({
  children,
  feature,
  fallback,
}) => {
  const { isProUser } = useRevenueCatContext();
  const [showPaywall, setShowPaywall] = useState(false);

  // If user has Pro access, render children
  if (isProUser) {
    return <>{children}</>;
  }

  // If custom fallback provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback: locked feature message
  return (
    <>
      <View style={styles.lockedContainer}>
        <View style={styles.lockIcon}>
          <Text style={styles.lockEmoji}>🔒</Text>
        </View>
        <Text style={styles.lockedTitle}>Pro Feature</Text>
        <Text style={styles.lockedDescription}>
          {feature} is available in BarkWell Pro.
        </Text>
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => setShowPaywall(true)}
        >
          <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
        </TouchableOpacity>
      </View>

      {/* Paywall Modal */}
      <Modal
        visible={showPaywall}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPaywall(false)}
      >
        <PaywallScreen
          onDismiss={() => setShowPaywall(false)}
          onPurchaseSuccess={() => {
            setShowPaywall(false);
            // Feature will be unlocked automatically when component re-renders
          }}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8F9FA',
  },
  lockIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3E8EF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  lockEmoji: {
    fontSize: 40,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1D1F',
    marginBottom: 8,
    textAlign: 'center',
  },
  lockedDescription: {
    fontSize: 16,
    color: '#6F7787',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  upgradeButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ProFeatureGate;
