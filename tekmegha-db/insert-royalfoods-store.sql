-- Insert Royal Foods store record
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
  'Royal Foods',
  'royalfoods',
  'food',
  'royalfoods.com',
  '{
    "primaryColor": "#d97706",
    "secondaryColor": "#f59e0b",
    "accentColor": "#ef4444",
    "warningColor": "#f59e0b",
    "dangerColor": "#dc2626",
    "backgroundColor": "#fff7ed",
    "surfaceColor": "#ffffff",
    "textPrimary": "#1f2937",
    "textSecondary": "#6b7280",
    "fontFamily": "Roboto, sans-serif",
    "logo": "assets/images/royalfoods/logo.png",
    "layout": "layout-food"
  }'::jsonb,
  '{
    "monday": {"open": "11:00", "close": "23:00"},
    "tuesday": {"open": "11:00", "close": "23:00"},
    "wednesday": {"open": "11:00", "close": "23:00"},
    "thursday": {"open": "11:00", "close": "23:00"},
    "friday": {"open": "11:00", "close": "23:30"},
    "saturday": {"open": "11:00", "close": "23:30"},
    "sunday": {"open": "11:00", "close": "23:00"}
  }'::jsonb,
  'info@royalfoods.com',
  '+91-8500961396',
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
WHERE store_code = 'royalfoods';

