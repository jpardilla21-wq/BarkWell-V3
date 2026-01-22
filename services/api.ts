import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";

// Determine the base URL based on the environment
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3001/api';
    }
    return 'http://localhost:3001/api';
  }
  return 'https://api.pupsense.com/api';
};

const BASE_URL = getBaseUrl();

export interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  affiliate_link: string;
  target_breed_size: string;
  image_url: string;
  average_price: string;
  features: string[];
}

export interface Category {
  category: string;
  count: string;
}

export interface Partner {
  id: number;
  partner_name: string;
  referral_link: string;
  discount_offer: string;
  logo_url: string;
  description: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  interval: string;
  features: string[];
}

export const getProducts = async (
  category?: string,
  size?: string,
  petId?: string
): Promise<{ success: boolean; products: Product[]; count: number }> => {
  try {
    const params = new URLSearchParams();
    if (category && category !== "All") params.append("category", category);
    if (size) params.append("size", size);
    if (petId) params.append("petId", petId);

    const response = await fetch(`${BASE_URL}/shop/products?${params.toString()}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, products: [], count: 0 };
  }
};

export const getCategories = async (): Promise<{
  success: boolean;
  categories: Category[];
}> => {
  try {
    const response = await fetch(`${BASE_URL}/shop/categories`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, categories: [] };
  }
};

export const getCuratedProducts = async (
  petId: string
): Promise<{
  success: boolean;
  products: Product[];
  recommendations: string[];
  pet?: any;
}> => {
  try {
    const response = await fetch(`${BASE_URL}/shop/curated/${petId}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching curated products:", error);
    return { success: false, products: [], recommendations: [] };
  }
};

export const getInsurancePartners = async (): Promise<{
  success: boolean;
  partners: Partner[];
}> => {
  try {
    const response = await fetch(`${BASE_URL}/shop/insurance`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching insurance partners:", error);
    return { success: false, partners: [] };
  }
};

export const trackAffiliateClick = async (
  productId: number,
  petId?: string,
  clickType: string = "amazon"
): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${BASE_URL}/shop/track-click`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        petId,
        clickType,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error tracking click:", error);
    return { success: false };
  }
};

export const getSubscriptionTiers = async (): Promise<{
  success: boolean;
  tiers: SubscriptionTier[];
}> => {
  try {
    const response = await fetch(`${BASE_URL}/subscriptions/tiers`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching subscription tiers:", error);
    return { success: false, tiers: [] };
  }
};

export const getSubscriptionStatus = async (
  userId: string | number
): Promise<{
  success: boolean;
  tier: string;
  expiry: string | null;
}> => {
  try {
    const response = await fetch(`${BASE_URL}/subscriptions/status/${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    return { success: false, tier: "free", expiry: null };
  }
};

// Deprecated or Mock function - using RevenueCat now
export const subscribeUser = async (
  userId: string | number,
  tier: string,
  paymentMethodId: string = "mock_pm_123"
): Promise<{ success: boolean; message?: string; error?: string; url?: string }> => {
  console.warn("subscribeUser is deprecated. Use RevenueCat SDK instead.");
  return { success: false, error: "Use RevenueCat SDK" };
};

export const cancelSubscription = async (
  userId: string | number
): Promise<{ success: boolean; message?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/subscriptions/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return { success: false };
  }
};

export const getPaymentHistory = async (
  userId: string | number
): Promise<{ success: boolean; payments: any[] }> => {
  try {
    const response = await fetch(`${BASE_URL}/subscriptions/payments/${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return { success: false, payments: [] };
  }
};

export const openCheckoutSession = async (url: string) => {
  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (error) {
    console.error("Failed to open web browser", error);
  }
};

// --- Referral System ---

export const getReferralCode = async (userId: string | number): Promise<{ success: boolean; code?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/referrals/code?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Error getting referral code:", error);
    return { success: false };
  }
};

export const redeemReferralCode = async (
  userId: string | number,
  code: string
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/referrals/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, code }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error redeeming code:", error);
    return { success: false, error: "Network error" };
  }
};

export const getReferralStats = async (userId: string | number): Promise<{
  success: boolean;
  stats?: { referralCount: number; rewardsEarned: number; progressToNextReward: number; target: number }
}> => {
  try {
    const response = await fetch(`${BASE_URL}/referrals/stats?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error("Error getting referral stats:", error);
    return { success: false };
  }
};
