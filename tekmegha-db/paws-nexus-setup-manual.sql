-- ============================================
-- PAWS NEXUS MANUAL SETUP
-- Run this script step by step or all at once
-- ============================================

-- Step 1: Create pet care tables (if they don't exist)

-- Create pet_care_services table
CREATE TABLE IF NOT EXISTS pet_care_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  service_code VARCHAR(50) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_description TEXT,
  service_type VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  is_emergency_service BOOLEAN DEFAULT false,
  requires_appointment BOOLEAN DEFAULT true,
  is_home_visit_available BOOLEAN DEFAULT false,
  home_visit_charge DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_store_service_code UNIQUE (megha_store_id, service_code)
);

-- Create freelance_doctors table
CREATE TABLE IF NOT EXISTS freelance_doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  doctor_code VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  qualifications TEXT,
  experience_years INTEGER DEFAULT 0,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  consultation_fee DECIMAL(10,2) DEFAULT 0.00,
  home_visit_fee DECIMAL(10,2) DEFAULT 0.00,
  emergency_fee DECIMAL(10,2) DEFAULT 0.00,
  available_days JSONB,
  available_hours JSONB,
  is_available_for_home_visits BOOLEAN DEFAULT false,
  is_available_for_emergency BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_store_doctor_code UNIQUE (megha_store_id, doctor_code)
);

-- Create pet_stores table
CREATE TABLE IF NOT EXISTS pet_stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  store_code VARCHAR(50) NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  store_type VARCHAR(100) NOT NULL,
  contact_person VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  business_hours JSONB,
  delivery_radius_km DECIMAL(5,2) DEFAULT 5.0,
  min_order_amount DECIMAL(10,2) DEFAULT 0.00,
  is_partner BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_store_partner_code UNIQUE (megha_store_id, store_code)
);

-- Create doctor_services table
CREATE TABLE IF NOT EXISTS doctor_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID REFERENCES freelance_doctors(id) ON DELETE CASCADE,
  service_id UUID REFERENCES pet_care_services(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_doctor_service UNIQUE (doctor_id, service_id)
);

-- Create pet_appointments table
CREATE TABLE IF NOT EXISTS pet_appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  appointment_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  doctor_id UUID REFERENCES freelance_doctors(id),
  service_id UUID REFERENCES pet_care_services(id),
  pet_name VARCHAR(255) NOT NULL,
  pet_type VARCHAR(100) NOT NULL,
  pet_breed VARCHAR(255),
  pet_age_months INTEGER,
  pet_weight_kg DECIMAL(5,2),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_type VARCHAR(50) NOT NULL,
  address TEXT,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  symptoms TEXT,
  previous_medical_history TEXT,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pet_emergency_contacts table
CREATE TABLE IF NOT EXISTS pet_emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  contact_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  service_type VARCHAR(100) NOT NULL,
  is_24_hours BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert Paws Nexus store
INSERT INTO megha_stores (
  store_code,
  store_name,
  store_type,
  domain,
  theme_config,
  business_hours,
  contact_email,
  support_phone,
  is_active,
  enable_products,
  enable_cart,
  enable_payments,
  enable_inventory,
  enable_invoices,
  enable_customers,
  enable_reports,
  is_prod_ready
) VALUES (
  'paws-nexus',
  'Paws Nexus',
  'petcare',
  'paws-nexus.com',
  '{
    "primaryColor": "#0891b2",
    "secondaryColor": "#06b6d4", 
    "accentColor": "#14b8a6",
    "warningColor": "#f59e0b",
    "dangerColor": "#dc2626",
    "backgroundColor": "#f0fdfa",
    "surfaceColor": "#ffffff",
    "textPrimary": "#1f2937",
    "textSecondary": "#6b7280",
    "fontFamily": "Inter, sans-serif",
    "logo": "assets/images/paws-nexus/logo.png",
    "layout": "layout-pet-care"
  }',
  '{
    "monday": {"open": "09:00", "close": "18:00"},
    "tuesday": {"open": "09:00", "close": "18:00"},
    "wednesday": {"open": "09:00", "close": "18:00"},
    "thursday": {"open": "09:00", "close": "18:00"},
    "friday": {"open": "09:00", "close": "18:00"},
    "saturday": {"open": "09:00", "close": "14:00"},
    "sunday": {"open": "10:00", "close": "16:00"}
  }',
  'info@paws-nexus.com',
  '8550046444',
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true
);

-- Step 3: Insert store location
INSERT INTO store_locations (
  megha_store_id,
  location_code,
  name,
  address,
  phone,
  hours,
  latitude,
  longitude,
  is_flagship,
  delivery_radius_km,
  min_order_amount,
  has_parking,
  has_wifi,
  has_drive_through,
  capacity,
  manager_contact,
  is_active
) VALUES (
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'main',
  'Paws Nexus Main Clinic',
  '123 Pet Care Street, Veterinary District, Mumbai - 400001',
  '8550046444',
  'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 2:00 PM, Sun: 10:00 AM - 4:00 PM',
  19.0760,
  72.8777,
  true,
  15.0,
  0.00,
  true,
  true,
  false,
  50,
  'Dr. Sarah Johnson',
  true
);

-- Step 4: Insert categories
INSERT INTO categories (
  name,
  description,
  slug,
  megha_store_id,
  parent_id,
  sort_order,
  is_active,
  image_url
) VALUES 
(
  'Pet Care Services',
  'Professional pet care and medical services',
  'pet-care-services',
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  NULL,
  1,
  true,
  'assets/images/paws-nexus/categories/pet-care.jpg'
),
(
  'Dogs',
  'Services specifically for dogs',
  'dogs',
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  (SELECT id FROM categories WHERE slug = 'pet-care-services' AND megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus')),
  1,
  true,
  'assets/images/paws-nexus/categories/dogs.jpg'
),
(
  'Cats',
  'Services specifically for cats',
  'cats',
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  (SELECT id FROM categories WHERE slug = 'pet-care-services' AND megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus')),
  2,
  true,
  'assets/images/paws-nexus/categories/cats.jpg'
),
(
  'Emergency Care',
  '24/7 emergency pet care services',
  'emergency-care',
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  (SELECT id FROM categories WHERE slug = 'pet-care-services' AND megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus')),
  3,
  true,
  'assets/images/paws-nexus/categories/emergency.jpg'
);

-- Step 5: Insert freelance doctors
INSERT INTO freelance_doctors (
  megha_store_id,
  doctor_code,
  full_name,
  specialization,
  qualifications,
  experience_years,
  phone,
  email,
  address,
  city,
  state,
  pincode,
  consultation_fee,
  home_visit_fee,
  emergency_fee,
  available_days,
  available_hours,
  is_available_for_home_visits,
  is_available_for_emergency,
  rating,
  review_count,
  is_verified,
  is_active
) VALUES (
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'DR001',
  'Dr. Sarah Johnson',
  'veterinary',
  'BVSc, MVSc in Veterinary Medicine, 8 years experience',
  8,
  '8550046444',
  'sarah.johnson@paws-nexus.com',
  '123 Pet Care Street, Veterinary District',
  'Mumbai',
  'Maharashtra',
  '400001',
  500.00,
  200.00,
  1000.00,
  '{"monday": true, "tuesday": true, "wednesday": true, "thursday": true, "friday": true, "saturday": true, "sunday": true}',
  '{"start": "09:00", "end": "18:00"}',
  true,
  true,
  4.8,
  150,
  true,
  true
),
(
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'DR002',
  'Dr. Michael Chen',
  'veterinary',
  'DVM, PhD in Animal Health, 12 years experience',
  12,
  '8550046445',
  'michael.chen@paws-nexus.com',
  '456 Animal Hospital Road',
  'Mumbai',
  'Maharashtra',
  '400002',
  600.00,
  250.00,
  1200.00,
  '{"monday": true, "tuesday": true, "wednesday": true, "thursday": true, "friday": true, "saturday": false, "sunday": false}',
  '{"start": "08:00", "end": "17:00"}',
  true,
  true,
  4.9,
  200,
  true,
  true
);

-- Step 6: Insert pet stores (partners)
INSERT INTO pet_stores (
  megha_store_id,
  store_code,
  store_name,
  store_type,
  contact_person,
  phone,
  email,
  address,
  city,
  state,
  pincode,
  latitude,
  longitude,
  business_hours,
  delivery_radius_km,
  min_order_amount,
  is_partner,
  is_active
) VALUES (
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'PETSUPPLIES001',
  'Pet Paradise Supplies',
  'pet_supplies',
  'John Smith',
  '8550046500',
  'info@petparadise.com',
  '789 Pet Supplies Lane, Mumbai',
  'Mumbai',
  'Maharashtra',
  '400003',
  19.0760,
  72.8777,
  '{"monday": {"open": "09:00", "close": "19:00"}, "tuesday": {"open": "09:00", "close": "19:00"}, "wednesday": {"open": "09:00", "close": "19:00"}, "thursday": {"open": "09:00", "close": "19:00"}, "friday": {"open": "09:00", "close": "19:00"}, "saturday": {"open": "09:00", "close": "18:00"}, "sunday": {"open": "10:00", "close": "17:00"}}',
  10.0,
  500.00,
  true,
  true
),
(
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'PETMEDICINE001',
  'VetMed Pharmacy',
  'pet_medicine',
  'Dr. Lisa Wilson',
  '8550046501',
  'pharmacy@vetmed.com',
  '321 Medicine Street, Mumbai',
  'Mumbai',
  'Maharashtra',
  '400004',
  19.0760,
  72.8777,
  '{"monday": {"open": "08:00", "close": "20:00"}, "tuesday": {"open": "08:00", "close": "20:00"}, "wednesday": {"open": "08:00", "close": "20:00"}, "thursday": {"open": "08:00", "close": "20:00"}, "friday": {"open": "08:00", "close": "20:00"}, "saturday": {"open": "08:00", "close": "18:00"}, "sunday": {"open": "09:00", "close": "17:00"}}',
  15.0,
  200.00,
  true,
  true
);

-- Step 7: Verify setup
SELECT 
  s.store_code,
  s.store_name,
  s.store_type,
  s.support_phone,
  s.is_active,
  l.name as location_name
FROM megha_stores s
LEFT JOIN store_locations l ON s.id = l.megha_store_id
WHERE s.store_code = 'paws-nexus';
