-- ============================================================
--  BiteByte — Database Re-alignment & Schema Setup Script
--  Run this entire file in your Supabase SQL Editor
-- ============================================================

-- 1. CLEANUP (Drop tables in reverse dependency order)
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS food_items CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. CREATE PROFILES TABLE (extends Supabase auth.users)
CREATE TABLE profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT NOT NULL,
    phone       TEXT,
    address     TEXT,
    goal        TEXT DEFAULT 'balanced'  -- 'weight_loss' | 'muscle_gain' | 'balanced'
);

-- 3. CREATE FOOD ITEMS TABLE
CREATE TABLE food_items (
    item_id      SERIAL PRIMARY KEY,
    item_name    TEXT    NOT NULL,
    category     TEXT    NOT NULL,
    price        NUMERIC NOT NULL,
    description  TEXT,
    is_veg       BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    calories     INTEGER DEFAULT 0,
    protein      NUMERIC DEFAULT 0,   -- grams
    carbs        NUMERIC DEFAULT 0,   -- grams
    fat          NUMERIC DEFAULT 0    -- grams
);

-- 4. CREATE ORDERS TABLE
CREATE TABLE orders (
    order_id     SERIAL PRIMARY KEY,
    user_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    total_price  NUMERIC NOT NULL,
    total_cal    INTEGER DEFAULT 0,
    order_status TEXT    DEFAULT 'Pending',  -- Pending | Preparing | Delivered
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE ORDER ITEMS TABLE (junction table)
CREATE TABLE order_items (
    id          SERIAL PRIMARY KEY,
    order_id    INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    item_id     INTEGER REFERENCES food_items(item_id) ON DELETE SET NULL,
    item_name   TEXT    NOT NULL,
    quantity    INTEGER NOT NULL,
    unit_price  NUMERIC NOT NULL,
    calories    INTEGER DEFAULT 0
);

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items  ENABLE ROW LEVEL SECURITY;

-- 7. DEFINE RLS POLICIES

-- profiles: Users can read/write their own profiles
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- food_items: Anyone can read, only Service Role (admin) can write
CREATE POLICY "food_items_public_read" ON food_items FOR SELECT USING (TRUE);

-- orders: Users can only see and insert their own orders
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- order_items: Users can only see and insert items for their own orders
CREATE POLICY "order_items_select_own" ON order_items FOR SELECT USING (
    order_id IN (SELECT order_id FROM orders WHERE user_id = auth.uid())
);
CREATE POLICY "order_items_insert_own" ON order_items FOR INSERT WITH CHECK (
    order_id IN (SELECT order_id FROM orders WHERE user_id = auth.uid())
);

-- 8. SEED DATA (Default Food Items)
INSERT INTO food_items (item_name, category, price, description, is_veg, calories, protein, carbs, fat) VALUES
-- Pizza
('Margherita Pizza',   'Pizza',    249, 'Classic tomato and mozzarella',        TRUE,  266, 11, 33, 10),
('Pepperoni Pizza',    'Pizza',    329, 'Loaded with pepperoni slices',          FALSE, 313, 14, 34, 13),
('Veggie Supreme',     'Pizza',    289, 'Bell peppers, olives, onion, corn',     TRUE,  240, 10, 32,  9),
-- Burger
('Veg Burger',         'Burger',   149, 'Crispy patty with fresh veggies',       TRUE,  390, 12, 44, 17),
('Chicken Burger',     'Burger',   199, 'Grilled chicken with mayo sauce',       FALSE, 490, 28, 42, 19),
('Double Smash',       'Burger',   249, 'Double patty smash burger with cheese', FALSE, 610, 35, 45, 28),
-- Pasta
('Penne Arrabbiata',   'Pasta',    229, 'Spicy tomato pasta',                    TRUE,  380, 13, 68, 10),
('White Sauce Pasta',  'Pasta',    219, 'Creamy bechamel pasta',                 TRUE,  420, 14, 62, 15),
('Chicken Alfredo',    'Pasta',    279, 'Grilled chicken in alfredo sauce',      FALSE, 510, 32, 55, 18),
-- Sandwich
('Club Sandwich',      'Sandwich', 179, 'Triple decker with veggies and egg',    TRUE,  350, 15, 40, 14),
('Grilled Sandwich',   'Sandwich', 159, 'Golden toasted with cheese',            TRUE,  290, 10, 38, 11),
('Chicken Wrap',       'Sandwich', 199, 'Grilled chicken in whole wheat wrap',   FALSE, 410, 30, 36, 13),
-- Drinks
('Cold Coffee',        'Drinks',   129, 'Chilled coffee with cream',             TRUE,  180,  4, 28,  6),
('Mango Shake',        'Drinks',   119, 'Fresh Alphonso mango blend',            TRUE,  210,  4, 48,  3),
('Green Detox Juice',  'Drinks',    99, 'Spinach, cucumber, lemon, ginger',      TRUE,   65,  2, 14,  1),
-- Snacks
('French Fries',       'Snacks',    99, 'Crispy golden salted fries',            TRUE,  365,  4, 48, 17),
('Loaded Fries',       'Snacks',   149, 'Cheese and jalapeno fries',             TRUE,  470,  9, 52, 23),
('Protein Bowl',       'Snacks',   199, 'Quinoa, chickpeas, veggies, tahini',    TRUE,  320, 18, 38,  9);
