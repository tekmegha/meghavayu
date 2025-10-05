-- Test script to verify CCTV Device product insertion
-- This is a simplified version to test the JSON casting

-- First, get the store ID for CCTV Device
WITH cctv_store AS (
  SELECT id FROM megha_stores WHERE store_code = 'cctv-device' LIMIT 1
)

-- Insert a single test product
INSERT INTO products (
  megha_store_id,
  sku,
  name,
  price,
  rating,
  review_count,
  serves,
  description,
  image_url,
  gallery_images,
  customisable,
  customization_options,
  category,
  tags,
  discount_percentage,
  old_price,
  nutritional_info,
  allergen_info,
  preparation_time,
  is_available,
  is_featured,
  sort_order,
  created_at,
  updated_at
)
SELECT 
  cctv_store.id,
  'TEST-001',
  'Test CCTV Camera',
  9999.00,
  4.5,
  100,
  1,
  'Test product for CCTV Device',
  'assets/images/cctv-device/test-camera.jpg',
  '["assets/images/cctv-device/test-1.jpg", "assets/images/cctv-device/test-2.jpg"]'::jsonb,
  true,
  '{"resolution": ["1080p", "4K"], "color": ["Black", "White"]}'::jsonb,
  'CCTV Cameras',
  '["test", "cctv", "camera"]'::jsonb,
  10,
  11111.00,
  NULL,
  NULL,
  NULL,
  true,
  true,
  1,
  NOW(),
  NOW()
FROM cctv_store;

-- Verify the insertion
SELECT 
  p.id,
  p.sku,
  p.name,
  p.price,
  p.gallery_images,
  p.customization_options,
  p.tags
FROM products p
WHERE p.megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'cctv-device')
AND p.sku = 'TEST-001';
