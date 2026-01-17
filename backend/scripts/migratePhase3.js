/**
 * Phase 3 Database Migration Script
 * Adds monetization features: subscriptions, affiliate links, insurance referrals
 */

const fs = require("fs");
const path = require("path");
const { pool } = require("../config/database");

async function migratePhase3() {
  try {
    console.log("💰 Running Phase 3 Database Migration (Monetization)...\n");

    // Read Phase 3 schema file
    const schemaPath = path.join(__dirname, "../../database/phase3-schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    // Execute schema
    console.log("📝 Running Phase 3 schema migration...");
    await pool.query(schemaSql);

    console.log("✓ Users table updated with subscription fields");
    console.log("✓ Payments table created");
    console.log(
      "✓ Food database updated with affiliate_link and average_price columns",
    );
    console.log("✓ Recommended products table created with sample products");
    console.log("✓ Insurance partners table created with sample partners");
    console.log("\n📊 Summary:");
    console.log("   - Subscription tiers: free, plus, pro");
    console.log(
      "   - 15 curated products added (toys, beds, supplements, etc.)",
    );
    console.log("   - 3 insurance partners configured");
    console.log("\n🎉 Phase 3 migration complete!\n");

    // Close pool
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Phase 3 migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migratePhase3();
