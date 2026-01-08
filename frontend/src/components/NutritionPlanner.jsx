import { useState, useEffect } from 'react';
import {
  getNutritionPlan,
  calculateCalories,
  createNutritionPlan,
  getFoods,
  calculatePortion,
  trackAffiliateClick
} from '../services/api';

function NutritionPlanner({ petId, petName, petBreed, petAge, petWeight }) {
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlanner, setShowPlanner] = useState(false);
  const [foods, setFoods] = useState([]);

  // Form state
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [mealsPerDay, setMealsPerDay] = useState(2);
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [portionInfo, setPortionInfo] = useState(null);
  const [calorieCalculation, setCalorieCalculation] = useState(null);

  useEffect(() => {
    fetchNutritionPlan();
    fetchFoods();
  }, [petId]);

  const fetchNutritionPlan = async () => {
    try {
      setLoading(true);
      const response = await getNutritionPlan(petId);
      if (response.success && response.data) {
        setNutritionPlan(response.data);
        setActivityLevel(response.data.activity_level);
      }
    } catch (error) {
      console.error('Error fetching nutrition plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFoods = async () => {
    try {
      // Determine life stage based on age
      let lifeStage = 'adult';
      if (petAge < 1) lifeStage = 'puppy';
      else if (petAge >= 7) lifeStage = 'senior';

      const response = await getFoods(lifeStage);
      if (response.success) {
        setFoods(response.data);
      }
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  const handleCalculateCalories = async () => {
    try {
      const response = await calculateCalories({
        breed: petBreed,
        ageYears: petAge,
        weightLbs: petWeight,
        activityLevel
      });

      if (response.success) {
        setCalorieCalculation(response.data);
      }
    } catch (error) {
      console.error('Error calculating calories:', error);
      alert('Failed to calculate caloric needs. Please try again.');
    }
  };

  const handleCreatePlan = async () => {
    try {
      if (!petWeight) {
        alert('Please add a weight entry for your pet first.');
        return;
      }

      const response = await createNutritionPlan({
        petId,
        activityLevel,
        mealsPerDay,
        foodId: selectedFoodId || null
      });

      if (response.success) {
        setNutritionPlan(response.data.plan);
        setCalorieCalculation(response.data.calculations);
        setShowPlanner(false);
        alert('Nutrition plan created successfully!');
      }
    } catch (error) {
      console.error('Error creating nutrition plan:', error);
      alert(error.response?.data?.message || 'Failed to create nutrition plan');
    }
  };

  const handleCalculatePortion = async () => {
    if (!selectedFoodId) {
      alert('Please select a food brand first');
      return;
    }

    try {
      const response = await calculatePortion({
        petId,
        foodId: selectedFoodId,
        mealsPerDay
      });

      if (response.success) {
        setPortionInfo(response.data);
      }
    } catch (error) {
      console.error('Error calculating portion:', error);
      alert(error.response?.data?.message || 'Failed to calculate portion size');
    }
  };

  const handleAffiliateClick = async (food) => {
    try {
      // Track the click
      await trackAffiliateClick(food.id, petId, 'food');

      // Open affiliate link in new tab
      window.open(food.affiliate_link, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error tracking affiliate click:', error);
      // Still open the link even if tracking fails
      window.open(food.affiliate_link, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Nutrition Planner</h2>
        <button
          onClick={() => setShowPlanner(!showPlanner)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {nutritionPlan ? 'Update Plan' : 'Create Plan'}
        </button>
      </div>

      {/* Existing Nutrition Plan Display */}
      {nutritionPlan && !showPlanner && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-semibold">Daily Calories</p>
              <p className="text-3xl font-bold text-blue-900">{nutritionPlan.caloric_needs}</p>
              <p className="text-xs text-blue-600 mt-1">Total per day</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-semibold">Meal Calories</p>
              <p className="text-3xl font-bold text-green-900">
                {nutritionPlan.caloric_needs - nutritionPlan.treat_allowance}
              </p>
              <p className="text-xs text-green-600 mt-1">90% of daily</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-semibold">Treat Allowance</p>
              <p className="text-3xl font-bold text-purple-900">{nutritionPlan.treat_allowance}</p>
              <p className="text-xs text-purple-600 mt-1">10% of daily</p>
            </div>
          </div>

          {/* Meal Schedule */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Feeding Schedule</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {JSON.parse(nutritionPlan.meal_schedule).map((meal, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🍽️</span>
                    <span className="font-medium text-gray-900">Meal {index + 1}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{meal.time}</p>
                    {meal.portion > 0 && (
                      <p className="text-sm text-gray-600">{meal.portion} cups</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Activity Level:</strong> {nutritionPlan.activity_level.replace('_', ' ')}
            </p>
          </div>
        </div>
      )}

      {/* Nutrition Planner Form */}
      {showPlanner && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sedentary">Sedentary (Indoor, minimal activity)</option>
              <option value="moderate">Moderate (Regular walks)</option>
              <option value="active">Active (High exercise routine)</option>
              <option value="very_active">Very Active (Working/Competition dog)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meals Per Day
            </label>
            <select
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1 meal</option>
              <option value={2}>2 meals (Recommended)</option>
              <option value={3}>3 meals</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleCalculateCalories}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Calculate Caloric Needs
            </button>
          </div>

          {calorieCalculation && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Calculated Needs</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-600">Total Daily Calories:</p>
                  <p className="font-bold text-blue-900">{calorieCalculation.totalCalories}</p>
                </div>
                <div>
                  <p className="text-blue-600">Treat Allowance:</p>
                  <p className="font-bold text-blue-900">{calorieCalculation.treatAllowance}</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Food Brand (Optional)
            </label>
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a food brand...</option>
              {foods.map((food) => (
                <option key={food.id} value={food.id}>
                  {food.brand_name} - {food.product_name} ({food.calories_per_cup} cal/cup)
                </option>
              ))}
            </select>
          </div>

          {selectedFoodId && nutritionPlan && (
            <div>
              <button
                onClick={handleCalculatePortion}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Calculate Portion Size
              </button>
            </div>
          )}

          {portionInfo && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-purple-900 mb-1">{portionInfo.food.brand_name}</h3>
                  <p className="text-sm text-purple-700">{portionInfo.food.product_name}</p>
                </div>
                {portionInfo.food.average_price && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-900">
                      ${portionInfo.food.average_price.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm mb-4">
                <p><strong>Total per day:</strong> {portionInfo.portions.totalCupsPerDay} cups</p>
                <p><strong>Per meal:</strong> {portionInfo.portions.cupsPerMeal} cups</p>
                <p><strong>Calories per meal:</strong> {portionInfo.portions.caloriesPerMeal}</p>
              </div>
              {portionInfo.food.affiliate_link && (
                <button
                  onClick={() => handleAffiliateClick(portionInfo.food)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center"
                >
                  <span className="mr-2">🛒</span>
                  Buy on Amazon
                  {portionInfo.food.average_price && (
                    <span className="ml-2">- ${portionInfo.food.average_price.toFixed(2)}</span>
                  )}
                </button>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleCreatePlan}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Save Nutrition Plan
            </button>
            <button
              onClick={() => setShowPlanner(false)}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!nutritionPlan && !showPlanner && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No nutrition plan created yet for {petName}</p>
          <button
            onClick={() => setShowPlanner(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Nutrition Plan
          </button>
        </div>
      )}
    </div>
  );
}

export default NutritionPlanner;
