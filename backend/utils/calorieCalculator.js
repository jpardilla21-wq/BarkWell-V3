/**
 * Calorie Calculator Utility
 * Calculates daily caloric needs for dogs based on various factors
 */

/**
 * Calculate Resting Energy Requirement (RER)
 * Formula: RER = 70 × (body weight in kg)^0.75
 *
 * @param {number} weightLbs - Dog's weight in pounds
 * @returns {number} RER in calories
 */
function calculateRER(weightLbs) {
  const weightKg = weightLbs * 0.453592; // Convert lbs to kg
  const rer = 70 * Math.pow(weightKg, 0.75);
  return Math.round(rer);
}

/**
 * Get activity multiplier based on activity level
 *
 * @param {string} activityLevel - Activity level: sedentary, moderate, active, very_active
 * @returns {number} Multiplier for RER
 */
function getActivityMultiplier(activityLevel) {
  const multipliers = {
    'sedentary': 1.2,      // Indoor dogs with minimal activity
    'moderate': 1.6,       // Average adult dogs with regular walks
    'active': 2.0,         // Working dogs or dogs with high exercise
    'very_active': 3.0     // Performance/competition dogs
  };

  return multipliers[activityLevel] || 1.6; // Default to moderate
}

/**
 * Get age multiplier for growing puppies or senior dogs
 *
 * @param {number} ageYears - Dog's age in years
 * @returns {number} Age-based multiplier
 */
function getAgeMultiplier(ageYears) {
  if (ageYears < 1) {
    // Puppies need more calories for growth
    return 2.0;
  } else if (ageYears >= 7) {
    // Senior dogs may need slightly fewer calories
    return 0.8;
  }

  return 1.0; // Adult dogs
}

/**
 * Get breed size multiplier
 * Small breeds have faster metabolisms
 *
 * @param {number} weightLbs - Dog's weight in pounds
 * @returns {number} Size-based multiplier
 */
function getSizeMultiplier(weightLbs) {
  if (weightLbs < 20) {
    return 1.1; // Small breeds
  } else if (weightLbs > 70) {
    return 0.9; // Large breeds
  }

  return 1.0; // Medium breeds
}

/**
 * Main function: Calculate daily caloric needs
 *
 * @param {Object} params - Calculation parameters
 * @param {string} params.breed - Dog's breed (currently for reference)
 * @param {number} params.ageYears - Age in years
 * @param {number} params.weightLbs - Weight in pounds
 * @param {string} params.activityLevel - Activity level (sedentary, moderate, active, very_active)
 * @returns {Object} Caloric needs breakdown
 */
function calculateCalories(params) {
  const { breed, ageYears, weightLbs, activityLevel } = params;

  // Validate inputs
  if (!weightLbs || weightLbs <= 0) {
    throw new Error('Weight must be a positive number');
  }
  if (ageYears < 0) {
    throw new Error('Age cannot be negative');
  }

  // Step 1: Calculate base RER
  const rer = calculateRER(weightLbs);

  // Step 2: Apply multipliers
  const activityMult = getActivityMultiplier(activityLevel);
  const ageMult = getAgeMultiplier(ageYears);
  const sizeMult = getSizeMultiplier(weightLbs);

  // Step 3: Calculate total daily calories
  const totalCalories = Math.round(rer * activityMult * ageMult * sizeMult);

  // Step 4: Calculate treat allowance (10% of daily calories)
  const treatAllowance = Math.round(totalCalories * 0.1);

  // Step 5: Calculate meal calories (90% of daily calories)
  const mealCalories = totalCalories - treatAllowance;

  return {
    totalCalories,
    mealCalories,
    treatAllowance,
    rer,
    breakdown: {
      activityMultiplier: activityMult,
      ageMultiplier: ageMult,
      sizeMultiplier: sizeMult
    }
  };
}

/**
 * Calculate portion size based on food calories and daily needs
 *
 * @param {number} dailyCalories - Total daily caloric needs
 * @param {number} caloriesPerCup - Calories per cup of selected food
 * @param {number} mealsPerDay - Number of meals per day (default: 2)
 * @returns {Object} Portion recommendations
 */
function calculatePortionSize(dailyCalories, caloriesPerCup, mealsPerDay = 2) {
  if (caloriesPerCup <= 0 || mealsPerDay <= 0) {
    throw new Error('Invalid input for portion calculation');
  }

  const totalCups = dailyCalories / caloriesPerCup;
  const cupsPerMeal = totalCups / mealsPerDay;

  return {
    totalCupsPerDay: parseFloat(totalCups.toFixed(2)),
    cupsPerMeal: parseFloat(cupsPerMeal.toFixed(2)),
    mealsPerDay,
    caloriesPerMeal: Math.round(dailyCalories / mealsPerDay)
  };
}

/**
 * Generate recommended meal schedule
 *
 * @param {number} cupsPerMeal - Cups of food per meal
 * @param {number} mealsPerDay - Number of meals per day
 * @returns {Array} Meal schedule with times and portions
 */
function generateMealSchedule(cupsPerMeal, mealsPerDay = 2) {
  const schedules = {
    1: [{ time: '08:00', portion: cupsPerMeal }],
    2: [
      { time: '08:00', portion: cupsPerMeal },
      { time: '18:00', portion: cupsPerMeal }
    ],
    3: [
      { time: '07:00', portion: cupsPerMeal },
      { time: '13:00', portion: cupsPerMeal },
      { time: '19:00', portion: cupsPerMeal }
    ]
  };

  return schedules[mealsPerDay] || schedules[2];
}

module.exports = {
  calculateCalories,
  calculatePortionSize,
  generateMealSchedule,
  calculateRER, // Export for testing
  getActivityMultiplier // Export for testing
};
