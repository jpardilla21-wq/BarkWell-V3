const db = require('../config/database');

async function createAnalyticsTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        event_name VARCHAR(255) NOT NULL,
        properties JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON analytics_events(event_name);`);
    await db.query(`CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);`);

    console.log('Analytics table created successfully');
  } catch (error) {
    console.error('Error creating analytics table:', error);
  }
}

createAnalyticsTable();
