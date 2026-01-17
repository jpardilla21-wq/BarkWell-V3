/**
 * Wellness Score Calculation Utility
 *
 * The Wellness Score is a composite health metric (0-100) that combines
 * multiple health indicators to provide a holistic view of a pet's wellbeing.
 *
 * ALGORITHM:
 * - The score is calculated as a weighted average of 5 components:
 *   1. Digestion Score (20% weight)
 *   2. Nutrition Score (20% weight)
 *   3. Behavior Score (20% weight)
 *   4. Activity Score (20% weight)
 *   5. Preventive Care Score (20% weight)
 *
 * - Each component is scored 0-100
 * - Final score = (sum of all components) / number of components
 * - Preventive Care is based on vaccination status and recent vet visits
 */

const db = require("../config/database");

/**
 * Calculate Preventive Care Score
 * Based on vaccination status and recent vet visits
 *
 * Scoring Logic:
 * - Start with base score of 50
 * - Add 30 points if all vaccinations are current (none overdue)
 * - Add 20 points if there's a vet visit within the last 6 months
 * - Subtract 20 points for each overdue vaccination (up to -40)
 *
 * @param {number} petId - Pet ID
 * @returns {Promise<number>} Preventive care score (0-100)
 */
async function calculatePreventiveCareScore(petId) {
  let score = 50; // Base score

  try {
    // Check vaccination status
    const vaccinationQuery = `
      SELECT
        COUNT(*) FILTER (WHERE next_due_date < CURRENT_DATE) as overdue_count,
        COUNT(*) FILTER (WHERE next_due_date >= CURRENT_DATE) as current_count
      FROM health_records
      WHERE pet_id = $1 AND record_type = 'vaccination'
    `;
    const vaccinationResult = await db.query(vaccinationQuery, [petId]);

    if (vaccinationResult.rows.length > 0) {
      const { overdue_count, current_count } = vaccinationResult.rows[0];

      // Penalize for overdue vaccinations
      if (overdue_count > 0) {
        score -= Math.min(overdue_count * 20, 40); // Max -40 points
      }

      // Reward for current vaccinations
      if (current_count > 0 && overdue_count === 0) {
        score += 30;
      }
    }

    // Check for recent vet visits (within last 6 months)
    const vetVisitQuery = `
      SELECT COUNT(*) as recent_visits
      FROM health_records
      WHERE pet_id = $1
        AND record_type = 'vet_visit'
        AND visit_date >= CURRENT_DATE - INTERVAL '6 months'
    `;
    const vetVisitResult = await db.query(vetVisitQuery, [petId]);

    if (vetVisitResult.rows[0].recent_visits > 0) {
      score += 20;
    }
  } catch (error) {
    console.error("Error calculating preventive care score:", error);
    // Return default score on error
    return 50;
  }

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate Daily Wellness Score
 * Combines all health components into a single 0-100 score
 *
 * @param {Object} components - Health score components
 * @param {number} components.digestionScore - Digestion score (0-100)
 * @param {number} components.nutritionScore - Nutrition score (0-100)
 * @param {number} components.behaviorScore - Behavior score (0-100)
 * @param {number} components.activityScore - Activity score (0-100)
 * @param {number} components.preventiveCareScore - Preventive care score (0-100)
 * @returns {number} Overall wellness score (0-100)
 */
function calculateWellnessScore(components) {
  const {
    digestionScore = null,
    nutritionScore = null,
    behaviorScore = null,
    activityScore = null,
    preventiveCareScore = null,
  } = components;

  // Collect non-null scores
  const scores = [
    digestionScore,
    nutritionScore,
    behaviorScore,
    activityScore,
    preventiveCareScore,
  ].filter((score) => score !== null && score !== undefined);

  // If no scores available, return 0
  if (scores.length === 0) {
    return 0;
  }

  // Calculate average of available scores
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const averageScore = totalScore / scores.length;

  // Round to nearest integer
  return Math.round(averageScore);
}

/**
 * Detect significant wellness score drop
 * Returns true if current score dropped >15% from previous average
 *
 * @param {number} petId - Pet ID
 * @param {number} currentScore - Current wellness score
 * @param {number} daysToCompare - Number of days to look back (default: 7)
 * @returns {Promise<Object>} Alert status and details
 */
async function detectScoreDrop(petId, currentScore, daysToCompare = 7) {
  try {
    // Get average score from previous period
    const previousScoreQuery = `
      SELECT AVG(wellness_score) as avg_score
      FROM daily_logs
      WHERE pet_id = $1
        AND log_date < CURRENT_DATE
        AND log_date >= CURRENT_DATE - INTERVAL '${daysToCompare} days'
        AND wellness_score IS NOT NULL
    `;
    const result = await db.query(previousScoreQuery, [petId]);

    if (result.rows.length === 0 || !result.rows[0].avg_score) {
      // No previous data to compare
      return {
        isAlert: false,
        message: "No previous data for comparison",
      };
    }

    const previousAverage = parseFloat(result.rows[0].avg_score);
    const dropPercentage =
      ((previousAverage - currentScore) / previousAverage) * 100;

    // Alert if drop is greater than 15%
    if (dropPercentage > 15) {
      return {
        isAlert: true,
        message: `Wellness score dropped ${dropPercentage.toFixed(1)}% from ${daysToCompare}-day average`,
        previousAverage: Math.round(previousAverage),
        currentScore,
        dropPercentage: Math.round(dropPercentage),
      };
    }

    return {
      isAlert: false,
      previousAverage: Math.round(previousAverage),
      currentScore,
    };
  } catch (error) {
    console.error("Error detecting score drop:", error);
    return { isAlert: false, error: error.message };
  }
}

/**
 * Get wellness score trend for a pet over time
 *
 * @param {number} petId - Pet ID
 * @param {number} days - Number of days to retrieve (default: 30)
 * @returns {Promise<Array>} Array of {date, score} objects
 */
async function getWellnessScoreTrend(petId, days = 30) {
  try {
    const trendQuery = `
      SELECT
        log_date as date,
        wellness_score as score
      FROM daily_logs
      WHERE pet_id = $1
        AND log_date >= CURRENT_DATE - INTERVAL '${days} days'
        AND wellness_score IS NOT NULL
      ORDER BY log_date ASC
    `;
    const result = await db.query(trendQuery, [petId]);

    return result.rows.map((row) => ({
      date: row.date,
      score: parseInt(row.score),
    }));
  } catch (error) {
    console.error("Error getting wellness score trend:", error);
    return [];
  }
}

module.exports = {
  calculateWellnessScore,
  calculatePreventiveCareScore,
  detectScoreDrop,
  getWellnessScoreTrend,
};
