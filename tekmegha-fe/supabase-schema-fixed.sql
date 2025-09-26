-- Supabase Schema for BrewBuddy Multi-Brand E-commerce Platform
-- This schema avoids direct references to auth.users to prevent permission errors

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  description TEXT,
  image_url TEXT,
  category VARCHAR(100) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  serves INTEGER DEFAULT 1,
  customisable BOOLEAN DEFAULT FALSE,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  old_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20),
  hours VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_address TEXT,
  delivery_instructions TEXT,
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

-- Create user_roles table for role-based access control
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'inventory_staff', 'store_manager', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Products: Everyone can read
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Stores: Everyone can read
CREATE POLICY "Stores are viewable by everyone" ON stores
  FOR SELECT USING (true);

-- Cart items: Users can manage their own cart
CREATE POLICY "Users can manage their own cart" ON cart_items
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Orders: Users can manage their own orders
CREATE POLICY "Users can manage their own orders" ON orders
  FOR ALL USING (auth.uid()::text = user_id::text);

-- Order items: Users can view their own order items
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_items.order_id 
      AND user_id::text = auth.uid()::text
    )
  );

-- User Roles: Users can read their own role, admins can manage all roles
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own role" ON user_roles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id::text = auth.uid()::text 
      AND role IN ('admin', 'manager')
    )
  );

-- Insert sample products
INSERT INTO products (name, price, description, image_url, category, rating, review_count, serves, customisable, discount_percentage, old_price) VALUES
('Cappuccino', 120.00, 'Rich and creamy Italian coffee', 'assets/images/brew-buddy/cappuccino.jpg', 'Espresso Drinks', 4.5, 128, 1, true, 10, 135.00),
('Americano', 95.00, 'Smooth and bold American-style coffee', 'assets/images/brew-buddy/americano.jpg', 'Espresso Drinks', 4.3, 95, 1, true, 0, NULL),
('Latte', 110.00, 'Creamy and smooth milk coffee', 'assets/images/brew-buddy/latte.jpg', 'Espresso Drinks', 4.6, 156, 1, true, 15, 130.00),
('Mocha', 135.00, 'Chocolate and coffee blend', 'assets/images/brew-buddy/mocha.jpg', 'Espresso Drinks', 4.4, 89, 1, true, 0, NULL),
('Espresso', 80.00, 'Strong and concentrated coffee', 'assets/images/brew-buddy/espresso.jpg', 'Espresso Drinks', 4.2, 67, 1, false, 0, NULL),
('French Press', 150.00, 'Full-bodied brewed coffee', 'assets/images/brew-buddy/french-press.jpg', 'Brewed Coffee', 4.7, 203, 2, false, 20, 190.00),
('Cold Brew', 100.00, 'Smooth and refreshing cold coffee', 'assets/images/brew-buddy/cold-brew.jpg', 'Brewed Coffee', 4.5, 134, 1, false, 0, NULL),
('Pour Over', 90.00, 'Artisanal hand-poured coffee', 'assets/images/brew-buddy/pour-over.jpg', 'Brewed Coffee', 4.8, 187, 1, false, 0, NULL),
('Croissant', 45.00, 'Buttery and flaky French pastry', 'assets/images/brew-buddy/croissant.jpg', 'Pastries & Snacks', 4.3, 78, 1, false, 0, NULL),
('Muffin', 35.00, 'Freshly baked blueberry muffin', 'assets/images/brew-buddy/muffin.jpg', 'Pastries & Snacks', 4.1, 56, 1, false, 0, NULL);

-- Insert sample stores
INSERT INTO stores (id, name, address, phone, hours, latitude, longitude) VALUES
('hyderabad-store1', 'BrewBuddy Gachibowli', 'Plot No. 1, Hitech City Main Rd, Gachibowli, Hyderabad, Telangana 500032', '+91 40 1111 2222', 'Mon-Fri: 8 AM - 9 PM, Sat-Sun: 9 AM - 8 PM', 17.4483, 78.3908),
('hyderabad-store2', 'BrewBuddy Jubilee Hills', 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033', '+91 40 3333 4444', 'Mon-Sun: 7 AM - 10 PM', 17.4065, 78.4772),
('hyderabad-store3', 'BrewBuddy Banjara Hills', 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034', '+91 40 5555 6666', 'Mon-Fri: 7:30 AM - 9:30 PM, Sat-Sun: 8 AM - 9 PM', 17.4065, 78.4772),
('hyderabad-store4', 'BrewBuddy Kondapur', 'Survey No. 64, Kondapur, Hyderabad, Telangana 500084', '+91 40 7777 8888', 'Mon-Sun: 8 AM - 8 PM', 17.4849, 78.3897),
('hyderabad-store5', 'BrewBuddy Kothaguda', 'Botanical Garden Rd, Kothaguda, Hyderabad, Telangana 500084', '+91 40 9999 0000', 'Mon-Fri: 8:30 AM - 8:30 PM, Sat-Sun: 9 AM - 7 PM', 17.4849, 78.3897),
('hyderabad-store6', 'BrewBuddy Madhapur', 'Plot No. 2, Hitech City Rd, Madhapur, Hyderabad, Telangana 500081', '+91 40 1234 5678', 'Mon-Sun: 7 AM - 9 PM', 17.4483, 78.3908),
('hyderabad-store7', 'BrewBuddy Begumpet', 'S.P. Road, Begumpet, Hyderabad, Telangana 500016', '+91 40 8765 4321', 'Mon-Fri: 8 AM - 7 PM, Sat-Sun: 9 AM - 6 PM', 17.4399, 78.4738),
('hyderabad-store8', 'BrewBuddy Secunderabad', 'MG Road, Secunderabad, Telangana 500003', '+91 40 2468 1357', 'Mon-Sun: 7:30 AM - 8:30 PM', 17.4399, 78.4981),
('hyderabad-store9', 'BrewBuddy Himayatnagar', 'Street No. 1, Himayatnagar, Hyderabad, Telangana 500029', '+91 40 1357 2468', 'Mon-Fri: 9 AM - 8 PM, Sat-Sun: 10 AM - 7 PM', 17.4065, 78.4772),
('hyderabad-store10', 'BrewBuddy Ameerpet', 'Near Ameerpet Metro Station, Hyderabad, Telangana 500016', '+91 40 9876 5432', 'Mon-Sun: 8 AM - 9 PM', 17.4399, 78.4738);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);

-- Create indexes for user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
