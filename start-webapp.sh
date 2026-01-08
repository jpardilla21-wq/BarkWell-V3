#!/bin/bash

echo "🐕 Starting BarkWell Web App..."
echo ""

# Check if database is initialized
echo "📊 Checking database..."
if ! psql $DATABASE_URL -c "SELECT 1 FROM users LIMIT 1;" 2>/dev/null; then
  echo "⚠️  Database not initialized. Running setup..."
  cd backend && npm run init-db
  cd ..
fi

# Check if Phase 3 migration ran
echo "💰 Checking Phase 3 setup..."
if ! psql $DATABASE_URL -c "SELECT 1 FROM recommended_products LIMIT 1;" 2>/dev/null; then
  echo "⚠️  Phase 3 not migrated. Running migration..."
  node backend/scripts/migratePhase3.js
fi

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting services..."
echo "   Backend API: http://localhost:3001"
echo "   Frontend App: http://localhost:5173"
echo ""

# Start backend in background
cd backend && npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend in background
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Services started!"
echo ""
echo "📝 Testing endpoints:"
echo "   - Subscription tiers: http://localhost:3001/api/subscriptions/tiers"
echo "   - Shop products: http://localhost:3001/api/shop/products"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
