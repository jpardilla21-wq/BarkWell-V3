/**
 * PupSense Backend Server
 * Express API server for pet health tracking application
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const db = require('./config/database');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// ================================================
// MIDDLEWARE
// ================================================

// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// HTTP request logging
app.use(morgan('dev'));

// Webhook routes need raw body, so we mount them before body-parser
app.use('/api/webhooks', require('./routes/webhooks'));

// Parse JSON request bodies for other routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ================================================
// API ROUTES
// ================================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'PupSense API is running',
    timestamp: new Date().toISOString(),
  });
});

// Import route handlers
const petsRoutes = require('./routes/pets');
const healthRecordsRoutes = require('./routes/healthRecords');
const dailyLogsRoutes = require('./routes/dailyLogs');
const weightLogsRoutes = require('./routes/weightLogs');
// Phase 2 routes
const nutritionRoutes = require('./routes/nutrition');
const contentRoutes = require('./routes/content');
const breedsRoutes = require('./routes/breeds');
// Phase 3 routes (Monetization)
const subscriptionsRoutes = require('./routes/subscriptions');
const shopRoutes = require('./routes/shop');

// Mount routes
app.use('/api/pets', petsRoutes);
app.use('/api/health-records', healthRecordsRoutes);
app.use('/api/daily-logs', dailyLogsRoutes);
app.use('/api/weight-logs', weightLogsRoutes);
// Phase 2 routes
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/breeds', breedsRoutes);
// Phase 3 routes (Monetization)
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/shop', shopRoutes);

// ================================================
// ERROR HANDLING
// ================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ================================================
// START SERVER
// ================================================

app.listen(PORT, async () => {
  console.log('\n🚀 PupSense API Server Started');
  console.log('=====================================');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log('=====================================\n');

  // Test database connection
  try {
    await db.query('SELECT NOW()');
    console.log('✓ Database connection established\n');
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    console.error('Please check your database configuration in .env file\n');
  }

  console.log('Available API Endpoints:');
  console.log('------------------------');
  console.log('GET    /api/health                            - Health check');
  console.log('GET    /api/pets                              - Get all pets');
  console.log('GET    /api/pets/:id                          - Get pet by ID');
  console.log('POST   /api/pets                              - Create new pet');
  console.log('PUT    /api/pets/:id                          - Update pet');
  console.log('DELETE /api/pets/:id                          - Delete pet');
  console.log('');
  console.log('GET    /api/health-records/vaccinations/:petId      - Get vaccinations');
  console.log('POST   /api/health-records/vaccinations             - Create vaccination');
  console.log('PUT    /api/health-records/vaccinations/:id         - Update vaccination');
  console.log('DELETE /api/health-records/vaccinations/:id         - Delete vaccination');
  console.log('');
  console.log('GET    /api/health-records/medications/:petId       - Get medications');
  console.log('POST   /api/health-records/medications              - Create medication');
  console.log('PUT    /api/health-records/medications/:id          - Update medication');
  console.log('DELETE /api/health-records/medications/:id          - Delete medication');
  console.log('');
  console.log('GET    /api/health-records/vet-visits/:petId        - Get vet visits');
  console.log('POST   /api/health-records/vet-visits               - Create vet visit');
  console.log('PUT    /api/health-records/vet-visits/:id           - Update vet visit');
  console.log('DELETE /api/health-records/vet-visits/:id           - Delete vet visit');
  console.log('');
  console.log('GET    /api/daily-logs/:petId                       - Get daily logs');
  console.log('GET    /api/daily-logs/:petId/wellness-trend        - Get wellness trend');
  console.log('GET    /api/daily-logs/:petId/current-score         - Get current score');
  console.log('POST   /api/daily-logs                              - Create/update daily log');
  console.log('DELETE /api/daily-logs/:petId/date/:date            - Delete daily log');
  console.log('');
  console.log('GET    /api/weight-logs/:petId                      - Get weight logs');
  console.log('GET    /api/weight-logs/:petId/trend                - Get weight trend');
  console.log('GET    /api/weight-logs/:petId/latest               - Get latest weight');
  console.log('POST   /api/weight-logs                             - Create weight log');
  console.log('PUT    /api/weight-logs/:id                         - Update weight log');
  console.log('DELETE /api/weight-logs/:id                         - Delete weight log');
  console.log('');
  console.log('--- Phase 2: Engagement Features ---');
  console.log('GET    /api/nutrition/plan/:petId                   - Get nutrition plan');
  console.log('POST   /api/nutrition/calculate                     - Calculate caloric needs');
  console.log('POST   /api/nutrition/plan                          - Create/update nutrition plan');
  console.log('GET    /api/nutrition/foods                         - Get food database');
  console.log('POST   /api/nutrition/portion                       - Calculate portion size');
  console.log('GET    /api/nutrition/treats/:petId                 - Get treat logs');
  console.log('POST   /api/nutrition/treats                        - Log treat');
  console.log('DELETE /api/nutrition/treats/:id                    - Delete treat');
  console.log('');
  console.log('GET    /api/content                                 - Get all content');
  console.log('GET    /api/content/recommend/:petId                - Get personalized recommendations');
  console.log('GET    /api/content/categories/list                 - Get content categories');
  console.log('');
  console.log('GET    /api/breeds                                  - Get all breeds');
  console.log('GET    /api/breeds/:breedName                       - Get breed information');
  console.log('');
  console.log('--- Phase 3: Monetization Features ---');
  console.log('GET    /api/subscriptions/tiers                     - Get subscription tiers & pricing');
  console.log('GET    /api/subscriptions/status/:userId            - Get user subscription status');
  console.log('POST   /api/subscriptions/subscribe                 - Subscribe to premium (mock payment)');
  console.log('POST   /api/subscriptions/cancel                    - Cancel subscription');
  console.log('GET    /api/subscriptions/payments/:userId          - Get payment history');
  console.log('');
  console.log('GET    /api/shop/products                           - Get affiliate products');
  console.log('GET    /api/shop/curated/:petId                     - Get personalized product recommendations');
  console.log('GET    /api/shop/categories                         - Get product categories');
  console.log('GET    /api/shop/insurance                          - Get insurance partners');
  console.log('POST   /api/shop/track-click                        - Track affiliate click');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    db.pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });
});

module.exports = app;
