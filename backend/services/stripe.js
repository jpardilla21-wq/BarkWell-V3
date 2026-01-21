// Placeholder file for Stripe configuration
// In a real environment, you would use your Stripe secret key from process.env

const Stripe = require('stripe');
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key'; // Default to mock if not set

const stripe = Stripe(STRIPE_SECRET_KEY);

module.exports = stripe;
