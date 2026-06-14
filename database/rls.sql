-- ============================================================
--  BiteByte — Full Stack Food Ordering App
--  Run this entire file in Supabase SQL Editor
-- ============================================================

-- 1. USERS (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT NOT NULL,
    phone       TEXT,
    address     TEXT,
    goal        TEXT DEFAULT 'balanced'  -- 'weight_loss' | 'muscle_gain' | 'balanced'
);

-- 2. FOOD ITEMS
CREATE TABLE IF NOT EXISTS food_items (
    item_id     SERIAL PRIMARY KEY,
    item_name   TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    price       NUMERIC NOT NULL,
    description TEXT,
    is_veg      BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    -- Nutrition columns (unique feature)
    calories    INTEGER DEFAULT 0,
    protein     NUMERIC DEFAULT 0,   -- grams
    carbs       NUMERIC DEFAULT 0,   -- grams
    fat         NUMERIC DEFAULT 0    -- grams
);

-- 3. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    order_id     SERIAL PRIMARY KEY,
    user_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
    total_price  NUMERIC NOT NULL,
    total_cal    INTEGER DEFAULT 0,
    order_status TEXT    DEFAULT 'Pending',  -- Pending | Preparing | Delivered
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDER ITEMS (junction table)
CREATE TABLE IF NOT EXISTS order_items (
    id         SERIAL PRIMARY KEY,
    order_id   INTEGER REFERENCES orders(order_id) ON DELETE CASCADE,
    item_id    INTEGER REFERENCES food_items(item_id) ON DELETE SET NULL,
    item_name  TEXT    NOT NULL,
    quantity   INTEGER NOT NULL,
    unit_price NUMERIC NOT NULL,
    calories   INTEGER DEFAULT 0
);