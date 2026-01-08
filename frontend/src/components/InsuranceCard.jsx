import { useState, useEffect } from 'react';
import { getInsurancePartners, trackAffiliateClick } from '../services/api';

const InsuranceCard = ({ petId, petName, petAge, hasInsurance = false, onClose }) => {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetchInsurancePartner();
  }, [petId]);

  const fetchInsurancePartner = async () => {
    try {
      setLoading(true);
      const response = await getInsurancePartners();

      if (response.success && response.partners && response.partners.length > 0) {
        // Select a random partner from the list
        const randomIndex = Math.floor(Math.random() * response.partners.length);
        setPartner(response.partners[randomIndex]);
      }
    } catch (error) {
      console.error('Error fetching insurance partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetQuote = async () => {
    if (!partner) return;

    try {
      // Track the referral click
      await trackAffiliateClick(partner.id, petId, 'insurance');

      // Open partner link in new tab
      window.open(partner.referral_link, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking insurance click:', error);
      // Still open the link even if tracking fails
      window.open(partner.referral_link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    if (onClose) {
      onClose();
    }
  };

  // Don't show if:
  // - Already dismissed
  // - Pet already has insurance
  // - Pet is too young (< 6 months)
  // - No partner data
  // - Loading
  if (dismissed || hasInsurance || petAge < 0.5 || !partner || loading) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl shadow-lg p-6 relative">
      {/* Close Button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        aria-label="Dismiss"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0 mr-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-4xl">🏥</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            Protect {petName} with Pet Insurance
          </h3>
          <p className="text-sm text-gray-600">
            Peace of mind for unexpected vet bills
          </p>
        </div>
      </div>

      {/* Partner Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-gray-900 text-lg">{partner.partner_name}</h4>
          {partner.discount_offer && (
            <span className="inline-flex items-center px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
              🎁 {partner.discount_offer}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 mb-3">
          {partner.description}
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-green-100">
        <p className="text-xs font-semibold text-green-700 mb-2">Why Pet Insurance?</p>
        <ul className="space-y-1.5">
          <li className="flex items-start text-xs text-gray-700">
            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Coverage for accidents & illnesses</span>
          </li>
          <li className="flex items-start text-xs text-gray-700">
            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Protect your savings from costly vet bills</span>
          </li>
          <li className="flex items-start text-xs text-gray-700">
            <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Choose any licensed vet</span>
          </li>
        </ul>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleGetQuote}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-md flex items-center justify-center"
      >
        <span className="mr-2">📋</span>
        Get Free Quote from {partner.partner_name}
      </button>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center mt-3">
        PupSense may earn a commission from insurance referrals
      </p>
    </div>
  );
};

export default InsuranceCard;
