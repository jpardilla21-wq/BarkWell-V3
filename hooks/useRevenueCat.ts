/**
 * useRevenueCat Hook
 * Custom hook for managing RevenueCat subscriptions in React Native
 */

import { useState, useEffect, useCallback } from 'react';
import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
} from 'react-native-purchases';
import { revenueCatService } from '../services/RevenueCatService';
import { RevenueCatConfig } from '../services/RevenueCatConfig';

interface UseRevenueCatReturn {
  // Customer state
  customerInfo: CustomerInfo | null;
  isProUser: boolean;
  isLoading: boolean;

  // Offerings
  offerings: PurchasesOfferings | null;
  currentOffering: PurchasesPackage[] | null;

  // Subscription details
  subscriptionStatus: {
    isSubscribed: boolean;
    productIdentifier: string | null;
    expirationDate: string | null;
    willRenew: boolean;
  };

  // Actions
  purchasePackage: (pkg: PurchasesPackage) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
  refreshCustomerInfo: () => Promise<void>;

  // Error state
  error: string | null;
}

export const useRevenueCat = (): UseRevenueCatReturn => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived state
  const isProUser = customerInfo?.entitlements.active[RevenueCatConfig.entitlements.pro] !== undefined;
  const currentOffering = offerings?.current?.availablePackages ?? null;

  const subscriptionStatus = {
    isSubscribed: isProUser,
    productIdentifier: customerInfo?.entitlements.active[RevenueCatConfig.entitlements.pro]?.productIdentifier ?? null,
    expirationDate: customerInfo?.entitlements.active[RevenueCatConfig.entitlements.pro]?.expirationDate ?? null,
    willRenew: customerInfo?.entitlements.active[RevenueCatConfig.entitlements.pro]?.willRenew ?? false,
  };

  /**
   * Refresh customer info from RevenueCat
   */
  const refreshCustomerInfo = useCallback(async () => {
    try {
      setError(null);
      const info = await revenueCatService.getCustomerInfo();
      setCustomerInfo(info);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch customer info');
      console.error('Error fetching customer info:', err);
    }
  }, []);

  /**
   * Load offerings
   */
  const loadOfferings = useCallback(async () => {
    try {
      setError(null);
      const fetchedOfferings = await revenueCatService.getOfferings();
      setOfferings(fetchedOfferings);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch offerings');
      console.error('Error fetching offerings:', err);
    }
  }, []);

  /**
   * Purchase a package
   */
  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const result = await revenueCatService.purchasePackage(pkg);
      setCustomerInfo(result.customerInfo);

      return result.success;
    } catch (err: any) {
      if (!err.userCancelled) {
        setError(err.message || 'Purchase failed');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Restore purchases
   */
  const restorePurchases = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);

      const info = await revenueCatService.restorePurchases();
      setCustomerInfo(info);
    } catch (err: any) {
      setError(err.message || 'Failed to restore purchases');
      console.error('Error restoring purchases:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    const initialize = async () => {
      setIsLoading(true);

      try {
        await refreshCustomerInfo();
        await loadOfferings();
      } catch (err) {
        console.error('Error initializing RevenueCat hook:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  /**
   * Listen for customer info updates
   */
  useEffect(() => {
    const listener = Purchases.addCustomerInfoUpdateListener((info) => {
      console.log('Customer info updated:', info);
      setCustomerInfo(info);
    });

    return () => {
      listener.remove();
    };
  }, []);

  return {
    customerInfo,
    isProUser,
    isLoading,
    offerings,
    currentOffering,
    subscriptionStatus,
    purchasePackage,
    restorePurchases,
    refreshCustomerInfo,
    error,
  };
};
