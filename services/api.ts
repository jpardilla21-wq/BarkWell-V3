import { Platform } from "react-native";

// Determine the base URL based on the environment
const getBaseUrl = () => {
  // If we are in development and running on an Android emulator, use 10.0.2.2
  // If on iOS simulator, localhost is fine.
  // If on a real device, we need the machine's IP.
  // However, in Replit, we likely want to hit the Replit URL.

  if (__DEV__) {
    // Check if we have a proxy URL from expo-constants or similar if needed.
    // For now, I will assume localhost:3001 as per the documentation.
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3001/api';
    }
    return 'http://localhost:3001/api';
  }

  // Production URL (placeholder)
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
