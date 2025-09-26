-- Supabase Multi-Brand Schema Updates
-- Add brand_id to all tables for multi-brand support

-- Create brands table first
CREATE TABLE IF NOT EXISTS brands (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  primary_color VARCHAR(7) NOT NULL,
  secondary_color VARCHAR(7) NOT NULL,
  accent_color VARCHAR(7) NOT NULL,
  theme VARCHAR(50) NOT NULL CHECK (theme IN ('coffee', 'toys', 'fashion')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default brands
INSERT INTO brands (id, name, display_name, primary_color, secondary_color, accent_color, theme) VALUES
('brew-buddy', 'BrewBuddy', 'BrewBuddy Coffee', '#6366f1', '#3b82f6', '#ec4899', 'coffee'),
('little-ducks', 'Little Ducks', 'Little Ducks Toys', '#fbbf24', '#3b82f6', '#ef4444', 'toys'),
('opula', 'Opula', 'Opula Fashion', '#ec4899', '#6366f1', '#f59e0b', 'fashion');

-- Add brand_id to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE;

-- Add brand_id to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE;

-- Add brand_id to cart_items table
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE;

-- Add brand_id to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE;

-- Add brand_id to order_items table
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE;

-- Add brand_id to user_roles table
ALTER TABLE user_roles ADD COLUMN IF NOT EXISTS brand_id VARCHAR(50) REFERENCES brands(id) ON DELETE CASCADE;

-- Update existing data with default brand_id (brew-buddy)
UPDATE products SET brand_id = 'brew-buddy' WHERE brand_id IS NULL;
UPDATE stores SET brand_id = 'brew-buddy' WHERE brand_id IS NULL;
UPDATE cart_items SET brand_id = 'brew-buddy' WHERE brand_id IS NULL;
UPDATE orders SET brand_id = 'brew-buddy' WHERE brand_id IS NULL;
UPDATE order_items SET brand_id = 'brew-buddy' WHERE brand_id IS NULL;
UPDATE user_roles SET brand_id = 'brew-buddy' WHERE brand_id IS NULL;

-- Make brand_id NOT NULL after updating existing data
ALTER TABLE products ALTER COLUMN brand_id SET NOT NULL;
ALTER TABLE stores ALTER COLUMN brand_id SET NOT NULL;
ALTER TABLE cart_items ALTER COLUMN brand_id SET NOT NULL;
ALTER TABLE orders ALTER COLUMN brand_id SET NOT NULL;
ALTER TABLE order_items ALTER COLUMN brand_id SET NOT NULL;
ALTER TABLE user_roles ALTER COLUMN brand_id SET NOT NULL;

-- Enable RLS on brands table
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for brands
CREATE POLICY "Brands are viewable by everyone" ON brands
  FOR SELECT USING (true);

-- Update RLS policies to include brand_id filtering

-- Products: Filter by brand_id
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Stores: Filter by brand_id
DROP POLICY IF EXISTS "Stores are viewable by everyone" ON stores;
CREATE POLICY "Stores are viewable by everyone" ON stores
  FOR SELECT USING (true);

-- Cart items: Users can manage their own cart with brand filtering
DROP POLICY IF EXISTS "Users can manage their own cart" ON cart_items;
CREATE POLICY "Users can manage their own cart" ON cart_items
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Orders: Users can manage their own orders with brand filtering
DROP POLICY IF EXISTS "Users can manage their own orders" ON orders;
CREATE POLICY "Users can manage their own orders" ON orders
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Order items: Users can view their own order items with brand filtering
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_items.order_id 
      AND user_id::text = auth.uid()::text
    )
  );

-- User Roles: Users can read their own role with brand filtering
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Users can insert their own role" ON user_roles;
CREATE POLICY "Users can insert their own role" ON user_roles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Create indexes for brand_id columns
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_stores_brand_id ON stores(brand_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_brand_id ON cart_items(brand_id);
CREATE INDEX IF NOT EXISTS idx_orders_brand_id ON orders(brand_id);
CREATE INDEX IF NOT EXISTS idx_order_items_brand_id ON order_items(brand_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_brand_id ON user_roles(brand_id);

-- Create composite indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_brand_category ON products(brand_id, category);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_brand ON cart_items(user_id, brand_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_brand ON orders(user_id, brand_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_brand ON user_roles(user_id, brand_id);

-- Insert sample products for different brands
INSERT INTO products (name, price, description, image_url, category, rating, review_count, serves, customisable, discount_percentage, old_price, brand_id) VALUES
-- BrewBuddy Coffee Products
('Cappuccino', 120.00, 'Rich and creamy Italian coffee', 'assets/images/brew-buddy/cappuccino.jpg', 'Espresso Drinks', 4.5, 128, 1, true, 10, 135.00, 'brew-buddy'),
('Americano', 95.00, 'Smooth and bold American-style coffee', 'assets/images/brew-buddy/americano.jpg', 'Espresso Drinks', 4.3, 95, 1, true, 0, NULL, 'brew-buddy'),
('Latte', 110.00, 'Creamy and smooth milk coffee', 'assets/images/brew-buddy/latte.jpg', 'Espresso Drinks', 4.6, 156, 1, true, 15, 130.00, 'brew-buddy'),
('Mocha', 135.00, 'Chocolate and coffee blend', 'assets/images/brew-buddy/mocha.jpg', 'Espresso Drinks', 4.4, 89, 1, true, 0, NULL, 'brew-buddy'),
('Espresso', 80.00, 'Strong and concentrated coffee', 'assets/images/brew-buddy/espresso.jpg', 'Espresso Drinks', 4.2, 67, 1, false, 0, NULL, 'brew-buddy'),
('French Press', 150.00, 'Full-bodied brewed coffee', 'assets/images/brew-buddy/french-press.jpg', 'Brewed Coffee', 4.7, 203, 2, false, 20, 190.00, 'brew-buddy'),
('Cold Brew', 100.00, 'Smooth and refreshing cold coffee', 'assets/images/brew-buddy/cold-brew.jpg', 'Brewed Coffee', 4.5, 134, 1, false, 0, NULL, 'brew-buddy'),
('Pour Over', 90.00, 'Artisanal hand-poured coffee', 'assets/images/brew-buddy/pour-over.jpg', 'Brewed Coffee', 4.8, 187, 1, false, 0, NULL, 'brew-buddy'),
('Croissant', 45.00, 'Buttery and flaky French pastry', 'assets/images/brew-buddy/croissant.jpg', 'Pastries & Snacks', 4.3, 78, 1, false, 0, NULL, 'brew-buddy'),
('Muffin', 35.00, 'Freshly baked blueberry muffin', 'assets/images/brew-buddy/muffin.jpg', 'Pastries & Snacks', 4.1, 56, 1, false, 0, NULL, 'brew-buddy'),

-- Little Ducks Toys Products
('LEGO Classic Set', 2500.00, 'Creative building blocks for endless fun', 'assets/images/little-ducks/lego-classic.jpg', 'Educational', 4.8, 234, 1, false, 15, 2950.00, 'little-ducks'),
('Action Figure Set', 850.00, 'Superhero action figures with accessories', 'assets/images/little-ducks/action-figures.jpg', 'Action Figures', 4.6, 156, 1, false, 0, NULL, 'little-ducks'),
('Board Game Collection', 1200.00, 'Family-friendly board games', 'assets/images/little-ducks/board-games.jpg', 'Board Games', 4.7, 189, 4, false, 20, 1500.00, 'little-ducks'),
('Doll House', 3500.00, 'Beautiful wooden doll house with furniture', 'assets/images/little-ducks/doll-house.jpg', 'Dolls', 4.9, 267, 1, false, 0, NULL, 'little-ducks'),
('Outdoor Play Set', 4500.00, 'Complete outdoor playground equipment', 'assets/images/little-ducks/outdoor-play.jpg', 'Outdoor', 4.5, 123, 1, false, 25, 6000.00, 'little-ducks'),
('Puzzle Set', 450.00, 'Educational jigsaw puzzles for all ages', 'assets/images/little-ducks/puzzles.jpg', 'Puzzles', 4.4, 98, 1, false, 0, NULL, 'little-ducks'),

-- Opula Fashion Products
('Designer Dress', 3500.00, 'Elegant evening dress for special occasions', 'assets/images/opula/designer-dress.jpg', 'Dresses', 4.7, 145, 1, false, 30, 5000.00, 'opula'),
('Men\'s Suit', 5500.00, 'Premium quality business suit', 'assets/images/opula/mens-suit.jpg', 'Men\'s', 4.8, 89, 1, false, 0, NULL, 'opula'),
('Luxury Watch', 8500.00, 'Swiss-made luxury timepiece', 'assets/images/opula/luxury-watch.jpg', 'Accessories', 4.9, 67, 1, false, 15, 10000.00, 'opula'),
('Designer Handbag', 4200.00, 'Premium leather handbag', 'assets/images/opula/designer-handbag.jpg', 'Accessories', 4.6, 112, 1, false, 0, NULL, 'opula'),
('Sports Shoes', 2800.00, 'High-performance athletic footwear', 'assets/images/opula/sports-shoes.jpg', 'Footwear', 4.5, 203, 1, false, 20, 3500.00, 'opula'),
('Diamond Necklace', 15000.00, 'Exquisite diamond jewelry piece', 'assets/images/opula/diamond-necklace.jpg', 'Jewelry', 4.9, 45, 1, false, 0, NULL, 'opula');

-- Insert sample stores for different brands
INSERT INTO stores (id, name, address, phone, hours, latitude, longitude, brand_id) VALUES
-- BrewBuddy Coffee Stores
('brew-buddy-gachibowli', 'BrewBuddy Gachibowli', 'Plot No. 1, Hitech City Main Rd, Gachibowli, Hyderabad, Telangana 500032', '+91 40 1111 2222', 'Mon-Fri: 8 AM - 9 PM, Sat-Sun: 9 AM - 8 PM', 17.4483, 78.3908, 'brew-buddy'),
('brew-buddy-jubilee-hills', 'BrewBuddy Jubilee Hills', 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033', '+91 40 3333 4444', 'Mon-Sun: 7 AM - 10 PM', 17.4065, 78.4772, 'brew-buddy'),
('brew-buddy-banjara-hills', 'BrewBuddy Banjara Hills', 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034', '+91 40 5555 6666', 'Mon-Fri: 7:30 AM - 9:30 PM, Sat-Sun: 8 AM - 9 PM', 17.4065, 78.4772, 'brew-buddy'),

-- Little Ducks Toys Stores
('little-ducks-mall', 'Little Ducks Mall Store', 'City Center Mall, Ground Floor, Hyderabad, Telangana 500032', '+91 40 7777 8888', 'Mon-Sun: 10 AM - 10 PM', 17.4483, 78.3908, 'little-ducks'),
('little-ducks-jubilee', 'Little Ducks Jubilee Hills', 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033', '+91 40 9999 0000', 'Mon-Sun: 9 AM - 9 PM', 17.4065, 78.4772, 'little-ducks'),

-- Opula Fashion Stores
('opula-fashion-mall', 'Opula Fashion Mall', 'Phoenix Mall, Level 2, Hyderabad, Telangana 500032', '+91 40 1234 5678', 'Mon-Sun: 10 AM - 11 PM', 17.4483, 78.3908, 'opula'),
('opula-banjara-hills', 'Opula Banjara Hills', 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034', '+91 40 8765 4321', 'Mon-Sun: 9 AM - 10 PM', 17.4065, 78.4772, 'opula');
