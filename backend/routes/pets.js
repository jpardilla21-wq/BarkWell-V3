/**
 * Pets API Routes
 * Handles pet profile operations
 */

const express = require("express");
const router = express.Router();
const db = require("../config/database");

/**
 * GET /api/pets
 * Get all pets for a user
 */
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId || 1; // Default to user 1 for demo

    const result = await db.query(
      `SELECT
        id,
        name,
        breed,
        date_of_birth,
        gender,
        weight_unit,
        photo_url,
        created_at,
        -- Calculate age in years
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) as age_years
       FROM pets
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch pets",
    });
  }
});

/**
 * GET /api/pets/:id
 * Get a single pet by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT
        id,
        name,
        breed,
        date_of_birth,
        gender,
        weight_unit,
        photo_url,
        created_at,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, date_of_birth)) as age_years
       FROM pets
       WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Pet not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching pet:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch pet",
    });
  }
});

/**
 * POST /api/pets
 * Create a new pet profile
 */
router.post("/", async (req, res) => {
  try {
    const { userId, name, breed, dateOfBirth, gender, weightUnit, photoUrl } =
      req.body;

    // Validate required fields
    if (!userId || !name) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userId, name",
      });
    }

    const result = await db.query(
      `INSERT INTO pets (user_id, name, breed, date_of_birth, gender, weight_unit, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        userId,
        name,
        breed || null,
        dateOfBirth || null,
        gender || "unknown",
        weightUnit || "lbs",
        photoUrl || null,
      ],
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating pet:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create pet",
    });
  }
});

/**
 * PUT /api/pets/:id
 * Update a pet profile
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, breed, dateOfBirth, gender, weightUnit, photoUrl } = req.body;

    const result = await db.query(
      `UPDATE pets
       SET name = COALESCE($1, name),
           breed = COALESCE($2, breed),
           date_of_birth = COALESCE($3, date_of_birth),
           gender = COALESCE($4, gender),
           weight_unit = COALESCE($5, weight_unit),
           photo_url = COALESCE($6, photo_url)
       WHERE id = $7
       RETURNING *`,
      [name, breed, dateOfBirth, gender, weightUnit, photoUrl, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Pet not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update pet",
    });
  }
});

/**
 * DELETE /api/pets/:id
 * Delete a pet profile
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      "DELETE FROM pets WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Pet not found",
      });
    }

    res.json({
      success: true,
      message: "Pet deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting pet:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete pet",
    });
  }
});

module.exports = router;
