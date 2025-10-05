-- Insert categories for CCTV Device (Digital Security)
-- First, get the store ID for CCTV Device
WITH cctv_store AS (
  SELECT id FROM megha_stores WHERE store_code = 'cctv-device' LIMIT 1
)

-- Insert main categories
INSERT INTO categories (
  megha_store_id,
  name,
  description,
  slug,
  parent_id,
  sort_order,
  is_active,
  image_url,
  created_at,
  updated_at
)
SELECT 
  cctv_store.id,
  category_name,
  category_description,
  category_slug,
  NULL, -- Main categories have no parent
  sort_order,
  true,
  image_url,
  NOW(),
  NOW()
FROM cctv_store,
(VALUES
  ('CCTV Cameras', 'Surveillance cameras for indoor and outdoor use', 'cctv-cameras', 1, 'assets/images/cctv-device/cameras.jpg'),
  ('Security Systems', 'Complete security system solutions', 'security-systems', 2, 'assets/images/cctv-device/security-systems.jpg'),
  ('Access Control', 'Door access and biometric systems', 'access-control', 3, 'assets/images/cctv-device/access-control.jpg'),
  ('Alarm Systems', 'Intrusion detection and alarm systems', 'alarm-systems', 4, 'assets/images/cctv-device/alarm-systems.jpg'),
  ('Network Security', 'Network infrastructure and security solutions', 'network-security', 5, 'assets/images/cctv-device/network-security.jpg'),
  ('Fire Safety', 'Fire detection and suppression systems', 'fire-safety', 6, 'assets/images/cctv-device/fire-safety.jpg'),
  ('Smart Security', 'AI-powered and IoT security solutions', 'smart-security', 7, 'assets/images/cctv-device/smart-security.jpg'),
  ('Monitoring', '24/7 monitoring and surveillance services', 'monitoring', 8, 'assets/images/cctv-device/monitoring.jpg'),
  ('Installation', 'Professional installation and setup services', 'installation', 9, 'assets/images/cctv-device/installation.jpg'),
  ('Maintenance', 'System maintenance and support services', 'maintenance', 10, 'assets/images/cctv-device/maintenance.jpg')
) AS categories(category_name, category_description, category_slug, sort_order, image_url);

-- Insert subcategories for CCTV Cameras
WITH cctv_store AS (
  SELECT id FROM megha_stores WHERE store_code = 'cctv-device' LIMIT 1
),
camera_category AS (
  SELECT id FROM categories WHERE megha_store_id = (SELECT id FROM cctv_store) AND slug = 'cctv-cameras' LIMIT 1
)

INSERT INTO categories (
  megha_store_id,
  name,
  description,
  slug,
  parent_id,
  sort_order,
  is_active,
  image_url,
  created_at,
  updated_at
)
SELECT 
  cctv_store.id,
  subcategory_name,
  subcategory_description,
  subcategory_slug,
  camera_category.id,
  sort_order,
  true,
  NULL,
  NOW(),
  NOW()
FROM cctv_store, camera_category,
(VALUES
  ('IP Cameras', 'Network-based surveillance cameras', 'ip-cameras', 1),
  ('Analog Cameras', 'Traditional CCTV cameras', 'analog-cameras', 2),
  ('Wireless Cameras', 'WiFi and wireless surveillance cameras', 'wireless-cameras', 3),
  ('PTZ Cameras', 'Pan-tilt-zoom cameras for large areas', 'ptz-cameras', 4),
  ('Dome Cameras', 'Indoor dome surveillance cameras', 'dome-cameras', 5),
  ('Bullet Cameras', 'Outdoor bullet surveillance cameras', 'bullet-cameras', 6),
  ('Night Vision Cameras', 'Low-light and infrared cameras', 'night-vision-cameras', 7),
  ('4K Cameras', 'Ultra-high definition surveillance cameras', '4k-cameras', 8)
) AS subcategories(subcategory_name, subcategory_description, subcategory_slug, sort_order);

-- Insert subcategories for Security Systems
WITH cctv_store AS (
  SELECT id FROM megha_stores WHERE store_code = 'cctv-device' LIMIT 1
),
security_category AS (
  SELECT id FROM categories WHERE megha_store_id = (SELECT id FROM cctv_store) AND slug = 'security-systems' LIMIT 1
)

INSERT INTO categories (
  megha_store_id,
  name,
  description,
  slug,
  parent_id,
  sort_order,
  is_active,
  image_url,
  created_at,
  updated_at
)
SELECT 
  cctv_store.id,
  subcategory_name,
  subcategory_description,
  subcategory_slug,
  security_category.id,
  sort_order,
  true,
  NULL,
  NOW(),
  NOW()
FROM cctv_store, security_category,
(VALUES
  ('Home Security', 'Residential security systems', 'home-security', 1),
  ('Commercial Security', 'Business and office security systems', 'commercial-security', 2),
  ('Industrial Security', 'Factory and warehouse security systems', 'industrial-security', 3),
  ('Retail Security', 'Shop and retail security systems', 'retail-security', 4),
  ('Hospital Security', 'Healthcare facility security systems', 'hospital-security', 5),
  ('School Security', 'Educational institution security systems', 'school-security', 6),
  ('Bank Security', 'Financial institution security systems', 'bank-security', 7),
  ('Government Security', 'Public sector security systems', 'government-security', 8)
) AS subcategories(subcategory_name, subcategory_description, subcategory_slug, sort_order);

-- Insert subcategories for Access Control
WITH cctv_store AS (
  SELECT id FROM megha_stores WHERE store_code = 'cctv-device' LIMIT 1
),
access_category AS (
  SELECT id FROM categories WHERE megha_store_id = (SELECT id FROM cctv_store) AND slug = 'access-control' LIMIT 1
)

INSERT INTO categories (
  megha_store_id,
  name,
  description,
  slug,
  parent_id,
  sort_order,
  is_active,
  image_url,
  created_at,
  updated_at
)
SELECT 
  cctv_store.id,
  subcategory_name,
  subcategory_description,
  subcategory_slug,
  access_category.id,
  sort_order,
  true,
  NULL,
  NOW(),
  NOW()
FROM cctv_store, access_category,
(VALUES
  ('Biometric Systems', 'Fingerprint and facial recognition systems', 'biometric-systems', 1),
  ('Card Readers', 'RFID and proximity card systems', 'card-readers', 2),
  ('Keypad Systems', 'PIN-based access control systems', 'keypad-systems', 3),
  ('Intercom Systems', 'Audio and video intercom systems', 'intercom-systems', 4),
  ('Door Controllers', 'Electronic door lock controllers', 'door-controllers', 5),
  ('Turnstiles', 'Physical access control barriers', 'turnstiles', 6),
  ('Vehicle Barriers', 'Parking and vehicle access control', 'vehicle-barriers', 7),
  ('Visitor Management', 'Guest and visitor access systems', 'visitor-management', 8)
) AS subcategories(subcategory_name, subcategory_description, subcategory_slug, sort_order);

-- Insert subcategories for Smart Security
WITH cctv_store AS (
  SELECT id FROM megha_stores WHERE store_code = 'cctv-device' LIMIT 1
),
smart_category AS (
  SELECT id FROM categories WHERE megha_store_id = (SELECT id FROM cctv_store) AND slug = 'smart-security' LIMIT 1
)

INSERT INTO categories (
  megha_store_id,
  name,
  description,
  slug,
  parent_id,
  sort_order,
  is_active,
  image_url,
  created_at,
  updated_at
)
SELECT 
  cctv_store.id,
  subcategory_name,
  subcategory_description,
  subcategory_slug,
  smart_category.id,
  sort_order,
  true,
  NULL,
  NOW(),
  NOW()
FROM cctv_store, smart_category,
(VALUES
  ('AI Analytics', 'Artificial intelligence video analytics', 'ai-analytics', 1),
  ('IoT Sensors', 'Internet of Things security sensors', 'iot-sensors', 2),
  ('Mobile Apps', 'Smartphone security applications', 'mobile-apps', 3),
  ('Cloud Storage', 'Cloud-based video and data storage', 'cloud-storage', 4),
  ('Remote Monitoring', 'Remote surveillance and monitoring', 'remote-monitoring', 5),
  ('Smart Alerts', 'Intelligent notification systems', 'smart-alerts', 6),
  ('Integration', 'Third-party system integration', 'integration', 7),
  ('Automation', 'Automated security responses', 'automation', 8)
) AS subcategories(subcategory_name, subcategory_description, subcategory_slug, sort_order);

-- Verify the categories
SELECT 
  c.id,
  c.name,
  c.slug,
  c.parent_id,
  p.name as parent_name,
  c.sort_order,
  c.is_active
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id
WHERE c.megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'cctv-device')
ORDER BY c.sort_order, c.name;
