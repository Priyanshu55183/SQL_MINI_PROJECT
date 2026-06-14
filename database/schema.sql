-- ============================================================
--  BiteByte — Seed Data (run after schema.sql)
-- ============================================================

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