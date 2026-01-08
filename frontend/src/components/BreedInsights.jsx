import { useState, useEffect } from 'react';
import { getBreedInfo } from '../services/api';

function BreedInsights({ breedName }) {
  const [breedInfo, setBreedInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (breedName) {
      fetchBreedInfo();
    }
  }, [breedName]);

  const fetchBreedInfo = async () => {
    try {
      setLoading(true);
      const response = await getBreedInfo(breedName);
      if (response.success && response.data) {
        setBreedInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching breed info:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEnergyLevelColor = (level) => {
    const colors = {
      'low': 'bg-blue-100 text-blue-700',
      'moderate': 'bg-green-100 text-green-700',
      'high': 'bg-yellow-100 text-yellow-700',
      'very_high': 'bg-red-100 text-red-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const getGroomingColor = (level) => {
    const colors = {
      'low': 'bg-green-100 text-green-700',
      'moderate': 'bg-yellow-100 text-yellow-700',
      'high': 'bg-orange-100 text-orange-700'
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!breedInfo) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">🐕 Breed Insights</h3>
        <p className="text-gray-600 text-sm">
          Breed information not available for {breedName}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-bold text-gray-900">🐕 Breed Insights</h3>
        <span className="text-sm text-gray-600">({breedInfo.breed_name})</span>
      </div>

      {/* Description */}
      {breedInfo.description && (
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          {breedInfo.description}
        </p>
      )}

      {/* Key Characteristics */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Energy Level:</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getEnergyLevelColor(breedInfo.energy_level)}`}>
            {breedInfo.energy_level.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Grooming Needs:</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getGroomingColor(breedInfo.grooming_needs)}`}>
            {breedInfo.grooming_needs.toUpperCase()}
          </span>
        </div>

        {breedInfo.training_difficulty && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Training Difficulty:</span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">
              {breedInfo.training_difficulty.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Temperament */}
      {breedInfo.temperament && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs font-semibold text-blue-700 mb-1">TEMPERAMENT</p>
          <p className="text-sm text-blue-900">{breedInfo.temperament}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {breedInfo.average_weight_range && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Weight Range</p>
            <p className="text-sm font-semibold text-gray-900">{breedInfo.average_weight_range}</p>
          </div>
        )}

        {breedInfo.average_lifespan && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Lifespan</p>
            <p className="text-sm font-semibold text-gray-900">{breedInfo.average_lifespan}</p>
          </div>
        )}
      </div>

      {/* Family Friendly */}
      <div className="flex gap-2 mb-4">
        {breedInfo.good_with_children !== null && (
          <div className={`flex-1 p-2 rounded-lg text-center ${
            breedInfo.good_with_children ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <p className="text-xs font-semibold ${
              breedInfo.good_with_children ? 'text-green-700' : 'text-red-700'
            }">
              {breedInfo.good_with_children ? '👶 Good with Kids' : '👶 Caution with Kids'}
            </p>
          </div>
        )}

        {breedInfo.good_with_pets !== null && (
          <div className={`flex-1 p-2 rounded-lg text-center ${
            breedInfo.good_with_pets ? 'bg-green-50' : 'bg-red-50'
          }`}>
            <p className="text-xs font-semibold ${
              breedInfo.good_with_pets ? 'text-green-700' : 'text-red-700'
            }">
              {breedInfo.good_with_pets ? '🐾 Good with Pets' : '🐾 Caution with Pets'}
            </p>
          </div>
        )}
      </div>

      {/* Exercise Requirements */}
      {breedInfo.exercise_requirements && (
        <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
          <p className="text-xs font-semibold text-yellow-700 mb-1">EXERCISE NEEDS</p>
          <p className="text-sm text-yellow-900">{breedInfo.exercise_requirements}</p>
        </div>
      )}

      {/* Common Health Issues */}
      {breedInfo.common_health_issues && breedInfo.common_health_issues.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs font-semibold text-red-700 mb-2">⚠️ COMMON HEALTH ISSUES</p>
          <ul className="space-y-1">
            {breedInfo.common_health_issues.map((issue, index) => (
              <li key={index} className="text-sm text-red-900 flex items-start gap-2">
                <span className="text-red-600">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-red-600 mt-2">
            Consult your vet about preventive screenings
          </p>
        </div>
      )}
    </div>
  );
}

export default BreedInsights;
