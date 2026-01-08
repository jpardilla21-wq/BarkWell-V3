import { useState, useEffect } from 'react'
import { getPets, getSubscriptionStatus } from './services/api'
import PetProfile from './components/PetProfile'
import WellnessDashboard from './components/WellnessDashboard'
import WeightTracking from './components/WeightTracking'
// Phase 2 components
import NutritionPlanner from './components/NutritionPlanner'
import TreatTracker from './components/TreatTracker'
import ContentLibrary from './components/ContentLibrary'
import BreedInsights from './components/BreedInsights'
// Phase 3 components
import Shop from './components/Shop'
import Pricing from './components/Pricing'

function App() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, nutrition, learn, profile, shop, pricing
  const [currentTier, setCurrentTier] = useState('free');
  const [userId] = useState(1); // Hardcoded for demo

  // Fetch pets and subscription status on mount
  useEffect(() => {
    fetchPets();
    fetchSubscriptionStatus();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await getPets();
      if (response.success && response.data.length > 0) {
        setPets(response.data);
        setSelectedPetId(response.data[0].id); // Select first pet by default
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError('Failed to load pets. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await getSubscriptionStatus(userId);
      if (response.success && response.subscription) {
        setCurrentTier(response.subscription.tier || 'free');
      }
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      // Default to free tier on error
      setCurrentTier('free');
    }
  };

  const handleUpgrade = () => {
    setActiveTab('pricing');
  };

  const selectedPet = pets.find(pet => pet.id === selectedPetId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading PupSense...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-800 font-semibold text-lg mb-2">Connection Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchPets}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-gray-800 font-semibold text-xl mb-2">No Pets Found</h2>
          <p className="text-gray-600 mb-4">
            Please add a pet profile to get started with PupSense.
          </p>
          <p className="text-sm text-gray-500">
            Run the database initialization script to add demo data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PupSense</h1>
              <p className="text-sm text-gray-600">Pet Health Tracking Dashboard</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Subscription Tier Badge */}
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                  currentTier === 'pro'
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                    : currentTier === 'plus'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
                onClick={() => setActiveTab('pricing')}
              >
                {currentTier === 'pro' && '💎 '}
                {currentTier === 'plus' && '⭐ '}
                {currentTier.toUpperCase()}
                {currentTier === 'free' && ' - Upgrade'}
              </span>

              {/* Pet Selector */}
              {pets.length > 1 && (
                <select
                  value={selectedPetId}
                  onChange={(e) => setSelectedPetId(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {pets.map(pet => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedPet && (
          <div className="space-y-8">
            {/* Pet Info Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <h2 className="text-3xl font-bold">{selectedPet.name}</h2>
              <p className="text-blue-100 mt-1">
                {selectedPet.breed} • {selectedPet.age_years} years old • {selectedPet.gender}
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex-1 px-6 py-4 font-medium transition ${
                    activeTab === 'dashboard'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`flex-1 px-6 py-4 font-medium transition ${
                    activeTab === 'nutrition'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🍖 Nutrition
                </button>
                <button
                  onClick={() => setActiveTab('shop')}
                  className={`flex-1 px-6 py-4 font-medium transition ${
                    activeTab === 'shop'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🛍️ Shop
                </button>
                <button
                  onClick={() => setActiveTab('learn')}
                  className={`flex-1 px-6 py-4 font-medium transition ${
                    activeTab === 'learn'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📚 Learn
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 px-6 py-4 font-medium transition ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🐕 Profile
                </button>
                <button
                  onClick={() => setActiveTab('pricing')}
                  className={`flex-1 px-6 py-4 font-medium transition ${
                    activeTab === 'pricing'
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                      : currentTier === 'free'
                      ? 'text-orange-600 hover:bg-orange-50 font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {currentTier === 'free' ? '💎 Upgrade' : '💎 Pricing'}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Wellness Score Dashboard */}
                <WellnessDashboard
                  petId={selectedPetId}
                  petName={selectedPet.name}
                  petAge={parseFloat(selectedPet.age_years)}
                  currentTier={currentTier}
                  hasInsurance={false}
                  onUpgrade={handleUpgrade}
                />

                {/* Treat Tracker - Phase 2 */}
                <TreatTracker petId={selectedPetId} petName={selectedPet.name} />

                {/* Weight Tracking */}
                <WeightTracking petId={selectedPetId} petName={selectedPet.name} />
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="space-y-8">
                {/* Nutrition Planner - Phase 2 */}
                <NutritionPlanner
                  petId={selectedPetId}
                  petName={selectedPet.name}
                  petBreed={selectedPet.breed}
                  petAge={parseFloat(selectedPet.age_years)}
                  petWeight={null} // Will be fetched from weight logs
                />
              </div>
            )}

            {activeTab === 'learn' && (
              <div>
                {/* Content Library - Phase 2 */}
                <ContentLibrary petId={selectedPetId} petName={selectedPet.name} />
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Breed Insights - Phase 2 */}
                <BreedInsights breedName={selectedPet.breed} />

                {/* Pet Profile with Health Records */}
                <PetProfile petId={selectedPetId} petName={selectedPet.name} />
              </div>
            )}

            {activeTab === 'shop' && (
              <div>
                {/* Shop - Phase 3 */}
                <Shop petId={selectedPetId} petName={selectedPet.name} />
              </div>
            )}

            {activeTab === 'pricing' && (
              <div>
                {/* Pricing - Phase 3 */}
                <Pricing userId={userId} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            PupSense - Pet Health Tracking Application © 2024
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
