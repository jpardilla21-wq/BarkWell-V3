import { Platform } from "react-native";

// Determine the base URL based on the environment
// Using the same logic as api.ts
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

type EventProperties = Record<string, string | number | boolean | null>;

/**
 * Send an analytics event to the backend
 */
export const trackEvent = async (eventName: string, properties?: EventProperties) => {
  try {
    // In a real app, you might want to queue these or use a persistent store
    // to avoid losing events if offline.
    // For this implementation, we fire and forget.

    // We should ideally get the userId from a context, but here we'll assume the backend
    // can handle anonymous events or we pass a hardcoded/stored ID if available.
    // For now, let's assume userId is 1 (mock) as consistent with other parts.
    const userId = 1;

    console.log(`[Analytics] Tracking: ${eventName}`, properties);

    await fetch(`${BASE_URL}/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        eventName,
        properties,
      }),
    });
  } catch (error) {
    // Silently fail for analytics to not disrupt user experience
    console.warn("[Analytics] Failed to track event:", error);
  }
};

/**
 * Helper to track screen views
 */
export const trackScreenView = async (screenName: string, params?: EventProperties) => {
  await trackEvent("screen_view", {
    screen_name: screenName,
    ...params,
  });
};
