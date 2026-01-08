-- ================================================
-- Phase 3: Monetization Schema Updates
-- PupSense Database Migration
-- ================================================

-- ================================================
-- UPDATE: Users Table - Add Subscription Fields
-- ================================================
ALTER TABLE users
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'plus', 'pro')),
ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMP,
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_users_subscription_expiry ON users(subscription_expiry);

-- ================================================
-- TABLE: Payments
-- Tracks subscription payment transactions
-- ================================================
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('plus', 'pro')),
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50), -- e.g., 'card', 'mock_payment'
  transaction_id VARCHAR(255), -- Stripe transaction ID or mock ID
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

-- ================================================
-- UPDATE: Food Database - Add Affiliate Columns
-- ================================================
ALTER TABLE food_database
ADD COLUMN IF NOT EXISTS affiliate_link TEXT,
ADD COLUMN IF NOT EXISTS average_price DECIMAL(6,2);

-- Update some popular brands with mock affiliate links and prices
UPDATE food_database
SET
  affiliate_link = 'https://amazon.com/dp/MOCK123?tag=pupsense-20',
  average_price = 54.99
WHERE brand_name = 'Blue Buffalo' AND product_name LIKE '%Life Protection%';

UPDATE food_database
SET
  affiliate_link = 'https://amazon.com/dp/MOCK456?tag=pupsense-20',
  average_price = 68.99
WHERE brand_name = 'Royal Canin' AND product_name LIKE '%Medium Adult%';

UPDATE food_database
SET
  affiliate_link = 'https://amazon.com/dp/MOCK789?tag=pupsense-20',
  average_price = 59.99
WHERE brand_name = 'Hill''s Science Diet' AND product_name LIKE '%Adult%';

UPDATE food_database
SET
  affiliate_link = 'https://amazon.com/dp/MOCK101?tag=pupsense-20',
  average_price = 49.99
WHERE brand_name = 'Purina Pro Plan' AND product_name LIKE '%Complete Essentials%';

UPDATE food_database
SET
  affiliate_link = 'https://amazon.com/dp/MOCK202?tag=pupsense-20',
  average_price = 64.99
WHERE brand_name = 'Wellness Core' AND product_name LIKE '%Original%';

-- ================================================
-- TABLE: Recommended Products
-- Curated affiliate products (toys, beds, supplements)
-- ================================================
CREATE TABLE IF NOT EXISTS recommended_products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Toy', 'Bed', 'Supplement', 'Grooming', 'Training', 'Health')),
  description TEXT,
  affiliate_link TEXT NOT NULL,
  target_breed_size VARCHAR(20) CHECK (target_breed_size IN ('Small', 'Medium', 'Large', 'All')),
  image_url TEXT,
  average_price DECIMAL(6,2),
  features TEXT[], -- Array of key features
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_recommended_products_category ON recommended_products(category);
CREATE INDEX idx_recommended_products_size ON recommended_products(target_breed_size);

-- ================================================
-- INSERT: Mock Recommended Products
-- ================================================
INSERT INTO recommended_products (name, category, description, affiliate_link, target_breed_size, image_url, average_price, features) VALUES
-- Toys
('KONG Classic Dog Toy', 'Toy', 'Durable rubber toy for stuffing treats, keeps dogs mentally stimulated', 'https://amazon.com/dp/B0002AR0II?tag=pupsense-20', 'All', 'https://m.media-amazon.com/images/I/61uHpdAf4wL._AC_SL1500_.jpg', 13.99, ARRAY['Durable rubber', 'Dishwasher safe', 'Veterinarian recommended', 'Made in USA']),
('Chuckit! Ultra Ball', 'Toy', 'High-bounce rubber ball for fetch, compatible with ball launchers', 'https://amazon.com/dp/B000F4AVPA?tag=pupsense-20', 'All', 'https://m.media-amazon.com/images/I/71F+4QlPjLL._AC_SL1500_.jpg', 8.99, ARRAY['High bounce', 'Buoyant', 'Bright colors', 'Durable rubber']),
('Nylabone Power Chew', 'Toy', 'Long-lasting chew toy for aggressive chewers, promotes dental health', 'https://amazon.com/dp/B000BQSRIU?tag=pupsense-20', 'Large', 'https://m.media-amazon.com/images/I/71KnNzB8VsL._AC_SL1500_.jpg', 6.99, ARRAY['Dental health', 'Long-lasting', 'Made in USA', 'Bacon flavor']),
('Outward Hound Hide-A-Squirrel Puzzle Toy', 'Toy', 'Interactive plush puzzle toy, great for mental stimulation', 'https://amazon.com/dp/B0002I0O60?tag=pupsense-20', 'Small', 'https://m.media-amazon.com/images/I/81RGnKS3O-L._AC_SL1500_.jpg', 12.99, ARRAY['Puzzle toy', 'Squeaky squirrels', 'Mental stimulation', 'Soft plush']),

-- Beds
('Furhaven Orthopedic Dog Bed', 'Bed', 'Egg-crate orthopedic foam bed, ideal for senior dogs and those with joint issues', 'https://amazon.com/dp/B005GTA3PW?tag=pupsense-20', 'Large', 'https://m.media-amazon.com/images/I/91oX2VYJ9UL._AC_SL1500_.jpg', 39.99, ARRAY['Orthopedic foam', 'Machine washable', 'Non-skid bottom', 'Available in multiple sizes']),
('PetFusion Ultimate Dog Bed', 'Bed', 'Premium memory foam bed with waterproof liner and tear-resistant cover', 'https://amazon.com/dp/B004X6UEH6?tag=pupsense-20', 'Medium', 'https://m.media-amazon.com/images/I/81rL6gD0RkL._AC_SL1500_.jpg', 89.99, ARRAY['Memory foam', 'Waterproof', 'Tear-resistant', '3-year warranty']),
('Best Pet Supplies Calming Donut Bed', 'Bed', 'Cozy, self-warming round bed that provides security and comfort', 'https://amazon.com/dp/B07QKZVX73?tag=pupsense-20', 'Small', 'https://m.media-amazon.com/images/I/81E7t7OIQWL._AC_SL1500_.jpg', 29.99, ARRAY['Calming design', 'Self-warming', 'Machine washable', 'Non-slip bottom']),

-- Supplements
('Zesty Paws Multivitamin Chews', 'Supplement', 'All-in-one multivitamin with glucosamine, probiotics, and omega-3', 'https://amazon.com/dp/B01FED4OUQ?tag=pupsense-20', 'All', 'https://m.media-amazon.com/images/I/81tKCdYGOjL._AC_SL1500_.jpg', 25.97, ARRAY['Hip & joint support', 'Digestive health', 'Skin & coat', 'Made in USA']),
('Nutrena Hip & Joint Supplement', 'Supplement', 'Glucosamine and chondroitin for joint health and mobility', 'https://amazon.com/dp/B00025YR4M?tag=pupsense-20', 'Large', 'https://m.media-amazon.com/images/I/81TvH3JHJSL._AC_SL1500_.jpg', 19.99, ARRAY['Glucosamine', 'Chondroitin', 'MSM', 'Veterinarian recommended']),
('PetHonesty Omega-3 Fish Oil', 'Supplement', 'Wild-caught fish oil for healthy skin, coat, joints, and immune support', 'https://amazon.com/dp/B01M4PI59Y?tag=pupsense-20', 'All', 'https://m.media-amazon.com/images/I/71G7XJLkIHL._AC_SL1500_.jpg', 22.95, ARRAY['Wild-caught', 'Skin & coat', 'Joint support', 'No fishy smell']),

-- Grooming
('Hertzko Self-Cleaning Slicker Brush', 'Grooming', 'Professional pet grooming brush removes loose hair and tangles', 'https://amazon.com/dp/B00ZGPI3OY?tag=pupsense-20', 'All', 'https://m.media-amazon.com/images/I/71i5lC+TFUL._AC_SL1500_.jpg', 15.99, ARRAY['Self-cleaning', 'Removes tangles', 'Comfortable grip', 'Works on all coats']),
('Vet''s Best Dental Care Gel', 'Grooming', 'Natural dental gel for fresh breath and clean teeth', 'https://amazon.com/dp/B00AU5AZ7M?tag=pupsense-20', 'All', 'https://m.media-amazon.com/images/I/71X5W6DVIML._AC_SL1500_.jpg', 8.99, ARRAY['Natural ingredients', 'Fresh breath', 'Easy application', 'Veterinarian formulated']),

-- Health/Training
('Furbo Dog Camera', 'Health', 'Interactive pet camera with treat dispenser and barking alerts', 'https://amazon.com/dp/B01FXC7JWQ?tag=pupsense-20', 'All', 'https://m.media-amazon.com/images/I/41ShHNoHvlL._AC_SL1000_.jpg', 169.99, ARRAY['1080p HD camera', 'Treat tossing', 'Barking alerts', '2-way audio']),
('PetSafe Automatic Ball Launcher', 'Training', 'Automatic ball launcher for independent fetch play', 'https://amazon.com/dp/B0721735K9?tag=pupsense-20', 'Medium', 'https://m.media-amazon.com/images/I/71KqnSLSqCL._AC_SL1500_.jpg', 109.99, ARRAY['Automatic launching', 'Adjustable distance', 'Motion sensor', 'Indoor/outdoor']);

-- ================================================
-- TABLE: Insurance Partners
-- Track insurance referral partners and commission rates
-- ================================================
CREATE TABLE IF NOT EXISTS insurance_partners (
  id SERIAL PRIMARY KEY,
  partner_name VARCHAR(255) NOT NULL,
  referral_link TEXT NOT NULL,
  commission_rate DECIMAL(5,2), -- Percentage commission
  discount_offer VARCHAR(255), -- e.g., "10% off first year"
  logo_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert mock insurance partners
INSERT INTO insurance_partners (partner_name, referral_link, commission_rate, discount_offer, logo_url, description, is_active) VALUES
('Lemonade Pet Insurance', 'https://lemonade.com/pet?ref=pupsense', 15.00, '10% off first year', 'https://assets.lemonade.com/assets/lemonade-logo.svg', 'Fast, easy pet insurance powered by AI and social good', true),
('Trupanion', 'https://trupanion.com/referral/pupsense', 12.00, '1 month free coverage', 'https://trupanion.com/images/logo.png', 'Direct payment to vets, comprehensive coverage with no payout limits', true),
('Healthy Paws', 'https://healthypawspetinsurance.com?ref=pupsense', 10.00, 'Get a quote and save 10%', 'https://healthypawspetinsurance.com/images/logo.png', 'Unlimited lifetime benefits, no caps on claims', true);

-- ================================================
-- Success Message
-- ================================================
SELECT 'Phase 3: Monetization schema migration completed successfully!' AS message;
