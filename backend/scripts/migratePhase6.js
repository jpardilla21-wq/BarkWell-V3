const db = require('../config/database');

async function migrateReferrals() {
  try {
    // 1. Add referral_code to users if not exists
    await db.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='referral_code') THEN
          ALTER TABLE users ADD COLUMN referral_code VARCHAR(20) UNIQUE;
        END IF;
      END $$;
    `);

    // 2. Create referrals table
    await db.query(`
      CREATE TABLE IF NOT EXISTS referrals (
        id SERIAL PRIMARY KEY,
        referrer_id INTEGER REFERENCES users(id),
        referee_id INTEGER REFERENCES users(id),
        code_used VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending', -- pending, completed
        reward_granted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // 3. Create indexes
    await db.query(`CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_referrals_referee_id ON referrals(referee_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);`);

    console.log('Referral system migration completed successfully');
  } catch (error) {
    console.error('Error migrating referrals:', error);
  }
}

migrateReferrals();
