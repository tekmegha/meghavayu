-- ===================================================================
-- TEKMEGHA MULTI-STORE DATABASE SCHEMA FOR SUPABASE
-- Complete production-ready schema for online delivery stores
-- ===================================================================

-- Create dedicated API schemas
CREATE SCHEMA IF NOT EXISTS api_v1;
CREATE SCHEMA IF NOT EXISTS public_api;
CREATE SCHEMA IF NOT EXISTS admin_api;
CREATE SCHEMA IF NOT EXISTS mobile_api;
CREATE SCHEMA IF NOT EXISTS store_api;

-- Enable Row Level Security on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- CORE TABLES
-- ===================================================================

-- Create megha_stores table (master store registry)
CREATE TABLE IF NOT EXISTS megha_stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_code VARCHAR(50) UNIQUE NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  store_type VARCHAR(100) NOT NULL,
  domain VARCHAR(255),
  theme_config JSONB,
  business_hours JSONB,
  contact_email VARCHAR(255),
  support_phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create store_locations table
CREATE TABLE IF NOT EXISTS store_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  location_code VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  hours TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_flagship BOOLEAN DEFAULT false,
  delivery_radius_km DECIMAL(5,2) DEFAULT 10.0,
  min_order_amount DECIMAL(10,2) DEFAULT 0.00,
  has_parking BOOLEAN DEFAULT false,
  has_wifi BOOLEAN DEFAULT false,
  has_drive_through BOOLEAN DEFAULT false,
  capacity INTEGER,
  manager_contact VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_store_location_code UNIQUE (megha_store_id, location_code)
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  sku VARCHAR(100),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  serves INTEGER DEFAULT 1,
  description TEXT,
  image_url VARCHAR(500),
  gallery_images JSONB,
  customisable BOOLEAN DEFAULT false,
  customization_options JSONB,
  category VARCHAR(50),
  tags JSONB,
  discount_percentage INTEGER DEFAULT 0,
  old_price DECIMAL(10,2),
  nutritional_info JSONB,
  allergen_info JSONB,
  preparation_time INTEGER,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_store_sku UNIQUE (megha_store_id, sku)
);

-- Create location_inventory table
CREATE TABLE IF NOT EXISTS location_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_location_id UUID REFERENCES store_locations(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  max_stock_capacity INTEGER DEFAULT 1000,
  cost_price DECIMAL(10,2),
  last_restocked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_location_id, product_id)
);

-- Create location_staff table
CREATE TABLE IF NOT EXISTS location_staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_location_id UUID REFERENCES store_locations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id VARCHAR(50),
  role VARCHAR(50) NOT NULL CHECK (role IN ('location_manager', 'assistant_manager', 'barista', 'cashier', 'kitchen_staff', 'delivery_person', 'cleaner')),
  shift_schedule JSONB,
  hourly_rate DECIMAL(8,2),
  hire_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(store_location_id, user_id)
);

-- Create customer_addresses table
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  address_type VARCHAR(20) CHECK (address_type IN ('home', 'work', 'other')),
  full_address TEXT NOT NULL,
  landmark TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  customizations JSONB,
  special_instructions TEXT,
  unit_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, megha_store_id)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_location_id UUID REFERENCES store_locations(id),
  pickup_location_id UUID REFERENCES store_locations(id),
  customer_address_id UUID REFERENCES customer_addresses(id),
  order_type VARCHAR(20) DEFAULT 'delivery' CHECK (order_type IN ('delivery', 'pickup', 'dine_in')),
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  discount_amount DECIMAL(10,2) DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'refunded')),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  payment_id VARCHAR(255),
  delivery_address JSONB,
  billing_address JSONB,
  phone_number VARCHAR(20),
  customer_notes TEXT,
  staff_notes TEXT,
  estimated_preparation_time INTEGER,
  actual_preparation_time INTEGER,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_reason TEXT,
  refund_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  customizations JSONB,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'store_admin', 'manager', 'inventory_staff', 'store_manager', 'customer', 'delivery_partner')),
  permissions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, megha_store_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_verified BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  promo_code VARCHAR(50),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed_amount', 'buy_x_get_y')),
  discount_value DECIMAL(10,2),
  min_order_amount DECIMAL(10,2),
  max_discount_amount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  applicable_products JSONB,
  applicable_categories JSONB,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_store_promo_code UNIQUE (megha_store_id, promo_code)
);

-- Create delivery_partners table
CREATE TABLE IF NOT EXISTS delivery_partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_code VARCHAR(50),
  vehicle_type VARCHAR(50) CHECK (vehicle_type IN ('bike', 'car', 'cycle', 'van')),
  license_number VARCHAR(100),
  phone VARCHAR(20),
  emergency_contact VARCHAR(20),
  is_available BOOLEAN DEFAULT true,
  current_location_lat DECIMAL(10,8),
  current_location_lng DECIMAL(11,8),
  max_orders_capacity INTEGER DEFAULT 3,
  current_orders_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_partner_code UNIQUE (megha_store_id, partner_code)
);

-- Create delivery_tracking table
CREATE TABLE IF NOT EXISTS delivery_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  delivery_partner_id UUID REFERENCES delivery_partners(id),
  status VARCHAR(50) CHECK (status IN ('assigned', 'picked_up', 'in_transit', 'reached_destination', 'delivered', 'failed', 'returned')),
  pickup_time TIMESTAMP WITH TIME ZONE,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  delivery_location_lat DECIMAL(10,8),
  delivery_location_lng DECIMAL(11,8),
  delivery_notes TEXT,
  customer_signature JSONB,
  delivery_photo_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_transactions table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  payment_gateway VARCHAR(50) CHECK (payment_gateway IN ('razorpay', 'stripe', 'paytm', 'phonepe', 'gpay', 'cash')),
  transaction_id VARCHAR(255),
  gateway_order_id VARCHAR(255),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50) CHECK (status IN ('pending', 'processing', 'success', 'failed', 'refunded', 'cancelled')),
  gateway_response JSONB,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create refunds table
CREATE TABLE IF NOT EXISTS refunds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  payment_transaction_id UUID REFERENCES payment_transactions(id),
  refund_amount DECIMAL(10,2),
  refund_reason TEXT,
  status VARCHAR(50) CHECK (status IN ('initiated', 'processing', 'completed', 'failed', 'cancelled')),
  gateway_refund_id VARCHAR(255),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  megha_store_id UUID REFERENCES megha_stores(id),
  type VARCHAR(50) CHECK (type IN ('order_confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'promotion')),
  title VARCHAR(255),
  message TEXT,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  sent_via VARCHAR(20) CHECK (sent_via IN ('push', 'sms', 'email', 'in_app')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Create notification_templates table
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  template_type VARCHAR(50),
  channel VARCHAR(20) CHECK (channel IN ('sms', 'email', 'push', 'whatsapp')),
  subject VARCHAR(255),
  content TEXT,
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tax_rates table
CREATE TABLE IF NOT EXISTS tax_rates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  state VARCHAR(50),
  tax_type VARCHAR(50) CHECK (tax_type IN ('GST', 'VAT', 'Service_Tax', 'CGST', 'SGST', 'IGST')),
  rate DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cancellation_policies table
CREATE TABLE IF NOT EXISTS cancellation_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  time_limit_minutes INTEGER,
  refund_percentage DECIMAL(5,2),
  cancellation_fee DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_status_history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  from_status VARCHAR(20),
  to_status VARCHAR(20),
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- ENABLE ROW LEVEL SECURITY
-- ===================================================================

ALTER TABLE megha_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellation_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- ROW LEVEL SECURITY POLICIES
-- ===================================================================

-- Megha Stores Policies
CREATE POLICY "Active stores are viewable by everyone" ON megha_stores
  FOR SELECT USING (is_active = true);

CREATE POLICY "Super admins can manage all stores" ON megha_stores
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id::text = auth.uid()::text 
      AND role = 'super_admin'
    )
  );

-- Store Locations Policies
CREATE POLICY "Active locations are viewable by everyone" ON store_locations
  FOR SELECT USING (is_active = true);

CREATE POLICY "Store staff can manage their locations" ON store_locations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id::text = auth.uid()::text 
      AND megha_store_id = store_locations.megha_store_id
      AND role IN ('super_admin', 'store_admin', 'manager')
    )
  );

-- Products Policies
CREATE POLICY "Available products are viewable by everyone" ON products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Store staff can manage their products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id::text = auth.uid()::text 
      AND megha_store_id = products.megha_store_id
      AND role IN ('super_admin', 'store_admin', 'manager', 'inventory_staff')
    )
  );

-- Customer Addresses Policies
CREATE POLICY "Users can manage own addresses" ON customer_addresses
  FOR ALL USING (auth.uid() = user_id);

-- Cart Items Policies
CREATE POLICY "Users can manage own cart items" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Orders Policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Store staff can view store orders" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id::text = auth.uid()::text 
      AND megha_store_id = orders.megha_store_id
      AND role IN ('super_admin', 'store_admin', 'manager', 'store_manager')
    )
  );

CREATE POLICY "Store staff can update store orders" ON orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id::text = auth.uid()::text 
      AND megha_store_id = orders.megha_store_id
      AND role IN ('super_admin', 'store_admin', 'manager', 'store_manager')
    )
  );

-- Order Items Policies
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Notifications Policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Reviews Policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own reviews" ON reviews
  FOR ALL USING (auth.uid() = user_id);

-- User Roles Policies
CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Super admins can manage all roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id::text = auth.uid()::text 
      AND role = 'super_admin'
    )
  );

-- ===================================================================
-- API SCHEMA VIEWS
-- ===================================================================

-- PUBLIC API SCHEMA
CREATE VIEW public_api.products AS 
SELECT p.id, p.sku, p.name, p.price, p.rating, p.review_count, p.serves, 
       p.description, p.image_url, p.gallery_images, p.customisable, p.customization_options,
       p.category, p.tags, p.discount_percentage, p.old_price, p.nutritional_info,
       p.allergen_info, p.preparation_time, p.is_featured, p.megha_store_id,
       ms.store_name, ms.store_code, ms.store_type
FROM products p
JOIN megha_stores ms ON p.megha_store_id = ms.id
WHERE p.is_available = true AND ms.is_active = true;

CREATE VIEW public_api.store_locations AS 
SELECT sl.id, sl.location_code, sl.name, sl.address, sl.phone, sl.hours, 
       sl.latitude, sl.longitude, sl.delivery_radius_km, sl.min_order_amount,
       sl.has_parking, sl.has_wifi, sl.has_drive_through, sl.capacity,
       sl.megha_store_id, ms.store_name, ms.store_code
FROM store_locations sl
JOIN megha_stores ms ON sl.megha_store_id = ms.id
WHERE sl.is_active = true AND ms.is_active = true;

CREATE VIEW public_api.products_with_availability AS 
SELECT p.id, p.name, p.price, p.rating, p.image_url, p.category, 
       p.discount_percentage, p.old_price, p.preparation_time, p.megha_store_id,
       ms.store_name, ms.store_code,
       sl.id as location_id, sl.name as location_name, sl.location_code,
       COALESCE(li.stock_quantity - li.reserved_quantity, 0) as available_quantity,
       CASE 
         WHEN COALESCE(li.stock_quantity - li.reserved_quantity, 0) > 0 THEN true 
         ELSE false 
       END as in_stock
FROM products p
JOIN megha_stores ms ON p.megha_store_id = ms.id
JOIN store_locations sl ON sl.megha_store_id = ms.id
LEFT JOIN location_inventory li ON li.product_id = p.id AND li.store_location_id = sl.id
WHERE p.is_available = true AND ms.is_active = true AND sl.is_active = true;

-- MOBILE API SCHEMA
CREATE VIEW mobile_api.product_catalog AS 
SELECT p.id, p.name, p.price, p.rating, p.review_count, p.image_url, p.category, 
       p.discount_percentage, p.old_price, p.preparation_time, p.is_featured,
       p.megha_store_id, ms.store_code,
       CASE WHEN p.discount_percentage > 0 THEN true ELSE false END as on_sale,
       CASE WHEN p.is_featured THEN true ELSE false END as featured
FROM products p
JOIN megha_stores ms ON p.megha_store_id = ms.id
WHERE p.is_available = true AND ms.is_active = true
ORDER BY p.is_featured DESC, p.rating DESC, p.review_count DESC;

CREATE VIEW mobile_api.store_locator AS 
SELECT sl.id, sl.location_code, sl.name, sl.address, sl.phone, sl.hours, 
       sl.latitude, sl.longitude, sl.delivery_radius_km, sl.min_order_amount,
       sl.has_parking, sl.has_wifi, sl.has_drive_through, sl.is_flagship,
       sl.capacity, ms.store_name, ms.store_code, ms.store_type,
       COUNT(p.id) as total_products
FROM store_locations sl
JOIN megha_stores ms ON sl.megha_store_id = ms.id
LEFT JOIN products p ON p.megha_store_id = ms.id AND p.is_available = true
WHERE sl.is_active = true AND ms.is_active = true
GROUP BY sl.id, sl.location_code, sl.name, sl.address, sl.phone, sl.hours, 
         sl.latitude, sl.longitude, sl.delivery_radius_km, sl.min_order_amount,
         sl.has_parking, sl.has_wifi, sl.has_drive_through, sl.is_flagship,
         sl.capacity, ms.store_name, ms.store_code, ms.store_type;

-- ADMIN API SCHEMA
CREATE VIEW admin_api.order_management AS 
SELECT o.id, o.order_number, o.megha_store_id, o.user_id, o.total_amount, 
       o.status, o.payment_status, o.order_type, o.created_at, o.updated_at,
       o.delivery_address, o.phone_number, o.estimated_preparation_time,
       ms.store_name, ms.store_code,
       sl.name as fulfillment_location,
       u.email as customer_email,
       dt.status as delivery_status,
       dp.partner_code as delivery_partner
FROM orders o
JOIN megha_stores ms ON o.megha_store_id = ms.id
JOIN auth.users u ON o.user_id = u.id
LEFT JOIN store_locations sl ON o.store_location_id = sl.id
LEFT JOIN delivery_tracking dt ON dt.order_id = o.id
LEFT JOIN delivery_partners dp ON dt.delivery_partner_id = dp.id;

CREATE VIEW admin_api.location_analytics AS 
SELECT sl.id as location_id, sl.location_code, sl.name as location_name,
       ms.store_name, ms.store_code,
       COUNT(DISTINCT o.id) as total_orders,
       COUNT(DISTINCT CASE WHEN o.status = 'delivered' THEN o.id END) as completed_orders,
       COALESCE(SUM(CASE WHEN o.status = 'delivered' THEN o.total_amount END), 0) as total_revenue,
       COALESCE(AVG(CASE WHEN o.status = 'delivered' THEN o.total_amount END), 0) as avg_order_value,
       COUNT(DISTINCT ls.user_id) as staff_count,
       COALESCE(AVG(o.actual_preparation_time), 0) as avg_preparation_time
FROM store_locations sl
JOIN megha_stores ms ON sl.megha_store_id = ms.id
LEFT JOIN orders o ON (o.store_location_id = sl.id OR o.pickup_location_id = sl.id)
LEFT JOIN location_staff ls ON ls.store_location_id = sl.id AND ls.is_active = true
WHERE sl.is_active = true
GROUP BY sl.id, sl.location_code, sl.name, ms.store_name, ms.store_code;

-- STORE API SCHEMA
CREATE VIEW store_api.location_inventory_status AS 
SELECT li.*, p.name as product_name, p.category, p.sku,
       sl.name as location_name, sl.location_code,
       ms.store_name,
       CASE 
         WHEN li.stock_quantity <= li.low_stock_threshold THEN 'low_stock'
         WHEN li.stock_quantity = 0 THEN 'out_of_stock'
         ELSE 'in_stock'
       END as stock_status
FROM location_inventory li
JOIN products p ON li.product_id = p.id
JOIN store_locations sl ON li.store_location_id = sl.id
JOIN megha_stores ms ON sl.megha_store_id = ms.id;

-- ===================================================================
-- FUNCTIONS
-- ===================================================================

-- Function to find nearest store locations
CREATE OR REPLACE FUNCTION public_api.find_nearest_locations(
  p_megha_store_id UUID,
  p_latitude DECIMAL(10,8),
  p_longitude DECIMAL(11,8),
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
  location_id UUID,
  location_code VARCHAR(50),
  location_name VARCHAR(255),
  address TEXT,
  distance_km DECIMAL(10,2),
  delivery_radius_km DECIMAL(5,2),
  can_deliver BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sl.id,
    sl.location_code,
    sl.name,
    sl.address,
    ROUND(
      CAST(
        6371 * acos(
          cos(radians(p_latitude)) * 
          cos(radians(sl.latitude)) * 
          cos(radians(sl.longitude) - radians(p_longitude)) + 
          sin(radians(p_latitude)) * 
          sin(radians(sl.latitude))
        ) AS DECIMAL(10,2)
      ), 2
    ) as distance_km,
    sl.delivery_radius_km,
    CASE 
      WHEN 6371 * acos(
        cos(radians(p_latitude)) * 
        cos(radians(sl.latitude)) * 
        cos(radians(sl.longitude) - radians(p_longitude)) + 
        sin(radians(p_latitude)) * 
        sin(radians(sl.latitude))
      ) <= sl.delivery_radius_km THEN true 
      ELSE false 
    END as can_deliver
  FROM store_locations sl
  WHERE sl.megha_store_id = p_megha_store_id 
    AND sl.is_active = true
  ORDER BY distance_km
  LIMIT p_limit;
END;
$$;

-- Function to add items to cart
CREATE OR REPLACE FUNCTION mobile_api.add_to_cart(
  p_megha_store_id UUID,
  p_product_id UUID,
  p_quantity INTEGER DEFAULT 1,
  p_customizations JSONB DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
  product_price DECIMAL(10,2);
BEGIN
  SELECT price INTO product_price
  FROM products 
  WHERE id = p_product_id AND megha_store_id = p_megha_store_id AND is_available = true;
  
  IF product_price IS NULL THEN
    SELECT json_build_object('success', false, 'message', 'Product not found or unavailable')
    INTO result;
    RETURN result;
  END IF;

  INSERT INTO cart_items (user_id, product_id, megha_store_id, quantity, customizations, unit_price)
  VALUES (auth.uid(), p_product_id, p_megha_store_id, p_quantity, p_customizations, product_price)
  ON CONFLICT (user_id, product_id, megha_store_id) 
  DO UPDATE SET 
    quantity = cart_items.quantity + p_quantity,
    customizations = COALESCE(p_customizations, cart_items.customizations),
    unit_price = product_price,
    updated_at = NOW();
  
  SELECT json_build_object('success', true, 'message', 'Item added to cart')
  INTO result;
  
  RETURN result;
END;
$$;

-- Function to calculate delivery fee
CREATE OR REPLACE FUNCTION calculate_delivery_fee(
  p_store_location_id UUID,
  p_delivery_lat DECIMAL(10,8),
  p_delivery_lng DECIMAL(11,8),
  p_order_amount DECIMAL(10,2)
)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
  base_fee DECIMAL(10,2) := 50.00;
  distance_km DECIMAL(10,2);
  location_lat DECIMAL(10,8);
  location_lng DECIMAL(11,8);
  min_order DECIMAL(10,2);
BEGIN
  SELECT latitude, longitude, min_order_amount 
  INTO location_lat, location_lng, min_order
  FROM store_locations 
  WHERE id = p_store_location_id;
  
  distance_km := 6371 * acos(
    cos(radians(location_lat)) * 
    cos(radians(p_delivery_lat)) * 
    cos(radians(p_delivery_lng) - radians(location_lng)) + 
    sin(radians(location_lat)) * 
    sin(radians(p_delivery_lat))
  );
  
  IF p_order_amount >= min_order THEN
    RETURN 0.00;
  END IF;
  
  IF distance_km <= 5 THEN
    RETURN base_fee;
  ELSIF distance_km <= 10 THEN
    RETURN base_fee + 20.00;
  ELSE
    RETURN base_fee + (distance_km - 10) * 10.00;
  END IF;
END;
$$;

-- Function to calculate tax
CREATE OR REPLACE FUNCTION calculate_tax(
  p_megha_store_id UUID,
  p_subtotal DECIMAL(10,2),
  p_delivery_state VARCHAR(50) DEFAULT 'Telangana'
)
RETURNS DECIMAL(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
  tax_rate DECIMAL(5,2);
  tax_amount DECIMAL(10,2);
BEGIN
  SELECT rate INTO tax_rate
  FROM tax_rates 
  WHERE megha_store_id = p_megha_store_id 
    AND state = p_delivery_state 
    AND is_active = true
  LIMIT 1;
  
  IF tax_rate IS NULL THEN
    tax_rate := 18.00;
  END IF;
  
  tax_amount := (p_subtotal * tax_rate) / 100;
  RETURN ROUND(tax_amount, 2);
END;
$$;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number(store_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  order_num TEXT;
  counter INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
  INTO counter
  FROM orders
  WHERE order_number LIKE UPPER(store_code) || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%'
  AND DATE(created_at) = CURRENT_DATE;
  
  order_num := UPPER(store_code) || '-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 3, '0');
  
  RETURN order_num;
END;
$$;

-- Function to cancel order
CREATE OR REPLACE FUNCTION cancel_order(
  p_order_id UUID,
  p_cancellation_reason TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  order_record orders%ROWTYPE;
  time_diff INTEGER;
  refund_amount DECIMAL(10,2);
  result JSON;
BEGIN
  SELECT * INTO order_record FROM orders WHERE id = p_order_id;
  
  IF order_record.status IN ('delivered', 'cancelled') THEN
    SELECT json_build_object('success', false, 'message', 'Order cannot be cancelled')
    INTO result;
    RETURN result;
  END IF;
  
  time_diff := EXTRACT(EPOCH FROM (NOW() - order_record.created_at)) / 60;
  
  IF time_diff <= 15 OR order_record.status = 'pending' THEN
    refund_amount := order_record.total_amount;
  ELSE
    refund_amount := order_record.total_amount * 0.8;
  END IF;
  
  UPDATE orders SET 
    status = 'cancelled',
    cancelled_reason = p_cancellation_reason,
    refund_amount = refund_amount,
    updated_at = NOW()
  WHERE id = p_order_id;
  
  INSERT INTO order_status_history (order_id, from_status, to_status, changed_by, change_reason)
  VALUES (p_order_id, order_record.status, 'cancelled', auth.uid(), p_cancellation_reason);
  
  SELECT json_build_object('success', true, 'refund_amount', refund_amount)
  INTO result;
  
  RETURN result;
END;
$$;

-- ===================================================================
-- TRIGGERS
-- ===================================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_megha_stores_updated_at BEFORE UPDATE ON megha_stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_locations_updated_at BEFORE UPDATE ON store_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_location_inventory_updated_at BEFORE UPDATE ON location_inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_location_staff_updated_at BEFORE UPDATE ON location_staff
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customer_addresses_updated_at BEFORE UPDATE ON customer_addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_partners_updated_at BEFORE UPDATE ON delivery_partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_delivery_tracking_updated_at BEFORE UPDATE ON delivery_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_refunds_updated_at BEFORE UPDATE ON refunds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON notification_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tax_rates_updated_at BEFORE UPDATE ON tax_rates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cancellation_policies_updated_at BEFORE UPDATE ON cancellation_policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-generate order numbers
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
DECLARE
  store_code_val TEXT;
BEGIN
  IF NEW.order_number IS NULL THEN
    SELECT ms.store_code INTO store_code_val
    FROM megha_stores ms
    WHERE ms.id = NEW.megha_store_id;
    
    NEW.order_number := generate_order_number(store_code_val);
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_order_number_trigger BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Trigger for order status changes
CREATE OR REPLACE FUNCTION order_status_change_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
    
    INSERT INTO notifications (user_id, order_id, megha_store_id, type, title, message)
    VALUES (NEW.user_id, NEW.id, NEW.megha_store_id, 
           NEW.status, 
           'Order Status Update',
           'Your order #' || NEW.order_number || ' status has been updated to ' || NEW.status);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER order_status_change_trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION order_status_change_trigger();

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================

-- Core table indexes
CREATE INDEX IF NOT EXISTS idx_megha_stores_code ON megha_stores(store_code);
CREATE INDEX IF NOT EXISTS idx_megha_stores_active ON megha_stores(is_active);

CREATE INDEX IF NOT EXISTS idx_store_locations_megha_store ON store_locations(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_store_locations_coordinates ON store_locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_store_locations_code ON store_locations(megha_store_id, location_code);
CREATE INDEX IF NOT EXISTS idx_store_locations_active ON store_locations(is_active);

CREATE INDEX IF NOT EXISTS idx_products_megha_store_id ON products(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_products_category_store ON products(megha_store_id, category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(megha_store_id, sku);

CREATE INDEX IF NOT EXISTS idx_location_inventory_location ON location_inventory(store_location_id);
CREATE INDEX IF NOT EXISTS idx_location_inventory_product ON location_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_location_inventory_stock ON location_inventory(stock_quantity);

CREATE INDEX IF NOT EXISTS idx_location_staff_location ON location_staff(store_location_id);
CREATE INDEX IF NOT EXISTS idx_location_staff_user ON location_staff(user_id);
CREATE INDEX IF NOT EXISTS idx_location_staff_active ON location_staff(is_active);

CREATE INDEX IF NOT EXISTS idx_customer_addresses_user ON customer_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_default ON customer_addresses(user_id, is_default);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_store ON cart_items(user_id, megha_store_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items(product_id);

CREATE INDEX IF NOT EXISTS idx_orders_megha_store ON orders(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_store_location ON orders(store_location_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_store ON user_roles(user_id, megha_store_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_store ON reviews(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_promotions_store ON promotions(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_promotions_code ON promotions(megha_store_id, promo_code);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_delivery_partners_store ON delivery_partners(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_delivery_partners_available ON delivery_partners(is_available);
CREATE INDEX IF NOT EXISTS idx_delivery_partners_location ON delivery_partners(current_location_lat, current_location_lng);

CREATE INDEX IF NOT EXISTS idx_delivery_tracking_order ON delivery_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_partner ON delivery_tracking(delivery_partner_id);
CREATE INDEX IF NOT EXISTS idx_delivery_tracking_status ON delivery_tracking(status);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_gateway ON payment_transactions(payment_gateway);

CREATE INDEX IF NOT EXISTS idx_refunds_order ON refunds(order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_order ON notifications(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

CREATE INDEX IF NOT EXISTS idx_notification_templates_store ON notification_templates(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_notification_templates_type ON notification_templates(template_type);

CREATE INDEX IF NOT EXISTS idx_tax_rates_store ON tax_rates(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_tax_rates_state ON tax_rates(state);
CREATE INDEX IF NOT EXISTS idx_tax_rates_active ON tax_rates(is_active);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created ON order_status_history(created_at);

-- ===================================================================
-- SCHEMA COMPLETION MESSAGE
-- ===================================================================

DO $$
BEGIN
  RAISE NOTICE '====================================================';
  RAISE NOTICE 'TEKMEGHA MULTI-STORE DATABASE SCHEMA COMPLETED';
  RAISE NOTICE '====================================================';
  RAISE NOTICE 'Complete Features Included:';
  RAISE NOTICE '- Multi-store architecture with store isolation';
  RAISE NOTICE '- Multi-location support with inventory management';
  RAISE NOTICE '- Complete order management with status tracking';
  RAISE NOTICE '- Delivery partner and tracking system';
  RAISE NOTICE '- Payment processing and refund management';
  RAISE NOTICE '- Customer notification system';
  RAISE NOTICE '- Tax calculation and cancellation policies';
  RAISE NOTICE '- Reviews and promotions system';
  RAISE NOTICE '- API schemas for different client types';
  RAISE NOTICE '- Comprehensive RLS security policies';
  RAISE NOTICE '- Performance-optimized indexes';
  RAISE NOTICE '- Automated triggers and functions';
  RAISE NOTICE '====================================================';
  RAISE NOTICE 'Ready for production deployment!';
  RAISE NOTICE '====================================================';
END $$;
