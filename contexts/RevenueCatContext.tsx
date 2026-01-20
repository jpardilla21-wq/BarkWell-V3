/**
 * RevenueCat Context Provider
 * Initializes RevenueCat and provides subscription state to the app
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { revenueCatService } from '../services/RevenueCatService';
import { Alert } from 'react-native';

interface RevenueCatContextType {
  isConfigured: boolean;
  isProUser: boolean;
  refreshProStatus: () => Promise<void>;
}

const RevenueCatContext = createContext<RevenueCatContextType>({
  isConfigured: false,
  isProUser: false,
  refreshProStatus: async () => {},
});

export const useRevenueCatContext = () => useContext(RevenueCatContext);

interface RevenueCatProviderProps {
  children: ReactNode;
  userId?: string; // Optional: provide user ID if available
}

export const RevenueCatProvider: React.FC<RevenueCatProviderProps> = ({
  children,
  userId,
}) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isProUser, setIsProUser] = useState(false);

  /**
   * Check Pro access status
   */
  const refreshProStatus = async () => {
    try {
      const hasAccess = await revenueCatService.hasProAccess();
      setIsProUser(hasAccess);
      console.log(`Pro status: ${hasAccess ? 'Active' : 'Inactive'}`);
    } catch (error) {
      console.error('Failed to check Pro status:', error);
      setIsProUser(false);
    }
  };

  /**
   * Initialize RevenueCat on mount
   */
  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        console.log('🚀 Initializing RevenueCat...');

        // Configure RevenueCat
        await revenueCatService.configure(userId);
        setIsConfigured(true);

        // Check initial Pro status
        await refreshProStatus();

        console.log('✅ RevenueCat initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize RevenueCat:', error);

        // Show error alert in development
        if (__DEV__) {
          Alert.alert(
            'RevenueCat Error',
            'Failed to initialize RevenueCat. Subscription features may not work correctly.',
            [{ text: 'OK' }]
          );
        }
      }
    };

    initializeRevenueCat();
  }, [userId]);

  /**
   * Update user ID if it changes
   */
  useEffect(() => {
    if (isConfigured && userId) {
      revenueCatService.identifyUser(userId).catch((error) => {
        console.error('Failed to identify user:', error);
      });
    }
  }, [userId, isConfigured]);

  const value: RevenueCatContextType = {
    isConfigured,
    isProUser,
    refreshProStatus,
  };

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};
