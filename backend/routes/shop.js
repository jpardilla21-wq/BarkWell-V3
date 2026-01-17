/**
 * Shop Routes - Phase 3 Monetization
 * Handles affiliate product recommendations
 */

const express = require("express");
const router = express.Router();
const db = require("../config/database");

/**
 * GET /api/shop/products
 * Get recommended products filtered by pet characteristics
 * Query params: petId (optional), category, size
 */
router.get("/products", async (req, res) => {
  try {
    const { petId, category, size } = req.query;

    let targetSize = size;

    // If petId provided, determine size from pet's weight
    if (petId && !targetSize) {
      const petResult = await db.query(
        `SELECT
          p.name,
          COALESCE(
            (SELECT weight FROM weight_logs WHERE pet_id = p.id ORDER BY log_date DESC LIMIT 1),
            0
          ) as current_weight
         FROM pets p
         WHERE p.id = $1`,
        [petId],
      );

      if (petResult.rows.length > 0) {
        const weight = parseFloat(petResult.rows[0].current_weight);
        // Categorize by weight (assuming lbs)
        if (weight < 25) {
          targetSize = "Small";
        } else if (weight < 55) {
          targetSize = "Medium";
        } else {
          targetSize = "Large";
        }
      }
    }

    // Build query
    let query = `
      SELECT
        id,
        name,
        category,
        description,
        affiliate_link,
        target_breed_size,
        image_url,
        average_price,
        features
      FROM recommended_products
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 1;

    // Filter by category
    if (category) {
      query += ` AND category = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    // Filter by size (include 'All' sizes)
    if (targetSize) {
      query += ` AND (target_breed_size = $${paramCount} OR target_breed_size = 'All')`;
      params.push(targetSize);
      paramCount++;
    }

    query += " ORDER BY category, name";

    const result = await db.query(query, params);

    res.json({
      success: true,
      products: result.rows,
      count: result.rows.length,
      filters: {
        category: category || "all",
        size: targetSize || "all",
        petId: petId || null,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get products",
    });
  }
});

/**
 * GET /api/shop/curated/:petId
 * Get personalized product recommendations for a specific pet
 */
router.get("/curated/:petId", async (req, res) => {
  try {
    const { petId } = req.params;

    // Get pet information
    const petResult = await db.query(
      `SELECT
        p.id,
        p.name,
        p.breed,
        COALESCE(
          (SELECT weight FROM weight_logs WHERE pet_id = p.id ORDER BY log_date DESC LIMIT 1),
          0
        ) as current_weight,
        EXTRACT(YEAR FROM AGE(CURRENT_DATE, p.date_of_birth)) as age_years
       FROM pets p
       WHERE p.id = $1`,
      [petId],
    );

    if (petResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Pet not found",
      });
    }

    const pet = petResult.rows[0];
    const weight = parseFloat(pet.current_weight);

    // Determine size category
    let targetSize;
    if (weight < 25) {
      targetSize = "Small";
    } else if (weight < 55) {
      targetSize = "Medium";
    } else {
      targetSize = "Large";
    }

    // Get curated products (include size-specific and 'All')
    const productsResult = await db.query(
      `SELECT
        id,
        name,
        category,
        description,
        affiliate_link,
        target_breed_size,
        image_url,
        average_price,
        features
       FROM recommended_products
       WHERE target_breed_size = $1 OR target_breed_size = 'All'
       ORDER BY
         CASE category
           WHEN 'Toy' THEN 1
           WHEN 'Supplement' THEN 2
           WHEN 'Bed' THEN 3
           WHEN 'Grooming' THEN 4
           WHEN 'Health' THEN 5
           ELSE 6
         END,
         name
       LIMIT 12`,
      [targetSize],
    );

    // Add age-based recommendations
    const recommendations = [];
    const ageYears = parseFloat(pet.age_years);

    if (ageYears < 1) {
      recommendations.push(
        "Consider puppy training toys for mental stimulation",
      );
    } else if (ageYears > 7) {
      recommendations.push(
        "Senior dogs benefit from orthopedic beds and joint supplements",
      );
    }

    if (weight > 50) {
      recommendations.push("Large dogs need durable toys and elevated feeders");
    }

    res.json({
      success: true,
      pet: {
        id: pet.id,
        name: pet.name,
        breed: pet.breed,
        weight: weight,
        size: targetSize,
        age: ageYears,
      },
      products: productsResult.rows,
      recommendations,
      count: productsResult.rows.length,
    });
  } catch (error) {
    console.error("Get curated products error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get curated products",
    });
  }
});

/**
 * GET /api/shop/categories
 * Get available product categories
 */
router.get("/categories", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT DISTINCT category, COUNT(*) as count
       FROM recommended_products
       GROUP BY category
       ORDER BY category`,
    );

    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get categories",
    });
  }
});

/**
 * GET /api/shop/insurance
 * Get insurance partner information
 */
router.get("/insurance", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
        id,
        partner_name,
        referral_link,
        discount_offer,
        logo_url,
        description
       FROM insurance_partners
       WHERE is_active = true
       ORDER BY partner_name`,
    );

    res.json({
      success: true,
      partners: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Get insurance partners error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get insurance partners",
    });
  }
});

/**
 * POST /api/shop/track-click
 * Track affiliate link clicks for analytics
 */
router.post("/track-click", async (req, res) => {
  try {
    const { productId, petId, clickType } = req.body;

    // In a real app, you'd store this in an analytics table
    // For now, just log it
    console.log("Affiliate click tracked:", {
      productId,
      petId,
      clickType,
      timestamp: new Date(),
    });

    res.json({
      success: true,
      message: "Click tracked",
    });
  } catch (error) {
    console.error("Track click error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to track click",
    });
  }
});

module.exports = router;
