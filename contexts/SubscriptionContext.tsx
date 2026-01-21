import React, { createContext, useContext, useState, useEffect } from "react";
import { Platform } from "react-native";
import { CustomerInfo, PurchasesPackage } from "react-native-purchases";
import { initRevenueCat, getCustomerInfo, checkEntitlement } from "@/services/revenueCat";

type SubscriptionTier = "free" | "plus" | "pro";

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isLoading: boolean;
  expiry: string | null;
  refreshStatus: () => Promise<void>;
  checkPermission: (requiredTier: SubscriptionTier) => boolean;
  isPro: boolean; // Explicit check for 'pawer Pro'
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined
);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return context;
};

// Tier hierarchy for permission checking
// Mapping 'pawer Pro' to 'pro' tier in our app
const TIER_LEVELS = {
  free: 0,
  plus: 1,
  pro: 2,
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [expiry, setExpiry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  // Initialize RevenueCat
  useEffect(() => {
    const init = async () => {
      // Initialize without specific user ID for anonymous, or pass one if auth exists
      // For now, anonymous is fine or use hardcoded '1' if we want consistency with Phase 3
      await initRevenueCat('1');
      await refreshStatus();
    };
    init();
  }, []);

  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        // Fallback or skip for web
        setTier("free");
      } else {
        const info = await getCustomerInfo();
        setCustomerInfo(info);

        const hasPro = checkEntitlement(info);

        if (hasPro) {
          setTier("pro");
          // Optionally extract expiry from entitlement if needed
        } else {
          setTier("free");
        }
      }
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPermission = (requiredTier: SubscriptionTier): boolean => {
    const userLevel = TIER_LEVELS[tier] || 0;
    const requiredLevel = TIER_LEVELS[requiredTier] || 0;
    return userLevel >= requiredLevel;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        tier,
        isLoading,
        expiry,
        refreshStatus,
        checkPermission,
        isPro: tier === "pro",
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
