-- ============================================
-- MEGHA_STORES Table Schema
-- Master registry for all TekMegha stores/brands
-- ============================================

-- Drop existing table if recreating (use with caution)
-- DROP TABLE IF EXISTS megha_stores CASCADE;

-- Create megha_stores table
CREATE TABLE IF NOT EXISTS megha_stores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Store identification
  store_code VARCHAR(50) UNIQUE NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  store_type VARCHAR(100) NOT NULL, -- coffee, toys, fashion, digitalsecurity, food, insurance
  
  -- Domain and branding
  domain VARCHAR(255),
  theme_config JSONB, -- Theme colors, logo, layout preferences
  
  -- Business information
  business_hours JSONB, -- Opening hours for each day of the week
  contact_email VARCHAR(255),
  support_phone VARCHAR(20),
  
  -- Additional metadata
  description TEXT,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) DEFAULT 'India',
  
  -- Business details
  tax_id VARCHAR(50), -- GST number or tax ID
  pan_number VARCHAR(20),
  business_registration_number VARCHAR(100),
  
  -- Features enabled
  features JSONB, -- {inventory: true, delivery: true, multiStore: true, etc.}
  
  -- Social media
  social_links JSONB, -- {facebook, instagram, twitter, linkedin, etc.}
  
  -- Settings
  settings JSONB, -- Store-specific settings and configurations
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_megha_stores_store_code ON megha_stores(store_code);
CREATE INDEX IF NOT EXISTS idx_megha_stores_store_type ON megha_stores(store_type);
CREATE INDEX IF NOT EXISTS idx_megha_stores_is_active ON megha_stores(is_active);
CREATE INDEX IF NOT EXISTS idx_megha_stores_domain ON megha_stores(domain);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_megha_stores_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_megha_stores_updated_at_trigger ON megha_stores;
CREATE TRIGGER update_megha_stores_updated_at_trigger
    BEFORE UPDATE ON megha_stores
    FOR EACH ROW
    EXECUTE FUNCTION update_megha_stores_updated_at();

-- Add comments for documentation
COMMENT ON TABLE megha_stores IS 'Master registry table for all TekMegha store brands';
COMMENT ON COLUMN megha_stores.store_code IS 'Unique identifier code for the store (e.g., brewbuddy, royalfoods, dkassociates)';
COMMENT ON COLUMN megha_stores.store_type IS 'Category of store: coffee, toys, fashion, digitalsecurity, food, insurance';
COMMENT ON COLUMN megha_stores.theme_config IS 'JSON configuration for theme colors, logo, and layout preferences';
COMMENT ON COLUMN megha_stores.business_hours IS 'JSON object with opening hours for each day of the week';
COMMENT ON COLUMN megha_stores.features IS 'JSON object defining enabled features like inventory, delivery, multiStore, etc.';
COMMENT ON COLUMN megha_stores.social_links IS 'JSON object with social media URLs';
COMMENT ON COLUMN megha_stores.settings IS 'JSON object for store-specific settings and configurations';

-- ============================================
-- Example theme_config structure:
-- ============================================
-- {
--   "primaryColor": "#0891b2",
--   "secondaryColor": "#06b6d4",
--   "accentColor": "#14b8a6",
--   "warningColor": "#f59e0b",
--   "dangerColor": "#dc2626",
--   "backgroundColor": "#f0fdfa",
--   "surfaceColor": "#ffffff",
--   "textPrimary": "#1f2937",
--   "textSecondary": "#6b7280",
--   "fontFamily": "Inter, sans-serif",
--   "logo": "assets/images/storecode/logo.png",
--   "layout": "layout-type"
-- }

-- ============================================
-- Example business_hours structure:
-- ============================================
-- {
--   "monday": {"open": "09:00", "close": "18:00"},
--   "tuesday": {"open": "09:00", "close": "18:00"},
--   "wednesday": {"open": "09:00", "close": "18:00"},
--   "thursday": {"open": "09:00", "close": "18:00"},
--   "friday": {"open": "09:00", "close": "18:00"},
--   "saturday": {"open": "09:00", "close": "14:00"},
--   "sunday": {"open": null, "close": null, "closed": true}
-- }

-- ============================================
-- Example features structure:
-- ============================================
-- {
--   "inventory": true,
--   "delivery": true,
--   "multiStore": true,
--   "userRoles": true,
--   "payment": true,
--   "analytics": true,
--   "loyaltyProgram": false
-- }

-- ============================================
-- Example social_links structure:
-- ============================================
-- {
--   "facebook": "https://facebook.com/storename",
--   "instagram": "https://instagram.com/storename",
--   "twitter": "https://twitter.com/storename",
--   "linkedin": "https://linkedin.com/company/storename",
--   "youtube": "https://youtube.com/@storename"
-- }

-- ============================================
-- Store Types Reference:
-- ============================================
-- coffee - Coffee shops and cafes (e.g., BrewBuddy)
-- toys - Toy stores (e.g., Little Ducks)
-- fashion - Fashion and apparel (e.g., Majili)
-- digitalsecurity - Security systems and CCTV (e.g., CCTV Device)
-- food - Food and restaurant businesses (e.g., Royal Foods)
-- insurance - Insurance services (e.g., DK Associates)

-- ============================================
-- Query Examples:
-- ============================================

-- Get all active stores
-- SELECT * FROM megha_stores WHERE is_active = true;

-- Get stores by type
-- SELECT store_code, store_name FROM megha_stores WHERE store_type = 'insurance';

-- Get store with theme config
-- SELECT store_code, store_name, theme_config FROM megha_stores WHERE store_code = 'dkassociates';

-- Get stores open on Sunday
-- SELECT store_code, store_name 
-- FROM megha_stores 
-- WHERE business_hours->'sunday'->>'closed' IS NULL OR business_hours->'sunday'->>'closed' = 'false';

-- Update store status
-- UPDATE megha_stores SET is_active = false WHERE store_code = 'storecode';

-- Soft delete a store
-- UPDATE megha_stores SET deleted_at = NOW(), is_active = false WHERE store_code = 'storecode';

