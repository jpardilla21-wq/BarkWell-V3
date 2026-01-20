-- ================================================
-- Phase 5: Advanced Analytics Schema
-- BarkWell Database Migration
-- ================================================

-- ================================================
-- TABLE: Analytics Events
-- Tracks user interactions and feature usage
-- ================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  event_type VARCHAR(100) NOT NULL, -- e.g., 'page_view', 'feature_used', 'subscription_upgraded'
  event_category VARCHAR(50), -- e.g., 'engagement', 'monetization', 'retention'
  event_data JSONB, -- Flexible storage for event-specific data
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_data ON analytics_events USING GIN(event_data);

-- ================================================
-- TABLE: Affiliate Clicks
-- Tracks affiliate link clicks for conversion analysis
-- ================================================
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  product_id INTEGER REFERENCES recommended_products(id) ON DELETE CASCADE,
  product_type VARCHAR(50) NOT NULL, -- 'food', 'toy', 'bed', 'supplement', etc.
  affiliate_link TEXT NOT NULL,
  session_id VARCHAR(255),
  referrer_page VARCHAR(255), -- Which page the click came from
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Conversion tracking (updated later if known)
  converted BOOLEAN DEFAULT false,
  conversion_amount DECIMAL(10,2),
  conversion_date TIMESTAMP,

  -- Attribution
  pet_id INTEGER REFERENCES pets(id) ON DELETE SET NULL,
  recommendation_context JSONB -- Why this was recommended (size, age, etc.)
);

CREATE INDEX idx_affiliate_clicks_user_id ON affiliate_clicks(user_id);
CREATE INDEX idx_affiliate_clicks_product_id ON affiliate_clicks(product_id);
CREATE INDEX idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at);
CREATE INDEX idx_affiliate_clicks_converted ON affiliate_clicks(converted);

-- ================================================
-- TABLE: Subscription Changes
-- Tracks subscription tier changes for churn/conversion analysis
-- ================================================
CREATE TABLE IF NOT EXISTS subscription_changes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_tier VARCHAR(20) NOT NULL CHECK (from_tier IN ('free', 'plus', 'pro')),
  to_tier VARCHAR(20) NOT NULL CHECK (to_tier IN ('free', 'plus', 'pro')),
  change_type VARCHAR(20) NOT NULL CHECK (change_type IN ('upgrade', 'downgrade', 'churn')),
  reason TEXT, -- Optional user-provided reason
  mrr_change DECIMAL(10,2), -- Monthly recurring revenue impact
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_subscription_changes_user_id ON subscription_changes(user_id);
CREATE INDEX idx_subscription_changes_type ON subscription_changes(change_type);
CREATE INDEX idx_subscription_changes_changed_at ON subscription_changes(changed_at);

-- ================================================
-- TABLE: Daily Metrics Snapshot
-- Pre-computed daily metrics for fast dashboard loading
-- ================================================
CREATE TABLE IF NOT EXISTS daily_metrics (
  id SERIAL PRIMARY KEY,
  metric_date DATE NOT NULL UNIQUE,

  -- User metrics
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0, -- Users who logged in that day

  -- Subscription metrics
  free_users INTEGER DEFAULT 0,
  plus_users INTEGER DEFAULT 0,
  pro_users INTEGER DEFAULT 0,
  mrr DECIMAL(10,2) DEFAULT 0, -- Monthly Recurring Revenue
  arr DECIMAL(10,2) DEFAULT 0, -- Annual Recurring Revenue

  -- Engagement metrics
  daily_logs_created INTEGER DEFAULT 0,
  health_records_created INTEGER DEFAULT 0,
  content_views INTEGER DEFAULT 0,

  -- Monetization metrics
  affiliate_clicks INTEGER DEFAULT 0,
  affiliate_conversions INTEGER DEFAULT 0,
  affiliate_revenue DECIMAL(10,2) DEFAULT 0,
  new_subscriptions INTEGER DEFAULT 0,
  cancelled_subscriptions INTEGER DEFAULT 0,
  subscription_revenue DECIMAL(10,2) DEFAULT 0,

  -- Conversion rates (stored as percentages)
  free_to_paid_rate DECIMAL(5,2) DEFAULT 0,
  affiliate_ctr DECIMAL(5,2) DEFAULT 0, -- Click-through rate
  affiliate_conversion_rate DECIMAL(5,2) DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_daily_metrics_date ON daily_metrics(metric_date);

-- ================================================
-- TABLE: User Cohorts
-- Track user cohorts for retention and LTV analysis
-- ================================================
CREATE TABLE IF NOT EXISTS user_cohorts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cohort_month DATE NOT NULL, -- First day of the month user signed up
  acquisition_source VARCHAR(100), -- How they found the app
  first_pet_breed VARCHAR(255),
  first_subscription_tier VARCHAR(20) DEFAULT 'free',
  days_to_first_premium INTEGER, -- NULL if never upgraded
  lifetime_value DECIMAL(10,2) DEFAULT 0, -- Total revenue from this user
  is_churned BOOLEAN DEFAULT false,
  churn_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_cohorts_user_id ON user_cohorts(user_id);
CREATE INDEX idx_user_cohorts_cohort_month ON user_cohorts(cohort_month);
CREATE INDEX idx_user_cohorts_is_churned ON user_cohorts(is_churned);

-- ================================================
-- TABLE: Feature Usage
-- Track which premium features are actually being used
-- ================================================
CREATE TABLE IF NOT EXISTS feature_usage (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feature_name VARCHAR(100) NOT NULL, -- e.g., 'wellness_trends', 'pdf_export', 'ai_insights'
  usage_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  subscription_tier VARCHAR(20) NOT NULL,

  UNIQUE(user_id, feature_name)
);

CREATE INDEX idx_feature_usage_user_id ON feature_usage(user_id);
CREATE INDEX idx_feature_usage_feature_name ON feature_usage(feature_name);
CREATE INDEX idx_feature_usage_tier ON feature_usage(subscription_tier);

-- ================================================
-- TABLE: Insurance Referrals
-- Track insurance quote requests and conversions
-- ================================================
CREATE TABLE IF NOT EXISTS insurance_referrals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  pet_id INTEGER REFERENCES pets(id) ON DELETE SET NULL,
  partner_id INTEGER NOT NULL REFERENCES insurance_partners(id) ON DELETE CASCADE,
  referral_status VARCHAR(20) DEFAULT 'clicked' CHECK (referral_status IN ('clicked', 'quote_requested', 'purchased')),
  estimated_commission DECIMAL(10,2),
  actual_commission DECIMAL(10,2),
  referred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  converted_at TIMESTAMP,
  pet_age_at_referral INTEGER, -- In months
  pet_breed VARCHAR(255)
);

CREATE INDEX idx_insurance_referrals_user_id ON insurance_referrals(user_id);
CREATE INDEX idx_insurance_referrals_partner_id ON insurance_referrals(partner_id);
CREATE INDEX idx_insurance_referrals_status ON insurance_referrals(referral_status);
CREATE INDEX idx_insurance_referrals_referred_at ON insurance_referrals(referred_at);

-- ================================================
-- VIEWS: Analytics Aggregations
-- ================================================

-- Subscription Metrics View
CREATE OR REPLACE VIEW v_subscription_metrics AS
SELECT
  COUNT(*) FILTER (WHERE subscription_tier = 'free') as free_users,
  COUNT(*) FILTER (WHERE subscription_tier = 'plus') as plus_users,
  COUNT(*) FILTER (WHERE subscription_tier = 'pro') as pro_users,
  COUNT(*) FILTER (WHERE subscription_tier IN ('plus', 'pro')) as paid_users,
  ROUND(
    COUNT(*) FILTER (WHERE subscription_tier IN ('plus', 'pro'))::NUMERIC /
    NULLIF(COUNT(*), 0) * 100,
    2
  ) as conversion_rate,
  SUM(
    CASE
      WHEN subscription_tier = 'plus' THEN 4.99
      WHEN subscription_tier = 'pro' THEN 9.99
      ELSE 0
    END
  ) as mrr,
  SUM(
    CASE
      WHEN subscription_tier = 'plus' THEN 4.99 * 12
      WHEN subscription_tier = 'pro' THEN 9.99 * 12
      ELSE 0
    END
  ) as arr
FROM users
WHERE subscription_expiry IS NULL OR subscription_expiry > NOW();

-- Affiliate Performance View
CREATE OR REPLACE VIEW v_affiliate_performance AS
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
  COALESCE(SUM(conversion_amount) * 0.05, 0) as estimated_commission -- Assuming 5% commission
FROM affiliate_clicks
GROUP BY DATE_TRUNC('day', clicked_at), product_type
ORDER BY date DESC;

-- User Growth View
CREATE OR REPLACE VIEW v_user_growth AS
SELECT
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as new_users,
  SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as cumulative_users
FROM users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- Churn Analysis View
CREATE OR REPLACE VIEW v_churn_analysis AS
SELECT
  DATE_TRUNC('month', changed_at) as month,
  COUNT(*) FILTER (WHERE change_type = 'churn') as churned_users,
  COUNT(*) FILTER (WHERE change_type = 'upgrade') as upgrades,
  COUNT(*) FILTER (WHERE change_type = 'downgrade') as downgrades,
  SUM(mrr_change) FILTER (WHERE change_type = 'churn') as mrr_lost,
  SUM(mrr_change) FILTER (WHERE change_type = 'upgrade') as mrr_gained
FROM subscription_changes
GROUP BY DATE_TRUNC('month', changed_at)
ORDER BY month DESC;

-- ================================================
-- FUNCTION: Calculate MRR for a specific date
-- ================================================
CREATE OR REPLACE FUNCTION calculate_mrr(target_date DATE DEFAULT CURRENT_DATE)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  mrr_total DECIMAL(10,2);
BEGIN
  SELECT SUM(
    CASE
      WHEN subscription_tier = 'plus' THEN 4.99
      WHEN subscription_tier = 'pro' THEN 9.99
      ELSE 0
    END
  ) INTO mrr_total
  FROM users
  WHERE (subscription_expiry IS NULL OR subscription_expiry > target_date)
    AND subscription_tier IN ('plus', 'pro');

  RETURN COALESCE(mrr_total, 0);
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- FUNCTION: Calculate churn rate for a time period
-- ================================================
CREATE OR REPLACE FUNCTION calculate_churn_rate(
  start_date DATE,
  end_date DATE
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  users_at_start INTEGER;
  users_churned INTEGER;
  churn_rate DECIMAL(5,2);
BEGIN
  -- Count active paid users at start
  SELECT COUNT(*) INTO users_at_start
  FROM users
  WHERE subscription_tier IN ('plus', 'pro')
    AND created_at < start_date
    AND (subscription_expiry IS NULL OR subscription_expiry > start_date);

  -- Count users who churned during period
  SELECT COUNT(*) INTO users_churned
  FROM subscription_changes
  WHERE change_type = 'churn'
    AND changed_at BETWEEN start_date AND end_date;

  -- Calculate rate
  IF users_at_start > 0 THEN
    churn_rate := (users_churned::NUMERIC / users_at_start) * 100;
  ELSE
    churn_rate := 0;
  END IF;

  RETURN ROUND(churn_rate, 2);
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- FUNCTION: Update daily metrics (run via cron)
-- ================================================
CREATE OR REPLACE FUNCTION update_daily_metrics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS void AS $$
DECLARE
  metrics_record RECORD;
BEGIN
  -- Calculate all metrics for the target date
  SELECT
    -- User metrics
    (SELECT COUNT(*) FROM users WHERE created_at::DATE <= target_date) as total_users,
    (SELECT COUNT(*) FROM users WHERE created_at::DATE = target_date) as new_users,
    (SELECT COUNT(DISTINCT user_id) FROM analytics_events WHERE created_at::DATE = target_date) as active_users,

    -- Subscription metrics
    (SELECT COUNT(*) FROM users WHERE subscription_tier = 'free' AND created_at::DATE <= target_date) as free_users,
    (SELECT COUNT(*) FROM users WHERE subscription_tier = 'plus' AND (subscription_expiry IS NULL OR subscription_expiry > target_date)) as plus_users,
    (SELECT COUNT(*) FROM users WHERE subscription_tier = 'pro' AND (subscription_expiry IS NULL OR subscription_expiry > target_date)) as pro_users,
    calculate_mrr(target_date) as mrr,
    calculate_mrr(target_date) * 12 as arr,

    -- Engagement metrics
    (SELECT COUNT(*) FROM daily_logs WHERE log_date = target_date) as daily_logs_created,
    (SELECT COUNT(*) FROM health_records WHERE created_at::DATE = target_date) as health_records_created,
    (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'content_view' AND created_at::DATE = target_date) as content_views,

    -- Monetization metrics
    (SELECT COUNT(*) FROM affiliate_clicks WHERE clicked_at::DATE = target_date) as affiliate_clicks,
    (SELECT COUNT(*) FROM affiliate_clicks WHERE converted = true AND conversion_date::DATE = target_date) as affiliate_conversions,
    (SELECT COALESCE(SUM(conversion_amount * 0.05), 0) FROM affiliate_clicks WHERE converted = true AND conversion_date::DATE = target_date) as affiliate_revenue,
    (SELECT COUNT(*) FROM subscription_changes WHERE change_type = 'upgrade' AND changed_at::DATE = target_date) as new_subscriptions,
    (SELECT COUNT(*) FROM subscription_changes WHERE change_type = 'churn' AND changed_at::DATE = target_date) as cancelled_subscriptions,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE created_at::DATE = target_date AND status = 'completed') as subscription_revenue
  INTO metrics_record;

  -- Insert or update the daily metrics
  INSERT INTO daily_metrics (
    metric_date, total_users, new_users, active_users,
    free_users, plus_users, pro_users, mrr, arr,
    daily_logs_created, health_records_created, content_views,
    affiliate_clicks, affiliate_conversions, affiliate_revenue,
    new_subscriptions, cancelled_subscriptions, subscription_revenue
  ) VALUES (
    target_date, metrics_record.total_users, metrics_record.new_users, metrics_record.active_users,
    metrics_record.free_users, metrics_record.plus_users, metrics_record.pro_users,
    metrics_record.mrr, metrics_record.arr,
    metrics_record.daily_logs_created, metrics_record.health_records_created, metrics_record.content_views,
    metrics_record.affiliate_clicks, metrics_record.affiliate_conversions, metrics_record.affiliate_revenue,
    metrics_record.new_subscriptions, metrics_record.cancelled_subscriptions, metrics_record.subscription_revenue
  )
  ON CONFLICT (metric_date) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    new_users = EXCLUDED.new_users,
    active_users = EXCLUDED.active_users,
    free_users = EXCLUDED.free_users,
    plus_users = EXCLUDED.plus_users,
    pro_users = EXCLUDED.pro_users,
    mrr = EXCLUDED.mrr,
    arr = EXCLUDED.arr,
    daily_logs_created = EXCLUDED.daily_logs_created,
    health_records_created = EXCLUDED.health_records_created,
    content_views = EXCLUDED.content_views,
    affiliate_clicks = EXCLUDED.affiliate_clicks,
    affiliate_conversions = EXCLUDED.affiliate_conversions,
    affiliate_revenue = EXCLUDED.affiliate_revenue,
    new_subscriptions = EXCLUDED.new_subscriptions,
    cancelled_subscriptions = EXCLUDED.cancelled_subscriptions,
    subscription_revenue = EXCLUDED.subscription_revenue;

END;
$$ LANGUAGE plpgsql;

-- ================================================
-- Success Message
-- ================================================
SELECT 'Phase 5: Advanced Analytics schema migration completed successfully!' AS message;
