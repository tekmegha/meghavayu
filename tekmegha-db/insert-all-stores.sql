-- ============================================
-- Insert All TekMegha Stores
-- Master insertion script for all store records
-- ============================================

-- Insert BrewBuddy (Coffee)
INSERT INTO megha_stores (
  id, store_name, store_code, store_type, domain, theme_config, business_hours,
  contact_email, support_phone, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'BrewBuddy',
  'brewbuddy',
  'coffee',
  'brewbuddy.com',
  '{
    "primaryColor": "#6366f1",
    "secondaryColor": "#ec4899",
    "accentColor": "#f59e0b",
    "backgroundColor": "#faf5ff",
    "surfaceColor": "#ffffff",
    "textPrimary": "#1f2937",
    "textSecondary": "#6b7280",
    "fontFamily": "Roboto, sans-serif",
    "logo": "assets/images/brew-buddy/logo.png",
    "layout": "layout-coffee"
  }'::jsonb,
  '{
    "monday": {"open": "07:00", "close": "22:00"},
    "tuesday": {"open": "07:00", "close": "22:00"},
    "wednesday": {"open": "07:00", "close": "22:00"},
    "thursday": {"open": "07:00", "close": "22:00"},
    "friday": {"open": "07:00", "close": "23:00"},
    "saturday": {"open": "08:00", "close": "23:00"},
    "sunday": {"open": "08:00", "close": "22:00"}
  }'::jsonb,
  'info@brewbuddy.com',
  '+91-9876543210',
  true,
  NOW(),
  NOW()
) ON CONFLICT (store_code) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  theme_config = EXCLUDED.theme_config,
  updated_at = NOW();

-- Insert Little Ducks (Toys)
INSERT INTO megha_stores (
  id, store_name, store_code, store_type, domain, theme_config, business_hours,
  contact_email, support_phone, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Little Ducks',
  'littleducks',
  'toys',
  'littleducks.com',
  '{
    "primaryColor": "#f59e0b",
    "secondaryColor": "#ec4899",
    "accentColor": "#10b981",
    "backgroundColor": "#fffbeb",
    "surfaceColor": "#ffffff",
    "textPrimary": "#1f2937",
    "textSecondary": "#6b7280",
    "fontFamily": "Poppins, sans-serif",
    "logo": "assets/images/little-ducks/logo.png",
    "layout": "layout-toys"
  }'::jsonb,
  '{
    "monday": {"open": "10:00", "close": "20:00"},
    "tuesday": {"open": "10:00", "close": "20:00"},
    "wednesday": {"open": "10:00", "close": "20:00"},
    "thursday": {"open": "10:00", "close": "20:00"},
    "friday": {"open": "10:00", "close": "21:00"},
    "saturday": {"open": "10:00", "close": "21:00"},
    "sunday": {"open": "10:00", "close": "20:00"}
  }'::jsonb,
  'info@littleducks.com',
  '+91-9876543211',
  true,
  NOW(),
  NOW()
) ON CONFLICT (store_code) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  theme_config = EXCLUDED.theme_config,
  updated_at = NOW();

-- Insert Majili (Fashion)
INSERT INTO megha_stores (
  id, store_name, store_code, store_type, domain, theme_config, business_hours,
  contact_email, support_phone, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'Majili Fashion',
  'majili',
  'fashion',
  'majili.com',
  '{
    "primaryColor": "#ec4899",
    "secondaryColor": "#8b5cf6",
    "accentColor": "#f59e0b",
    "backgroundColor": "#fdf4ff",
    "surfaceColor": "#ffffff",
    "textPrimary": "#1f2937",
    "textSecondary": "#6b7280",
    "fontFamily": "Playfair Display, serif",
    "logo": "assets/images/majili/logo.png",
    "layout": "layout-fashion"
  }'::jsonb,
  '{
    "monday": {"open": "10:00", "close": "21:00"},
    "tuesday": {"open": "10:00", "close": "21:00"},
    "wednesday": {"open": "10:00", "close": "21:00"},
    "thursday": {"open": "10:00", "close": "21:00"},
    "friday": {"open": "10:00", "close": "22:00"},
    "saturday": {"open": "10:00", "close": "22:00"},
    "sunday": {"open": "11:00", "close": "21:00"}
  }'::jsonb,
  'info@majili.com',
  '+91-9876543212',
  true,
  NOW(),
  NOW()
) ON CONFLICT (store_code) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  theme_config = EXCLUDED.theme_config,
  updated_at = NOW();

-- Insert CCTV Device (Digital Security)
INSERT INTO megha_stores (
  id, store_name, store_code, store_type, domain, theme_config, business_hours,
  contact_email, support_phone, is_active, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  'CCTV Device Solutions',
  'cctv-device',
  'digitalsecurity',
  'cctvdevice.com',
  '{
    "primaryColor": "#0ea5e9",
    "secondaryColor": "#3b82f6",
    "accentColor": "#10b981",
    "backgroundColor": "#f0f9ff",
    "surfaceColor": "#ffffff",
    "textPrimary": "#1f2937",
    "textSecondary": "#6b7280",
    "fontFamily": "Inter, sans-serif",
    "logo": "assets/images/cctv-device/logo.png",
    "layout": "layout-digitalsecurity"
  }'::jsonb,
  '{
    "monday": {"open": "09:00", "close": "19:00"},
    "tuesday": {"open": "09:00", "close": "19:00"},
    "wednesday": {"open": "09:00", "close": "19:00"},
    "thursday": {"open": "09:00", "close": "19:00"},
    "friday": {"open": "09:00", "close": "19:00"},
    "saturday": {"open": "09:00", "close": "17:00"},
    "sunday": {"open": null, "close": null, "closed": true}
  }'::jsonb,
  'info@cctvdevice.com',
  '+91-9876543213',
  true,
  NOW(),
  NOW()
) ON CONFLICT (store_code) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  theme_config = EXCLUDED.theme_config,
  updated_at = NOW();

-- Insert Royal Foods (Food)
INSERT INTO megha_stores (
  id, store_name, store_code, store_type, domain, theme_config, business_hours,
  contact_email, support_phone, is_active, created_at, updated_at
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
) ON CONFLICT (store_code) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  theme_config = EXCLUDED.theme_config,
  updated_at = NOW();

-- Insert DK Associates (Automobile Insurance)
INSERT INTO megha_stores (
  id, store_name, store_code, store_type, domain, theme_config, business_hours,
  contact_email, support_phone, is_active, created_at, updated_at
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
  '+91-9876543214',
  true,
  NOW(),
  NOW()
) ON CONFLICT (store_code) DO UPDATE SET
  store_name = EXCLUDED.store_name,
  theme_config = EXCLUDED.theme_config,
  updated_at = NOW();

-- Verify all insertions
SELECT 
  store_code,
  store_name,
  store_type,
  domain,
  is_active,
  created_at
FROM megha_stores 
ORDER BY store_type, store_name;

-- Display store count by type
SELECT 
  store_type,
  COUNT(*) as store_count
FROM megha_stores
GROUP BY store_type
ORDER BY store_type;

