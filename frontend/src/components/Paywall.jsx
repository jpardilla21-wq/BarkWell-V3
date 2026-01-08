import { useState } from 'react';

const Paywall = ({
  feature = 'Premium Feature',
  currentTier = 'free',
  requiredTier = 'plus',
  onUpgrade
}) => {
  // Determine styling based on required tier
  const tierColors = {
    plus: {
      bg: 'bg-blue-600',
      hoverBg: 'hover:bg-blue-700',
      text: 'text-blue-600',
      border: 'border-blue-200',
      lightBg: 'bg-blue-50'
    },
    pro: {
      bg: 'bg-gradient-to-r from-purple-600 to-pink-600',
      hoverBg: 'hover:from-purple-700 hover:to-pink-700',
      text: 'text-purple-600',
      border: 'border-purple-200',
      lightBg: 'bg-purple-50'
    }
  };

  const colors = tierColors[requiredTier] || tierColors.plus;

  // Get tier-specific benefits
  const getTierBenefits = () => {
    if (requiredTier === 'pro') {
      return [
        'AI-powered wellness insights',
        'Telemedicine consultations',
        'Priority customer support',
        'Advanced analytics and reports'
      ];
    }
    return [
      'Unlimited health records',
      'Wellness trend charts',
      'PDF export capabilities',
      'Ad-free experience'
    ];
  };

  const benefits = getTierBenefits();

  return (
    <div className="relative">
      {/* Blurred/Locked Content Indicator */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          {/* Card */}
          <div className={`${colors.lightBg} ${colors.border} border-2 rounded-xl shadow-xl p-8`}>
            {/* Lock Icon */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                <span className="text-4xl">🔒</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {feature} Locked
              </h3>
              <p className="text-gray-600">
                Upgrade to <span className="font-semibold capitalize">{requiredTier}</span> to unlock this feature
              </p>
            </div>

            {/* Benefits List */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                What you'll get with {requiredTier.toUpperCase()}:
              </p>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={onUpgrade}
                className={`w-full ${colors.bg} ${colors.hoverBg} text-white py-3 px-6 rounded-lg font-semibold transition shadow-lg`}
              >
                Upgrade to {requiredTier.toUpperCase()} Now
              </button>
              <button
                onClick={onUpgrade}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2 px-6 rounded-lg font-medium transition border border-gray-300"
              >
                View All Plans
              </button>
            </div>

            {/* Price Display */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Starting at{' '}
                <span className="font-bold text-gray-900">
                  ${requiredTier === 'pro' ? '9.99' : '4.99'}/month
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dummy Content (Optional - for visual blur effect) */}
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        <div className="bg-gray-100 rounded-lg p-6 h-64">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
