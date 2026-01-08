-- PupSense Database Schema
-- PostgreSQL Database for Pet Health Tracking Application

-- ================================================
-- TABLE: Users (Pet Owners)
-- ================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ================================================
-- TABLE: Pets (Dogs)
-- ================================================
CREATE TABLE IF NOT EXISTS pets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    breed VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'unknown')),
    weight_unit VARCHAR(10) DEFAULT 'lbs' CHECK (weight_unit IN ('lbs', 'kg')),
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pets_user_id ON pets(user_id);

-- ================================================
-- TABLE: Health Records
-- Stores vaccinations, medications, and vet visits
-- ================================================
CREATE TABLE IF NOT EXISTS health_records (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('vaccination', 'medication', 'vet_visit')),

    -- Vaccination fields
    vaccination_name VARCHAR(255),
    vaccination_date DATE,
    next_due_date DATE,

    -- Medication fields
    medication_name VARCHAR(255),
    dosage VARCHAR(255),
    frequency VARCHAR(255),
    start_date DATE,
    end_date DATE,

    -- Vet Visit fields
    visit_date DATE,
    vet_name VARCHAR(255),
    reason TEXT,
    diagnosis TEXT,
    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_health_records_pet_id ON health_records(pet_id);
CREATE INDEX idx_health_records_type ON health_records(record_type);
CREATE INDEX idx_health_records_next_due_date ON health_records(next_due_date) WHERE record_type = 'vaccination';

-- ================================================
-- TABLE: Daily Logs
-- Tracks daily inputs for wellness score calculation
-- ================================================
CREATE TABLE IF NOT EXISTS daily_logs (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,

    -- Wellness Score Components (each rated 0-100)
    digestion_score INTEGER CHECK (digestion_score >= 0 AND digestion_score <= 100),
    nutrition_score INTEGER CHECK (nutrition_score >= 0 AND nutrition_score <= 100),
    behavior_score INTEGER CHECK (behavior_score >= 0 AND behavior_score <= 100),
    activity_score INTEGER CHECK (activity_score >= 0 AND activity_score <= 100),

    -- Additional context fields
    digestion_notes TEXT,
    nutrition_notes TEXT,
    behavior_notes TEXT,
    activity_notes TEXT,

    -- Calculated wellness score (computed from component scores)
    wellness_score INTEGER CHECK (wellness_score >= 0 AND wellness_score <= 100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Ensure one log per pet per day
    UNIQUE(pet_id, log_date)
);

CREATE INDEX idx_daily_logs_pet_id ON daily_logs(pet_id);
CREATE INDEX idx_daily_logs_date ON daily_logs(log_date);
CREATE INDEX idx_daily_logs_pet_date ON daily_logs(pet_id, log_date);

-- ================================================
-- TABLE: Weight Logs
-- Tracks weight changes over time
-- ================================================
CREATE TABLE IF NOT EXISTS weight_logs (
    id SERIAL PRIMARY KEY,
    pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    weight DECIMAL(6, 2) NOT NULL CHECK (weight > 0),
    unit VARCHAR(10) DEFAULT 'lbs' CHECK (unit IN ('lbs', 'kg')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_weight_logs_pet_id ON weight_logs(pet_id);
CREATE INDEX idx_weight_logs_date ON weight_logs(log_date);
CREATE INDEX idx_weight_logs_pet_date ON weight_logs(pet_id, log_date);

-- ================================================
-- FUNCTION: Update timestamp on record update
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ================================================
-- TRIGGERS: Auto-update updated_at timestamps
-- ================================================
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_records_updated_at BEFORE UPDATE ON health_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON daily_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_weight_logs_updated_at BEFORE UPDATE ON weight_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- SEED DATA (Optional - for testing)
-- ================================================
-- Insert a test user
INSERT INTO users (email, name, password_hash)
VALUES ('demo@pupsense.com', 'Demo User', '$2b$10$dummyhashfordemopurposes')
ON CONFLICT (email) DO NOTHING;

-- Insert a test pet
INSERT INTO pets (user_id, name, breed, date_of_birth, gender, weight_unit)
SELECT id, 'Max', 'Golden Retriever', '2020-03-15', 'male', 'lbs'
FROM users WHERE email = 'demo@pupsense.com'
ON CONFLICT DO NOTHING;
