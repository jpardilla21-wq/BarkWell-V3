/**
 * Customer Center Screen
 * Allows users to manage their subscriptions using RevenueCat Customer Center
 */

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RevenueCatUI, CUSTOMER_CENTER_RESULT } from 'react-native-purchases-ui';
import { useRevenueCat } from '../hooks/useRevenueCat';

interface CustomerCenterScreenProps {
  onDismiss?: () => void;
}

export const CustomerCenterScreen: React.FC<CustomerCenterScreenProps> = ({
  onDismiss,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isProUser, refreshCustomerInfo } = useRevenueCat();

  /**
   * Handle Customer Center result
   */
  const handleCustomerCenterResult = async (result: typeof CUSTOMER_CENTER_RESULT[keyof typeof CUSTOMER_CENTER_RESULT]) => {
    console.log('Customer Center result:', result);

    switch (result) {
      case CUSTOMER_CENTER_RESULT.CANCELLED:
        // User dismissed Customer Center
        console.log('User cancelled Customer Center');
        onDismiss?.();
        break;

      case CUSTOMER_CENTER_RESULT.ERROR:
        // Error occurred
        Alert.alert(
          'Error',
          'Something went wrong. Please try again.',
          [{ text: 'OK', onPress: onDismiss }]
        );
        break;

      case CUSTOMER_CENTER_RESULT.SUBSCRIPTION_UPDATED:
        // Subscription was updated (e.g., cancelled, renewed)
        setIsLoading(true);
        try {
          await refreshCustomerInfo();
          Alert.alert(
            'Subscription Updated',
            'Your subscription has been updated successfully.',
            [{ text: 'OK', onPress: onDismiss }]
          );
        } catch (error) {
          console.error('Error refreshing customer info:', error);
        } finally {
          setIsLoading(false);
        }
        break;

      default:
        console.log('Unknown Customer Center result:', result);
        onDismiss?.();
    }
  };

  if (!isProUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notSubscribedContainer}>
          <Text style={styles.notSubscribedTitle}>Not Subscribed</Text>
          <Text style={styles.notSubscribedText}>
            You don't have an active subscription yet.
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onDismiss}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Updating...</Text>
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

      {/* RevenueCat Customer Center */}
      <RevenueCatUI.CustomerCenter
        onDismiss={handleCustomerCenterResult}
      />
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
  notSubscribedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  notSubscribedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  notSubscribedText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default CustomerCenterScreen;
