# PupSense Web Application - Phase 1 Implementation

A comprehensive pet health tracking dashboard built with React, Express, and PostgreSQL.

## Project Structure

```
/home/runner/workspace/
├── backend/              # Express API server
│   ├── config/          # Database configuration
│   ├── routes/          # API route handlers
│   ├── scripts/         # Database initialization scripts
│   ├── utils/           # Wellness score calculation utilities
│   ├── package.json
│   └── server.js        # Main server file
│
├── frontend/            # React (Vite) application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API service layer
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── database/            # SQL schema files
    └── schema.sql       # PostgreSQL database schema
```

## Features Implemented

### ✅ Feature 1: Health Records Management (High Priority)
- **CRUD API endpoints** for:
  - Vaccinations (with 7-day reminder logic)
  - Medications (with active/inactive status)
  - Vet Visits
- **Frontend**: Pet Profile component displaying health records in tabs
- **Vaccination Reminders**: Visual alerts for vaccinations due within 7 days or overdue

### ✅ Feature 2: AI Wellness Score Dashboard (High Priority)
- **Wellness Score Algorithm**:
  - Composite score (0-100) averaging 5 components:
    - Digestion (20%)
    - Nutrition (20%)
    - Behavior (20%)
    - Activity (20%)
    - Preventive Care (20% - auto-calculated from vaccination status & vet visits)
- **Dashboard UI**:
  - Current score display with color-coded status
  - Interactive form to log daily health metrics
  - Week-over-week trend visualization using Recharts
- **Alerts**: Visual warning when score drops >15% from previous average

### ✅ Feature 3: Weight Tracking (Quick Win)
- **Input Form**: Date and weight entry with unit selection (lbs/kg)
- **Visualization**: Line chart showing weight changes over last 6 months
- **Statistics**: Weight change tracking with percentage calculations

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.18.2
- **Database**: PostgreSQL with pg driver
- **Middleware**: CORS, body-parser, morgan

### Frontend
- **Framework**: React 18.2 with Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **Charts**: Recharts 2.10.3
- **HTTP Client**: Axios 1.6.2

### Database
- **PostgreSQL** with:
  - 5 main tables (users, pets, health_records, daily_logs, weight_logs)
  - Indexes for performance
  - Triggers for timestamp updates
  - Foreign key constraints

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

### Step 1: Database Setup

1. **Install PostgreSQL** (if using Replit, use the integrated PostgreSQL)

2. **Create Database**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE pupsense;

   # Exit psql
   \q
   ```

3. **Configure Database Connection**:
   ```bash
   cd backend
   cp .env.example .env
   ```

4. **Edit `.env` file** with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=pupsense
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

5. **Run Database Schema**:
   ```bash
   cd backend
   npm install
   npm run init-db
   ```

   This will:
   - Create all tables
   - Set up indexes and triggers
   - Insert demo data (demo user and sample pet)

### Step 2: Backend Setup

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Start Backend Server**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # OR Production mode
   npm start
   ```

3. **Verify Backend** is running at: `http://localhost:3001`
   - Health check: `http://localhost:3001/api/health`

### Step 3: Frontend Setup

1. **Install Dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Start Frontend Dev Server**:
   ```bash
   npm run dev
   ```

3. **Access Application** at: `http://localhost:5173`

### Step 4: Verify Installation

Open your browser to `http://localhost:5173` and you should see:
- PupSense dashboard
- Demo pet "Max" (Golden Retriever)
- Three main sections:
  1. Wellness Score Dashboard
  2. Pet Profile with Health Records
  3. Weight Tracking

## API Endpoints Documentation

### Pets
- `GET /api/pets` - Get all pets for a user
- `GET /api/pets/:id` - Get single pet
- `POST /api/pets` - Create new pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

### Health Records - Vaccinations
- `GET /api/health-records/vaccinations/:petId` - Get all vaccinations (includes reminder flags)
- `POST /api/health-records/vaccinations` - Create vaccination
- `PUT /api/health-records/vaccinations/:id` - Update vaccination
- `DELETE /api/health-records/vaccinations/:id` - Delete vaccination

### Health Records - Medications
- `GET /api/health-records/medications/:petId` - Get all medications
- `POST /api/health-records/medications` - Create medication
- `PUT /api/health-records/medications/:id` - Update medication
- `DELETE /api/health-records/medications/:id` - Delete medication

### Health Records - Vet Visits
- `GET /api/health-records/vet-visits/:petId` - Get all vet visits
- `POST /api/health-records/vet-visits` - Create vet visit
- `PUT /api/health-records/vet-visits/:id` - Update vet visit
- `DELETE /api/health-records/vet-visits/:id` - Delete vet visit

### Daily Logs & Wellness Score
- `GET /api/daily-logs/:petId` - Get daily logs (query: ?days=30)
- `GET /api/daily-logs/:petId/wellness-trend` - Get wellness score trend
- `GET /api/daily-logs/:petId/current-score` - Get current wellness score with alerts
- `POST /api/daily-logs` - Create/update daily log (auto-calculates wellness score)
- `DELETE /api/daily-logs/:petId/date/:date` - Delete daily log

### Weight Logs
- `GET /api/weight-logs/:petId` - Get weight logs (query: ?months=6)
- `GET /api/weight-logs/:petId/trend` - Get weight trend with statistics
- `GET /api/weight-logs/:petId/latest` - Get latest weight entry
- `POST /api/weight-logs` - Create weight log
- `PUT /api/weight-logs/:id` - Update weight log
- `DELETE /api/weight-logs/:id` - Delete weight log

## Wellness Score Calculation

The wellness score is calculated using the following algorithm:

```javascript
// Algorithm: Average of 5 components (each 0-100)
WellnessScore = (Digestion + Nutrition + Behavior + Activity + PreventiveCare) / 5

// Preventive Care Score Calculation:
- Base score: 50
- +30 points: All vaccinations current
- +20 points: Vet visit within last 6 months
- -20 points per overdue vaccination (max -40)

// Alert Trigger:
- If current score drops >15% from 7-day average
- Visual warning displayed on dashboard
```

## Development Notes

### Modular Code Structure
- **Backend**: Separate route files for each resource type
- **Frontend**: Component-based architecture with reusable API service layer
- **Database**: Normalized schema with proper relationships

### Code Quality
- Comprehensive comments explaining business logic
- Error handling in all API routes
- Input validation for all user inputs
- Responsive UI design with Tailwind CSS

### Vaccination Reminder Logic
Located in: `backend/routes/healthRecords.js:16-31`

The SQL query automatically calculates:
- `is_reminder`: true if `next_due_date` is within 7 days
- `is_overdue`: true if `next_due_date` has passed

### Wellness Score Drop Detection
Located in: `backend/utils/wellnessScore.js:102-149`

Compares current score to 7-day average and flags drops >15%.

## Testing the Application

### 1. Test Health Records
- Add a vaccination with next due date within 7 days
- Verify yellow "Due Soon" badge appears
- Add a medication with current dates
- Verify green "Active" badge appears

### 2. Test Wellness Dashboard
- Click "Log Today's Health Metrics"
- Enter scores for all components (0-100)
- Submit and verify:
  - Wellness score is calculated
  - Score appears on dashboard
  - Trend chart updates

### 3. Test Weight Tracking
- Click "Log Weight"
- Enter date and weight
- Verify:
  - Chart updates with new data point
  - Statistics recalculate
  - Trend indicator shows direction

### 4. Test Alerts
- Create multiple daily logs with consistent high scores (e.g., 85)
- Add a new log with significantly lower score (e.g., 60)
- Verify red alert banner appears on dashboard

## Production Deployment

### Environment Variables
Create `.env` file in backend with:
```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-frontend-url.com

DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=pupsense
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

### Build Frontend
```bash
cd frontend
npm run build
```

Serves static files from `frontend/dist/`

### Security Considerations
- Add authentication middleware (not included in Phase 1)
- Enable HTTPS in production
- Use environment variables for sensitive data
- Implement rate limiting
- Add input sanitization for user-generated content

## Future Enhancements (Post-Phase 1)
- User authentication and authorization
- Multi-user support with proper access control
- Photo upload for pets
- Email/SMS notifications for vaccination reminders
- Export health records to PDF
- Integration with veterinary clinic systems
- Mobile app synchronization
- Advanced analytics and insights

## Troubleshooting

### Database Connection Failed
- Verify PostgreSQL is running: `pg_isready`
- Check `.env` credentials match your PostgreSQL setup
- Ensure database exists: `psql -U postgres -c '\l'`

### Backend Port Already in Use
- Change PORT in `.env` file
- Or kill process: `lsof -ti:3001 | xargs kill`

### Frontend Can't Connect to Backend
- Verify backend is running on port 3001
- Check proxy configuration in `vite.config.js`
- Ensure CORS is enabled in backend

### Charts Not Displaying
- Verify Recharts is installed: `npm list recharts`
- Check browser console for errors
- Ensure data format matches Recharts requirements

## Support

For issues or questions:
1. Check API endpoint responses using browser DevTools
2. Review backend logs for error messages
3. Verify database has data using psql client

## License

Proprietary - PupSense Pet Health Tracking Application

---

**Built with** ❤️ **for pet health tracking**
