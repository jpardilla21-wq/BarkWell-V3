#!/bin/bash

echo "🧹 NUCLEAR CACHE CLEAR - This will destroy ALL caches"
echo "=================================================="
echo ""

# Kill all running processes
echo "1️⃣ Killing all Node and Expo processes..."
pkill -9 node 2>/dev/null || true
pkill -9 expo 2>/dev/null || true
sleep 2

# Clear project caches
echo "2️⃣ Clearing project caches..."
rm -rf .expo
rm -rf node_modules/.cache
rm -rf .metro

# Clear system temp caches (macOS)
echo "3️⃣ Clearing system Metro caches..."
rm -rf $TMPDIR/metro-* 2>/dev/null || true
rm -rf $TMPDIR/haste-* 2>/dev/null || true
rm -rf $TMPDIR/react-* 2>/dev/null || true

# Clear Expo global caches (macOS)
echo "4️⃣ Clearing Expo global caches..."
rm -rf ~/Library/Caches/Expo 2>/dev/null || true
rm -rf ~/.expo/cache 2>/dev/null || true

# Clear watchman (if installed)
echo "5️⃣ Clearing Watchman..."
if command -v watchman &> /dev/null; then
    watchman watch-del-all 2>/dev/null || true
fi

echo ""
echo "✅ All caches cleared!"
echo ""
echo "📱 IMPORTANT - On your iPhone:"
echo "   1. Force close Expo Go (swipe up from app switcher)"
echo "   2. Go to iPhone Settings > General > iPhone Storage > Expo Go"
echo "   3. Delete 'Documents & Data' or 'Offload App'"
echo "   4. Or simply delete and reinstall Expo Go from App Store"
echo ""
echo "🚀 Starting Expo with maximum cache clearing..."
echo ""

# Start with all cache clearing flags
npx expo start --clear --no-dev --minify --reset-cache
