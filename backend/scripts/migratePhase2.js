/**
 * Phase 2 Database Migration Script
 * Adds new tables for nutrition, content, and breed info
 */

const fs = require("fs");
const path = require("path");
const { pool } = require("../config/database");

async function migratePhase2() {
  try {
    console.log("🗄️  Running Phase 2 Database Migration...\n");

    // Read Phase 2 schema file
    const schemaPath = path.join(__dirname, "../../database/phase2-schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    // Execute schema
    console.log("📝 Running Phase 2 schema migration...");
    await pool.query(schemaSql);

    console.log("✓ Phase 2 tables created successfully");
    console.log(
      "✓ Tables added: nutrition_plans, food_database, treat_logs, content_library, breed_info",
    );
    console.log(
      "✓ Mock data inserted for food_database, content_library, and breed_info",
    );
    console.log("\n🎉 Phase 2 migration complete!\n");

    // Close pool
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Phase 2 migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migratePhase2();
