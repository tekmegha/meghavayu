-- Insert CCTV Device store record
INSERT INTO megha_stores (
  id,
  store_name,
  store_code,
  store_type,
  domain,
  theme_config,
  business_hours,
  contact_email,
  support_phone,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'CCTV Device',
  'cctv-device',
  'digitalsecurity',
  'cctvdevice.com',
  '{
    "primaryColor": "#1a237e",
    "secondaryColor": "#3949ab",
    "accentColor": "#00e676",
    "warningColor": "#ff9800",
    "dangerColor": "#f44336",
    "backgroundColor": "#0d1117",
    "surfaceColor": "#161b22",
    "textPrimary": "#f0f6fc",
    "textSecondary": "#8b949e",
    "fontFamily": "Roboto, sans-serif",
    "logo": "assets/images/cctv-device/logo.png",
    "layout": "layout-digitalsecurity"
  }'::jsonb,
  '{
    "monday": {"open": "09:00", "close": "18:00"},
    "tuesday": {"open": "09:00", "close": "18:00"},
    "wednesday": {"open": "09:00", "close": "18:00"},
    "thursday": {"open": "09:00", "close": "18:00"},
    "friday": {"open": "09:00", "close": "18:00"},
    "saturday": {"open": "10:00", "close": "16:00"},
    "sunday": {"open": "10:00", "close": "14:00"}
  }'::jsonb,
  'info@cctvdevice.com',
  '+91-9876543210',
  true,
  NOW(),
  NOW()
);

-- Verify the insertion
SELECT 
  id,
  store_name,
  store_code,
  store_type,
  domain,
  is_active,
  created_at
FROM megha_stores 
WHERE store_code = 'cctv-device';
