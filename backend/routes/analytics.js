/**
 * Analytics Routes
 * Phase 5: Advanced Analytics & Admin Dashboard
 * Provides endpoints for tracking metrics, subscriptions, affiliates, and user behavior
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// ================================================
// DASHBOARD OVERVIEW
// ================================================

/**
 * GET /api/analytics/dashboard
 * Returns high-level overview metrics for admin dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    // Get latest metrics from daily_metrics table
    const latestMetrics = await pool.query(`
      SELECT *
      FROM daily_metrics
      ORDER BY metric_date DESC
      LIMIT 1
    `);

    // Get real-time subscription counts
    const subscriptionMetrics = await pool.query(`
      SELECT * FROM v_subscription_metrics
    `);

    // Get recent growth trends (last 30 days)
    const growthTrends = await pool.query(`
      SELECT
        metric_date,
        new_users,
        total_users,
        mrr,
        affiliate_clicks,
        affiliate_conversions
      FROM daily_metrics
      WHERE metric_date >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY metric_date ASC
    `);

    // Calculate key metrics
    const today = latestMetrics.rows[0] || {};
    const conversionRate = subscriptionMetrics.rows[0]?.conversion_rate || 0;
    const avgRevenuePerUser = subscriptionMetrics.rows[0]?.paid_users > 0
      ? (parseFloat(subscriptionMetrics.rows[0].mrr) / subscriptionMetrics.rows[0].paid_users).toFixed(2)
      : 0;

    res.json({
      overview: {
        totalUsers: today.total_users || 0,
        paidUsers: subscriptionMetrics.rows[0]?.paid_users || 0,
        mrr: parseFloat(today.mrr || 0),
        arr: parseFloat(today.arr || 0),
        conversionRate: parseFloat(conversionRate),
        avgRevenuePerUser: parseFloat(avgRevenuePerUser),
        affiliateClicks: today.affiliate_clicks || 0,
        affiliateRevenue: parseFloat(today.affiliate_revenue || 0)
      },
      subscriptions: {
        free: subscriptionMetrics.rows[0]?.free_users || 0,
        plus: subscriptionMetrics.rows[0]?.plus_users || 0,
        pro: subscriptionMetrics.rows[0]?.pro_users || 0
      },
      trends: growthTrends.rows,
      lastUpdated: today.created_at || new Date()
    });

  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// ================================================
// SUBSCRIPTION ANALYTICS
// ================================================

/**
 * GET /api/analytics/subscriptions/metrics
 * Returns detailed subscription metrics
 */
router.get('/subscriptions/metrics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Base query for subscription metrics over time
    let query = `
      SELECT
        metric_date,
        free_users,
        plus_users,
        pro_users,
        mrr,
        arr,
        new_subscriptions,
        cancelled_subscriptions,
        free_to_paid_rate
      FROM daily_metrics
      WHERE 1=1
    `;

    const params = [];
    if (startDate) {
      params.push(startDate);
      query += ` AND metric_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND metric_date <= $${params.length}`;
    }

    query += ' ORDER BY metric_date DESC LIMIT 90'; // Last 90 days max

    const result = await pool.query(query, params);

    // Calculate period metrics
    const totalNewSubs = result.rows.reduce((sum, row) => sum + (row.new_subscriptions || 0), 0);
    const totalCancelled = result.rows.reduce((sum, row) => sum + (row.cancelled_subscriptions || 0), 0);
    const latestMRR = result.rows[0]?.mrr || 0;
    const oldestMRR = result.rows[result.rows.length - 1]?.mrr || 0;
    const mrrGrowth = oldestMRR > 0 ? ((latestMRR - oldestMRR) / oldestMRR * 100).toFixed(2) : 0;

    res.json({
      metrics: result.rows,
      summary: {
        totalNewSubscriptions: totalNewSubs,
        totalCancellations: totalCancelled,
        currentMRR: parseFloat(latestMRR),
        mrrGrowthRate: parseFloat(mrrGrowth),
        netNewSubscriptions: totalNewSubs - totalCancelled
      }
    });

  } catch (error) {
    console.error('Error fetching subscription metrics:', error);
    res.status(500).json({ error: 'Failed to fetch subscription metrics' });
  }
});

/**
 * GET /api/analytics/subscriptions/churn
 * Returns churn analysis
 */
router.get('/subscriptions/churn', async (req, res) => {
  try {
    const { months = 12 } = req.query;

    // Get churn data from view
    const churnData = await pool.query(`
      SELECT * FROM v_churn_analysis
      ORDER BY month DESC
      LIMIT $1
    `, [months]);

    // Calculate average churn rate
    const avgChurnRate = await pool.query(`
      SELECT calculate_churn_rate(
        CURRENT_DATE - INTERVAL '1 month',
        CURRENT_DATE
      ) as monthly_churn_rate
    `);

    res.json({
      churnByMonth: churnData.rows,
      averageMonthlyChurnRate: parseFloat(avgChurnRate.rows[0]?.monthly_churn_rate || 0)
    });

  } catch (error) {
    console.error('Error fetching churn analysis:', error);
    res.status(500).json({ error: 'Failed to fetch churn analysis' });
  }
});

/**
 * GET /api/analytics/subscriptions/funnel
 * Returns conversion funnel data
 */
router.get('/subscriptions/funnel', async (req, res) => {
  try {
    // Get conversion funnel stages
    const funnelData = await pool.query(`
      SELECT
        COUNT(*) as total_users,
        COUNT(*) FILTER (WHERE subscription_tier != 'free') as paid_users,
        COUNT(*) FILTER (WHERE subscription_tier = 'plus') as plus_users,
        COUNT(*) FILTER (WHERE subscription_tier = 'pro') as pro_users
      FROM users
    `);

    // Get feature usage for premium users (engagement indicator)
    const featureEngagement = await pool.query(`
      SELECT
        feature_name,
        COUNT(DISTINCT user_id) as unique_users,
        SUM(usage_count) as total_usage
      FROM feature_usage
      WHERE subscription_tier IN ('plus', 'pro')
      GROUP BY feature_name
      ORDER BY total_usage DESC
    `);

    const data = funnelData.rows[0];
    const conversionRate = data.total_users > 0
      ? ((data.paid_users / data.total_users) * 100).toFixed(2)
      : 0;

    res.json({
      funnel: {
        totalUsers: parseInt(data.total_users),
        paidUsers: parseInt(data.paid_users),
        plusUsers: parseInt(data.plus_users),
        proUsers: parseInt(data.pro_users),
        conversionRate: parseFloat(conversionRate)
      },
      featureEngagement: featureEngagement.rows
    });

  } catch (error) {
    console.error('Error fetching conversion funnel:', error);
    res.status(500).json({ error: 'Failed to fetch conversion funnel' });
  }
});

// ================================================
// AFFILIATE ANALYTICS
// ================================================

/**
 * GET /api/analytics/affiliates/performance
 * Returns affiliate performance metrics
 */
router.get('/affiliates/performance', async (req, res) => {
  try {
    const { startDate, endDate, productType } = req.query;

    let query = `
      SELECT
        DATE_TRUNC('day', clicked_at) as date,
        product_type,
        COUNT(*) as total_clicks,
        COUNT(*) FILTER (WHERE converted = true) as conversions,
        ROUND(
          COUNT(*) FILTER (WHERE converted = true)::NUMERIC /
          NULLIF(COUNT(*), 0) * 100,
          2
        ) as conversion_rate,
        COALESCE(SUM(conversion_amount), 0) as total_revenue,
        COALESCE(SUM(conversion_amount) * 0.05, 0) as estimated_commission
      FROM affiliate_clicks
      WHERE 1=1
    `;

    const params = [];
    if (startDate) {
      params.push(startDate);
      query += ` AND clicked_at >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND clicked_at <= $${params.length}`;
    }
    if (productType) {
      params.push(productType);
      query += ` AND product_type = $${params.length}`;
    }

    query += `
      GROUP BY DATE_TRUNC('day', clicked_at), product_type
      ORDER BY date DESC
      LIMIT 365
    `;

    const result = await pool.query(query, params);

    // Get top performing products
    const topProducts = await pool.query(`
      SELECT
        rp.id,
        rp.name,
        rp.category,
        COUNT(ac.id) as click_count,
        COUNT(*) FILTER (WHERE ac.converted = true) as conversion_count,
        COALESCE(SUM(ac.conversion_amount), 0) as revenue
      FROM recommended_products rp
      LEFT JOIN affiliate_clicks ac ON rp.id = ac.product_id
      WHERE ac.clicked_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY rp.id, rp.name, rp.category
      ORDER BY revenue DESC
      LIMIT 10
    `);

    res.json({
      performance: result.rows,
      topProducts: topProducts.rows
    });

  } catch (error) {
    console.error('Error fetching affiliate performance:', error);
    res.status(500).json({ error: 'Failed to fetch affiliate performance' });
  }
});

/**
 * GET /api/analytics/affiliates/categories
 * Returns performance by product category
 */
router.get('/affiliates/categories', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        rp.category,
        COUNT(ac.id) as total_clicks,
        COUNT(*) FILTER (WHERE ac.converted = true) as conversions,
        ROUND(
          COUNT(*) FILTER (WHERE ac.converted = true)::NUMERIC /
          NULLIF(COUNT(ac.id), 0) * 100,
          2
        ) as conversion_rate,
        COALESCE(SUM(ac.conversion_amount), 0) as revenue,
        COALESCE(SUM(ac.conversion_amount) * 0.05, 0) as commission
      FROM recommended_products rp
      LEFT JOIN affiliate_clicks ac ON rp.id = ac.product_id
      WHERE ac.clicked_at >= CURRENT_DATE - INTERVAL '90 days'
      GROUP BY rp.category
      ORDER BY revenue DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching category performance:', error);
    res.status(500).json({ error: 'Failed to fetch category performance' });
  }
});

// ================================================
// USER ANALYTICS
// ================================================

/**
 * GET /api/analytics/users/growth
 * Returns user growth metrics
 */
router.get('/users/growth', async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    const growthData = await pool.query(`
      SELECT
        metric_date as date,
        new_users,
        total_users,
        active_users
      FROM daily_metrics
      WHERE metric_date >= CURRENT_DATE - INTERVAL '${parseInt(period)} days'
      ORDER BY metric_date ASC
    `);

    res.json(growthData.rows);

  } catch (error) {
    console.error('Error fetching user growth:', error);
    res.status(500).json({ error: 'Failed to fetch user growth' });
  }
});

/**
 * GET /api/analytics/users/cohorts
 * Returns cohort analysis
 */
router.get('/users/cohorts', async (req, res) => {
  try {
    // Get cohort data with retention
    const cohorts = await pool.query(`
      SELECT
        cohort_month,
        COUNT(*) as cohort_size,
        COUNT(*) FILTER (WHERE first_subscription_tier != 'free') as paid_at_signup,
        COUNT(*) FILTER (WHERE days_to_first_premium IS NOT NULL) as eventually_paid,
        AVG(days_to_first_premium) as avg_days_to_convert,
        AVG(lifetime_value) as avg_ltv,
        COUNT(*) FILTER (WHERE is_churned = true) as churned_count,
        ROUND(
          COUNT(*) FILTER (WHERE is_churned = true)::NUMERIC /
          NULLIF(COUNT(*), 0) * 100,
          2
        ) as churn_rate
      FROM user_cohorts
      GROUP BY cohort_month
      ORDER BY cohort_month DESC
      LIMIT 24
    `);

    res.json(cohorts.rows);

  } catch (error) {
    console.error('Error fetching cohort analysis:', error);
    res.status(500).json({ error: 'Failed to fetch cohort analysis' });
  }
});

/**
 * GET /api/analytics/users/engagement
 * Returns engagement metrics
 */
router.get('/users/engagement', async (req, res) => {
  try {
    const { period = '30' } = req.query;

    // Get daily engagement
    const engagementData = await pool.query(`
      SELECT
        metric_date as date,
        active_users,
        daily_logs_created,
        health_records_created,
        content_views
      FROM daily_metrics
      WHERE metric_date >= CURRENT_DATE - INTERVAL '${parseInt(period)} days'
      ORDER BY metric_date ASC
    `);

    // Get feature usage breakdown
    const featureUsage = await pool.query(`
      SELECT
        feature_name,
        subscription_tier,
        COUNT(DISTINCT user_id) as unique_users,
        SUM(usage_count) as total_uses,
        AVG(usage_count) as avg_uses_per_user
      FROM feature_usage
      GROUP BY feature_name, subscription_tier
      ORDER BY total_uses DESC
    `);

    res.json({
      dailyEngagement: engagementData.rows,
      featureUsage: featureUsage.rows
    });

  } catch (error) {
    console.error('Error fetching engagement metrics:', error);
    res.status(500).json({ error: 'Failed to fetch engagement metrics' });
  }
});

// ================================================
// REVENUE ANALYTICS
// ================================================

/**
 * GET /api/analytics/revenue/overview
 * Returns revenue overview across all sources
 */
router.get('/revenue/overview', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT
        metric_date as date,
        subscription_revenue,
        affiliate_revenue,
        (subscription_revenue + affiliate_revenue) as total_revenue,
        mrr,
        arr
      FROM daily_metrics
      WHERE 1=1
    `;

    const params = [];
    if (startDate) {
      params.push(startDate);
      query += ` AND metric_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND metric_date <= $${params.length}`;
    }

    query += ' ORDER BY metric_date DESC LIMIT 365';

    const result = await pool.query(query, params);

    // Calculate totals
    const totalSubRevenue = result.rows.reduce((sum, row) => sum + parseFloat(row.subscription_revenue || 0), 0);
    const totalAffRevenue = result.rows.reduce((sum, row) => sum + parseFloat(row.affiliate_revenue || 0), 0);
    const currentMRR = result.rows[0]?.mrr || 0;
    const currentARR = result.rows[0]?.arr || 0;

    res.json({
      revenueByDay: result.rows,
      summary: {
        totalSubscriptionRevenue: parseFloat(totalSubRevenue.toFixed(2)),
        totalAffiliateRevenue: parseFloat(totalAffRevenue.toFixed(2)),
        totalRevenue: parseFloat((totalSubRevenue + totalAffRevenue).toFixed(2)),
        currentMRR: parseFloat(currentMRR),
        currentARR: parseFloat(currentARR)
      }
    });

  } catch (error) {
    console.error('Error fetching revenue overview:', error);
    res.status(500).json({ error: 'Failed to fetch revenue overview' });
  }
});

/**
 * GET /api/analytics/revenue/projections
 * Returns revenue projections based on current trends
 */
router.get('/revenue/projections', async (req, res) => {
  try {
    // Get last 90 days of data for trend analysis
    const historicalData = await pool.query(`
      SELECT
        metric_date,
        mrr,
        new_subscriptions,
        cancelled_subscriptions
      FROM daily_metrics
      WHERE metric_date >= CURRENT_DATE - INTERVAL '90 days'
      ORDER BY metric_date ASC
    `);

    if (historicalData.rows.length < 30) {
      return res.json({
        error: 'Insufficient data for projections',
        message: 'Need at least 30 days of data'
      });
    }

    // Simple linear regression for MRR growth
    const rows = historicalData.rows;
    const n = rows.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    rows.forEach((row, index) => {
      const x = index;
      const y = parseFloat(row.mrr);
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Project next 12 months
    const currentMRR = parseFloat(rows[n - 1].mrr);
    const projections = [];

    for (let month = 1; month <= 12; month++) {
      const daysAhead = month * 30;
      const projectedMRR = slope * (n + daysAhead) + intercept;
      projections.push({
        month: month,
        projectedMRR: Math.max(0, parseFloat(projectedMRR.toFixed(2))),
        projectedARR: Math.max(0, parseFloat((projectedMRR * 12).toFixed(2)))
      });
    }

    res.json({
      currentMRR: currentMRR,
      growthRate: ((slope / currentMRR) * 100).toFixed(2) + '% per day',
      projections: projections
    });

  } catch (error) {
    console.error('Error calculating revenue projections:', error);
    res.status(500).json({ error: 'Failed to calculate projections' });
  }
});

// ================================================
// INSURANCE ANALYTICS
// ================================================

/**
 * GET /api/analytics/insurance/performance
 * Returns insurance referral performance
 */
router.get('/insurance/performance', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        ip.partner_name,
        COUNT(ir.id) as total_referrals,
        COUNT(*) FILTER (WHERE ir.referral_status = 'quote_requested') as quotes_requested,
        COUNT(*) FILTER (WHERE ir.referral_status = 'purchased') as purchases,
        COALESCE(SUM(ir.estimated_commission), 0) as estimated_commission,
        COALESCE(SUM(ir.actual_commission), 0) as actual_commission,
        ROUND(
          COUNT(*) FILTER (WHERE ir.referral_status = 'purchased')::NUMERIC /
          NULLIF(COUNT(ir.id), 0) * 100,
          2
        ) as conversion_rate
      FROM insurance_partners ip
      LEFT JOIN insurance_referrals ir ON ip.id = ir.partner_id
      WHERE ir.referred_at >= CURRENT_DATE - INTERVAL '90 days' OR ir.referred_at IS NULL
      GROUP BY ip.id, ip.partner_name
      ORDER BY actual_commission DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching insurance performance:', error);
    res.status(500).json({ error: 'Failed to fetch insurance performance' });
  }
});

// ================================================
// EVENTS TRACKING (for real-time analytics)
// ================================================

/**
 * POST /api/analytics/track
 * Track custom analytics events
 */
router.post('/track', async (req, res) => {
  try {
    const {
      userId,
      eventType,
      eventCategory,
      eventData,
      sessionId,
      userAgent
    } = req.body;

    // Get IP from request
    const ipAddress = req.ip || req.connection.remoteAddress;

    await pool.query(`
      INSERT INTO analytics_events (
        user_id, event_type, event_category, event_data,
        session_id, ip_address, user_agent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [userId, eventType, eventCategory, JSON.stringify(eventData), sessionId, ipAddress, userAgent]);

    res.json({ success: true });

  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

/**
 * POST /api/analytics/affiliate-click
 * Track affiliate link clicks
 */
router.post('/affiliate-click', async (req, res) => {
  try {
    const {
      userId,
      productId,
      productType,
      affiliateLink,
      sessionId,
      referrerPage,
      petId,
      recommendationContext
    } = req.body;

    const result = await pool.query(`
      INSERT INTO affiliate_clicks (
        user_id, product_id, product_type, affiliate_link,
        session_id, referrer_page, pet_id, recommendation_context
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id
    `, [
      userId,
      productId,
      productType,
      affiliateLink,
      sessionId,
      referrerPage,
      petId,
      JSON.stringify(recommendationContext)
    ]);

    res.json({ success: true, clickId: result.rows[0].id });

  } catch (error) {
    console.error('Error tracking affiliate click:', error);
    res.status(500).json({ error: 'Failed to track click' });
  }
});

/**
 * POST /api/analytics/update-metrics
 * Manually trigger daily metrics update (can be called by cron)
 */
router.post('/update-metrics', async (req, res) => {
  try {
    const { date } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];

    await pool.query('SELECT update_daily_metrics($1)', [targetDate]);

    res.json({
      success: true,
      message: `Daily metrics updated for ${targetDate}`
    });

  } catch (error) {
    console.error('Error updating daily metrics:', error);
    res.status(500).json({ error: 'Failed to update metrics' });
  }
});

module.exports = router;
