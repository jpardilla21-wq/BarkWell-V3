-- ================================================
-- Phase 2: Engagement Schema Updates
-- PupSense Database Migration
-- ================================================

-- ================================================
-- Table: nutrition_plans
-- Stores personalized nutrition plans for each pet
-- ================================================
CREATE TABLE IF NOT EXISTS nutrition_plans (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  caloric_needs INTEGER NOT NULL, -- Daily caloric requirement
  meal_schedule JSONB NOT NULL, -- Array of feeding times: [{"time": "08:00", "portion": 1.5}, ...]
  treat_allowance INTEGER NOT NULL, -- Daily calorie budget for treats
  activity_level VARCHAR(20) NOT NULL CHECK (activity_level IN ('sedentary', 'moderate', 'active', 'very_active')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pet_id) -- One nutrition plan per pet
);

CREATE INDEX idx_nutrition_plans_pet ON nutrition_plans(pet_id);

-- ================================================
-- Table: food_database
-- Contains food brand information and nutritional data
-- ================================================
CREATE TABLE IF NOT EXISTS food_database (
  id SERIAL PRIMARY KEY,
  brand_name VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  calories_per_cup INTEGER NOT NULL,
  protein_percent DECIMAL(5,2), -- Protein percentage
  fat_percent DECIMAL(5,2), -- Fat percentage
  ingredients TEXT,
  life_stage VARCHAR(50), -- 'puppy', 'adult', 'senior', 'all_life_stages'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_food_database_brand ON food_database(brand_name);
CREATE INDEX idx_food_database_life_stage ON food_database(life_stage);

-- ================================================
-- Table: treat_logs
-- Tracks daily treat consumption
-- ================================================
CREATE TABLE IF NOT EXISTS treat_logs (
  id SERIAL PRIMARY KEY,
  pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
  treat_name VARCHAR(255) NOT NULL,
  calories INTEGER NOT NULL,
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_treat_logs_pet_date ON treat_logs(pet_id, date);

-- ================================================
-- Table: content_library
-- Educational content (articles, videos) for pet owners
-- ================================================
CREATE TABLE IF NOT EXISTS content_library (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Training', 'Nutrition', 'Health', 'Behavior', 'Grooming')),
  format VARCHAR(20) NOT NULL CHECK (format IN ('Video', 'Article')),
  tags TEXT[], -- Array of tags: ['Puppy', 'Senior', 'Anxiety', etc.]
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_minutes INTEGER, -- For videos
  difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_category ON content_library(category);
CREATE INDEX idx_content_tags ON content_library USING GIN(tags);

-- ================================================
-- Table: breed_info
-- Static breed information and characteristics
-- ================================================
CREATE TABLE IF NOT EXISTS breed_info (
  id SERIAL PRIMARY KEY,
  breed_name VARCHAR(255) NOT NULL UNIQUE,
  common_health_issues TEXT[], -- Array of common health issues
  energy_level VARCHAR(20) NOT NULL CHECK (energy_level IN ('low', 'moderate', 'high', 'very_high')),
  grooming_needs VARCHAR(20) NOT NULL CHECK (grooming_needs IN ('low', 'moderate', 'high')),
  temperament TEXT,
  average_weight_range VARCHAR(50), -- e.g., "55-75 lbs"
  average_lifespan VARCHAR(50), -- e.g., "10-12 years"
  exercise_requirements TEXT,
  training_difficulty VARCHAR(20) CHECK (training_difficulty IN ('easy', 'moderate', 'challenging')),
  good_with_children BOOLEAN,
  good_with_pets BOOLEAN,
  description TEXT
);

CREATE INDEX idx_breed_name ON breed_info(breed_name);

-- ================================================
-- Triggers for updated_at timestamps
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nutrition_plans_updated_at
  BEFORE UPDATE ON nutrition_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- Insert Mock Data: Food Database
-- ================================================
INSERT INTO food_database (brand_name, product_name, calories_per_cup, protein_percent, fat_percent, ingredients, life_stage) VALUES
('Blue Buffalo', 'Life Protection Formula Adult', 385, 24.0, 14.0, 'Chicken, Chicken Meal, Brown Rice, Oatmeal', 'adult'),
('Royal Canin', 'Medium Adult Dry Dog Food', 368, 23.0, 12.0, 'Chicken By-Product Meal, Brewers Rice, Wheat', 'adult'),
('Hill''s Science Diet', 'Adult Perfect Weight', 291, 28.9, 10.3, 'Chicken, Cracked Pearled Barley, Brown Rice', 'adult'),
('Purina Pro Plan', 'Puppy Complete Essentials', 445, 28.0, 17.0, 'Chicken, Rice Flour, Poultry By-Product Meal', 'puppy'),
('Wellness CORE', 'Grain-Free Original', 421, 34.0, 16.0, 'Deboned Turkey, Turkey Meal, Chicken Meal', 'all_life_stages'),
('Iams ProActive Health', 'Senior Plus Dry Dog Food', 337, 24.5, 11.5, 'Chicken, Whole Grain Corn, Chicken By-Product Meal', 'senior'),
('Taste of the Wild', 'High Prairie Canine', 370, 32.0, 18.0, 'Buffalo, Lamb Meal, Sweet Potatoes', 'all_life_stages'),
('Nutro Ultra', 'Adult Dry Dog Food', 355, 26.0, 15.0, 'Chicken, Chicken Meal, Whole Brown Rice', 'adult');

-- ================================================
-- Insert Mock Data: Content Library
-- ================================================
INSERT INTO content_library (title, category, format, tags, description, url, thumbnail_url, duration_minutes, difficulty_level) VALUES
('Puppy Training Basics: First Commands', 'Training', 'Video', ARRAY['Puppy', 'Beginner', 'Commands'], 'Learn how to teach your puppy sit, stay, and come', 'https://example.com/puppy-training-basics', 'https://example.com/thumb1.jpg', 15, 'beginner'),
('Understanding Dog Anxiety Signals', 'Behavior', 'Article', ARRAY['Anxiety', 'Behavior', 'All Ages'], 'Recognize signs of anxiety in your dog and learn calming techniques', 'https://example.com/dog-anxiety', 'https://example.com/thumb2.jpg', NULL, 'beginner'),
('Nutrition for Senior Dogs: What to Know', 'Nutrition', 'Article', ARRAY['Senior', 'Diet', 'Health'], 'Adjusting your senior dog''s diet for optimal health', 'https://example.com/senior-nutrition', 'https://example.com/thumb3.jpg', NULL, 'intermediate'),
('Treating Separation Anxiety in Dogs', 'Behavior', 'Video', ARRAY['Anxiety', 'Training', 'Behavior'], 'Step-by-step guide to reducing separation anxiety', 'https://example.com/separation-anxiety', 'https://example.com/thumb4.jpg', 22, 'intermediate'),
('Complete Guide to Dog Dental Health', 'Health', 'Article', ARRAY['Health', 'Preventive Care', 'All Ages'], 'Everything you need to know about maintaining your dog''s dental health', 'https://example.com/dental-health', 'https://example.com/thumb5.jpg', NULL, 'beginner'),
('Advanced Agility Training Techniques', 'Training', 'Video', ARRAY['Active', 'Training', 'Advanced'], 'Take your dog''s agility skills to the next level', 'https://example.com/agility-training', 'https://example.com/thumb6.jpg', 30, 'advanced'),
('Managing Weight in Overweight Dogs', 'Nutrition', 'Article', ARRAY['Weight Management', 'Diet', 'Health'], 'Safe and effective strategies for helping your dog lose weight', 'https://example.com/weight-management', 'https://example.com/thumb7.jpg', NULL, 'intermediate'),
('Grooming Long-Haired Breeds at Home', 'Grooming', 'Video', ARRAY['Grooming', 'Long Hair', 'DIY'], 'Professional grooming techniques for long-haired dogs', 'https://example.com/grooming-longhair', 'https://example.com/thumb8.jpg', 18, 'intermediate'),
('Puppy Socialization: Critical First Months', 'Training', 'Article', ARRAY['Puppy', 'Socialization', 'Behavior'], 'Why the first 16 weeks matter for your puppy''s development', 'https://example.com/puppy-socialization', 'https://example.com/thumb9.jpg', NULL, 'beginner'),
('Recognizing Common Health Issues', 'Health', 'Video', ARRAY['Health', 'Symptoms', 'All Ages'], 'Learn to spot early warning signs of common dog health problems', 'https://example.com/health-issues', 'https://example.com/thumb10.jpg', 25, 'beginner');

-- ================================================
-- Insert Mock Data: Breed Info
-- ================================================
INSERT INTO breed_info (breed_name, common_health_issues, energy_level, grooming_needs, temperament, average_weight_range, average_lifespan, exercise_requirements, training_difficulty, good_with_children, good_with_pets, description) VALUES
('Golden Retriever', ARRAY['Hip Dysplasia', 'Cancer', 'Heart Disease'], 'high', 'moderate', 'Friendly, Intelligent, Devoted', '55-75 lbs', '10-12 years', 'Requires 1-2 hours of daily exercise including walks, playtime, and swimming', 'easy', true, true, 'Golden Retrievers are friendly, intelligent, and devoted dogs that make excellent family pets. They are highly trainable and excel in obedience.'),
('German Shepherd', ARRAY['Hip Dysplasia', 'Elbow Dysplasia', 'Bloat'], 'very_high', 'moderate', 'Confident, Courageous, Smart', '50-90 lbs', '9-13 years', 'Needs vigorous daily exercise, mental stimulation, and training activities', 'moderate', true, true, 'German Shepherds are intelligent, versatile working dogs known for their loyalty and protective nature. They require consistent training.'),
('Labrador Retriever', ARRAY['Hip Dysplasia', 'Obesity', 'Ear Infections'], 'high', 'low', 'Outgoing, Even-Tempered, Gentle', '55-80 lbs', '10-12 years', '1-2 hours of daily exercise including swimming, fetch, and running', 'easy', true, true, 'Labrador Retrievers are friendly, outgoing, and active companions who are excellent with families and children.'),
('Bulldog', ARRAY['Breathing Problems', 'Hip Dysplasia', 'Skin Issues'], 'low', 'moderate', 'Calm, Courageous, Friendly', '40-50 lbs', '8-10 years', 'Moderate exercise, short walks due to breathing concerns', 'moderate', true, true, 'Bulldogs are gentle, affectionate dogs with a calm demeanor. They make excellent companions but require special care due to their flat faces.'),
('Beagle', ARRAY['Epilepsy', 'Hypothyroidism', 'Ear Infections'], 'high', 'low', 'Friendly, Curious, Merry', '20-30 lbs', '10-15 years', 'Daily walks and playtime, strong scent-tracking instinct', 'moderate', true, true, 'Beagle are curious, friendly dogs with excellent noses. They are great family pets but can be stubborn during training.'),
('Poodle', ARRAY['Hip Dysplasia', 'Progressive Retinal Atrophy', 'Epilepsy'], 'high', 'high', 'Intelligent, Active, Proud', '45-70 lbs (Standard)', '12-15 years', 'Daily exercise and mental stimulation required', 'easy', true, true, 'Poodles are highly intelligent and versatile dogs that excel in various activities. They require regular grooming to maintain their coat.'),
('French Bulldog', ARRAY['Breathing Problems', 'Spinal Disorders', 'Eye Issues'], 'moderate', 'low', 'Playful, Adaptable, Smart', '16-28 lbs', '10-12 years', 'Short walks and indoor play, sensitive to extreme temperatures', 'moderate', true, true, 'French Bulldogs are small, muscular dogs with big personalities. They are affectionate companions well-suited for apartment living.'),
('Dachshund', ARRAY['Intervertebral Disc Disease', 'Obesity', 'Dental Issues'], 'moderate', 'low', 'Clever, Lively, Courageous', '16-32 lbs', '12-16 years', 'Moderate exercise, avoid activities that strain the back', 'moderate', true, true, 'Dachshunds are brave, clever dogs with long bodies. They make loyal companions but require careful handling due to their spinal structure.');

-- ================================================
-- Success Message
-- ================================================
SELECT 'Phase 2 schema migration completed successfully!' AS message;
