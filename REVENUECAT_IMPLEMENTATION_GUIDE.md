# RevenueCat Implementation Guide for BarkWell

## Overview

This guide explains how to use the RevenueCat integration in your BarkWell React Native app.

## ✅ What's Been Implemented

### 1. Core Services
- **RevenueCatConfig.ts** - Centralized configuration (API keys, product IDs, entitlements)
- **RevenueCatService.ts** - Core service for all RevenueCat operations
- **useRevenueCat.ts** - React hook for subscription management
- **RevenueCatContext.tsx** - App-wide subscription state provider

### 2. UI Components
- **PaywallScreen.tsx** - Beautiful paywall using RevenueCat UI
- **CustomerCenterScreen.tsx** - Subscription management screen
- **ProFeatureGate.tsx** - Wrapper component for premium features

### 3. Configuration
- **API Key**: `test_MXWebbdbJtwxgRMVXlCHkssmRQQ` (test key)
- **Entitlement**: `pawer Pro`
- **Products**: `monthly`, `yearly`, `lifetime`

---

## 🚀 Quick Start

### Step 1: Configure Products in RevenueCat Dashboard

1. Go to [RevenueCat Dashboard](https://app.revenuecat.com)
2. Create products with identifiers:
   - `monthly` - Monthly subscription
   - `yearly` - Annual subscription
   - `lifetime` - Lifetime purchase

3. Create an entitlement named `pawer Pro`
4. Attach all products to the `pawer Pro` entitlement
5. Create a default offering with all three products

### Step 2: Update API Keys

**For Production:**
Replace the test API key in `services/RevenueCatConfig.ts`:

```typescript
apiKey: Platform.select({
  ios: 'appl_YOUR_IOS_KEY', // From RevenueCat dashboard
  android: 'goog_YOUR_ANDROID_KEY', // From RevenueCat dashboard
}) as string,
```

### Step 3: Configure App Store Connect (iOS)

1. Create In-App Purchase products with matching identifiers:
   - `monthly`
   - `yearly`
   - `lifetime`

2. Link products in RevenueCat dashboard

### Step 4: Configure Google Play Console (Android)

1. Create subscription products with matching identifiers
2. Link products in RevenueCat dashboard

---

## 📱 Usage Examples

### Example 1: Show Paywall

```typescript
import React, { useState } from 'react';
import { View, Button, Modal } from 'react-native';
import PaywallScreen from '../screens/PaywallScreen';

function MyComponent() {
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <View>
      <Button
        title="Upgrade to Pro"
        onPress={() => setShowPaywall(true)}
      />

      <Modal
        visible={showPaywall}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <PaywallScreen
          onDismiss={() => setShowPaywall(false)}
          onPurchaseSuccess={() => {
            console.log('User upgraded to Pro!');
            setShowPaywall(false);
          }}
        />
      </Modal>
    </View>
  );
}
```

### Example 2: Check Pro Access

```typescript
import { useRevenueCatContext } from '../contexts/RevenueCatContext';

function MyComponent() {
  const { isProUser } = useRevenueCatContext();

  return (
    <View>
      {isProUser ? (
        <Text>Welcome Pro User! 🎉</Text>
      ) : (
        <Text>Upgrade to unlock premium features</Text>
      )}
    </View>
  );
}
```

### Example 3: Gate Premium Features

```typescript
import ProFeatureGate from '../components/ProFeatureGate';
import AdvancedAnalytics from '../components/AdvancedAnalytics';

function AnalyticsScreen() {
  return (
    <ProFeatureGate feature="Advanced Analytics">
      <AdvancedAnalytics />
    </ProFeatureGate>
  );
}
```

### Example 4: Custom Subscription UI

```typescript
import { useRevenueCat } from '../hooks/useRevenueCat';

function CustomPricingScreen() {
  const {
    isProUser,
    currentOffering,
    isLoading,
    purchasePackage,
    error,
  } = useRevenueCat();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (isProUser) {
    return <Text>You're already a Pro user!</Text>;
  }

  return (
    <View>
      <Text style={styles.title}>Choose Your Plan</Text>

      {currentOffering?.map((pkg) => (
        <TouchableOpacity
          key={pkg.identifier}
          onPress={() => purchasePackage(pkg)}
          style={styles.packageCard}
        >
          <Text style={styles.packageTitle}>
            {pkg.product.title}
          </Text>
          <Text style={styles.packagePrice}>
            {pkg.product.priceString}
          </Text>
          <Text style={styles.packageDescription}>
            {pkg.product.description}
          </Text>
        </TouchableOpacity>
      ))}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}
```

### Example 5: Show Customer Center

```typescript
import React, { useState } from 'react';
import { Button, Modal } from 'react-native';
import CustomerCenterScreen from '../screens/CustomerCenterScreen';

function SettingsScreen() {
  const [showCustomerCenter, setShowCustomerCenter] = useState(false);

  return (
    <View>
      <Button
        title="Manage Subscription"
        onPress={() => setShowCustomerCenter(true)}
      />

      <Modal
        visible={showCustomerCenter}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <CustomerCenterScreen
          onDismiss={() => setShowCustomerCenter(false)}
        />
      </Modal>
    </View>
  );
}
```

### Example 6: Restore Purchases

```typescript
import { useRevenueCat } from '../hooks/useRevenueCat';

function SettingsScreen() {
  const { restorePurchases } = useRevenueCat();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await restorePurchases();
      Alert.alert('Success', 'Purchases restored!');
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <Button
      title={isRestoring ? "Restoring..." : "Restore Purchases"}
      onPress={handleRestore}
      disabled={isRestoring}
    />
  );
}
```

### Example 7: Track User Attributes

```typescript
import { revenueCatService } from '../services/RevenueCatService';

// After user signs in
async function handleUserLogin(user) {
  await revenueCatService.identifyUser(user.id);
  await revenueCatService.setEmail(user.email);
  await revenueCatService.setDisplayName(user.name);

  // Set custom attributes
  await revenueCatService.setUserAttributes({
    preferredPlan: 'monthly',
    signupSource: 'organic',
  });
}

// When user logs out
async function handleUserLogout() {
  await revenueCatService.logoutUser();
}
```

### Example 8: Get Subscription Details

```typescript
import { revenueCatService } from '../services/RevenueCatService';

async function showSubscriptionInfo() {
  const status = await revenueCatService.getSubscriptionStatus();

  console.log('Is Subscribed:', status.isSubscribed);
  console.log('Product:', status.productIdentifier);
  console.log('Expires:', status.expirationDate);
  console.log('Will Renew:', status.willRenew);

  // Check if on specific product
  const isMonthly = await revenueCatService.isOnProduct('monthly');
  console.log('On Monthly Plan:', isMonthly);
}
```

---

## 🎨 Customizing the Paywall

The paywall design is controlled in your RevenueCat dashboard:

1. Go to **Paywalls** section
2. Create a new paywall or edit the default
3. Customize:
   - Colors
   - Images
   - Copy text
   - Package order
   - Trial offers

Changes sync automatically to the app!

---

## 🔒 Best Practices

### 1. Always Check Entitlements, Not Products

```typescript
// ✅ CORRECT - Check entitlements
const { isProUser } = useRevenueCatContext();
if (isProUser) {
  // Show premium feature
}

// ❌ WRONG - Don't check product IDs directly
const status = await getSubscriptionStatus();
if (status.productIdentifier === 'monthly') {
  // This breaks if they have yearly or lifetime
}
```

### 2. Handle Errors Gracefully

```typescript
const { purchasePackage, error } = useRevenueCat();

const handlePurchase = async (pkg) => {
  const success = await purchasePackage(pkg);

  if (success) {
    // Show success message
    Alert.alert('Welcome to Pro!', 'You now have access to all features');
  } else if (error && !error.includes('cancelled')) {
    // Show error only if user didn't cancel
    Alert.alert('Purchase Failed', error);
  }
};
```

### 3. Restore Purchases on App Launch

Add to your app initialization:

```typescript
useEffect(() => {
  // Restore purchases when app starts
  revenueCatService.getCustomerInfo().then((info) => {
    console.log('Customer info loaded:', info);
  });
}, []);
```

### 4. Sync User Data

```typescript
// When user information changes
useEffect(() => {
  if (user) {
    revenueCatService.setEmail(user.email);
    revenueCatService.setUserAttributes({
      appVersion: Constants.manifest?.version || 'unknown',
      platform: Platform.OS,
    });
  }
}, [user]);
```

---

## 🐛 Testing

### Test with Sandbox Accounts

**iOS:**
1. Create sandbox tester in App Store Connect
2. Sign out of App Store on device
3. When prompted during purchase, sign in with sandbox account

**Android:**
1. Add test account in Google Play Console
2. Install app from internal testing track
3. Make test purchases (no real charges)

### Test Scenarios

```typescript
// Test 1: First-time purchase
// Test 2: Restore purchases (reinstall app)
// Test 3: Subscription renewal
// Test 4: Subscription cancellation
// Test 5: Upgrade from monthly to yearly
// Test 6: Family sharing (iOS)
// Test 7: Cross-platform restore
```

---

## 📊 Analytics Integration

Track subscription events:

```typescript
import Purchases from 'react-native-purchases';

// Listen for purchase events
useEffect(() => {
  const listener = Purchases.addCustomerInfoUpdateListener((info) => {
    // Log to your analytics
    logEvent('subscription_updated', {
      isProUser: info.entitlements.active['pawer Pro'] !== undefined,
      products: Object.keys(info.allPurchasedProductIdentifiers),
    });
  });

  return () => listener.remove();
}, []);
```

---

## 🚨 Troubleshooting

### "No offerings found"
- Check RevenueCat dashboard has offerings configured
- Verify products are linked to entitlements
- Ensure app is using correct API key

### "Purchase failed"
- Verify App Store Connect/Google Play products are approved
- Check product IDs match exactly
- Ensure device can make purchases (not restricted)

### "Restore purchases didn't work"
- Make sure using same Apple ID/Google account
- Check products are set as subscriptions (not consumables)
- Verify in RevenueCat dashboard under customer view

### Sandbox purchases not working
- Sign out of App Store completely
- Ensure using sandbox tester account
- Check sandbox account is valid (not expired)

---

## 📚 Additional Resources

- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [React Native SDK Reference](https://sdk.revenuecat.com/react-native/)
- [Paywall Customization](https://www.revenuecat.com/docs/tools/paywalls)
- [Customer Center Setup](https://www.revenuecat.com/docs/tools/customer-center)
- [Testing Guide](https://docs.revenuecat.com/docs/sandbox)

---

## 🎯 Next Steps

1. **Configure Products** in RevenueCat Dashboard
2. **Set up App Store Connect** (iOS) and **Google Play Console** (Android)
3. **Test subscription flow** with sandbox accounts
4. **Customize paywall** design in dashboard
5. **Add analytics tracking** for subscription events
6. **Submit for review** with proper test accounts

---

## ⚠️ Important Notes

- **Test API Key**: Replace with production keys before launch
- **Product IDs**: Must match exactly across all platforms
- **Entitlement Name**: `pawer Pro` is case-sensitive
- **Sandbox Testing**: Always test before production
- **Cross-Platform**: Subscriptions sync across iOS/Android automatically

---

**Need Help?** Check [RevenueCat Support](https://community.revenuecat.com/) or app's internal documentation.
