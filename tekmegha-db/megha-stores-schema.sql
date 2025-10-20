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
  
  -- Invoice functionality
  invoice_template_id BIGINT,
  
  -- Feature toggles
  enable_products BOOLEAN DEFAULT true,
  enable_cart BOOLEAN DEFAULT true,
  enable_payments BOOLEAN DEFAULT true,
  enable_inventory BOOLEAN DEFAULT true,
  enable_invoices BOOLEAN DEFAULT true,
  enable_customers BOOLEAN DEFAULT true,
  enable_reports BOOLEAN DEFAULT true,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  is_prod_ready BOOLEAN DEFAULT false,
  
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
CREATE INDEX IF NOT EXISTS idx_megha_stores_city ON megha_stores(city);
CREATE INDEX IF NOT EXISTS idx_megha_stores_state ON megha_stores(state);
CREATE INDEX IF NOT EXISTS idx_megha_stores_tax_id ON megha_stores(tax_id);
CREATE INDEX IF NOT EXISTS idx_megha_stores_is_verified ON megha_stores(is_verified);
CREATE INDEX IF NOT EXISTS idx_megha_stores_invoice_template_id ON megha_stores(invoice_template_id);
CREATE INDEX IF NOT EXISTS idx_megha_stores_enable_invoices ON megha_stores(enable_invoices);
CREATE INDEX IF NOT EXISTS idx_megha_stores_is_prod_ready ON megha_stores(is_prod_ready);

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

-- Add foreign key constraint for invoice template
ALTER TABLE megha_stores 
ADD CONSTRAINT IF NOT EXISTS megha_stores_invoice_template_id_fkey 
    FOREIGN KEY (invoice_template_id) REFERENCES invoice_templates(id);

-- Add comments for documentation
COMMENT ON TABLE megha_stores IS 'Master registry table for all TekMegha store brands';
COMMENT ON COLUMN megha_stores.store_code IS 'Unique identifier code for the store (e.g., brewbuddy, royalfoods, dkassociates)';
COMMENT ON COLUMN megha_stores.store_type IS 'Category of store: coffee, toys, fashion, digitalsecurity, food, insurance';
COMMENT ON COLUMN megha_stores.theme_config IS 'JSON configuration for theme colors, logo, and layout preferences';
COMMENT ON COLUMN megha_stores.business_hours IS 'JSON object with opening hours for each day of the week';
COMMENT ON COLUMN megha_stores.features IS 'JSON object defining enabled features like inventory, delivery, multiStore, etc.';
COMMENT ON COLUMN megha_stores.social_links IS 'JSON object with social media URLs';
COMMENT ON COLUMN megha_stores.settings IS 'JSON object for store-specific settings and configurations';
COMMENT ON COLUMN megha_stores.description IS 'Store description and additional information';
COMMENT ON COLUMN megha_stores.address IS 'Physical address of the store';
COMMENT ON COLUMN megha_stores.city IS 'City where the store is located';
COMMENT ON COLUMN megha_stores.state IS 'State where the store is located';
COMMENT ON COLUMN megha_stores.postal_code IS 'Postal/ZIP code of the store';
COMMENT ON COLUMN megha_stores.country IS 'Country where the store is located (default: India)';
COMMENT ON COLUMN megha_stores.tax_id IS 'GST number or tax identification number';
COMMENT ON COLUMN megha_stores.pan_number IS 'PAN number for tax purposes';
COMMENT ON COLUMN megha_stores.business_registration_number IS 'Business registration number';
COMMENT ON COLUMN megha_stores.invoice_template_id IS 'Reference to invoice template for this store';
COMMENT ON COLUMN megha_stores.enable_products IS 'Whether product management is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_cart IS 'Whether shopping cart is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_payments IS 'Whether payment processing is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_inventory IS 'Whether inventory management is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_invoices IS 'Whether invoice generation is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_customers IS 'Whether customer management is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_reports IS 'Whether reporting is enabled for this store';
COMMENT ON COLUMN megha_stores.is_verified IS 'Whether the store has been verified';
COMMENT ON COLUMN megha_stores.is_prod_ready IS 'Whether the store is ready for production use';

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

create table public.megha_stores (
  id uuid not null default gen_random_uuid (),
  store_code character varying(50) not null,
  store_name character varying(255) not null,
  store_type character varying(100) not null,
  domain character varying(255) null,
  theme_config jsonb null,
  business_hours jsonb null,
  contact_email character varying(255) null,
  support_phone character varying(20) null,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  invoice_template_id bigint null,
  enable_products boolean null default true,
  enable_cart boolean null default true,
  enable_payments boolean null default true,
  enable_inventory boolean null default true,
  enable_invoices boolean null default true,
  enable_customers boolean null default true,
  enable_reports boolean null default true,
  is_prod_ready boolean null default false,
  constraint megha_stores_pkey primary key (id),
  constraint megha_stores_store_code_key unique (store_code),
  constraint megha_stores_invoice_template_id_fkey foreign KEY (invoice_template_id) references invoice_templates (id)
) TABLESPACE pg_default;

create index IF not exists idx_megha_stores_code on public.megha_stores using btree (store_code) TABLESPACE pg_default;

create index IF not exists idx_megha_stores_active on public.megha_stores using btree (is_active) TABLESPACE pg_default;

create index IF not exists idx_megha_stores_type on public.megha_stores using btree (store_type) TABLESPACE pg_default;

create trigger update_megha_stores_updated_at BEFORE
update on megha_stores for EACH row
execute FUNCTION update_updated_at_column ();