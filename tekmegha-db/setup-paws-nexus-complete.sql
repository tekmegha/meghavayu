-- ============================================
-- COMPLETE PAWS NEXUS SETUP SCRIPT
-- Run this script to set up the entire Paws Nexus pet care store
-- ============================================

-- Step 1: Create pet care schema tables
\i pet-care-schema.sql

-- Step 2: Insert Paws Nexus store
\i insert-paws-nexus-store.sql

-- Step 3: Verify the setup
SELECT 
  'Setup Complete' as status,
  s.store_code,
  s.store_name,
  s.store_type,
  s.support_phone,
  s.is_active,
  l.name as location_name,
  l.phone as location_phone,
  (SELECT COUNT(*) FROM pet_care_services WHERE megha_store_id = s.id) as services_count,
  (SELECT COUNT(*) FROM freelance_doctors WHERE megha_store_id = s.id) as doctors_count,
  (SELECT COUNT(*) FROM pet_stores WHERE megha_store_id = s.id) as partner_stores_count
FROM megha_stores s
LEFT JOIN store_locations l ON s.id = l.megha_store_id
WHERE s.store_code = 'paws-nexus';

-- Step 4: Show all services
SELECT 
  'Services Available' as info,
  service_code,
  service_name,
  service_type,
  category,
  price,
  is_home_visit_available,
  is_emergency_service
FROM pet_care_services 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus')
ORDER BY sort_order;

-- Step 5: Show all doctors
SELECT 
  'Doctors Available' as info,
  doctor_code,
  full_name,
  specialization,
  experience_years,
  consultation_fee,
  is_available_for_home_visits,
  is_available_for_emergency
FROM freelance_doctors 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus')
ORDER BY experience_years DESC;

-- Step 6: Show partner stores
SELECT 
  'Partner Stores' as info,
  store_code,
  store_name,
  store_type,
  contact_person,
  phone,
  is_partner
FROM pet_stores 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'paws-nexus')
ORDER BY store_name;
