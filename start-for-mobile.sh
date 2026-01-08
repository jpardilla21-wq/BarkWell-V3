#!/bin/bash

echo "📱 Starting BarkWell Web App for Mobile Testing..."
echo ""

# Check database
if ! psql $DATABASE_URL -c "SELECT 1 FROM users LIMIT 1;" 2>/dev/null; then
  echo "⚙️  Initializing database..."
  cd backend && npm run init-db && cd ..
fi

# Check Phase 3
if ! psql $DATABASE_URL -c "SELECT 1 FROM recommended_products LIMIT 1;" 2>/dev/null; then
  echo "💰 Running Phase 3 migration..."
  node backend/scripts/migratePhase3.js
fi

# Install backend deps
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installing backend..."
  cd backend && npm install && cd ..
fi

# Install frontend deps
if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing frontend..."
  cd frontend && npm install && cd ..
fi

echo ""
echo "🚀 Starting servers..."
echo ""

# Start backend
cd backend && npm start &
sleep 4

# Start frontend with host flag for external access
cd ../frontend && npm run dev -- --host &

echo ""
echo "✅ Servers starting!"
echo ""
echo "📱 TO TEST ON YOUR IPHONE:"
echo "   1. Look for the 'Network:' URL in the output above"
echo "   2. Open that URL in Safari on your iPhone"
echo "   3. Test all Phase 3 monetization features!"
echo ""
echo "Press Ctrl+C to stop"

wait
