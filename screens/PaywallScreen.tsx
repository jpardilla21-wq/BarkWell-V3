/**
 * Paywall Screen
 * Displays RevenueCat Paywall UI for subscription purchase
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  RevenueCatUI,
  PAYWALL_RESULT,
  type PaywallResult,
} from 'react-native-purchases-ui';
import { revenueCatService } from '../services/RevenueCatService';

interface PaywallScreenProps {
  onDismiss?: () => void;
  onPurchaseSuccess?: () => void;
  onRestoreSuccess?: () => void;
}

export const PaywallScreen: React.FC<PaywallScreenProps> = ({
  onDismiss,
  onPurchaseSuccess,
  onRestoreSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle paywall result
   */
  const handlePaywallResult = async (result: PaywallResult) => {
    console.log('Paywall result:', result);

    switch (result) {
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        // Purchase or restore successful
        setIsLoading(true);

        try {
          // Refresh customer info to get latest entitlements
          const customerInfo = await revenueCatService.getCustomerInfo();
          const hasProAccess = await revenueCatService.hasProAccess();

          if (hasProAccess) {
            Alert.alert(
              '🎉 Welcome to BarkWell Pro!',
              'You now have access to all premium features.',
              [
                {
                  text: 'Get Started',
                  onPress: () => {
                    if (result === PAYWALL_RESULT.PURCHASED) {
                      onPurchaseSuccess?.();
                    } else {
                      onRestoreSuccess?.();
                    }
                    onDismiss?.();
                  },
                },
              ]
            );
          } else {
            Alert.alert(
              'Purchase Successful',
              'Your purchase was completed, but Pro access is not yet active. Please try again in a moment.',
              [{ text: 'OK', onPress: onDismiss }]
            );
          }
        } catch (error) {
          console.error('Error checking Pro access:', error);
          Alert.alert(
            'Error',
            'Failed to verify your purchase. Please restart the app.',
            [{ text: 'OK', onPress: onDismiss }]
          );
        } finally {
          setIsLoading(false);
        }
        break;

      case PAYWALL_RESULT.CANCELLED:
        // User dismissed the paywall
        console.log('User cancelled paywall');
        onDismiss?.();
        break;

      case PAYWALL_RESULT.ERROR:
        // Error occurred
        Alert.alert(
          'Purchase Error',
          'Something went wrong. Please try again.',
          [{ text: 'OK' }]
        );
        break;

      case PAYWALL_RESULT.NOT_PRESENTED:
        // Paywall was not presented (user already has access)
        console.log('Paywall not presented - user already has access');
        onDismiss?.();
        break;

      default:
        console.log('Unknown paywall result:', result);
        onDismiss?.();
    }
  };

  /**
   * Handle manual restore
   */
  const handleRestore = async () => {
    try {
      setIsLoading(true);
      const customerInfo = await revenueCatService.restorePurchases();

      const hasProAccess = customerInfo.entitlements.active['pawer Pro'] !== undefined;

      if (hasProAccess) {
        Alert.alert(
          '✅ Purchases Restored!',
          'Your Pro subscription has been restored.',
          [
            {
              text: 'Continue',
              onPress: () => {
                onRestoreSuccess?.();
                onDismiss?.();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'We couldn\'t find any previous purchases to restore.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Restore error:', error);
      Alert.alert(
        'Restore Failed',
        error.message || 'Failed to restore purchases. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Processing...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Close Button */}
      {onDismiss && (
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onDismiss}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}

      {/* RevenueCat Paywall */}
      <RevenueCatUI.Paywall
        options={{
          // Optional: specify offering ID if not using default
          // offeringIdentifier: 'your_offering_id',
        }}
        onPurchaseStarted={() => {
          console.log('Purchase started');
          setIsLoading(true);
        }}
        onPurchaseCompleted={() => {
          console.log('Purchase completed');
          setIsLoading(false);
        }}
        onPurchaseError={(error) => {
          console.error('Purchase error:', error);
          setIsLoading(false);
        }}
        onRestoreStarted={() => {
          console.log('Restore started');
          setIsLoading(true);
        }}
        onRestoreCompleted={() => {
          console.log('Restore completed');
          setIsLoading(false);
        }}
        onRestoreError={(error) => {
          console.error('Restore error:', error);
          setIsLoading(false);
        }}
        onDismiss={handlePaywallResult}
      />

      {/* Manual Restore Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isLoading}
        >
          <Text style={styles.restoreButtonText}>
            Already purchased? Restore Purchases
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1000,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default PaywallScreen;
