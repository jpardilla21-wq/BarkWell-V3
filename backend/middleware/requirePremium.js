/**
 * Premium Subscription Middleware
 * Blocks access to premium features for free-tier users
 */

const db = require("../config/database");

/**
 * Middleware to require premium subscription (Plus or Pro)
 * @param {Array} allowedTiers - Optional array of allowed tiers (default: ['plus', 'pro'])
 */
const requirePremium = (allowedTiers = ["plus", "pro"]) => {
  return async (req, res, next) => {
    try {
      // In a real app, you'd get userId from JWT token in req.user
      // For now, we'll use a userId from query params or body for testing
      const userId = req.userId || req.query.userId || req.body.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
          message: "User ID not found. Please log in.",
        });
      }

      // Query user's subscription tier
      const result = await db.query(
        "SELECT subscription_tier, subscription_expiry FROM users WHERE id = $1",
        [userId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const user = result.rows[0];
      const { subscription_tier, subscription_expiry } = user;

      // Check if subscription is expired (if expiry date exists)
      if (subscription_expiry && new Date(subscription_expiry) < new Date()) {
        return res.status(403).json({
          success: false,
          error: "Subscription expired",
          message:
            "Your subscription has expired. Please renew to access this feature.",
          currentTier: "free",
          upgradeRequired: true,
          upgradeUrl: "/pricing",
        });
      }

      // Check if user has required tier
      if (!allowedTiers.includes(subscription_tier)) {
        return res.status(403).json({
          success: false,
          error: "Premium subscription required",
          message: `This feature requires a ${allowedTiers.join(" or ")} subscription.`,
          currentTier: subscription_tier,
          requiredTiers: allowedTiers,
          upgradeRequired: true,
          upgradeUrl: "/pricing",
        });
      }

      // User has access - attach subscription info to request
      req.subscription = {
        tier: subscription_tier,
        expiry: subscription_expiry,
      };

      next();
    } catch (error) {
      console.error("Premium middleware error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to verify subscription status",
      });
    }
  };
};

/**
 * Middleware to require Pro subscription specifically
 */
const requirePro = () => requirePremium(["pro"]);

/**
 * Middleware to attach user's subscription info without blocking
 * Useful for conditional feature display
 */
const attachSubscription = async (req, res, next) => {
  try {
    const userId = req.userId || req.query.userId || req.body.userId;

    if (!userId) {
      req.subscription = { tier: "free" };
      return next();
    }

    const result = await db.query(
      "SELECT subscription_tier, subscription_expiry FROM users WHERE id = $1",
      [userId],
    );

    if (result.rows.length === 0) {
      req.subscription = { tier: "free" };
      return next();
    }

    const user = result.rows[0];
    const { subscription_tier, subscription_expiry } = user;

    // Check if expired
    const isExpired =
      subscription_expiry && new Date(subscription_expiry) < new Date();

    req.subscription = {
      tier: isExpired ? "free" : subscription_tier,
      expiry: subscription_expiry,
      isExpired,
    };

    next();
  } catch (error) {
    console.error("Attach subscription middleware error:", error);
    req.subscription = { tier: "free" };
    next();
  }
};

module.exports = {
  requirePremium,
  requirePro,
  attachSubscription,
};
