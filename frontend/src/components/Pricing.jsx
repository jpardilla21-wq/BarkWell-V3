import { useState, useEffect } from 'react';
import { getSubscriptionTiers, subscribeToTier, getSubscriptionStatus } from '../services/api';

const Pricing = ({ userId = 1 }) => {
  const [tiers, setTiers] = useState([]);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tiersResponse, statusResponse] = await Promise.all([
        getSubscriptionTiers(),
        getSubscriptionStatus(userId)
      ]);

      if (tiersResponse.success) {
        setTiers(tiersResponse.tiers);
      }

      if (statusResponse.success) {
        setCurrentStatus(statusResponse.subscription);
      }

      setError(null);
    } catch (err) {
      console.error('Error fetching pricing data:', err);
      setError('Failed to load pricing information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tierId) => {
    if (tierId === 'free') return;

    try {
      setSubscribing(true);
      setError(null);
      setSuccess(null);

      const response = await subscribeToTier(userId, tierId);

      if (response.success) {
        setSuccess(`Successfully subscribed to ${tierId.toUpperCase()}! 🎉`);
        // Refresh subscription status
        await fetchData();
      } else {
        setError(response.error || 'Failed to subscribe');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError('Failed to process subscription');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-gray-600">
          Unlock premium features to give your pup the best care possible
        </p>

        {/* Current Plan Badge */}
        {currentStatus && (
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
            <span className="text-blue-700 font-medium">
              Current Plan: {currentStatus.tier?.toUpperCase() || 'FREE'}
              {currentStatus.expiry && !currentStatus.isExpired && (
                <span className="text-blue-600 ml-2">
                  (Renews {new Date(currentStatus.expiry).toLocaleDateString()})
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800 font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => {
          const isCurrentPlan = currentStatus?.tier === tier.id;
          const canUpgrade = tier.id !== 'free' && currentStatus?.tier === 'free';

          return (
            <div
              key={tier.id}
              className={`bg-white rounded-xl shadow-lg border-2 transition-all hover:shadow-xl ${
                tier.popular
                  ? 'border-blue-500 ring-4 ring-blue-100 transform scale-105'
                  : isCurrentPlan
                  ? 'border-green-500'
                  : 'border-gray-200'
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="bg-blue-500 text-white text-center py-2 rounded-t-lg font-semibold text-sm">
                  ⭐ MOST POPULAR
                </div>
              )}

              {/* Current Plan Badge */}
              {isCurrentPlan && !tier.popular && (
                <div className="bg-green-500 text-white text-center py-2 rounded-t-lg font-semibold text-sm">
                  ✓ YOUR CURRENT PLAN
                </div>
              )}

              <div className="p-6">
                {/* Tier Name & Price */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-extrabold text-gray-900">
                      ${tier.price}
                    </span>
                    {tier.interval && (
                      <span className="text-gray-600 ml-2">/{tier.interval}</span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Limitations (for free tier) */}
                {tier.limitations && tier.limitations.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Limitations:</p>
                    <ul className="space-y-2">
                      {tier.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          <span className="text-sm text-gray-600">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={subscribing || isCurrentPlan || tier.id === 'free'}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : tier.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : canUpgrade
                      ? 'bg-gray-800 text-white hover:bg-gray-900'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {subscribing
                    ? 'Processing...'
                    : isCurrentPlan
                    ? 'Current Plan'
                    : tier.id === 'free'
                    ? 'Free Forever'
                    : 'Upgrade Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Indicators */}
      <div className="mt-16 bg-gray-50 rounded-xl p-8">
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="font-semibold text-gray-900 mb-1">Secure Payments</h4>
            <p className="text-sm text-gray-600">Your payment information is safe and encrypted</p>
          </div>
          <div>
            <div className="text-3xl mb-2">🔄</div>
            <h4 className="font-semibold text-gray-900 mb-1">Cancel Anytime</h4>
            <p className="text-sm text-gray-600">No long-term contracts or hidden fees</p>
          </div>
          <div>
            <div className="text-3xl mb-2">💎</div>
            <h4 className="font-semibold text-gray-900 mb-1">Premium Support</h4>
            <p className="text-sm text-gray-600">Get help when you need it most</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h4>
            <p className="text-gray-600">Yes! You can change your plan at any time. Upgrades take effect immediately.</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Is there a trial period?</h4>
            <p className="text-gray-600">The Free tier gives you full access to basic features with no time limit. Try it risk-free!</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">How does billing work?</h4>
            <p className="text-gray-600">Plans are billed monthly. You'll be charged on the same day each month. Cancel anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
