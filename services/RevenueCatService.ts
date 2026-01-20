/**
 * RevenueCat Service
 * Handles all RevenueCat SDK interactions
 */

import Purchases, {
  CustomerInfo,
  PurchasesOfferings,
  PurchasesPackage,
  LOG_LEVEL,
} from 'react-native-purchases';
import { RevenueCatConfig } from './RevenueCatConfig';

class RevenueCatService {
  private isConfigured = false;

  /**
   * Initialize RevenueCat SDK
   * Call this once when the app starts
   */
  async configure(userId?: string): Promise<void> {
    if (this.isConfigured) {
      console.log('RevenueCat already configured');
      return;
    }

    try {
      // Enable debug logging in development
      if (RevenueCatConfig.enableDebugLogging) {
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Configure RevenueCat with API key
      await Purchases.configure({
        apiKey: RevenueCatConfig.apiKey,
        appUserID: userId, // Optional: set custom user ID
      });

      this.isConfigured = true;
      console.log('✅ RevenueCat configured successfully');

      // Get initial customer info
      const customerInfo = await Purchases.getCustomerInfo();
      console.log('Customer Info:', customerInfo);
    } catch (error) {
      console.error('❌ RevenueCat configuration failed:', error);
      throw error;
    }
  }

  /**
   * Set user ID (for identifying users across devices)
   * Call after user logs in
   */
  async identifyUser(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
      console.log(`✅ User identified: ${userId}`);
    } catch (error) {
      console.error('❌ Failed to identify user:', error);
      throw error;
    }
  }

  /**
   * Log out current user
   * Call when user logs out
   */
  async logoutUser(): Promise<void> {
    try {
      await Purchases.logOut();
      console.log('✅ User logged out');
    } catch (error) {
      console.error('❌ Failed to logout user:', error);
      throw error;
    }
  }

  /**
   * Get current customer info (purchases, subscriptions, entitlements)
   */
  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('❌ Failed to get customer info:', error);
      throw error;
    }
  }

  /**
   * Check if user has active Pro entitlement
   */
  async hasProAccess(): Promise<boolean> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const proEntitlement = customerInfo.entitlements.active[RevenueCatConfig.entitlements.pro];
      return proEntitlement !== undefined;
    } catch (error) {
      console.error('❌ Failed to check Pro access:', error);
      return false;
    }
  }

  /**
   * Get all available offerings
   */
  async getOfferings(): Promise<PurchasesOfferings | null> {
    try {
      const offerings = await Purchases.getOfferings();

      if (offerings.current === null) {
        console.warn('⚠️ No offerings found. Check RevenueCat dashboard configuration.');
        return null;
      }

      console.log('Available offerings:', offerings);
      return offerings;
    } catch (error) {
      console.error('❌ Failed to get offerings:', error);
      return null;
    }
  }

  /**
   * Purchase a package
   */
  async purchasePackage(pkg: PurchasesPackage): Promise<{
    customerInfo: CustomerInfo;
    success: boolean;
  }> {
    try {
      console.log(`🛒 Purchasing package: ${pkg.identifier}`);

      const { customerInfo } = await Purchases.purchasePackage(pkg);

      console.log('✅ Purchase successful!');
      console.log('Customer Info:', customerInfo);

      // Check if Pro entitlement is now active
      const hasProAccess = customerInfo.entitlements.active[RevenueCatConfig.entitlements.pro] !== undefined;

      return {
        customerInfo,
        success: hasProAccess,
      };
    } catch (error: any) {
      // Handle specific error cases
      if (error.userCancelled) {
        console.log('ℹ️ User cancelled purchase');
      } else {
        console.error('❌ Purchase failed:', error);
      }
      throw error;
    }
  }

  /**
   * Restore previous purchases
   * Useful for users who reinstalled the app or switched devices
   */
  async restorePurchases(): Promise<CustomerInfo> {
    try {
      console.log('🔄 Restoring purchases...');
      const customerInfo = await Purchases.restorePurchases();
      console.log('✅ Purchases restored successfully');
      return customerInfo;
    } catch (error) {
      console.error('❌ Failed to restore purchases:', error);
      throw error;
    }
  }

  /**
   * Set custom user attributes (synced with RevenueCat dashboard)
   */
  async setUserAttributes(attributes: Record<string, string | null>): Promise<void> {
    try {
      await Purchases.setAttributes(attributes);
      console.log('✅ User attributes set:', attributes);
    } catch (error) {
      console.error('❌ Failed to set user attributes:', error);
    }
  }

  /**
   * Set user email
   */
  async setEmail(email: string): Promise<void> {
    try {
      await Purchases.setEmail(email);
      console.log(`✅ Email set: ${email}`);
    } catch (error) {
      console.error('❌ Failed to set email:', error);
    }
  }

  /**
   * Set user display name
   */
  async setDisplayName(displayName: string): Promise<void> {
    try {
      await Purchases.setDisplayName(displayName);
      console.log(`✅ Display name set: ${displayName}`);
    } catch (error) {
      console.error('❌ Failed to set display name:', error);
    }
  }

  /**
   * Get subscription status details
   */
  async getSubscriptionStatus(): Promise<{
    isSubscribed: boolean;
    productIdentifier: string | null;
    expirationDate: string | null;
    willRenew: boolean;
  }> {
    try {
      const customerInfo = await this.getCustomerInfo();
      const proEntitlement = customerInfo.entitlements.active[RevenueCatConfig.entitlements.pro];

      if (!proEntitlement) {
        return {
          isSubscribed: false,
          productIdentifier: null,
          expirationDate: null,
          willRenew: false,
        };
      }

      return {
        isSubscribed: true,
        productIdentifier: proEntitlement.productIdentifier,
        expirationDate: proEntitlement.expirationDate,
        willRenew: proEntitlement.willRenew,
      };
    } catch (error) {
      console.error('❌ Failed to get subscription status:', error);
      return {
        isSubscribed: false,
        productIdentifier: null,
        expirationDate: null,
        willRenew: false,
      };
    }
  }

  /**
   * Check if user is on a specific product
   */
  async isOnProduct(productId: string): Promise<boolean> {
    try {
      const status = await this.getSubscriptionStatus();
      return status.productIdentifier === productId;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const revenueCatService = new RevenueCatService();
export default revenueCatService;
