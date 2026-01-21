const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * POST /api/analytics/track
 * Track a client event
 */
router.post('/track', async (req, res) => {
  try {
    const { userId, eventName, properties } = req.body;

    if (!eventName) {
      return res.status(400).json({ error: 'Event name is required' });
    }

    // Insert into DB
    // Ideally use a message queue for high volume, but direct insert is fine for MVP
    await db.query(
      `INSERT INTO analytics_events (user_id, event_name, properties)
       VALUES ($1, $2, $3)`,
      [userId || null, eventName, properties || {}]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Track event error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

/**
 * GET /api/analytics/stats
 * Get dashboard stats (Admin only - simplistic protection for now)
 */
router.get('/stats', async (req, res) => {
  try {
    // 1. Total Users
    const usersResult = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersResult.rows[0].count);

    // 2. Subscription Breakdown
    const subsResult = await db.query(`
      SELECT subscription_tier, COUNT(*) as count
      FROM users
      GROUP BY subscription_tier
    `);

    // 3. Recent Events (Last 24h)
    const eventsResult = await db.query(`
      SELECT event_name, COUNT(*) as count
      FROM analytics_events
      WHERE created_at > NOW() - INTERVAL '24 HOURS'
      GROUP BY event_name
      ORDER BY count DESC
      LIMIT 10
    `);

    // 4. Calculate estimated MRR (Simplistic)
    let mrr = 0;
    const pricing = { plus: 4.99, pro: 9.99, free: 0 };
    subsResult.rows.forEach(row => {
      mrr += (pricing[row.subscription_tier] || 0) * parseInt(row.count);
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        mrr: parseFloat(mrr.toFixed(2)),
        subscriptions: subsResult.rows,
        recentEvents: eventsResult.rows
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

module.exports = router;
