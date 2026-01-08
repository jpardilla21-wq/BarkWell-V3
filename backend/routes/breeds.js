/**
 * Breed Information Routes
 * Provides breed-specific insights and characteristics
 */

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// ================================================
// BREED INFO ENDPOINTS
// ================================================

/**
 * GET /api/breeds
 * Get all breeds
 */
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM breed_info ORDER BY breed_name'
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching breeds:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch breed information'
    });
  }
});

/**
 * GET /api/breeds/:breedName
 * Get specific breed information by name
 */
router.get('/:breedName', async (req, res) => {
  try {
    const { breedName } = req.params;

    // Try exact match first
    let result = await query(
      'SELECT * FROM breed_info WHERE breed_name = $1',
      [breedName]
    );

    // If no exact match, try case-insensitive search
    if (result.rows.length === 0) {
      result = await query(
        'SELECT * FROM breed_info WHERE LOWER(breed_name) = LOWER($1)',
        [breedName]
      );
    }

    // If still no match, try partial match
    if (result.rows.length === 0) {
      result = await query(
        'SELECT * FROM breed_info WHERE breed_name ILIKE $1 LIMIT 1',
        [`%${breedName}%`]
      );
    }

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'Breed information not available for this breed'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching breed info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch breed information'
    });
  }
});

/**
 * GET /api/breeds/search/:query
 * Search breeds by name
 */
router.get('/search/:query', async (req, res) => {
  try {
    const { query: searchQuery } = req.params;

    const result = await query(
      'SELECT breed_name, energy_level, temperament FROM breed_info WHERE breed_name ILIKE $1 ORDER BY breed_name LIMIT 10',
      [`%${searchQuery}%`]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error searching breeds:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search breeds'
    });
  }
});

module.exports = router;
