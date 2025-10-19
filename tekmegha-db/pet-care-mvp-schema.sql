-- ============================================
-- PET CARE MVP SCHEMA
-- Core tables for staff, inventory, appointments
-- ============================================

-- Staff Management Tables
CREATE TABLE IF NOT EXISTS staff_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  staff_code VARCHAR(50) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL, -- 'doctor', 'groomer', 'trainer', 'receptionist', 'nurse', 'technician'
  specialization VARCHAR(255),
  qualifications TEXT,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  hire_date DATE NOT NULL,
  salary DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_store_staff_code UNIQUE (megha_store_id, staff_code)
);

CREATE TABLE IF NOT EXISTS staff_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID REFERENCES staff_members(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_staff_day_schedule UNIQUE (staff_id, day_of_week)
);

-- Inventory Management Tables
CREATE TABLE IF NOT EXISTS pet_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  item_code VARCHAR(50) NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'medicine', 'supplies', 'equipment', 'food', 'grooming', 'safety'
  subcategory VARCHAR(100),
  description TEXT,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity_in_stock INTEGER DEFAULT 0,
  minimum_stock_level INTEGER DEFAULT 0,
  supplier VARCHAR(255),
  expiry_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_store_item_code UNIQUE (megha_store_id, item_code)
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_id UUID REFERENCES pet_inventory(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'sale', 'adjustment', 'expiry', 'damage', 'return'
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2),
  total_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Appointment Management
CREATE TABLE IF NOT EXISTS appointment_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  megha_store_id UUID REFERENCES megha_stores(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES freelance_doctors(id),
  slot_date DATE NOT NULL,
  slot_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  is_available BOOLEAN DEFAULT true,
  is_booked BOOLEAN DEFAULT false,
  appointment_id UUID REFERENCES pet_appointments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns to existing pet_appointments table
ALTER TABLE pet_appointments ADD COLUMN IF NOT EXISTS appointment_duration INTEGER DEFAULT 30;
ALTER TABLE pet_appointments ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false;
ALTER TABLE pet_appointments ADD COLUMN IF NOT EXISTS follow_up_required BOOLEAN DEFAULT false;
ALTER TABLE pet_appointments ADD COLUMN IF NOT EXISTS follow_up_date DATE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_staff_members_store ON staff_members(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_staff_members_role ON staff_members(role);
CREATE INDEX IF NOT EXISTS idx_staff_members_active ON staff_members(is_active);

CREATE INDEX IF NOT EXISTS idx_staff_schedules_staff ON staff_schedules(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_schedules_day ON staff_schedules(day_of_week);

CREATE INDEX IF NOT EXISTS idx_pet_inventory_store ON pet_inventory(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_pet_inventory_category ON pet_inventory(category);
CREATE INDEX IF NOT EXISTS idx_pet_inventory_active ON pet_inventory(is_active);
CREATE INDEX IF NOT EXISTS idx_pet_inventory_stock ON pet_inventory(quantity_in_stock);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_item ON inventory_transactions(inventory_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_type ON inventory_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_date ON inventory_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_appointment_slots_store ON appointment_slots(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_appointment_slots_doctor ON appointment_slots(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointment_slots_date ON appointment_slots(slot_date);
CREATE INDEX IF NOT EXISTS idx_appointment_slots_available ON appointment_slots(is_available);

-- Create functions for auto-updating timestamps
CREATE OR REPLACE FUNCTION update_staff_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_pet_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for auto-updating timestamps
DROP TRIGGER IF EXISTS update_staff_members_updated_at_trigger ON staff_members;
CREATE TRIGGER update_staff_members_updated_at_trigger
    BEFORE UPDATE ON staff_members
    FOR EACH ROW
    EXECUTE FUNCTION update_staff_members_updated_at();

DROP TRIGGER IF EXISTS update_pet_inventory_updated_at_trigger ON pet_inventory;
CREATE TRIGGER update_pet_inventory_updated_at_trigger
    BEFORE UPDATE ON pet_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_pet_inventory_updated_at();

-- Add comments for documentation
COMMENT ON TABLE staff_members IS 'Staff members working at pet care stores';
COMMENT ON TABLE staff_schedules IS 'Weekly schedules for staff members';
COMMENT ON TABLE pet_inventory IS 'Inventory items for pet care stores';
COMMENT ON TABLE inventory_transactions IS 'Transaction history for inventory items';
COMMENT ON TABLE appointment_slots IS 'Available appointment time slots';

-- Insert sample data for testing
INSERT INTO staff_members (
  megha_store_id,
  staff_code,
  full_name,
  role,
  specialization,
  qualifications,
  phone,
  email,
  hire_date,
  salary,
  is_active
) VALUES (
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'DR001',
  'Dr. Sarah Johnson',
  'doctor',
  'Small Animal Medicine',
  'BVSc, MVSc in Veterinary Medicine',
  '8550046444',
  'sarah.johnson@paws-nexus.com',
  '2023-01-15',
  50000.00,
  true
),
(
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'GRM001',
  'Lisa Wilson',
  'groomer',
  'Dog Grooming',
  'Certified Pet Groomer',
  '8550046445',
  'lisa.wilson@paws-nexus.com',
  '2023-02-01',
  25000.00,
  true
);

-- Insert sample inventory items
INSERT INTO pet_inventory (
  megha_store_id,
  item_code,
  item_name,
  category,
  subcategory,
  description,
  unit_price,
  quantity_in_stock,
  minimum_stock_level,
  supplier,
  expiry_date,
  is_active
) VALUES (
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'MED001',
  'Antibiotic Tablets',
  'medicine',
  'Antibiotics',
  'Broad spectrum antibiotic for bacterial infections',
  150.00,
  50,
  10,
  'VetMed Supplies',
  '2025-12-31',
  true
),
(
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'SUP001',
  'Syringes 5ml',
  'supplies',
  'Medical Supplies',
  'Disposable syringes for injections',
  5.00,
  100,
  20,
  'MedSupply Co.',
  '2026-06-30',
  true
),
(
  (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus'),
  'EQP001',
  'Stethoscope',
  'equipment',
  'Diagnostic Equipment',
  'Professional veterinary stethoscope',
  2500.00,
  2,
  1,
  'MedEquip Ltd.',
  NULL,
  true
);

-- Insert sample inventory transactions
INSERT INTO inventory_transactions (
  inventory_id,
  transaction_type,
  quantity,
  unit_price,
  total_amount,
  notes
) VALUES (
  (SELECT id FROM pet_inventory WHERE item_code = 'MED001' AND megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus')),
  'purchase',
  100,
  120.00,
  12000.00,
  'Initial stock purchase'
),
(
  (SELECT id FROM pet_inventory WHERE item_code = 'SUP001' AND megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus')),
  'purchase',
  200,
  4.50,
  900.00,
  'Bulk purchase of syringes'
);

-- Verify the setup
SELECT 
  'Staff Members' as table_name,
  COUNT(*) as record_count
FROM staff_members
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus')

UNION ALL

SELECT 
  'Pet Inventory' as table_name,
  COUNT(*) as record_count
FROM pet_inventory
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus')

UNION ALL

SELECT 
  'Inventory Transactions' as table_name,
  COUNT(*) as record_count
FROM inventory_transactions
WHERE inventory_id IN (
  SELECT id FROM pet_inventory 
  WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus')
);
