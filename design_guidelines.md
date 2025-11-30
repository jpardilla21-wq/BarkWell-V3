# PupSense - Dog Health Assistant Design Guidelines

## Design System

### Color Palette
**Primary Colors:**
- Primary Blue: `#4A7BFF`
- Gradient Start: `#4A7BFF`
- Gradient End: `#6ED2FF`

**Status Colors:**
- Soft Green (Low Risk): `#6ED29B`
- Warning Yellow (Medium Risk): `#FFD95F`
- Urgent Red (High Risk): `#FF6B6B`

**Neutral Colors:**
- Background: `#F6F6F6`
- Card Background: `#FFFFFF`
- Text Dark: `#1E1E1E`
- Text Muted: `#6E6E6E`
- Border Light: `#E5E5E5`

### Typography
- **Heading L**: 28px, Bold (700)
- **Heading M**: 22px, Semi-bold (600)
- **Heading S**: 18px, Semi-bold (600)
- **Body M**: 16px, Regular (400)
- **Body S**: 14px, Regular (400)
- **Label**: 13px, Medium (500)

### Spacing Tokens
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px

### Layout Principles
- All screens use SafeAreaView
- Screen padding: MD (16px) or LG (24px)
- Card components: 16-20px border radius, white background, soft shadow
- Full-width buttons with 16px border radius
- Text inputs with 1px border using borderLight color

## Navigation Architecture

**Root Stack Navigator:**
1. Splash Screen (auto-navigates after 1-2 seconds)
2. Onboarding Screen
3. App Tabs (bottom tab navigator)

**Bottom Tab Navigator:**
- Home tab
- Poop Check tab
- Behavior Check tab
- Profile tab
- Tab icons: use emojis for MVP

## Screen Specifications

### Splash Screen
- Full-screen gradient (primaryGradientStart to primaryGradientEnd)
- Center: white circular container with paw emoji
- Bottom: "Powered by AI Vision" text (bodyS, white, 80% opacity)

### Onboarding Screen
- Illustration placeholder card (light background, rounded)
- Title: "Understand your dog in seconds" (headingL)
- Subtitle: "AI insights to help you act with confidence." (bodyM, muted)
- Primary button: "Get Started"

### Home Screen
**Header:**
- Left: circular dog avatar placeholder
- Right: bell icon for notifications

**Content:**
- Greeting: "Hi Juan 👋" (headingM)
- Subtext: "How's your pup today?" (bodyS, muted)
- Three feature cards in responsive 2x1 grid layout

**Feature Cards:**
- Poop Check (💩 icon)
- Food Scanner (🍖 icon)
- Behavior Check (🐕 icon)
- Each card shows icon, title, and subtitle

### Poop Check Screen
- Header: "Poop Check"
- Description text explaining the feature
- Multi-line text input with example placeholder
- Primary button: "Analyze Poop"
- Result section with RiskBadge (color-coded: green/yellow/red)
- Summary text and bullet-point tips

### Food Scanner Screen
- Header: "Food Scanner"
- Description for ingredient input
- Multi-line text input
- Primary button: "Analyze Food"
- Results showing:
  - Circular score badge (0-100)
  - Score color: 0-50 red, 51-75 yellow, 76-100 green
  - Positives list
  - Concerns list
  - Red warning card for toxins (if present)

### Behavior Check Screen
- Header: "Behavior Check"
- Description for behavior input
- Multi-line text input
- Primary button: "Analyze Behavior"
- Results showing:
  - Colored emotional state pill (Relaxed/Anxious/Overstimulated/Defensive/Pain)
  - Explanation text
  - Tips in bullet list format

### Profile Screen
- Dog avatar and static details (name, age, breed)
- "View History" button/row
- "App Info / Disclaimer" section
- Disclaimer text in bodyS: "PupSense does not replace a veterinarian. Always consult a licensed vet if you're unsure."

### History Screen
- Flat list of previous results
- Each card shows: type icon, date, short summary
- Cards use standard card styling with soft shadows

## Component Specifications

### FeatureCard
- White background, 20px border radius
- MD padding, SM margin
- Soft shadow for depth
- Large emoji icon at top
- Title below icon
- Subtitle at bottom
- Pressable with visual feedback

### PrimaryButton
- Full-width, 16px border radius
- Primary Blue background
- White centered label text
- Pressable with visual feedback

### RiskBadge
- Three levels: Low (green), Medium (yellow), High (red)
- Pill-shaped with appropriate background color
- Label text contrasts with background

### ScoreBadge
- Circular badge showing 0-100 score
- Dynamic color based on score range
- Bold score number centered

### TextInputField
- Label text above input
- Rounded corners
- 1px border (borderLight color)
- Internal padding
- Supports multi-line for descriptions

## Visual Design Details
- Use soft shadows (not harsh drop shadows)
- Consistent 16-20px border radius for cards and containers
- Color-coded risk/status indicators throughout
- White cards on light gray background for depth
- Emojis for icons in MVP phase
- Spacious, breathable layouts with consistent MD/LG padding

## Accessibility & UX
- All interactive elements have sufficient touch target size
- Color is not the only indicator (use text labels with colors)
- Clear visual feedback on button press
- Placeholder text provides usage examples
- Disclaimer prominently displayed in Profile