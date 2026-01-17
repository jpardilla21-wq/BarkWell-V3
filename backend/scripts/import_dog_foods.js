/**
 * Dog Food Brand Import Script
 * Imports nutritional data from JSON file into food_database table
 *
 * Usage: node backend/scripts/import_dog_foods.js
 */

const fs = require("fs");
const path = require("path");
const { pool } = require("../config/database");

/**
 * Main import function
 */
async function importDogFoods() {
  let client;

  try {
    console.log("🍖 Starting Dog Food Brand Import...\n");

    // Read the JSON file
    const jsonPath = path.join(
      __dirname,
      "../../top_100_dog_food_brands_nutritional_data.json",
    );
    console.log("📂 Reading JSON file:", jsonPath);

    const jsonData = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    const brands = jsonData.brands;

    console.log(`✓ Loaded ${brands.length} brands from JSON\n`);

    // Get database client
    client = await pool.connect();

    // Create unique index on (brand_name, product_name) if it doesn't exist
    // This allows the same brand to have multiple products while preventing duplicates
    console.log("🔧 Ensuring unique constraint exists...");
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_food_database_brand_product_unique
      ON food_database(brand_name, product_name)
    `);
    console.log("✓ Unique constraint ready\n");

    // Prepare insert statement with ON CONFLICT
    const insertQuery = `
      INSERT INTO food_database (
        brand_name,
        product_name,
        calories_per_cup,
        protein_percent,
        fat_percent,
        ingredients,
        life_stage
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (brand_name, product_name) DO NOTHING
      RETURNING id
    `;

    let insertedCount = 0;
    let skippedCount = 0;

    console.log("📝 Importing dog food brands...\n");

    // Loop through each brand and insert
    for (const brand of brands) {
      const brandName = brand.name;
      const productName = brand.popularProduct || "Original Formula";
      const caloriesPerCup = brand.nutritionalProfile.caloriesPerCup;
      const proteinPercent = brand.nutritionalProfile.crudeProteinMin || null;
      const fatPercent = brand.nutritionalProfile.crudeFatMin || null;

      // Join keyFeatures array as ingredients (closest available data)
      const ingredients = brand.keyFeatures
        ? brand.keyFeatures.join(", ")
        : null;

      // Determine life_stage (default to 'adult' as most products are for adults)
      // Could be enhanced with AI/parsing logic in the future
      const lifeStage = "adult";

      try {
        const result = await client.query(insertQuery, [
          brandName,
          productName,
          caloriesPerCup,
          proteinPercent,
          fatPercent,
          ingredients,
          lifeStage,
        ]);

        if (result.rowCount > 0) {
          insertedCount++;
          console.log(
            `  ✓ Inserted: ${brandName} - ${productName} (${caloriesPerCup} kcal/cup)`,
          );
        } else {
          skippedCount++;
          console.log(`  ⊘ Skipped (duplicate): ${brandName} - ${productName}`);
        }
      } catch (error) {
        console.error(`  ✗ Error inserting ${brandName}:`, error.message);
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 Import Summary");
    console.log("=".repeat(60));
    console.log(`Total brands processed: ${brands.length}`);
    console.log(`Successfully inserted: ${insertedCount}`);
    console.log(`Skipped (duplicates): ${skippedCount}`);
    console.log("=".repeat(60));
    console.log("\n🎉 Import completed successfully!\n");
  } catch (error) {
    console.error("\n❌ Import failed:", error);
    process.exit(1);
  } finally {
    // Release client and close pool
    if (client) {
      client.release();
    }
    await pool.end();
    process.exit(0);
  }
}

// Run the import
importDogFoods();
