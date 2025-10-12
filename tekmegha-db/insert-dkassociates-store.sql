-- Insert DK Associates (Automobile Insurance) store record
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
  'DK Associates - Automobile Insurance',
  'dkassociates',
  'insurance',
  'dkassociates.com',
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
    "logo": "assets/images/dkassociates/logo.png",
    "layout": "layout-insurance"
  }'::jsonb,
  '{
    "monday": {"open": "09:00", "close": "18:00"},
    "tuesday": {"open": "09:00", "close": "18:00"},
    "wednesday": {"open": "09:00", "close": "18:00"},
    "thursday": {"open": "09:00", "close": "18:00"},
    "friday": {"open": "09:00", "close": "18:00"},
    "saturday": {"open": "09:00", "close": "14:00"},
    "sunday": {"open": null, "close": null, "closed": true}
  }'::jsonb,
  'info@dkassociates.com',
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
WHERE store_code = 'dkassociates';

-- Display all stores for verification
SELECT 
  store_code,
  store_name,
  store_type,
  is_active
FROM megha_stores 
ORDER BY store_type, store_name;

