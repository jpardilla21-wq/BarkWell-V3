# Phase 5: Advanced Analytics & Admin Dashboard

## Overview

Phase 5 adds comprehensive analytics tracking and an admin dashboard for monitoring business metrics, user behavior, subscription performance, and affiliate revenue.

## Features Implemented

### 📊 Analytics Database Schema

**New Tables:**
- `analytics_events` - Track user interactions and feature usage
- `affiliate_clicks` - Monitor affiliate link clicks and conversions
- `subscription_changes` - Track subscription tier changes and churn
- `daily_metrics` - Pre-computed daily metrics snapshot
- `user_cohorts` - Cohort analysis for retention and LTV
- `feature_usage` - Track which premium features are used
- `insurance_referrals` - Insurance partner referral tracking

**Views:**
- `v_subscription_metrics` - Real-time subscription stats
- `v_affiliate_performance` - Affiliate performance aggregations
- `v_user_growth` - User growth over time
- `v_churn_analysis` - Churn metrics by month

**Functions:**
- `calculate_mrr(date)` - Calculate MRR for any date
- `calculate_churn_rate(start, end)` - Calculate churn rate for period
- `update_daily_metrics(date)` - Update daily metrics snapshot

### 🔌 Analytics API Endpoints

**Dashboard**
- `GET /api/analytics/dashboard` - Overview metrics for admin dashboard

**Subscriptions**
- `GET /api/analytics/subscriptions/metrics` - Detailed subscription metrics
- `GET /api/analytics/subscriptions/churn` - Churn analysis
- `GET /api/analytics/subscriptions/funnel` - Conversion funnel data

**Affiliates**
- `GET /api/analytics/affiliates/performance` - Affiliate performance metrics
- `GET /api/analytics/affiliates/categories` - Performance by product category

**Users**
- `GET /api/analytics/users/growth` - User growth metrics
- `GET /api/analytics/users/cohorts` - Cohort analysis
- `GET /api/analytics/users/engagement` - Engagement metrics

**Revenue**
- `GET /api/analytics/revenue/overview` - Revenue across all sources
- `GET /api/analytics/revenue/projections` - Revenue projections

**Insurance**
- `GET /api/analytics/insurance/performance` - Insurance referral performance

**Tracking**
- `POST /api/analytics/track` - Track custom events
- `POST /api/analytics/affiliate-click` - Track affiliate clicks
- `POST /api/analytics/update-metrics` - Update daily metrics

### 🖥️ Admin Dashboard UI

**Overview Tab**
- Total users and paid user conversion rate
- Monthly Recurring Revenue (MRR) and Annual Recurring Revenue (ARR)
- Average revenue per user (ARPU)
- Affiliate revenue and clicks
- Subscription tier distribution bar chart
- Conversion funnel visualization

**Subscriptions Tab**
- Free, Plus, and Pro subscriber counts
- Total MRR breakdown
- Churn analysis table with monthly metrics
- MRR lost vs gained tracking

**Affiliates Tab**
- Total clicks and revenue
- Top performing products table
- Performance by category

**Users Tab**
- Total users, paid users, conversion rate
- User growth trend chart
- Cohort analysis table with LTV and churn

**Revenue Tab**
- Total revenue across all sources
- Subscription vs affiliate revenue breakdown
- Current MRR and ARR
- Visual revenue source comparison

## Installation & Setup

### 1. Run Database Migration

```bash
cd backend
node scripts/migratePhase5.js
```

This will:
- Create 7 new analytics tables
- Create 4 analytics views
- Create 3 analytics functions
- Set up indexes for query optimization

### 2. Set Up Daily Metrics Cron Job

The `daily_metrics` table should be updated daily. Set up a cron job:

```bash
# Add to crontab (crontab -e)
0 1 * * * curl -X POST http://localhost:3001/api/analytics/update-metrics
```

Or use a node-cron scheduled job:

```javascript
// In backend/server.js
const cron = require('node-cron');

// Run daily at 1:00 AM
cron.schedule('0 1 * * *', async () => {
  try {
    await pool.query('SELECT update_daily_metrics()');
    console.log('Daily metrics updated successfully');
  } catch (error) {
    console.error('Failed to update daily metrics:', error);
  }
});
```

### 3. Start the Backend Server

```bash
cd backend
npm start
```

The analytics endpoints will be available at:
- http://localhost:3001/api/analytics/*

### 4. Add Admin Dashboard to Frontend

The admin dashboard component has been created at:
- `frontend/src/components/AdminDashboard.jsx`
- `frontend/src/components/AdminDashboard.css`

**Add to your App.jsx:**

```jsx
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="app">
      {/* ... other tabs ... */}
      {activeTab === 'admin' && <AdminDashboard />}
    </div>
  );
}
```

### 5. Access the Admin Dashboard

Navigate to the Admin tab in your application to view the analytics dashboard.

## Key Metrics Tracked

### Subscription Metrics
- **MRR (Monthly Recurring Revenue)**: Total monthly subscription revenue
- **ARR (Annual Recurring Revenue)**: MRR × 12
- **Churn Rate**: Percentage of users who cancel subscriptions
- **Conversion Rate**: Percentage of free users who upgrade to paid
- **ARPU (Average Revenue Per User)**: MRR / paid users

### Affiliate Metrics
- **Click-through Rate**: Percentage of users who click affiliate links
- **Conversion Rate**: Percentage of clicks that result in purchases
- **Revenue**: Total affiliate commission earned
- **Top Products**: Best performing affiliate products

### User Metrics
- **Total Users**: All registered users
- **Active Users**: Users who logged in during period
- **New Users**: New signups during period
- **User Growth**: New users over time

### Cohort Metrics
- **Cohort Size**: Number of users who signed up in a given month
- **LTV (Lifetime Value)**: Average revenue per user over lifetime
- **Days to Convert**: Average days from signup to first paid subscription
- **Retention Rate**: Percentage of cohort still active

## Performance Optimization

### Daily Metrics Snapshot

The `daily_metrics` table pre-computes expensive aggregations daily, enabling:
- **Fast Dashboard Loading**: No need to run complex queries on page load
- **Historical Tracking**: View metrics for any past date
- **Trend Analysis**: Compare metrics across time periods

### Indexed Queries

All analytics tables have indexes optimized for common queries:
- User ID lookups
- Date range queries
- Event type filtering
- Aggregation queries

### View-Based Aggregations

Views like `v_subscription_metrics` provide real-time aggregations without stored procedures, making queries simple and fast.

## Example Queries

### Get Current MRR
```sql
SELECT calculate_mrr(CURRENT_DATE);
```

### Get Churn Rate for Last Month
```sql
SELECT calculate_churn_rate(
  CURRENT_DATE - INTERVAL '1 month',
  CURRENT_DATE
);
```

### Get Top 10 Users by Lifetime Value
```sql
SELECT
  u.email,
  uc.lifetime_value,
  uc.days_to_first_premium,
  uc.is_churned
FROM user_cohorts uc
JOIN users u ON uc.user_id = u.id
ORDER BY uc.lifetime_value DESC
LIMIT 10;
```

### Get Affiliate Performance by Category
```sql
SELECT
  rp.category,
  COUNT(ac.id) as total_clicks,
  SUM(ac.conversion_amount) as revenue
FROM affiliate_clicks ac
JOIN recommended_products rp ON ac.product_id = rp.id
WHERE ac.clicked_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY rp.category
ORDER BY revenue DESC;
```

## Event Tracking Integration

### Track Custom Events

Use the analytics tracking endpoints to monitor user behavior:

```javascript
// Track page view
await trackEvent({
  userId: user.id,
  eventType: 'page_view',
  eventCategory: 'engagement',
  eventData: { page: '/wellness-dashboard' },
  sessionId: sessionId,
  userAgent: navigator.userAgent
});

// Track feature usage
await trackEvent({
  userId: user.id,
  eventType: 'feature_used',
  eventCategory: 'premium',
  eventData: { feature: 'pdf_export' },
  sessionId: sessionId
});
```

### Track Affiliate Clicks

```javascript
// When user clicks an affiliate product
await trackAffiliateClickDetailed({
  userId: user.id,
  productId: product.id,
  productType: product.category,
  affiliateLink: product.affiliate_link,
  sessionId: sessionId,
  referrerPage: window.location.pathname,
  petId: currentPet.id,
  recommendationContext: {
    source: 'curated_recommendations',
    petSize: currentPet.size,
    petAge: currentPet.age
  }
});
```

## Security Considerations

### Admin Access Control

**Important**: The analytics dashboard should only be accessible to admin users. Implement authentication/authorization:

```javascript
// backend/middleware/requireAdmin.js
const requireAdmin = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await pool.query(
    'SELECT is_admin FROM users WHERE id = $1',
    [userId]
  );

  if (!user.rows[0]?.is_admin) {
    return res.status(403).json({ error: 'Forbidden - Admin access required' });
  }

  next();
};

// Apply to analytics routes
app.use('/api/analytics', requireAdmin, analyticsRoutes);
```

### Rate Limiting

Apply rate limiting to analytics endpoints to prevent abuse:

```javascript
const rateLimit = require('express-rate-limit');

const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many analytics requests'
});

app.use('/api/analytics', analyticsLimiter);
```

## Monitoring & Alerts

### Set Up Alerts

Monitor key metrics and set up alerts for:
- MRR drops below threshold
- Churn rate spikes above normal
- Failed payment rate increases
- Affiliate conversion rate drops

### Dashboard Refresh

The admin dashboard automatically fetches fresh data based on the selected time period. Metrics update in real-time when the date range changes.

## Next Steps

After implementing Phase 5 analytics:

1. **Phase 6: Referral Program** - Add user referral system with rewards
2. **Phase 7: Partner Integrations** - Integrate with vet telemedicine, fitness trackers
3. **Phase 8: AI Insights** - Add AI-powered health insights for Pro users
4. **Phase 9: Mobile Apps** - Build native iOS and Android apps
5. **Phase 10: Enterprise Features** - Multi-pet household plans, breeder accounts

## Troubleshooting

### Dashboard Shows No Data

1. Ensure Phase 5 migration ran successfully
2. Run `SELECT update_daily_metrics()` to populate metrics
3. Check that your app has some users and activity

### Slow Dashboard Loading

1. Ensure daily metrics are being updated regularly
2. Check database indexes are created
3. Consider adding caching layer for frequently accessed metrics

### Incorrect Metrics

1. Verify webhook handlers are processing events correctly
2. Check `subscription_changes` table is being populated
3. Manually run `update_daily_metrics()` to recalculate

## Support

For questions or issues with Phase 5 analytics:
- Review the analytics API documentation in `backend/routes/analytics.js`
- Check the database schema in `database/phase5-schema.sql`
- Review the admin dashboard code in `frontend/src/components/AdminDashboard.jsx`

---

**Phase 5 Complete!** 🎉

You now have comprehensive analytics tracking and a beautiful admin dashboard for monitoring your BarkWell business metrics.
