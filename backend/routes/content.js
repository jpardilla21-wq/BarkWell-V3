/**
 * Content Library Routes
 * Handles educational content and personalized recommendations
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// ================================================
// CONTENT LIBRARY ENDPOINTS
// ================================================

/**
 * GET /api/content
 * Get all content from library, optionally filtered by category
 */
router.get('/', async (req, res) => {
  try {
    const { category, format } = req.query;

    let queryText = 'SELECT * FROM content_library WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (category) {
      queryText += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (format) {
      queryText += ` AND format = $${paramIndex}`;
      params.push(format);
      paramIndex++;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
});

/**
 * GET /api/content/recommend/:petId
 * Get personalized content recommendations based on pet profile
 *
 * Recommendation Logic:
 * - If pet age < 1 year: prioritize "Puppy", "Training", "Socialization" tags
 * - If pet age >= 7 years: prioritize "Senior" tag
 * - If recent wellness score shows low behavior/anxiety: prioritize "Behavior", "Anxiety" content
 * - If weight trend shows increase: prioritize "Weight Management", "Nutrition"
 * - Otherwise: show general content relevant to all ages
 */
router.get('/recommend/:petId', async (req, res) => {
  try {
    const { petId } = req.params;
    const { limit = 6 } = req.query;

    // Get pet information
    const petResult = await query(
      `SELECT
        id,
        name,
        breed,
        extract(year from age(date_of_birth)) as age_years,
        extract(month from age(date_of_birth)) as age_months
      FROM pets WHERE id = $1`,
      [petId]
    );

    if (petResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found'
      });
    }

    const pet = petResult.rows[0];
    const ageYears = parseFloat(pet.age_years);
    const ageMonths = parseFloat(pet.age_months);

    // Get recent wellness data
    const wellnessResult = await query(
      `SELECT behavior_score, activity_score, wellness_score
       FROM daily_logs
       WHERE pet_id = $1
       ORDER BY date DESC
       LIMIT 7`,
      [petId]
    );

    // Get recent weight trend
    const weightResult = await query(
      `SELECT
        (SELECT weight FROM weight_logs WHERE pet_id = $1 ORDER BY date DESC LIMIT 1) as current_weight,
        (SELECT weight FROM weight_logs WHERE pet_id = $1 ORDER BY date DESC LIMIT 1 OFFSET 1) as previous_weight`,
      [petId]
    );

    // Determine personalization tags based on pet profile
    const recommendedTags = [];
    const priorityCategories = [];

    // Age-based recommendations
    if (ageYears < 1 || (ageYears === 0 && ageMonths < 12)) {
      recommendedTags.push('Puppy', 'Beginner', 'Socialization', 'Training');
      priorityCategories.push('Training');
    } else if (ageYears >= 7) {
      recommendedTags.push('Senior', 'Health');
      priorityCategories.push('Health', 'Nutrition');
    }

    // Wellness-based recommendations
    if (wellnessResult.rows.length > 0) {
      const avgBehavior = wellnessResult.rows.reduce((sum, log) => sum + (log.behavior_score || 0), 0) / wellnessResult.rows.length;
      const avgActivity = wellnessResult.rows.reduce((sum, log) => sum + (log.activity_score || 0), 0) / wellnessResult.rows.length;

      if (avgBehavior < 60) {
        recommendedTags.push('Anxiety', 'Behavior');
        priorityCategories.push('Behavior');
      }

      if (avgActivity < 50) {
        recommendedTags.push('Active', 'Exercise');
        priorityCategories.push('Training');
      }
    }

    // Weight-based recommendations
    if (weightResult.rows.length > 0 && weightResult.rows[0].current_weight && weightResult.rows[0].previous_weight) {
      const weightChange = weightResult.rows[0].current_weight - weightResult.rows[0].previous_weight;
      if (weightChange > 2) {
        recommendedTags.push('Weight Management', 'Diet');
        priorityCategories.push('Nutrition');
      }
    }

    // Build query to fetch recommended content
    let contentQuery = `
      SELECT *,
        CASE
    `;

    // Add scoring based on tags
    recommendedTags.forEach((tag, index) => {
      contentQuery += `WHEN $${index + 2} = ANY(tags) THEN ${recommendedTags.length - index}\n`;
    });

    contentQuery += `ELSE 0 END as relevance_score
      FROM content_library
    `;

    // Add category filter if we have priority categories
    if (priorityCategories.length > 0) {
      const categoryPlaceholders = priorityCategories.map((_, i) => `$${recommendedTags.length + 2 + i}`).join(', ');
      contentQuery += `WHERE category IN (${categoryPlaceholders}) OR 1=1\n`;
    }

    contentQuery += `
      ORDER BY relevance_score DESC, created_at DESC
      LIMIT $1
    `;

    const params = [limit, ...recommendedTags, ...priorityCategories];
    const contentResult = await query(contentQuery, params);

    // Also get general content if we don't have enough recommendations
    let generalContent = [];
    if (contentResult.rows.length < limit) {
      const remaining = limit - contentResult.rows.length;
      const generalResult = await query(
        `SELECT * FROM content_library
         WHERE id NOT IN (${contentResult.rows.map(r => r.id).join(',') || '0'})
         ORDER BY created_at DESC
         LIMIT $1`,
        [remaining]
      );
      generalContent = generalResult.rows;
    }

    res.json({
      success: true,
      data: {
        recommended: contentResult.rows,
        general: generalContent,
        personalization: {
          petAge: ageYears,
          tags: recommendedTags,
          categories: priorityCategories
        }
      }
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations'
    });
  }
});

/**
 * GET /api/content/:id
 * Get specific content by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM content_library WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch content'
    });
  }
});

/**
 * GET /api/content/categories/list
 * Get all available categories
 */
router.get('/categories/list', async (req, res) => {
  try {
    const result = await query(
      'SELECT DISTINCT category FROM content_library ORDER BY category'
    );

    res.json({
      success: true,
      data: result.rows.map(row => row.category)
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

module.exports = router;
