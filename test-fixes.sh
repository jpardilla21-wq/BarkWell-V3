#!/bin/bash

# BarkWell - Test Fixes Script
# This script clears the cache and starts the Expo dev server fresh

echo "🐕 BarkWell - Testing Fixes"
echo "================================"
echo ""

# Stop any running Metro bundler
echo "📦 Stopping any running Metro bundler..."
pkill -f "metro" 2>/dev/null || true
pkill -f "expo" 2>/dev/null || true
sleep 2

# Clear all caches
echo "🧹 Clearing Metro bundler cache..."
npx expo start --clear

# Note: The --clear flag will:
# - Clear Metro bundler cache
# - Clear Babel cache
# - Start fresh Expo dev server
