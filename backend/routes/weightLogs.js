/**
 * Weight Logs API Routes
 * Handles CRUD operations for pet weight tracking
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * GET /api/weight-logs/:petId
 * Get all weight logs for a pet
 * Query params: ?months=6 (optional, default: 6 months)
 */
router.get('/:petId', async (req, res) => {
  try {
    const { petId } = req.params;
    const months = parseInt(req.query.months) || 6;

    const result = await db.query(
      `SELECT
        id,
        log_date,
        weight,
        unit,
        notes,
        created_at
       FROM weight_logs
       WHERE pet_id = $1
         AND log_date >= CURRENT_DATE - INTERVAL '${months} months'
       ORDER BY log_date DESC`,
      [petId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching weight logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weight logs',
    });
  }
});

/**
 * GET /api/weight-logs/:petId/trend
 * Get weight trend data for charting (last 6 months by default)
 * Query params: ?months=6 (optional)
 */
router.get('/:petId/trend', async (req, res) => {
  try {
    const { petId } = req.params;
    const months = parseInt(req.query.months) || 6;

    const result = await db.query(
      `SELECT
        log_date as date,
        weight,
        unit
       FROM weight_logs
       WHERE pet_id = $1
         AND log_date >= CURRENT_DATE - INTERVAL '${months} months'
       ORDER BY log_date ASC`,
      [petId]
    );

    // Calculate weight change statistics
    let weightChange = null;
    let percentageChange = null;

    if (result.rows.length >= 2) {
      const firstWeight = parseFloat(result.rows[0].weight);
      const lastWeight = parseFloat(result.rows[result.rows.length - 1].weight);
      weightChange = (lastWeight - firstWeight).toFixed(2);
      percentageChange = ((weightChange / firstWeight) * 100).toFixed(1);
    }

    res.json({
      success: true,
      data: {
        trend: result.rows,
        statistics: {
          totalRecords: result.rows.length,
          weightChange,
          percentageChange,
          unit: result.rows.length > 0 ? result.rows[0].unit : null,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching weight trend:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weight trend',
    });
  }
});

/**
 * POST /api/weight-logs
 * Create a new weight log entry
 */
router.post('/', async (req, res) => {
  try {
    const { petId, logDate, weight, unit, notes } = req.body;

    // Validate required fields
    if (!petId || !logDate || !weight) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: petId, logDate, weight',
      });
    }

    // Validate weight is a positive number
    if (parseFloat(weight) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Weight must be a positive number',
      });
    }

    const result = await db.query(
      `INSERT INTO weight_logs (pet_id, log_date, weight, unit, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [petId, logDate, weight, unit || 'lbs', notes || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating weight log:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create weight log',
    });
  }
});

/**
 * PUT /api/weight-logs/:id
 * Update a weight log entry
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { logDate, weight, unit, notes } = req.body;

    // Validate weight if provided
    if (weight !== undefined && parseFloat(weight) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Weight must be a positive number',
      });
    }

    const result = await db.query(
      `UPDATE weight_logs
       SET log_date = COALESCE($1, log_date),
           weight = COALESCE($2, weight),
           unit = COALESCE($3, unit),
           notes = COALESCE($4, notes)
       WHERE id = $5
       RETURNING *`,
      [logDate, weight, unit, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Weight log not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating weight log:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update weight log',
    });
  }
});

/**
 * DELETE /api/weight-logs/:id
 * Delete a weight log entry
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM weight_logs WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Weight log not found',
      });
    }

    res.json({
      success: true,
      message: 'Weight log deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting weight log:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete weight log',
    });
  }
});

/**
 * GET /api/weight-logs/:petId/latest
 * Get the most recent weight entry for a pet
 */
router.get('/:petId/latest', async (req, res) => {
  try {
    const { petId } = req.params;

    const result = await db.query(
      `SELECT *
       FROM weight_logs
       WHERE pet_id = $1
       ORDER BY log_date DESC
       LIMIT 1`,
      [petId]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No weight logs found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching latest weight:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch latest weight',
    });
  }
});

module.exports = router;
