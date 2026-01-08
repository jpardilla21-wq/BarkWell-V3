/**
 * Health Records API Routes
 * Handles CRUD operations for vaccinations, medications, and vet visits
 */

const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ================================================
// VACCINATIONS
// ================================================

/**
 * GET /api/health-records/vaccinations/:petId
 * Get all vaccinations for a pet
 */
router.get('/vaccinations/:petId', async (req, res) => {
  try {
    const { petId } = req.params;

    const result = await db.query(
      `SELECT
        id,
        vaccination_name,
        vaccination_date,
        next_due_date,
        created_at,
        updated_at,
        -- Check if vaccination is due within 7 days
        CASE
          WHEN next_due_date <= CURRENT_DATE + INTERVAL '7 days'
            AND next_due_date >= CURRENT_DATE
          THEN true
          ELSE false
        END as is_reminder,
        -- Check if overdue
        CASE
          WHEN next_due_date < CURRENT_DATE
          THEN true
          ELSE false
        END as is_overdue
      FROM health_records
      WHERE pet_id = $1 AND record_type = 'vaccination'
      ORDER BY next_due_date ASC NULLS LAST, vaccination_date DESC`,
      [petId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching vaccinations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vaccinations',
    });
  }
});

/**
 * POST /api/health-records/vaccinations
 * Create a new vaccination record
 */
router.post('/vaccinations', async (req, res) => {
  try {
    const { petId, vaccinationName, vaccinationDate, nextDueDate } = req.body;

    // Validate required fields
    if (!petId || !vaccinationName || !vaccinationDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: petId, vaccinationName, vaccinationDate',
      });
    }

    const result = await db.query(
      `INSERT INTO health_records (pet_id, record_type, vaccination_name, vaccination_date, next_due_date)
       VALUES ($1, 'vaccination', $2, $3, $4)
       RETURNING *`,
      [petId, vaccinationName, vaccinationDate, nextDueDate || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating vaccination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create vaccination record',
    });
  }
});

/**
 * PUT /api/health-records/vaccinations/:id
 * Update a vaccination record
 */
router.put('/vaccinations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { vaccinationName, vaccinationDate, nextDueDate } = req.body;

    const result = await db.query(
      `UPDATE health_records
       SET vaccination_name = COALESCE($1, vaccination_name),
           vaccination_date = COALESCE($2, vaccination_date),
           next_due_date = COALESCE($3, next_due_date)
       WHERE id = $4 AND record_type = 'vaccination'
       RETURNING *`,
      [vaccinationName, vaccinationDate, nextDueDate, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vaccination record not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating vaccination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update vaccination record',
    });
  }
});

/**
 * DELETE /api/health-records/vaccinations/:id
 * Delete a vaccination record
 */
router.delete('/vaccinations/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM health_records WHERE id = $1 AND record_type = \'vaccination\' RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vaccination record not found',
      });
    }

    res.json({
      success: true,
      message: 'Vaccination record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting vaccination:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete vaccination record',
    });
  }
});

// ================================================
// MEDICATIONS
// ================================================

/**
 * GET /api/health-records/medications/:petId
 * Get all medications for a pet
 */
router.get('/medications/:petId', async (req, res) => {
  try {
    const { petId } = req.params;

    const result = await db.query(
      `SELECT
        id,
        medication_name,
        dosage,
        frequency,
        start_date,
        end_date,
        created_at,
        updated_at,
        -- Check if medication is currently active
        CASE
          WHEN start_date <= CURRENT_DATE
            AND (end_date IS NULL OR end_date >= CURRENT_DATE)
          THEN true
          ELSE false
        END as is_active
      FROM health_records
      WHERE pet_id = $1 AND record_type = 'medication'
      ORDER BY is_active DESC, start_date DESC`,
      [petId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch medications',
    });
  }
});

/**
 * POST /api/health-records/medications
 * Create a new medication record
 */
router.post('/medications', async (req, res) => {
  try {
    const { petId, medicationName, dosage, frequency, startDate, endDate } = req.body;

    // Validate required fields
    if (!petId || !medicationName || !dosage || !frequency || !startDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: petId, medicationName, dosage, frequency, startDate',
      });
    }

    const result = await db.query(
      `INSERT INTO health_records (pet_id, record_type, medication_name, dosage, frequency, start_date, end_date)
       VALUES ($1, 'medication', $2, $3, $4, $5, $6)
       RETURNING *`,
      [petId, medicationName, dosage, frequency, startDate, endDate || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create medication record',
    });
  }
});

/**
 * PUT /api/health-records/medications/:id
 * Update a medication record
 */
router.put('/medications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { medicationName, dosage, frequency, startDate, endDate } = req.body;

    const result = await db.query(
      `UPDATE health_records
       SET medication_name = COALESCE($1, medication_name),
           dosage = COALESCE($2, dosage),
           frequency = COALESCE($3, frequency),
           start_date = COALESCE($4, start_date),
           end_date = COALESCE($5, end_date)
       WHERE id = $6 AND record_type = 'medication'
       RETURNING *`,
      [medicationName, dosage, frequency, startDate, endDate, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Medication record not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating medication:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update medication record',
    });
  }
});

/**
 * DELETE /api/health-records/medications/:id
 * Delete a medication record
 */
router.delete('/medications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM health_records WHERE id = $1 AND record_type = \'medication\' RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Medication record not found',
      });
    }

    res.json({
      success: true,
      message: 'Medication record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting medication:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete medication record',
    });
  }
});

// ================================================
// VET VISITS
// ================================================

/**
 * GET /api/health-records/vet-visits/:petId
 * Get all vet visits for a pet
 */
router.get('/vet-visits/:petId', async (req, res) => {
  try {
    const { petId } = req.params;

    const result = await db.query(
      `SELECT
        id,
        visit_date,
        vet_name,
        reason,
        diagnosis,
        notes,
        created_at,
        updated_at
      FROM health_records
      WHERE pet_id = $1 AND record_type = 'vet_visit'
      ORDER BY visit_date DESC`,
      [petId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching vet visits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vet visits',
    });
  }
});

/**
 * POST /api/health-records/vet-visits
 * Create a new vet visit record
 */
router.post('/vet-visits', async (req, res) => {
  try {
    const { petId, visitDate, vetName, reason, diagnosis, notes } = req.body;

    // Validate required fields
    if (!petId || !visitDate) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: petId, visitDate',
      });
    }

    const result = await db.query(
      `INSERT INTO health_records (pet_id, record_type, visit_date, vet_name, reason, diagnosis, notes)
       VALUES ($1, 'vet_visit', $2, $3, $4, $5, $6)
       RETURNING *`,
      [petId, visitDate, vetName || null, reason || null, diagnosis || null, notes || null]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating vet visit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create vet visit record',
    });
  }
});

/**
 * PUT /api/health-records/vet-visits/:id
 * Update a vet visit record
 */
router.put('/vet-visits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { visitDate, vetName, reason, diagnosis, notes } = req.body;

    const result = await db.query(
      `UPDATE health_records
       SET visit_date = COALESCE($1, visit_date),
           vet_name = COALESCE($2, vet_name),
           reason = COALESCE($3, reason),
           diagnosis = COALESCE($4, diagnosis),
           notes = COALESCE($5, notes)
       WHERE id = $6 AND record_type = 'vet_visit'
       RETURNING *`,
      [visitDate, vetName, reason, diagnosis, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vet visit record not found',
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating vet visit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update vet visit record',
    });
  }
});

/**
 * DELETE /api/health-records/vet-visits/:id
 * Delete a vet visit record
 */
router.delete('/vet-visits/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'DELETE FROM health_records WHERE id = $1 AND record_type = \'vet_visit\' RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Vet visit record not found',
      });
    }

    res.json({
      success: true,
      message: 'Vet visit record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting vet visit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete vet visit record',
    });
  }
});

module.exports = router;
