/**
 * Subscription Routes - Phase 3 Monetization
 * Handles subscription upgrades, downgrades, and payment tracking
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const stripe = require('../services/stripe');

/**
 * GET /api/subscriptions/tiers
 * Get available subscription tiers and pricing
 */
router.get('/tiers', (req, res) => {
  const tiers = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      interval: null,
      features: [
        'Track up to 5 health records',
        'Basic wellness scoring',
        'Weight tracking',
        'Community support',
      ],
      limitations: [
        'Limited to 5 health records',
        'Ads displayed',
        'No PDF export',
        'No AI insights',
      ],
    },
    {
      id: 'plus',
      name: 'Plus',
      price: 4.99,
      interval: 'month',
      popular: true,
      features: [
        'Unlimited health records',
        'Advanced wellness trends',
        'PDF export of records',
        'Ad-free experience',
        'Priority email support',
        'Custom reminders',
      ],
      limitations: [],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 9.99,
      interval: 'month',
      features: [
        'Everything in Plus',
        'AI wellness insights & predictions',
        '24/7 telemedicine access',
        'Nutrition optimization',
        'Breed-specific recommendations',
        'Priority phone support',
        'Early access to new features',
      ],
      limitations: [],
    },
  ];

  res.json({
    success: true,
    tiers,
  });
});

/**
 * GET /api/subscriptions/status/:userId
 * Get user's current subscription status
 */
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await db.query(
      `SELECT subscription_tier, subscription_expiry, stripe_customer_id
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const user = result.rows[0];
    const isExpired = user.subscription_expiry && new Date(user.subscription_expiry) < new Date();

    res.json({
      success: true,
      subscription: {
        tier: isExpired ? 'free' : user.subscription_tier,
        expiry: user.subscription_expiry,
        isExpired,
        hasPaymentMethod: !!user.stripe_customer_id,
      },
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get subscription status',
    });
  }
});

/**
 * POST /api/subscriptions/create-checkout-session
 * Create a Stripe Checkout Session
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { userId, tier } = req.body;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Pricing ID mapping (in production these would be real Stripe Price IDs)
    // For now, we construct the line item manually
    const prices = {
      plus: 499, // cents
      pro: 999,
    };

    if (!prices[tier]) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    // Get user email
    const userResult = await db.query('SELECT email, stripe_customer_id FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userResult.rows[0];

    let customerId = user.stripe_customer_id;

    // Create customer if doesn't exist
    if (!customerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { userId: userId },
        });
        customerId = customer.id;
        // Save customer ID
        await db.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customerId, userId]);
      } catch (e) {
        console.warn('Failed to create Stripe customer, proceeding without existing ID', e);
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `PupSense ${tier.charAt(0).toUpperCase() + tier.slice(1)} Subscription`,
            },
            unit_amount: prices[tier],
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${frontendUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/pricing`,
      metadata: {
        userId,
        tier,
      },
    });

    res.json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session',
    });
  }
});

/**
 * POST /api/subscriptions/subscribe
 * Mock payment endpoint - simulates Stripe subscription
 * (Kept for backward compatibility or dev testing without Stripe keys)
 */
router.post('/subscribe', async (req, res) => {
  // Check if we want to use real Stripe flow (e.g. via flag)
  // For now, let's keep the mock implementation as a fallback
  // if STRIPE_SECRET_KEY is explicitly 'sk_test_mock_key'
  // AND the client didn't call create-checkout-session.

  // This existing implementation serves as the 'Mock' mode
  // for clients that haven't updated or for dev environments.

  const client = await db.getClient();

  try {
    const { userId, tier, paymentMethod } = req.body;

    // Validate input
    if (!userId || !tier) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and tier',
      });
    }

    if (!['plus', 'pro'].includes(tier)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tier. Must be "plus" or "pro"',
      });
    }

    // Validate user exists
    const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Calculate pricing
    const pricing = {
      plus: 4.99,
      pro: 9.99,
    };
    const amount = pricing[tier];

    // Calculate expiry date (1 month from now)
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    // Start transaction
    await client.query('BEGIN');

    // Update user's subscription
    await client.query(
      `UPDATE users
       SET subscription_tier = $1,
           subscription_expiry = $2,
           stripe_customer_id = $3,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [tier, expiryDate, `mock_customer_${userId}_${Date.now()}`, userId]
    );

    // Record payment
    const paymentResult = await client.query(
      `INSERT INTO payments (user_id, amount, tier, status, payment_method, transaction_id, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [
        userId,
        amount,
        tier,
        'completed',
        paymentMethod || 'mock_payment',
        `mock_txn_${Date.now()}`,
        'Mock payment processed successfully',
      ]
    );

    // Commit transaction
    await client.query('COMMIT');

    const payment = paymentResult.rows[0];

    res.json({
      success: true,
      message: `Successfully subscribed to ${tier.toUpperCase()} plan!`,
      subscription: {
        tier,
        expiry: expiryDate,
        amount,
      },
      payment: {
        id: payment.id,
        amount,
        status: 'completed',
        createdAt: payment.created_at,
      },
      mock: true,
      note: 'This is a mock payment. In production, this would integrate with Stripe.',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process subscription',
      message: error.message,
    });
  } finally {
    client.release();
  }
});

/**
 * POST /api/subscriptions/cancel
 * Cancel user's subscription (downgrade to free)
 */
router.post('/cancel', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: userId',
      });
    }

    // Update user to free tier
    await db.query(
      `UPDATE users
       SET subscription_tier = 'free',
           subscription_expiry = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: {
        tier: 'free',
        expiry: null,
      },
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription',
    });
  }
});

/**
 * GET /api/subscriptions/payments/:userId
 * Get payment history for a user
 */
router.get('/payments/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    const result = await db.query(
      `SELECT id, amount, tier, status, payment_method, transaction_id, created_at
       FROM payments
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    res.json({
      success: true,
      payments: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment history',
    });
  }
});

module.exports = router;
