# BarkWell Mobile Testing Guide - iPhone via Replit

Quick guide for testing the new redesigned screens on your iPhone using Replit.

## Setup (One-Time)

1. **Install Expo Go on your iPhone**
   - Open App Store
   - Search for "Expo Go"
   - Install the app

2. **Start the Replit Development Server**
   - In Replit, click the "Run" button
   - Wait for the server to start
   - Look for the QR code or connection URL

## Testing the New Screens

### The app is currently configured to show the NEW HOME SCREEN on launch! 🎉

When you open the app, you'll immediately see the redesigned home screen with:
- Green Whisker design aesthetic
- Pet selector carousel
- Quick action cards
- Latest scan section with health score

### Navigation Between Screens

**From Home Screen to Pet Profile:**
1. Scroll to the "Latest scan" section
2. Tap the "View details" button
3. You'll see the Pet Profile screen with health metrics

**From Pet Profile Back to Home:**
1. Tap the back button (‹) in the top-left corner
2. Returns to the Home screen

## What to Test

### Home Screen ✅
- [ ] Greeting header displays correctly
- [ ] Notification button (bell icon) is visible
- [ ] Pet selector scrolls horizontally
- [ ] Selected pet has highlighted border
- [ ] Quick action cards (Scan/Appointment) are tappable
- [ ] Progress ring animates smoothly
- [ ] Health score displays in center of ring
- [ ] "View details" button navigates to profile

### Pet Profile Screen ✅
- [ ] Back button (‹) works and returns to home
- [ ] Large pet avatar displays with health score badge
- [ ] Tab navigation works (General/Appointments/Vaccines/Meds)
- [ ] Profile completion banner is visible
- [ ] 4 health metric cards display (Weight, Coat, Energy, Face)
- [ ] Cards are tappable (check console logs)
- [ ] Gender and Age info cards display
- [ ] Scrolling works smoothly
- [ ] All text is readable
- [ ] Colors match Whisker aesthetic (green theme)

### Design System ✅
- [ ] Primary green color (#8BC34A) is prominent
- [ ] Rounded corners on all cards and buttons
- [ ] Proper spacing between elements
- [ ] Smooth animations
- [ ] Touch feedback on interactive elements
- [ ] Health score colors (excellent = green, attention = yellow)

## Common Issues

### Can't Connect to Replit
- Make sure your iPhone is on the same network (if possible)
- Try refreshing the Expo Go app
- Check if Replit server is still running

### App Crashes or Errors
- Check Replit console for error messages
- Try clearing Expo Go cache: Shake phone → "Clear cache"
- Restart the Replit server

### Design Doesn't Look Right
- Make sure you're on the latest version (check git commit)
- Try force-closing Expo Go and reopening
- Check if ThemeProvider is properly set up

## Reverting to Old Screens

If you need to test the old screens, edit `navigation/HomeStackNavigator.tsx`:

Change line 31 from:
```typescript
initialRouteName="HomeNew" // TESTING
```

To:
```typescript
initialRouteName="Home" // Old screen
```

Then restart the Replit server.

## Testing Notes Template

Copy this template to document your testing:

```
Date: _______________
iPhone Model: _______________
iOS Version: _______________

Home Screen:
- Visual appearance: ⭐⭐⭐⭐⭐
- Performance: ⭐⭐⭐⭐⭐
- Interactions: ⭐⭐⭐⭐⭐
Issues found:
_________________________________

Pet Profile Screen:
- Visual appearance: ⭐⭐⭐⭐⭐
- Performance: ⭐⭐⭐⭐⭐
- Interactions: ⭐⭐⭐⭐⭐
Issues found:
_________________________________

Overall impression:
_________________________________
```

## Next Steps After Testing

1. Document any issues or bugs found
2. Take screenshots if helpful
3. Share feedback for improvements
4. Once approved, we'll proceed with Phase 2:
   - Switch old screens to new screens permanently
   - Update all navigation references
   - Apply design system colors to tab bar

## Questions?

Check these files for reference:
- `REDESIGN_NAVIGATION.md` - Full navigation documentation
- `design-system/DesignSystem.ts` - Design tokens
- `src/screens/HomeScreenRedesign.tsx` - Home screen code
- `src/screens/PetProfileScreenRedesign.tsx` - Pet profile code
