-- BrewBuddy Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  serves INTEGER DEFAULT 1,
  description TEXT,
  image_url VARCHAR(500),
  customisable BOOLEAN DEFAULT false,
  category VARCHAR(50) CHECK (category IN ('Espresso Drinks', 'Brewed Coffee', 'Pastries & Snacks')),
  discount_percentage INTEGER DEFAULT 0,
  old_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  hours TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 50.00,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_id VARCHAR(255),
  delivery_address TEXT,
  phone_number VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Products: Everyone can read
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Stores: Everyone can read
CREATE POLICY "Stores are viewable by everyone" ON stores
  FOR SELECT USING (true);

-- Cart items: Users can only see their own cart
CREATE POLICY "Users can view own cart items" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" ON cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- Orders: Users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Order items: Users can only see items from their orders
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, price, rating, review_count, serves, description, image_url, customisable, category, discount_percentage, old_price) VALUES
('Espresso Blend', 4.50, 4.8, 120, 1, 'A rich and intense coffee experience.', 'assets/images/brew-buddy/espresso.jpg', false, 'Brewed Coffee', 15, 5.29),
('Vanilla Latte', 5.25, 4.7, 95, 1, 'Smooth latte with a hint of sweet vanilla.', 'assets/images/brew-buddy/latte.jpg', true, 'Espresso Drinks', 10, 5.85),
('Chocolate Croissant', 3.00, 4.6, 80, 1, 'Flaky pastry with a rich chocolate filling.', 'assets/images/brew-buddy/muffin.jpg', false, 'Pastries & Snacks', 0, null),
('Cappuccino', 4.75, 4.9, 150, 1, 'Perfect balance of espresso, steamed milk, and foam.', 'assets/images/brew-buddy/cappuccino.jpg', true, 'Espresso Drinks', 12, 5.40),
('Cold Brew', 4.25, 4.5, 75, 1, 'Smooth and refreshing cold-brewed coffee.', 'assets/images/brew-buddy/cold-brew.jpg', false, 'Brewed Coffee', 8, 4.62),
('Caramel Macchiato', 5.50, 4.8, 110, 1, 'Rich espresso with vanilla and caramel drizzle.', 'assets/images/brew-buddy/macchiato.jpg', true, 'Espresso Drinks', 15, 6.47),
('Blueberry Muffin', 3.25, 4.4, 65, 1, 'Fresh baked muffin with juicy blueberries.', 'assets/images/brew-buddy/blueberry-muffin.jpg', false, 'Pastries & Snacks', 0, null),
('Americano', 3.75, 4.6, 85, 1, 'Classic espresso with hot water for a clean taste.', 'assets/images/brew-buddy/americano.jpg', false, 'Espresso Drinks', 0, null);

-- Insert sample stores
INSERT INTO stores (name, address, phone, hours, latitude, longitude) VALUES
('BrewBuddy Gachibowli', 'Plot No. 1, Hitech City Main Rd, Gachibowli, Hyderabad, Telangana 500032', '+91 40 1111 2222', 'Mon-Fri: 8 AM - 9 PM, Sat-Sun: 9 AM - 8 PM', 17.4399, 78.3481),
('BrewBuddy Jubilee Hills', 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033', '+91 40 3333 4444', 'Mon-Sun: 7 AM - 10 PM', 17.4339, 78.4078),
('BrewBuddy Banjara Hills', 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034', '+91 40 5555 6666', 'Mon-Fri: 7:30 AM - 9:30 PM, Sat-Sun: 8 AM - 9 PM', 17.4065, 78.4772),
('BrewBuddy Kondapur', 'Survey No. 64, Kondapur, Hyderabad, Telangana 500084', '+91 40 7777 8888', 'Mon-Sun: 8 AM - 8 PM', 17.4849, 78.3897),
('BrewBuddy Kothaguda', 'Botanical Garden Rd, Kothaguda, Hyderabad, Telangana 500084', '+91 40 9999 0000', 'Mon-Fri: 8:30 AM - 8:30 PM, Sat-Sun: 9 AM - 7 PM', 17.4849, 78.3897),
('BrewBuddy Madhapur', 'Plot No. 2, Hitech City Rd, Madhapur, Hyderabad, Telangana 500081', '+91 40 1234 5678', 'Mon-Sun: 7 AM - 9 PM', 17.4483, 78.3908),
('BrewBuddy Begumpet', 'S.P. Road, Begumpet, Hyderabad, Telangana 500016', '+91 40 8765 4321', 'Mon-Fri: 8 AM - 7 PM, Sat-Sun: 9 AM - 6 PM', 17.4399, 78.4738),
('BrewBuddy Secunderabad', 'MG Road, Secunderabad, Telangana 500003', '+91 40 2468 1357', 'Mon-Sun: 7:30 AM - 8:30 PM', 17.4399, 78.4981),
('BrewBuddy Himayatnagar', 'Street No. 1, Himayatnagar, Hyderabad, Telangana 500029', '+91 40 1357 2468', 'Mon-Fri: 9 AM - 8 PM, Sat-Sun: 10 AM - 7 PM', 17.4065, 78.4772),
('BrewBuddy Ameerpet', 'Near Ameerpet Metro Station, Hyderabad, Telangana 500016', '+91 40 9876 5432', 'Mon-Sun: 8 AM - 9 PM', 17.4399, 78.4738);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
