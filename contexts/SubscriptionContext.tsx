import React, { createContext, useContext, useState, useEffect } from "react";
import { getSubscriptionStatus } from "@/services/api";

type SubscriptionTier = "free" | "plus" | "pro";

interface SubscriptionContextType {
  tier: SubscriptionTier;
  isLoading: boolean;
  expiry: string | null;
  refreshStatus: () => Promise<void>;
  checkPermission: (requiredTier: SubscriptionTier) => boolean;
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

  // In a real app, userId would come from AuthContext
  const userId = 1;

  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      const response = await getSubscriptionStatus(userId);
      if (response.success) {
        setTier(response.tier as SubscriptionTier);
        setExpiry(response.expiry);
      }
    } catch (error) {
      console.error("Failed to fetch subscription status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

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
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
