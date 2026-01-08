#!/bin/bash

echo "🧪 Testing BarkWell API Endpoints..."
echo ""

API_BASE="http://localhost:3001/api"

echo "1️⃣ Testing Subscription Tiers..."
curl -s "$API_BASE/subscriptions/tiers" | jq '.' 2>/dev/null || echo "❌ Failed"
echo ""

echo "2️⃣ Testing Subscription Status..."
curl -s "$API_BASE/subscriptions/status/1" | jq '.' 2>/dev/null || echo "❌ Failed"
echo ""

echo "3️⃣ Testing Shop Products..."
curl -s "$API_BASE/shop/products" | jq '.[0:2]' 2>/dev/null || echo "❌ Failed"
echo ""

echo "4️⃣ Testing Insurance Partners..."
curl -s "$API_BASE/shop/insurance" | jq '.' 2>/dev/null || echo "❌ Failed"
echo ""

echo "5️⃣ Testing Subscription Upgrade (Mock)..."
curl -s -X POST "$API_BASE/subscriptions/subscribe" \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "tier": "plus", "paymentMethod": "card"}' | jq '.' 2>/dev/null || echo "❌ Failed"
echo ""

echo "✅ API Testing Complete!"
