import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getCurrentScore, getWellnessTrend, createDailyLog } from '../services/api';
import Paywall from './Paywall';
import InsuranceCard from './InsuranceCard';

/**
 * Wellness Score Dashboard Component
 * Displays current wellness score and trend visualization with alerts
 */
function WellnessDashboard({ petId, petName, petAge, currentTier = 'free', hasInsurance = false, onUpgrade }) {
  const [currentScore, setCurrentScore] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    logDate: new Date().toISOString().split('T')[0],
    digestionScore: '',
    nutritionScore: '',
    behaviorScore: '',
    activityScore: '',
  });

  useEffect(() => {
    fetchWellnessData();
  }, [petId]);

  const fetchWellnessData = async () => {
    try {
      setLoading(true);
      const [scoreRes, trendRes] = await Promise.all([
        getCurrentScore(petId),
        getWellnessTrend(petId, 30),
      ]);

      if (scoreRes.success && scoreRes.data) {
        setCurrentScore(scoreRes.data.currentScore);
        setAlert(scoreRes.data.alert || null);
      }

      if (trendRes.success && trendRes.data) {
        // Format trend data for Recharts
        const formatted = trendRes.data.map((item) => ({
          date: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          score: item.score,
        }));
        setTrendData(formatted);
      }
    } catch (error) {
      console.error('Error fetching wellness data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDailyLog = async (e) => {
    e.preventDefault();

    try {
      const response = await createDailyLog({
        petId,
        logDate: formData.logDate,
        digestionScore: parseInt(formData.digestionScore),
        nutritionScore: parseInt(formData.nutritionScore),
        behaviorScore: parseInt(formData.behaviorScore),
        activityScore: parseInt(formData.activityScore),
      });

      if (response.success) {
        // Check if there's a new alert
        if (response.alert) {
          setAlert(response.alert);
        }

        // Refresh data
        fetchWellnessData();

        // Reset form
        setFormData({
          logDate: new Date().toISOString().split('T')[0],
          digestionScore: '',
          nutritionScore: '',
          behaviorScore: '',
          activityScore: '',
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding daily log:', error);
      alert('Failed to add daily log. Please try again.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Wellness Score Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">
              Comprehensive health score based on daily metrics (0-100)
            </p>
          </div>
          {/* Subscription Tier Badge */}
          {currentTier && (
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                  currentTier === 'pro'
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                    : currentTier === 'plus'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {currentTier === 'pro' && '💎 '}
                {currentTier === 'plus' && '⭐ '}
                {currentTier.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Alert Banner */}
        {alert && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Wellness Score Alert</h3>
                <p className="mt-1 text-sm text-red-700">{alert.message}</p>
                <p className="mt-1 text-xs text-red-600">
                  Previous Average: {alert.previousAverage} → Current: {alert.currentScore} (
                  {alert.dropPercentage}% drop)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Current Score Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Score Card */}
          <div className={`rounded-lg p-6 ${currentScore ? getScoreBgColor(currentScore) : 'bg-gray-100'}`}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Wellness Score</h3>
            {currentScore !== null ? (
              <>
                <div className={`text-5xl font-bold ${getScoreColor(currentScore)}`}>
                  {currentScore}
                  <span className="text-2xl">/100</span>
                </div>
                <p className={`mt-2 text-sm font-medium ${getScoreColor(currentScore)}`}>
                  {getScoreLabel(currentScore)}
                </p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">No data available. Add a daily log to get started.</p>
            )}
          </div>

          {/* Score Components Breakdown */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Wellness Components</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Digestion (20%)</span>
                <span className="font-medium">0-100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nutrition (20%)</span>
                <span className="font-medium">0-100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Behavior (20%)</span>
                <span className="font-medium">0-100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Activity (20%)</span>
                <span className="font-medium">0-100</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-600">Preventive Care (20%)</span>
                <span className="font-medium">Auto-calculated</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * Preventive care is automatically calculated based on vaccination status and vet visits
            </p>
          </div>
        </div>

        {/* Add Daily Log Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            {showAddForm ? 'Cancel' : '+ Log Today\'s Health Metrics'}
          </button>
        </div>

        {/* Add Daily Log Form */}
        {showAddForm && (
          <form onSubmit={handleAddDailyLog} className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Log Daily Health Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.logDate}
                  onChange={(e) => setFormData({ ...formData, logDate: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Digestion Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.digestionScore}
                  onChange={(e) => setFormData({ ...formData, digestionScore: e.target.value })}
                  placeholder="e.g., 85"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nutrition Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.nutritionScore}
                  onChange={(e) => setFormData({ ...formData, nutritionScore: e.target.value })}
                  placeholder="e.g., 90"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Behavior Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.behaviorScore}
                  onChange={(e) => setFormData({ ...formData, behaviorScore: e.target.value })}
                  placeholder="e.g., 80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Score (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.activityScore}
                  onChange={(e) => setFormData({ ...formData, activityScore: e.target.value })}
                  placeholder="e.g., 75"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Save Daily Log
            </button>
          </form>
        )}

        {/* Insurance Card - Only show for pets without insurance */}
        {!hasInsurance && petAge >= 0.5 && (
          <div className="mb-6">
            <InsuranceCard
              petId={petId}
              petName={petName}
              petAge={petAge}
              hasInsurance={hasInsurance}
            />
          </div>
        )}

        {/* Trend Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">30-Day Wellness Trend</h3>

          {currentTier === 'free' ? (
            <Paywall
              feature="Wellness Trend Chart"
              currentTier={currentTier}
              requiredTier="plus"
              onUpgrade={onUpgrade}
            />
          ) : trendData.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-gray-500">
                No trend data available yet. Add daily logs to see the wellness trend chart.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Wellness Score', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Wellness Score"
                />
                {/* Reference line for "Good" threshold */}
                <Line
                  type="monotone"
                  dataKey={() => 60}
                  stroke="#fbbf24"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                  name="Good Threshold (60)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}

          {currentTier !== 'free' && trendData.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded p-3">
              <p>
                <strong>Note:</strong> The wellness score is calculated as an average of 5 components:
                Digestion, Nutrition, Behavior, Activity, and Preventive Care. Scores below 60 may
                indicate areas needing attention.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WellnessDashboard;
