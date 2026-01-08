# 🧪 BarkWell Testing Guide for Replit

## Quick Start Testing

### Method 1: Automatic Startup (Easiest) ⭐

Run this single command to start everything:

```bash
./start-webapp.sh
```

This will:
- ✅ Check and initialize the database
- ✅ Run Phase 3 migrations if needed
- ✅ Install dependencies
- ✅ Start backend API (port 3001)
- ✅ Start frontend app (port 5173)

**Access the app:**
- **Frontend UI**: Click the "Webview" button in Replit (or open the URL shown in console)
- **Backend API**: Use the backend URL shown in console

---

### Method 2: Manual Step-by-Step

**Terminal 1 - Start Backend:**
```bash
cd backend
npm install
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Terminal 3 - Test API:**
```bash
./test-api.sh
```

---

## Testing Checklist

### ✅ Backend API Tests

Run the automated test script:
```bash
./test-api.sh
```

Or test manually:

#### 1. Get Subscription Tiers
```bash
curl http://localhost:3001/api/subscriptions/tiers
```
**Expected:** 3 tiers (Free, Plus, Pro)

#### 2. Check User Subscription Status
```bash
curl http://localhost:3001/api/subscriptions/status/1
```
**Expected:** User's current tier and expiry date

#### 3. Upgrade Subscription (Mock Payment)
```bash
curl -X POST http://localhost:3001/api/subscriptions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "tier": "plus", "paymentMethod": "card"}'
```
**Expected:** Success message, payment record created

#### 4. Get Shop Products
```bash
curl http://localhost:3001/api/shop/products
```
**Expected:** 15 curated products

#### 5. Get Personalized Products
```bash
curl http://localhost:3001/api/shop/curated/1
```
**Expected:** Products filtered by pet size/age

#### 6. Get Insurance Partners
```bash
curl http://localhost:3001/api/shop/insurance
```
**Expected:** 3 insurance partners

---

### ✅ Frontend UI Tests

Open the frontend in your browser and test:

#### **1. Pricing Page**
- [ ] Click "Pricing" or "Upgrade" tab
- [ ] See 3 tier cards (Free, Plus, Pro)
- [ ] Current tier badge displays correctly
- [ ] Click "Subscribe" button on Plus tier
- [ ] See success message after upgrade

#### **2. Shop Tab**
- [ ] Click "Shop" tab
- [ ] See product grid with cards
- [ ] Try category filters (All, Toys, Beds, etc.)
- [ ] Click "Buy on Amazon" button (opens in new tab)
- [ ] Check personalized recommendations section

#### **3. Wellness Dashboard**
- [ ] Navigate to Wellness Dashboard
- [ ] See subscription tier badge in header
- [ ] Free users: See paywall on Wellness Trend Chart
- [ ] Plus/Pro users: See actual chart
- [ ] Check if Insurance Card appears (for uninsured pets)

#### **4. Nutrition Planner**
- [ ] Go to Nutrition Planner
- [ ] Select a dog food from recommendations
- [ ] See "Buy on Amazon" button with price
- [ ] Click affiliate link (should track click)

---

### ✅ Database Verification

Check the database directly:

```bash
# Connect to database
psql $DATABASE_URL

# Check Phase 3 tables exist
\dt

# Check recommended products
SELECT COUNT(*) FROM recommended_products;
# Expected: 15

# Check insurance partners
SELECT partner_name, discount_offer FROM insurance_partners;
# Expected: 3 partners (Lemonade, Trupanion, Healthy Paws)

# Check user subscription
SELECT id, email, subscription_tier, subscription_expiry FROM users WHERE id = 1;

# Check payment history
SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;

# Exit psql
\q
```

---

## Replit-Specific Tips

### 1. **Use Replit Webview**
- The Replit interface will detect your running web server
- Click the "Webview" button to see the frontend
- You may need to allow popups for external URLs

### 2. **Check Port Forwarding**
The `.replit` config already sets up:
- Port 3001 → Backend API
- Port 5173 → Frontend Vite dev server

### 3. **Database Connection**
Replit provides `$DATABASE_URL` environment variable automatically.
Check with:
```bash
echo $DATABASE_URL
```

### 4. **View Logs**
- Backend logs: Check Terminal 1
- Frontend logs: Check Terminal 2
- Browser console: Open DevTools (F12)

---

## Common Issues & Solutions

### ❌ "Port already in use"
```bash
# Kill existing processes
pkill -f "node server.js"
pkill -f "vite"
```

### ❌ "Cannot connect to database"
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start if needed
sudo service postgresql start

# Verify connection
psql $DATABASE_URL -c "SELECT 1;"
```

### ❌ "Module not found"
```bash
# Reinstall dependencies
cd backend && npm install
cd ../frontend && npm install
```

### ❌ "Migration failed"
```bash
# Run migrations manually
node backend/scripts/initDatabase.js
node backend/scripts/migratePhase3.js
```

---

## Quick Verification Commands

### Is everything running?
```bash
# Check backend
curl http://localhost:3001/api/subscriptions/tiers

# Check frontend
curl http://localhost:5173
```

### Check process status
```bash
ps aux | grep -E "(node|vite)" | grep -v grep
```

### View recent database activity
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) as total_users FROM users;"
psql $DATABASE_URL -c "SELECT COUNT(*) as total_products FROM recommended_products;"
```

---

## Test User Data

The app uses **User ID 1** for testing. You can:

1. Check current subscription:
```bash
curl http://localhost:3001/api/subscriptions/status/1
```

2. Upgrade to Plus:
```bash
curl -X POST http://localhost:3001/api/subscriptions/subscribe \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "tier": "plus", "paymentMethod": "card"}'
```

3. Downgrade to Free:
```bash
curl -X POST http://localhost:3001/api/subscriptions/cancel \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'
```

---

## Performance Testing

### Load Test Shop Endpoint
```bash
# Test 10 rapid requests
for i in {1..10}; do
  curl -s http://localhost:3001/api/shop/products > /dev/null &
done
wait
echo "✅ Load test complete"
```

### Check Response Times
```bash
# Time API response
time curl http://localhost:3001/api/subscriptions/tiers
```

---

## Next Steps After Testing

Once everything works:

1. ✅ **Phase 3 Testing Complete**
2. 🎯 **Move to Phase 4:** Real Stripe integration
3. 🚀 **Deploy to Production:** Set up hosting
4. 📊 **Add Analytics:** Track user behavior
5. 📧 **Email Notifications:** Subscription confirmations

---

## Support

If you encounter issues:
1. Check backend terminal for error logs
2. Check browser console for frontend errors
3. Verify database connection with `psql $DATABASE_URL`
4. Review API response codes (200 = success, 500 = server error)

---

**Last Updated:** 2026-01-08
**Project Status:** Phase 3 Complete - Ready for Testing
