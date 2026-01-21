/**
 * Webhook Routes - Phase 4 Monetization
 * Handles RevenueCat and Lemon Squeezy webhooks
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Middleware to verify Lemon Squeezy signature would go here
// For now we assume the payload is valid or validated by a global middleware/service

/**
 * POST /api/webhooks/revenuecat
 * Handle RevenueCat events (RENEWAL, CANCELLATION, etc.)
 */
router.post('/revenuecat', async (req, res) => {
  try {
    const event = req.body.event;

    if (!event) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const { type, app_user_id, product_id, expiration_at_ms } = event;
    console.log(`Received RevenueCat event: ${type} for user ${app_user_id}`);

    // app_user_id should match our database userId (id)
    const userId = parseInt(app_user_id);
    if (isNaN(userId)) {
      console.warn(`Invalid user ID in RevenueCat webhook: ${app_user_id}`);
      return res.json({ received: true }); // Acknowledge anyway
    }

    let tier = 'free';
    // Map product_id to tier (assuming product IDs contain 'plus' or 'pro')
    if (product_id && product_id.toLowerCase().includes('pro')) {
      tier = 'pro';
    } else if (product_id && product_id.toLowerCase().includes('plus')) {
      tier = 'plus';
    }

    // Handle different event types
    switch (type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'UNCANCELLATION':
        const expiryDate = new Date(expiration_at_ms);
        await updateUserSubscription(userId, tier, expiryDate, 'revenuecat');
        break;

      case 'CANCELLATION':
      case 'EXPIRATION':
        // For cancellation, they might still have time left, but usually expiration handles the actual cut off
        // If it's strictly cancellation, we might just note it but not remove access until expiration
        // For simplicity, on EXPIRATION we downgrade
        if (type === 'EXPIRATION') {
          await updateUserSubscription(userId, 'free', null, 'revenuecat');
        }
        break;

      default:
        console.log(`Unhandled RevenueCat event type: ${type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('RevenueCat webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

/**
 * POST /api/webhooks/lemonsqueezy
 * Handle Lemon Squeezy events
 */
router.post('/lemonsqueezy', async (req, res) => {
  try {
    // Lemon Squeezy payload structure
    const eventName = req.headers['x-event-name'];
    const payload = req.body;

    console.log(`Received Lemon Squeezy event: ${eventName}`);

    if (!payload || !payload.data) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const { attributes } = payload.data;
    // We expect 'custom_data' or 'checkout_data' to contain our userId
    // Lemon Squeezy passes custom data under `attributes.custom_data` if configured
    const userId = parseInt(attributes.custom_data?.user_id);

    if (isNaN(userId)) {
      // If we can't identify the user, we can't sync
      console.warn('No user ID found in Lemon Squeezy webhook');
      return res.json({ received: true });
    }

    // Determine tier from variant_id or product_name
    let tier = 'plus'; // Default fallback
    if (attributes.variant_name && attributes.variant_name.toLowerCase().includes('pro')) {
      tier = 'pro';
    }

    switch (eventName) {
      case 'order_created':
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_payment_success':
        const expiryDate = new Date(attributes.renews_at || Date.now() + 30*24*60*60*1000);
        await updateUserSubscription(userId, tier, expiryDate, 'lemonsqueezy');
        break;

      case 'subscription_expired':
      case 'subscription_cancelled':
        // Logic depends on if cancellation is immediate or at period end
        if (attributes.status === 'expired') {
          await updateUserSubscription(userId, 'free', null, 'lemonsqueezy');
        }
        break;

      default:
        console.log(`Unhandled Lemon Squeezy event: ${eventName}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Lemon Squeezy webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

/**
 * Helper to update user subscription in DB
 */
async function updateUserSubscription(userId, tier, expiryDate, provider) {
  try {
    await db.query(
      `UPDATE users
       SET subscription_tier = $1,
           subscription_expiry = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [tier, expiryDate, userId]
    );

    // Optional: Log to payments table
    // For a real app, we'd want more details (transaction ID, amount)
    // extracted from the webhook payload
  } catch (error) {
    console.error(`Failed to update subscription for user ${userId}:`, error);
  }
}

module.exports = router;
