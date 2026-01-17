/**
 * Nutrition Routes
 * Handles nutrition plans, food database, and treat tracking
 */

const express = require("express");
const router = express.Router();
const { query } = require("../config/database");
const {
  calculateCalories,
  calculatePortionSize,
  generateMealSchedule,
} = require("../utils/calorieCalculator");

// ================================================
// NUTRITION PLANS ENDPOINTS
// ================================================

/**
 * GET /api/nutrition/plan/:petId
 * Get nutrition plan for a specific pet
 */
router.get("/plan/:petId", async (req, res) => {
  try {
    const { petId } = req.params;

    const result = await query(
      "SELECT * FROM nutrition_plans WHERE pet_id = $1",
      [petId],
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: "No nutrition plan found for this pet",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching nutrition plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nutrition plan",
    });
  }
});

/**
 * POST /api/nutrition/calculate
 * Calculate caloric needs for a pet
 * Body: { breed, ageYears, weightLbs, activityLevel }
 */
router.post("/calculate", async (req, res) => {
  try {
    const { breed, ageYears, weightLbs, activityLevel } = req.body;

    if (!weightLbs || !ageYears || !activityLevel) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: weightLbs, ageYears, activityLevel",
      });
    }

    const caloricNeeds = calculateCalories({
      breed: breed || "Mixed Breed",
      ageYears: parseFloat(ageYears),
      weightLbs: parseFloat(weightLbs),
      activityLevel,
    });

    res.json({
      success: true,
      data: caloricNeeds,
    });
  } catch (error) {
    console.error("Error calculating calories:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate calories",
    });
  }
});

/**
 * POST /api/nutrition/plan
 * Create or update nutrition plan for a pet
 * Body: { petId, activityLevel, mealsPerDay, foodId, notes }
 */
router.post("/plan", async (req, res) => {
  try {
    const { petId, activityLevel, mealsPerDay = 2, foodId, notes } = req.body;

    if (!petId || !activityLevel) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: petId, activityLevel",
      });
    }

    // Get pet information
    const petResult = await query(
      "SELECT breed, date_of_birth, extract(year from age(date_of_birth)) as age_years FROM pets WHERE id = $1",
      [petId],
    );

    if (petResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pet not found",
      });
    }

    const pet = petResult.rows[0];

    // Get latest weight
    const weightResult = await query(
      "SELECT weight FROM weight_logs WHERE pet_id = $1 ORDER BY date DESC LIMIT 1",
      [petId],
    );

    if (weightResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No weight data found for this pet. Please add weight first.",
      });
    }

    const weightLbs = weightResult.rows[0].weight;

    // Calculate caloric needs
    const caloricNeeds = calculateCalories({
      breed: pet.breed,
      ageYears: parseFloat(pet.age_years),
      weightLbs: parseFloat(weightLbs),
      activityLevel,
    });

    // Get food info if foodId provided
    let mealSchedule = [];
    if (foodId) {
      const foodResult = await query(
        "SELECT calories_per_cup FROM food_database WHERE id = $1",
        [foodId],
      );

      if (foodResult.rows.length > 0) {
        const caloriesPerCup = foodResult.rows[0].calories_per_cup;
        const portions = calculatePortionSize(
          caloricNeeds.mealCalories,
          caloriesPerCup,
          parseInt(mealsPerDay),
        );

        mealSchedule = generateMealSchedule(
          portions.cupsPerMeal,
          parseInt(mealsPerDay),
        );
      }
    } else {
      // Default schedule without specific portions
      mealSchedule = generateMealSchedule(0, parseInt(mealsPerDay));
    }

    // Insert or update nutrition plan
    const upsertResult = await query(
      `INSERT INTO nutrition_plans (pet_id, caloric_needs, meal_schedule, treat_allowance, activity_level, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (pet_id)
       DO UPDATE SET
         caloric_needs = EXCLUDED.caloric_needs,
         meal_schedule = EXCLUDED.meal_schedule,
         treat_allowance = EXCLUDED.treat_allowance,
         activity_level = EXCLUDED.activity_level,
         notes = EXCLUDED.notes,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        petId,
        caloricNeeds.totalCalories,
        JSON.stringify(mealSchedule),
        caloricNeeds.treatAllowance,
        activityLevel,
        notes || null,
      ],
    );

    res.json({
      success: true,
      data: {
        plan: upsertResult.rows[0],
        calculations: caloricNeeds,
      },
      message: "Nutrition plan saved successfully",
    });
  } catch (error) {
    console.error("Error creating nutrition plan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create nutrition plan",
    });
  }
});

// ================================================
// FOOD DATABASE ENDPOINTS
// ================================================

/**
 * GET /api/nutrition/foods
 * Get all foods from database, optionally filtered by life stage
 * Phase 3: Now includes affiliate_link and average_price
 */
router.get("/foods", async (req, res) => {
  try {
    const { lifeStage } = req.query;

    let queryText = "SELECT * FROM food_database";
    const params = [];

    if (lifeStage) {
      queryText += " WHERE life_stage = $1 OR life_stage = $2";
      params.push(lifeStage, "all_life_stages");
    }

    queryText += " ORDER BY brand_name, product_name";

    const result = await query(queryText, params);

    // Add fallback Amazon search links for foods without affiliate links
    const foodsWithLinks = result.rows.map((food) => {
      if (!food.affiliate_link) {
        // Generate generic Amazon search link
        const searchQuery = encodeURIComponent(
          `${food.brand_name} ${food.product_name} dog food`,
        );
        food.affiliate_link = `https://www.amazon.com/s?k=${searchQuery}&tag=pupsense-20`;
        food.affiliate_link_type = "search";
      } else {
        food.affiliate_link_type = "direct";
      }
      return food;
    });

    res.json({
      success: true,
      data: foodsWithLinks,
    });
  } catch (error) {
    console.error("Error fetching foods:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch food database",
    });
  }
});

/**
 * POST /api/nutrition/portion
 * Calculate portion size for a selected food
 * Body: { petId, foodId, mealsPerDay }
 */
router.post("/portion", async (req, res) => {
  try {
    const { petId, foodId, mealsPerDay = 2 } = req.body;

    if (!petId || !foodId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: petId, foodId",
      });
    }

    // Get nutrition plan
    const planResult = await query(
      "SELECT caloric_needs, treat_allowance FROM nutrition_plans WHERE pet_id = $1",
      [petId],
    );

    if (planResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nutrition plan not found. Please create a plan first.",
      });
    }

    const plan = planResult.rows[0];
    const mealCalories = plan.caloric_needs - plan.treat_allowance;

    // Get food info
    const foodResult = await query(
      "SELECT * FROM food_database WHERE id = $1",
      [foodId],
    );

    if (foodResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const food = foodResult.rows[0];

    // Add fallback Amazon search link if no affiliate link
    if (!food.affiliate_link) {
      const searchQuery = encodeURIComponent(
        `${food.brand_name} ${food.product_name} dog food`,
      );
      food.affiliate_link = `https://www.amazon.com/s?k=${searchQuery}&tag=pupsense-20`;
      food.affiliate_link_type = "search";
    } else {
      food.affiliate_link_type = "direct";
    }

    // Calculate portions
    const portions = calculatePortionSize(
      mealCalories,
      food.calories_per_cup,
      parseInt(mealsPerDay),
    );

    res.json({
      success: true,
      data: {
        food,
        portions,
        dailyCalories: plan.caloric_needs,
        treatAllowance: plan.treat_allowance,
      },
    });
  } catch (error) {
    console.error("Error calculating portion:", error);
    res.status(500).json({
      success: false,
      message: "Failed to calculate portion size",
    });
  }
});

// ================================================
// TREAT TRACKING ENDPOINTS
// ================================================

/**
 * GET /api/nutrition/treats/:petId
 * Get treat logs for a specific pet for today
 */
router.get("/treats/:petId", async (req, res) => {
  try {
    const { petId } = req.params;
    const { date } = req.query; // Optional specific date

    const queryDate = date || "CURRENT_DATE";
    const result = await query(
      `SELECT * FROM treat_logs
       WHERE pet_id = $1 AND date = ${date ? "$2" : "CURRENT_DATE"}
       ORDER BY logged_at DESC`,
      date ? [petId, date] : [petId],
    );

    // Get treat allowance from nutrition plan
    const planResult = await query(
      "SELECT treat_allowance FROM nutrition_plans WHERE pet_id = $1",
      [petId],
    );

    const treatAllowance =
      planResult.rows.length > 0 ? planResult.rows[0].treat_allowance : 0;
    const caloriesUsed = result.rows.reduce(
      (sum, treat) => sum + treat.calories,
      0,
    );

    res.json({
      success: true,
      data: {
        treats: result.rows,
        summary: {
          treatAllowance,
          caloriesUsed,
          caloriesRemaining: Math.max(0, treatAllowance - caloriesUsed),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching treats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch treat logs",
    });
  }
});

/**
 * POST /api/nutrition/treats
 * Log a treat
 * Body: { petId, treatName, calories }
 */
router.post("/treats", async (req, res) => {
  try {
    const { petId, treatName, calories } = req.body;

    if (!petId || !treatName || !calories) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: petId, treatName, calories",
      });
    }

    const result = await query(
      `INSERT INTO treat_logs (pet_id, treat_name, calories)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [petId, treatName, parseInt(calories)],
    );

    res.json({
      success: true,
      data: result.rows[0],
      message: "Treat logged successfully",
    });
  } catch (error) {
    console.error("Error logging treat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to log treat",
    });
  }
});

/**
 * DELETE /api/nutrition/treats/:id
 * Delete a treat log
 */
router.delete("/treats/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await query("DELETE FROM treat_logs WHERE id = $1", [id]);

    res.json({
      success: true,
      message: "Treat log deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting treat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete treat log",
    });
  }
});

module.exports = router;
