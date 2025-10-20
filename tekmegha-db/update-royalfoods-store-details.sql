-- ============================================
-- Update Royal Foods Store Details
-- ============================================

-- Update Royal Foods store with new contact information and address
UPDATE megha_stores 
SET 
  support_phone = '8500961396',
  contact_email = 'royalfood530012@gmail.com',
  address = 'Sheelanagar',
  city = 'Visakhapatnam',
  state = 'Andhra Pradesh',
  postal_code = '530012',
  updated_at = NOW()
WHERE id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';

-- Verify the update
SELECT 
  store_code,
  store_name,
  support_phone,
  contact_email,
  address,
  city,
  state,
  postal_code,
  updated_at
FROM megha_stores 
WHERE id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';

-- ============================================
-- Additional Royal Foods Store Information
-- ============================================

-- Check if Royal Foods store exists and get current details
SELECT 
  id,
  store_code,
  store_name,
  store_type,
  support_phone,
  contact_email,
  address,
  city,
  state,
  postal_code,
  country,
  is_active,
  created_at,
  updated_at
FROM megha_stores 
WHERE store_code = 'royalfoods' OR id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';

-- Update business hours if needed (example)
-- UPDATE megha_stores 
-- SET business_hours = '{
--   "monday": {"open": "09:00", "close": "21:00"},
--   "tuesday": {"open": "09:00", "close": "21:00"},
--   "wednesday": {"open": "09:00", "close": "21:00"},
--   "thursday": {"open": "09:00", "close": "21:00"},
--   "friday": {"open": "09:00", "close": "21:00"},
--   "saturday": {"open": "09:00", "close": "21:00"},
--   "sunday": {"open": "10:00", "close": "20:00"}
-- }'::jsonb
-- WHERE id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';

-- Update social links if needed (example)
-- UPDATE megha_stores 
-- SET social_links = '{
--   "facebook": "https://facebook.com/royalfoods",
--   "instagram": "https://instagram.com/royalfoods",
--   "whatsapp": "https://wa.me/918500961396"
-- }'::jsonb
-- WHERE id = '26d71c6f-eac6-4696-bb75-a3a80a9e2e65';

-- ============================================
-- Query Examples for Royal Foods Store
-- ============================================

-- Get complete store information
-- SELECT 
--   store_code,
--   store_name,
--   store_type,
--   support_phone,
--   contact_email,
--   address,
--   city,
--   state,
--   postal_code,
--   country,
--   business_hours,
--   social_links,
--   is_active,
--   created_at,
--   updated_at
-- FROM megha_stores 
-- WHERE store_code = 'royalfoods';

-- Get store contact information only
-- SELECT 
--   store_name,
--   support_phone,
--   contact_email,
--   address,
--   city,
--   state
-- FROM megha_stores 
-- WHERE store_code = 'royalfoods';

-- Check if store is active and ready for production
-- SELECT 
--   store_code,
--   store_name,
--   is_active,
--   is_verified,
--   is_prod_ready,
--   support_phone,
--   contact_email
-- FROM megha_stores 
-- WHERE store_code = 'royalfoods';
