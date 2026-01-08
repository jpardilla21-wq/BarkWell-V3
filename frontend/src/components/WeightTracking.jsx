import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getWeightTrend, createWeightLog, deleteWeightLog } from '../services/api';

/**
 * Weight Tracking Component
 * Displays weight logs and trend chart over the last 6 months
 */
function WeightTracking({ petId, petName }) {
  const [weightData, setWeightData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    logDate: new Date().toISOString().split('T')[0],
    weight: '',
    unit: 'lbs',
    notes: '',
  });

  useEffect(() => {
    fetchWeightData();
  }, [petId]);

  const fetchWeightData = async () => {
    try {
      setLoading(true);
      const response = await getWeightTrend(petId, 6);

      if (response.success && response.data) {
        const { trend, statistics } = response.data;

        // Format data for Recharts
        const formatted = trend.map((item) => ({
          date: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: '2-digit',
          }),
          weight: parseFloat(item.weight),
          fullDate: item.date,
        }));

        setWeightData(formatted);
        setStatistics(statistics);
      }
    } catch (error) {
      console.error('Error fetching weight data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeight = async (e) => {
    e.preventDefault();

    try {
      const response = await createWeightLog({
        petId,
        logDate: formData.logDate,
        weight: parseFloat(formData.weight),
        unit: formData.unit,
        notes: formData.notes || null,
      });

      if (response.success) {
        fetchWeightData();
        setFormData({
          logDate: new Date().toISOString().split('T')[0],
          weight: '',
          unit: 'lbs',
          notes: '',
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding weight log:', error);
      alert('Failed to add weight log. Please try again.');
    }
  };

  const getWeightTrendColor = () => {
    if (!statistics || !statistics.percentageChange) return 'text-gray-600';

    const change = parseFloat(statistics.percentageChange);
    if (change > 5) return 'text-red-600'; // Significant gain
    if (change < -5) return 'text-red-600'; // Significant loss
    return 'text-green-600'; // Stable
  };

  const getWeightTrendIcon = () => {
    if (!statistics || !statistics.percentageChange) return '→';

    const change = parseFloat(statistics.percentageChange);
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
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
        <h2 className="text-xl font-semibold text-gray-900">Weight Tracking</h2>
        <p className="text-sm text-gray-600 mt-1">
          Monitor weight changes over the last 6 months
        </p>
      </div>

      <div className="p-6">
        {/* Weight Statistics */}
        {statistics && statistics.totalRecords > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-1">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalRecords}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-1">Weight Change</p>
              <p className={`text-2xl font-bold ${getWeightTrendColor()}`}>
                {getWeightTrendIcon()} {statistics.weightChange} {statistics.unit}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xs text-gray-600 mb-1">% Change</p>
              <p className={`text-2xl font-bold ${getWeightTrendColor()}`}>
                {statistics.percentageChange}%
              </p>
            </div>
          </div>
        )}

        {/* Add Weight Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
          >
            {showAddForm ? 'Cancel' : '+ Log Weight'}
          </button>
        </div>

        {/* Add Weight Form */}
        {showAddForm && (
          <form onSubmit={handleAddWeight} className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Add Weight Entry</h3>
            <div className="grid grid-cols-1 gap-3">
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    required
                    placeholder="e.g., 45.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="lbs">lbs</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  placeholder="Any notes about this measurement..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                Save Weight Entry
              </button>
            </div>
          </form>
        )}

        {/* Weight Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">6-Month Weight Trend</h3>

          {weightData.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-gray-500">
                No weight data available yet. Add weight entries to see the trend chart.
              </p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    label={{
                      value: `Weight (${statistics?.unit || 'lbs'})`,
                      angle: -90,
                      position: 'insideLeft',
                    }}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value} ${statistics?.unit || 'lbs'}`, 'Weight']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="Weight"
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 text-sm text-gray-600 bg-gray-50 rounded p-3">
                <p>
                  <strong>Tracking Tip:</strong> Regular weight monitoring helps identify health
                  trends early. Sudden changes (±5%) may warrant a vet consultation.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeightTracking;
