import { useState, useEffect } from 'react';
import { getTreats, logTreat, deleteTreat } from '../services/api';

function TreatTracker({ petId, petName }) {
  const [treats, setTreats] = useState([]);
  const [summary, setSummary] = useState({ treatAllowance: 0, caloriesUsed: 0, caloriesRemaining: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [treatName, setTreatName] = useState('');
  const [calories, setCalories] = useState('');

  useEffect(() => {
    fetchTreats();
  }, [petId]);

  const fetchTreats = async () => {
    try {
      setLoading(true);
      const response = await getTreats(petId);
      if (response.success) {
        setTreats(response.data.treats);
        setSummary(response.data.summary);
      }
    } catch (error) {
      console.error('Error fetching treats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogTreat = async (e) => {
    e.preventDefault();

    if (!treatName || !calories) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await logTreat({
        petId,
        treatName,
        calories: parseInt(calories)
      });

      if (response.success) {
        setTreatName('');
        setCalories('');
        setShowForm(false);
        fetchTreats();
      }
    } catch (error) {
      console.error('Error logging treat:', error);
      alert('Failed to log treat');
    }
  };

  const handleDeleteTreat = async (id) => {
    if (!confirm('Delete this treat log?')) return;

    try {
      await deleteTreat(id);
      fetchTreats();
    } catch (error) {
      console.error('Error deleting treat:', error);
      alert('Failed to delete treat');
    }
  };

  const percentageUsed = summary.treatAllowance > 0
    ? Math.min((summary.caloriesUsed / summary.treatAllowance) * 100, 100)
    : 0;

  const getProgressColor = () => {
    if (percentageUsed < 50) return 'bg-green-500';
    if (percentageUsed < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">🦴 Treat Tracker</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {showForm ? 'Cancel' : 'Log Treat'}
        </button>
      </div>

      {summary.treatAllowance === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Create a nutrition plan to enable treat tracking</p>
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">
                {summary.caloriesUsed} / {summary.treatAllowance} calories
              </span>
              <span className="text-gray-600">
                {summary.caloriesRemaining} remaining
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${getProgressColor()}`}
                style={{ width: `${percentageUsed}%` }}
              ></div>
            </div>

            {summary.caloriesUsed > summary.treatAllowance && (
              <p className="text-red-600 text-sm mt-2 font-medium">
                ⚠️ Treat allowance exceeded for today!
              </p>
            )}
          </div>

          {/* Log Treat Form */}
          {showForm && (
            <form onSubmit={handleLogTreat} className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treat Name
                  </label>
                  <input
                    type="text"
                    value={treatName}
                    onChange={(e) => setTreatName(e.target.value)}
                    placeholder="e.g., Peanut Butter Biscuit"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g., 50"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  Log Treat
                </button>
              </div>
            </form>
          )}

          {/* Today's Treats List */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Today's Treats</h4>

            {treats.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No treats logged today</p>
            ) : (
              <div className="space-y-2">
                {treats.map((treat) => (
                  <div
                    key={treat.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🦴</span>
                      <div>
                        <p className="font-medium text-gray-900">{treat.treat_name}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(treat.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-purple-600">{treat.calories} cal</span>
                      <button
                        onClick={() => handleDeleteTreat(treat.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visual Indicator */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Treats should make up no more than 10% of your dog's daily calories to maintain a balanced diet.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default TreatTracker;
