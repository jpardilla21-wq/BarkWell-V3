/**
 * Webhook Routes - Phase 4 Monetization
 * Handles Stripe webhooks
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const stripe = require('../services/stripe');

// This needs to be raw body for Stripe signature verification
// We will handle that in the main server.js or apply middleware here
// For this implementation, we assume the raw body is available on req.rawBody or similar if configured globally,
// but typically webhooks are handled with `express.raw({type: 'application/json'})`

/**
 * POST /api/webhooks/stripe
 * Handle incoming Stripe events
 */
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // If we have the secret, verify the signature
    // In dev without the secret, we might just parse the body (less secure, strictly for dev)
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
       // Fallback for dev/mock environment if secret isn't set
       // This is NOT safe for production
       event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutSessionCompleted(session);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handleInvoicePaymentSucceeded(invoice);
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({received: true});
  } catch (error) {
    console.error('Error handling webhook event:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

/**
 * Handle successful checkout session
 * Updates user to the new tier
 */
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;
  const tier = session.metadata.tier;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  console.log(`Processing checkout completion for user ${userId} to tier ${tier}`);

  if (!userId || !tier) {
    console.error('Missing metadata in checkout session');
    return;
  }

  // Calculate expiry (default 1 month from now, though Stripe manages this)
  // We keep a local expiry as a backup or for quick access
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 1);

  await db.query(
    `UPDATE users
     SET subscription_tier = $1,
         subscription_expiry = $2,
         stripe_customer_id = $3,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $4`,
    [tier, expiryDate, customerId, userId]
  );

  // Record payment
  await db.query(
    `INSERT INTO payments (user_id, amount, tier, status, payment_method, transaction_id, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      userId,
      session.amount_total / 100, // Stripe amounts are in cents
      tier,
      'completed',
      'stripe',
      session.payment_intent || session.id,
      'Stripe checkout completed'
    ]
  );
}

/**
 * Handle successful recurring payment
 */
async function handleInvoicePaymentSucceeded(invoice) {
  const customerId = invoice.customer;
  // We need to find the user by stripe_customer_id
  const userResult = await db.query('SELECT id FROM users WHERE stripe_customer_id = $1', [customerId]);

  if (userResult.rows.length === 0) {
    console.error(`User not found for customer ${customerId}`);
    return;
  }

  const userId = userResult.rows[0].id;

  // Extend expiry by 1 month (or whatever the interval is)
  // Ideally we inspect the invoice.lines.data[0].period.end
  const periodEnd = new Date(invoice.lines.data[0].period.end * 1000);

  await db.query(
    `UPDATE users
     SET subscription_expiry = $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2`,
    [periodEnd, userId]
  );

  // Record payment
  await db.query(
    `INSERT INTO payments (user_id, amount, tier, status, payment_method, transaction_id, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      userId,
      invoice.amount_paid / 100,
      'renewal', // We might not know the tier easily without querying, but 'renewal' is fine
      'completed',
      'stripe',
      invoice.payment_intent || invoice.id,
      'Subscription renewal'
    ]
  );
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;

  await db.query(
    `UPDATE users
     SET subscription_tier = 'free',
         subscription_expiry = NULL,
         updated_at = CURRENT_TIMESTAMP
     WHERE stripe_customer_id = $1`,
    [customerId]
  );

  console.log(`Subscription deleted for customer ${customerId}`);
}

module.exports = router;
