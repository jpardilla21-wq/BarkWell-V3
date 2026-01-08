# 📱 Testing BarkWell on Your iPhone

## Overview

You have **3 options** to test BarkWell on your iPhone:

1. **Expo Go App** (Quickest, no Apple Developer account needed)
2. **EAS Development Build** (Full features, requires Apple Developer account)
3. **Web App on Mobile Browser** (Test Phase 3 monetization features)

---

## Option 1: Expo Go App ⚡ (Quickest)

**No Apple Developer Account Required**

### Steps:

1. **Install Expo Go on your iPhone**
   - Open App Store
   - Search for "Expo Go"
   - Install the app

2. **Start the Expo development server in Replit**
   ```bash
   npm run dev
   ```

3. **Scan the QR code**
   - Expo will show a QR code in the terminal
   - Open Camera app on iPhone
   - Scan the QR code
   - Tap the notification to open in Expo Go

4. **Test the app**
   - The app will load on your phone
   - You can navigate through all screens
   - Changes you make in code will hot-reload automatically

### Limitations:
- Some native features may not work in Expo Go
- Cannot test custom native modules
- Cannot test production builds

---

## Option 2: EAS Development Build 🚀 (Full Features)

**Requires Apple Developer Account ($99/year)**

This creates a standalone app on your iPhone with full native capabilities.

### Prerequisites:
- Active Apple Developer account
- Apple Developer Team ID
- EAS CLI installed

### Steps:

#### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

#### 2. Login to Expo
```bash
eas login
```

#### 3. Configure EAS Build

Create `eas.json`:
```bash
cat > eas.json <<'EOF'
{
  "cli": {
    "version": ">= 7.6.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "ios": {
        "simulator": false
      }
    }
  },
  "submit": {
    "production": {}
  }
}
EOF
```

#### 4. Update app.json with your Apple Team ID

```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.pupsense.app",
      "appleTeamId": "YOUR_TEAM_ID_HERE"
    }
  }
}
```

**Find your Apple Team ID:**
- Go to https://developer.apple.com/account
- Click "Membership" in sidebar
- Copy your Team ID (10-character string)

#### 5. Build the Development App

```bash
# Build for iOS device
eas build --platform ios --profile development
```

This will:
- Upload your code to Expo's servers
- Build the app in the cloud
- Generate a link to download the `.ipa` file

#### 6. Install on Your iPhone

**Method A: Direct Install (Easiest)**
- Open the build URL on your iPhone
- Tap "Install"
- Go to Settings > General > VPN & Device Management
- Trust the developer profile
- Open the app

**Method B: TestFlight**
```bash
# Submit to TestFlight
eas submit --platform ios --latest
```

Then:
- You'll receive a TestFlight invitation
- Install TestFlight from App Store
- Accept the invitation
- Download the app through TestFlight

#### 7. Start Development Server

```bash
npm run dev
```

The app on your phone will connect to your dev server and load the latest code.

---

## Option 3: Web App on Mobile Browser 🌐 (Phase 3 Testing)

**Test the monetization features on mobile without building native app**

### Steps:

1. **Start the web app in Replit**
   ```bash
   ./start-webapp.sh
   ```

2. **Get the public URL**
   - Replit will provide a public URL for the frontend
   - It will look like: `https://[your-repl-name].[your-username].repl.co`

3. **Open on your iPhone**
   - Open Safari on your iPhone
   - Navigate to the frontend URL
   - The web app is fully responsive for mobile

4. **Add to Home Screen (Optional)**
   - Tap the Share button in Safari
   - Select "Add to Home Screen"
   - The app will appear like a native app icon

### What You Can Test:
- ✅ Pricing page and subscription tiers
- ✅ Shop tab with product cards
- ✅ Affiliate product recommendations
- ✅ Insurance card display
- ✅ Paywall overlays
- ✅ Responsive mobile design
- ✅ All Phase 3 monetization features

### Limitations:
- No native features (camera, push notifications)
- Internet connection required
- Slower than native app

---

## Comparison Table

| Feature | Expo Go | EAS Build | Web Browser |
|---------|---------|-----------|-------------|
| **Setup Time** | 5 min | 30-60 min | 5 min |
| **Apple Developer Account** | ❌ No | ✅ Yes ($99) | ❌ No |
| **Full Native Features** | ⚠️ Limited | ✅ Yes | ❌ No |
| **Phase 3 Monetization** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Hot Reload** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Offline Use** | ✅ Yes | ✅ Yes | ❌ No |
| **Production Ready** | ❌ No | ✅ Yes | ⚠️ PWA Only |
| **Best For** | Quick testing | Full testing | Phase 3 features |

---

## Recommended Approach

### For Your Situation:

**If you want to test Phase 3 monetization features ASAP:**
→ Use **Option 3** (Web Browser) - Takes 5 minutes

**If you want to test the native mobile app experience:**
→ Use **Option 1** (Expo Go) first - Takes 5 minutes
→ Then upgrade to **Option 2** (EAS Build) if needed

**If you need production-ready testing:**
→ Use **Option 2** (EAS Build) - Takes 1 hour setup

---

## Step-by-Step for Option 1 (Expo Go - Quickest)

Since you asked about testing on your phone, here's the fastest way:

### 1. Install Expo Go
Download from App Store on your iPhone

### 2. Start Expo in Replit
```bash
npm run dev
```

### 3. Connect Your Phone
The terminal will show:
```
› Metro waiting on exp://[IP]:8081
› Scan the QR code above with Expo Go (Android) or Camera app (iOS)
```

### 4. Scan & Run
- Open Camera on iPhone
- Point at the QR code
- Tap the notification
- App opens in Expo Go!

---

## Step-by-Step for Option 2 (EAS Build with Apple Developer)

### Quick Setup Script

I can create a script to automate the EAS setup:

```bash
#!/bin/bash

echo "📱 Setting up EAS Build for iOS..."
echo ""

# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure project
eas build:configure

# Prompt for Apple Team ID
echo ""
echo "Please enter your Apple Team ID:"
echo "(Find it at: https://developer.apple.com/account → Membership)"
read TEAM_ID

# Update app.json
node -e "
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('app.json', 'utf8'));
config.expo.ios.appleTeamId = '$TEAM_ID';
fs.writeFileSync('app.json', JSON.stringify(config, null, 2));
console.log('✅ Updated app.json with Team ID');
"

echo ""
echo "✅ Setup complete!"
echo ""
echo "Now run: eas build --platform ios --profile development"
```

---

## Testing Checklist

Once you have the app on your phone:

### Mobile App Features (Expo Go or EAS Build)
- [ ] Open app and complete onboarding
- [ ] Add a dog profile with photo
- [ ] Navigate through bottom tabs (Home, Poop, Behavior, Profile)
- [ ] Take a photo using camera
- [ ] Test Poop Check AI analysis
- [ ] Test Behavior Check video recording
- [ ] Test Food Scanner with camera
- [ ] Switch between light and dark mode
- [ ] Test navigation and gestures

### Phase 3 Features (Web Browser or Native App)
- [ ] View pricing page on mobile
- [ ] See 3 subscription tier cards
- [ ] Tap "Subscribe" button
- [ ] Browse shop products
- [ ] Filter products by category
- [ ] Tap "Buy on Amazon" buttons
- [ ] View insurance card
- [ ] Test paywall on locked features
- [ ] Verify responsive layout on different screen sizes

---

## Troubleshooting

### Expo Go: "Unable to connect to server"
- Make sure your phone and computer are on the same WiFi network
- Check if firewall is blocking the connection
- Try using tunnel mode: `npm run dev -- --tunnel`

### EAS Build: "Invalid Apple Developer credentials"
- Verify your Apple Developer account is active ($99/year)
- Check that you entered the correct Team ID
- Ensure you have accepted all agreements at developer.apple.com

### Web Browser: "Cannot load page"
- Check that backend is running (port 3001)
- Check that frontend is running (port 5173)
- Verify Replit has exposed the ports publicly
- Try accessing the full Replit URL instead of localhost

---

## Next Steps After Mobile Testing

1. **If testing in Expo Go or EAS Build:**
   - The mobile app (PupSense) has AI features for poop/behavior/food analysis
   - These require OpenAI and Gemini API keys
   - Check `replit.md` for API setup instructions

2. **If testing in web browser:**
   - You're testing the Phase 3 monetization features
   - Backend API provides mock payment processing
   - Ready to integrate real Stripe in Phase 4

3. **Ready for production?**
   - Build production iOS app: `eas build --platform ios --profile production`
   - Submit to App Store: `eas submit --platform ios`
   - Deploy web app to hosting provider

---

## Cost Summary

| Method | Cost | Time to Setup |
|--------|------|---------------|
| Expo Go | **Free** | 5 minutes |
| Web Browser | **Free** | 5 minutes |
| EAS Build | **$99/year** (Apple Developer) | 1 hour |
| TestFlight | **Included** with Apple Developer | +15 min |
| App Store | **Included** with Apple Developer | +2-3 days review |

---

## Questions?

**Want to test the mobile app right now?**
→ Use Expo Go (Option 1)

**Want to test Phase 3 monetization features?**
→ Use Web Browser (Option 3)

**Need a production-ready iOS build?**
→ Use EAS Build (Option 2)

Which option would you like to proceed with?
