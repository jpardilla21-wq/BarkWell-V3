/**
 * Phase 5 Database Migration Script
 * Adds advanced analytics tracking and reporting capabilities
 */

const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function migratePhase5() {
  try {
    console.log('📊 Running Phase 5 Database Migration (Advanced Analytics)...\n');

    // Read Phase 5 schema file
    const schemaPath = path.join(__dirname, '../../database/phase5-schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    console.log('📝 Running Phase 5 schema migration...');
    await pool.query(schemaSql);

    console.log('✓ Analytics events table created');
    console.log('✓ Affiliate clicks tracking table created');
    console.log('✓ Subscription changes tracking table created');
    console.log('✓ Daily metrics snapshot table created');
    console.log('✓ User cohorts table created');
    console.log('✓ Feature usage tracking table created');
    console.log('✓ Insurance referrals tracking table created');
    console.log('✓ Analytics views created (subscription metrics, affiliate performance, user growth, churn analysis)');
    console.log('✓ Analytics functions created (MRR calculation, churn rate, daily metrics update)');

    console.log('\n📊 Summary:');
    console.log('   - 7 new tracking tables');
    console.log('   - 4 analytics views for fast queries');
    console.log('   - 3 analytics functions for calculations');
    console.log('   - Indexes optimized for dashboard queries');

    console.log('\n💡 Next steps:');
    console.log('   1. Run: npm run migrate:phase5');
    console.log('   2. Set up daily metrics cron job: SELECT update_daily_metrics();');
    console.log('   3. Implement analytics API endpoints in backend/routes/analytics.js');
    console.log('   4. Build admin dashboard frontend component');

    console.log('\n🎉 Phase 5 migration complete!\n');

    // Close pool
    await pool.end();
    process.exit(0);

  } catch (error) {
    console.error('❌ Phase 5 migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migratePhase5();
