/**
 * Daily Logs API Routes
 * Handles CRUD operations for daily health logs and wellness scores
 */

const express = require("express");
const router = express.Router();
const db = require("../config/database");
const {
  calculateWellnessScore,
  calculatePreventiveCareScore,
  detectScoreDrop,
  getWellnessScoreTrend,
} = require("../utils/wellnessScore");

/**
 * GET /api/daily-logs/:petId
 * Get all daily logs for a pet
 * Query params: ?days=30 (optional, default: 30)
 */
router.get("/:petId", async (req, res) => {
  try {
    const { petId } = req.params;
    const days = parseInt(req.query.days) || 30;

    const result = await db.query(
      `SELECT *
       FROM daily_logs
       WHERE pet_id = $1
         AND log_date >= CURRENT_DATE - INTERVAL '${days} days'
       ORDER BY log_date DESC`,
      [petId],
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching daily logs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch daily logs",
    });
  }
});

/**
 * GET /api/daily-logs/:petId/date/:date
 * Get daily log for a specific date
 */
router.get("/:petId/date/:date", async (req, res) => {
  try {
    const { petId, date } = req.params;

    const result = await db.query(
      "SELECT * FROM daily_logs WHERE pet_id = $1 AND log_date = $2",
      [petId, date],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Daily log not found for this date",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching daily log:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch daily log",
    });
  }
});

/**
 * POST /api/daily-logs
 * Create or update a daily log
 */
router.post("/", async (req, res) => {
  try {
    const {
      petId,
      logDate,
      digestionScore,
      nutritionScore,
      behaviorScore,
      activityScore,
      digestionNotes,
      nutritionNotes,
      behaviorNotes,
      activityNotes,
    } = req.body;

    // Validate required fields
    if (!petId || !logDate) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: petId, logDate",
      });
    }

    // Calculate preventive care score
    const preventiveCareScore = await calculatePreventiveCareScore(petId);

    // Calculate overall wellness score
    const wellnessScore = calculateWellnessScore({
      digestionScore,
      nutritionScore,
      behaviorScore,
      activityScore,
      preventiveCareScore,
    });

    // Upsert (insert or update if exists)
    const result = await db.query(
      `INSERT INTO daily_logs (
        pet_id, log_date, digestion_score, nutrition_score, behavior_score, activity_score,
        digestion_notes, nutrition_notes, behavior_notes, activity_notes, wellness_score
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (pet_id, log_date)
      DO UPDATE SET
        digestion_score = COALESCE($3, daily_logs.digestion_score),
        nutrition_score = COALESCE($4, daily_logs.nutrition_score),
        behavior_score = COALESCE($5, daily_logs.behavior_score),
        activity_score = COALESCE($6, daily_logs.activity_score),
        digestion_notes = COALESCE($7, daily_logs.digestion_notes),
        nutrition_notes = COALESCE($8, daily_logs.nutrition_notes),
        behavior_notes = COALESCE($9, daily_logs.behavior_notes),
        activity_notes = COALESCE($10, daily_logs.activity_notes),
        wellness_score = $11
      RETURNING *`,
      [
        petId,
        logDate,
        digestionScore,
        nutritionScore,
        behaviorScore,
        activityScore,
        digestionNotes,
        nutritionNotes,
        behaviorNotes,
        activityNotes,
        wellnessScore,
      ],
    );

    // Check for significant score drop
    const alertStatus = await detectScoreDrop(petId, wellnessScore);

    res.status(201).json({
      success: true,
      data: result.rows[0],
      alert: alertStatus.isAlert ? alertStatus : null,
    });
  } catch (error) {
    console.error("Error creating/updating daily log:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create/update daily log",
    });
  }
});

/**
 * DELETE /api/daily-logs/:petId/date/:date
 * Delete a daily log
 */
router.delete("/:petId/date/:date", async (req, res) => {
  try {
    const { petId, date } = req.params;

    const result = await db.query(
      "DELETE FROM daily_logs WHERE pet_id = $1 AND log_date = $2 RETURNING id",
      [petId, date],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Daily log not found",
      });
    }

    res.json({
      success: true,
      message: "Daily log deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting daily log:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete daily log",
    });
  }
});

/**
 * GET /api/daily-logs/:petId/wellness-trend
 * Get wellness score trend over time
 * Query params: ?days=30 (optional, default: 30)
 */
router.get("/:petId/wellness-trend", async (req, res) => {
  try {
    const { petId } = req.params;
    const days = parseInt(req.query.days) || 30;

    const trend = await getWellnessScoreTrend(petId, days);

    res.json({
      success: true,
      data: trend,
    });
  } catch (error) {
    console.error("Error fetching wellness trend:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch wellness trend",
    });
  }
});

/**
 * GET /api/daily-logs/:petId/current-score
 * Get the most recent wellness score and alert status
 */
router.get("/:petId/current-score", async (req, res) => {
  try {
    const { petId } = req.params;

    // Get most recent daily log
    const result = await db.query(
      `SELECT *
       FROM daily_logs
       WHERE pet_id = $1
       ORDER BY log_date DESC
       LIMIT 1`,
      [petId],
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          currentScore: null,
          message: "No daily logs found",
        },
      });
    }

    const currentLog = result.rows[0];
    const alertStatus = await detectScoreDrop(petId, currentLog.wellness_score);

    res.json({
      success: true,
      data: {
        currentScore: currentLog.wellness_score,
        logDate: currentLog.log_date,
        components: {
          digestion: currentLog.digestion_score,
          nutrition: currentLog.nutrition_score,
          behavior: currentLog.behavior_score,
          activity: currentLog.activity_score,
        },
        alert: alertStatus.isAlert ? alertStatus : null,
      },
    });
  } catch (error) {
    console.error("Error fetching current score:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch current wellness score",
    });
  }
});

module.exports = router;
