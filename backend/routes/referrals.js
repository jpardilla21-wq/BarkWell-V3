/**
 * Referral Routes - Phase 6
 * Handles invite codes and rewards
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');
const crypto = require('crypto');

/**
 * Helper to generate a short random code
 */
function generateCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase(); // 8 chars
}

/**
 * GET /api/referrals/code
 * Get current user's referral code (generate if none)
 */
router.get('/code', async (req, res) => {
  try {
    // Mock user ID from headers or assuming auth middleware
    // For now we use query param or body in this prototype environment
    // Ideally this comes from req.user.id
    const userId = req.query.userId || 1;

    // Check existing code
    const result = await db.query('SELECT referral_code FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    let code = result.rows[0].referral_code;

    if (!code) {
      // Generate and save new code
      code = generateCode();
      // Ensure uniqueness (simple retry loop)
      let unique = false;
      while (!unique) {
        try {
          await db.query('UPDATE users SET referral_code = $1 WHERE id = $2', [code, userId]);
          unique = true;
        } catch (e) {
          code = generateCode(); // Retry on collision
        }
      }
    }

    res.json({ success: true, code });
  } catch (error) {
    console.error('Get referral code error:', error);
    res.status(500).json({ error: 'Failed to get referral code' });
  }
});

/**
 * POST /api/referrals/redeem
 * Redeem a friend's code
 */
router.post('/redeem', async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ error: 'Missing userId or code' });
    }

    // 1. Find referrer
    const referrerResult = await db.query('SELECT id FROM users WHERE referral_code = $1', [code]);

    if (referrerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    const referrerId = referrerResult.rows[0].id;

    // 2. Validation: Cannot refer self
    if (referrerId == userId) {
      return res.status(400).json({ error: 'Cannot redeem your own code' });
    }

    // 3. Validation: Have they already redeemed a code?
    // (Assuming one redemption per user)
    const existingCheck = await db.query(
      'SELECT id FROM referrals WHERE referee_id = $1',
      [userId]
    );

    if (existingCheck.rows.length > 0) {
      return res.status(400).json({ error: 'You have already redeemed a referral code' });
    }

    // 4. Create Referral Record
    await db.query(
      `INSERT INTO referrals (referrer_id, referee_id, code_used, status)
       VALUES ($1, $2, $3, 'completed')`,
      [referrerId, userId, code]
    );

    // 5. Grant Reward (Simple Logic: Both get 1 month free if not Pro)
    // In a real app, you might just store credits or call RevenueCat to apply a promo
    // For now, we'll just log it or maybe update a "credits" column if we had one.

    res.json({
      success: true,
      message: 'Code redeemed! You and your friend earned a reward.'
    });

  } catch (error) {
    console.error('Redeem error:', error);
    res.status(500).json({ error: 'Failed to redeem code' });
  }
});

/**
 * GET /api/referrals/stats
 * Get user's referral stats
 */
router.get('/stats', async (req, res) => {
  try {
    const userId = req.query.userId || 1;

    const result = await db.query(
      `SELECT COUNT(*) as count
       FROM referrals
       WHERE referrer_id = $1 AND status = 'completed'`,
      [userId]
    );

    const count = parseInt(result.rows[0].count);

    // Reward logic: e.g. 1 month free for every 3 referrals
    const rewardsEarned = Math.floor(count / 3);
    const progress = count % 3;

    res.json({
      success: true,
      stats: {
        referralCount: count,
        rewardsEarned,
        progressToNextReward: progress,
        target: 3
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

module.exports = router;
