/**
 * Database Initialization Script
 * Runs the SQL schema to set up all tables
 */

const fs = require("fs");
const path = require("path");
const { pool } = require("../config/database");

async function initializeDatabase() {
  try {
    console.log("🗄️  Initializing PupSense Database...\n");

    // Read SQL schema file
    const schemaPath = path.join(__dirname, "../../database/schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    // Execute schema
    console.log("📝 Running database schema...");
    await pool.query(schemaSql);

    console.log("✓ Database schema created successfully");
    console.log(
      "✓ Tables created: users, pets, health_records, daily_logs, weight_logs",
    );
    console.log("✓ Indexes and triggers configured");
    console.log("✓ Demo data inserted\n");

    console.log("🎉 Database initialization complete!\n");

    // Close pool
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();
