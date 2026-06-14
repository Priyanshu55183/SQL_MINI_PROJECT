-- ============================================================
--  BiteByte — Row Level Security (run after schema.sql)
--  Ensures users can ONLY see their own data
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items  ENABLE ROW LEVEL SECURITY;

-- PROFILES: user can only read/update their own profile
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- FOOD ITEMS: everyone can read, only service role can write
CREATE POLICY "food_items_public_read" ON food_items FOR SELECT USING (TRUE);

-- ORDERS: user sees only their own orders
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "orders_insert_own" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ORDER ITEMS: user sees items belonging to their orders
CREATE POLICY "order_items_select_own" ON order_items
    FOR SELECT USING (
        order_id IN (SELECT order_id FROM orders WHERE user_id = auth.uid())
    );
CREATE POLICY "order_items_insert_own" ON order_items
    FOR INSERT WITH CHECK (
        order_id IN (SELECT order_id FROM orders WHERE user_id = auth.uid())
    );