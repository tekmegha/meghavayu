-- ============================================
-- PET CARE SERVICES DATABASE SCHEMA
-- For Paws Nexus and other pet care stores
-- ============================================

-- Create pet_care_services table
CREATE TABLE IF NOT EXISTS pet_care_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  service_code VARCHAR(50) NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  service_description TEXT,
  service_type VARCHAR(100) NOT NULL, -- 'medical', 'grooming', 'boarding', 'training', 'emergency'
  category VARCHAR(100) NOT NULL, -- 'dogs', 'cats', 'birds', 'fish', 'all_pets'
  subcategory VARCHAR(100), -- 'vaccination', 'deworming', 'surgery', 'consultation', etc.
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
  specialization VARCHAR(255) NOT NULL, -- 'veterinary', 'pet_grooming', 'pet_training', 'emergency_care'
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
  available_days JSONB, -- {"monday": true, "tuesday": true, ...}
  available_hours JSONB, -- {"start": "09:00", "end": "18:00"}
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

-- Create pet_stores table (for partner stores)
CREATE TABLE IF NOT EXISTS pet_stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  store_code VARCHAR(50) NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  store_type VARCHAR(100) NOT NULL, -- 'pet_supplies', 'pet_food', 'pet_toys', 'pet_medicine', 'all'
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

-- Create doctor_services table (many-to-many relationship)
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
  pet_type VARCHAR(100) NOT NULL, -- 'dog', 'cat', 'bird', 'fish', etc.
  pet_breed VARCHAR(255),
  pet_age_months INTEGER,
  pet_weight_kg DECIMAL(5,2),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  appointment_type VARCHAR(50) NOT NULL, -- 'clinic', 'home_visit', 'emergency'
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
  service_type VARCHAR(100) NOT NULL, -- 'emergency_vet', 'ambulance', 'poison_control', 'rescue'
  is_24_hours BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pet_care_services_store ON pet_care_services(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_pet_care_services_type ON pet_care_services(service_type);
CREATE INDEX IF NOT EXISTS idx_pet_care_services_category ON pet_care_services(category);
CREATE INDEX IF NOT EXISTS idx_pet_care_services_active ON pet_care_services(is_active);

CREATE INDEX IF NOT EXISTS idx_freelance_doctors_store ON freelance_doctors(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_freelance_doctors_specialization ON freelance_doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_freelance_doctors_active ON freelance_doctors(is_active);
CREATE INDEX IF NOT EXISTS idx_freelance_doctors_emergency ON freelance_doctors(is_available_for_emergency);

CREATE INDEX IF NOT EXISTS idx_pet_stores_store ON pet_stores(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_pet_stores_type ON pet_stores(store_type);
CREATE INDEX IF NOT EXISTS idx_pet_stores_active ON pet_stores(is_active);

CREATE INDEX IF NOT EXISTS idx_pet_appointments_store ON pet_appointments(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_pet_appointments_user ON pet_appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_pet_appointments_doctor ON pet_appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_pet_appointments_date ON pet_appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_pet_appointments_status ON pet_appointments(status);

-- Create functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_pet_care_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_freelance_doctors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_pet_stores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_pet_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS update_pet_care_services_updated_at_trigger ON pet_care_services;
CREATE TRIGGER update_pet_care_services_updated_at_trigger
    BEFORE UPDATE ON pet_care_services
    FOR EACH ROW
    EXECUTE FUNCTION update_pet_care_services_updated_at();

DROP TRIGGER IF EXISTS update_freelance_doctors_updated_at_trigger ON freelance_doctors;
CREATE TRIGGER update_freelance_doctors_updated_at_trigger
    BEFORE UPDATE ON freelance_doctors
    FOR EACH ROW
    EXECUTE FUNCTION update_freelance_doctors_updated_at();

DROP TRIGGER IF EXISTS update_pet_stores_updated_at_trigger ON pet_stores;
CREATE TRIGGER update_pet_stores_updated_at_trigger
    BEFORE UPDATE ON pet_stores
    FOR EACH ROW
    EXECUTE FUNCTION update_pet_stores_updated_at();

DROP TRIGGER IF EXISTS update_pet_appointments_updated_at_trigger ON pet_appointments;
CREATE TRIGGER update_pet_appointments_updated_at_trigger
    BEFORE UPDATE ON pet_appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_pet_appointments_updated_at();

-- Add comments for documentation
COMMENT ON TABLE pet_care_services IS 'Services offered by pet care stores like vaccinations, grooming, etc.';
COMMENT ON TABLE freelance_doctors IS 'Freelance veterinarians and pet care professionals';
COMMENT ON TABLE pet_stores IS 'Partner pet stores for supplies and products';
COMMENT ON TABLE doctor_services IS 'Many-to-many relationship between doctors and services they offer';
COMMENT ON TABLE pet_appointments IS 'Pet care appointments and consultations';
COMMENT ON TABLE pet_emergency_contacts IS 'Emergency contacts for pet care services';

-- Insert sample data for Paws Nexus
INSERT INTO pet_care_services (megha_store_id, service_code, service_name, service_description, service_type, category, subcategory, price, duration_minutes, is_emergency_service, requires_appointment, is_home_visit_available, home_visit_charge, sort_order) VALUES
-- Get the store ID for paws-nexus (we'll insert the store first)
((SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'), 'house_visits', 'House Visits', 'Professional pet care services at your home', 'medical', 'dogs', 'consultation', 500.00, 60, false, true, true, 0.00, 1),
((SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'), 'vaccinations', 'Vaccinations', 'Complete vaccination services for pets', 'medical', 'dogs', 'vaccination', 300.00, 30, false, true, true, 0.00, 2),
((SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'), 'deworming', 'Deworming', 'Deworming treatment for pets', 'medical', 'dogs', 'treatment', 200.00, 20, false, true, true, 0.00, 3),
((SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'), 'walk_in_consultations', 'Walk In Consultations', 'Immediate consultation without appointment', 'medical', 'dogs', 'consultation', 400.00, 45, false, false, false, 0.00, 4),
((SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'), 'blood_sampling', 'Blood Sampling', 'Blood tests and sampling for pets', 'medical', 'dogs', 'diagnostic', 350.00, 30, false, true, true, 0.00, 5),
((SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'), 'critical_care_services', 'Critical Care Services', 'Emergency and critical care for pets', 'medical', 'dogs', 'emergency', 1000.00, 120, true, false, true, 0.00, 6);

-- Insert sample emergency contacts
INSERT INTO pet_emergency_contacts (megha_store_id, contact_name, phone, email, service_type, is_24_hours, is_active) VALUES
((SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'), 'Emergency Vet Line', '8550046444', 'emergency@paws-nexus.com', 'emergency_vet', true, true),
((SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'), 'Pet Ambulance', '8550046445', 'ambulance@paws-nexus.com', 'ambulance', true, true),
((SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'), 'Poison Control', '8550046446', 'poison@paws-nexus.com', 'poison_control', true, true);
