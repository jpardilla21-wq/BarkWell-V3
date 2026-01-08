#!/bin/bash

echo "🚀 Starting BarkWell Mobile App..."
echo ""
echo "📱 To test on your iPhone:"
echo "   1. Install 'Expo Go' app from the App Store"
echo "   2. Make sure your iPhone and computer are on the same WiFi"
echo "   3. Scan the QR code below with your iPhone Camera app"
echo ""
echo "Starting Expo development server..."
echo ""

# Start Expo without network validation checks
npx expo start --clear 2>&1 | tee /tmp/expo-output.log
