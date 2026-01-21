import { Platform } from 'react-native';
import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL
} from 'react-native-purchases';

// Config
const API_KEY = 'test_MXWebbdbJtwxgRMVXlCHkssmRQQ';
const ENTITLEMENT_ID = 'pawer Pro'; // As requested by user

export const initRevenueCat = async (userId?: string) => {
  if (Platform.OS === 'web') {
    console.log('RevenueCat not supported on web');
    return;
  }

  Purchases.setLogLevel(LOG_LEVEL.DEBUG);

  // Configure with the provided API key for both platforms (unless specific per platform keys provided later)
  // The user provided one key, assuming it's for the active platform or universal.
  await Purchases.configure({ apiKey: API_KEY, appUserID: userId });
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  if (Platform.OS === 'web') return null;
  try {
    return await Purchases.getCustomerInfo();
  } catch (e) {
    console.error('Error getting customer info', e);
    return null;
  }
};

export const checkEntitlement = (customerInfo: CustomerInfo | null): boolean => {
  if (!customerInfo) return false;

  const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
  return !!entitlement; // True if active
};

export const restorePurchases = async (): Promise<CustomerInfo | null> => {
    if (Platform.OS === 'web') return null;
    try {
        return await Purchases.restorePurchases();
    } catch (e) {
        console.error('Error restoring purchases', e);
        return null;
    }
}
