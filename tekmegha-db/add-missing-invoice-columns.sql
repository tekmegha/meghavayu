-- ============================================
-- Add Missing Columns to megha_stores Table
-- For Invoice Functionality
-- ============================================

-- Add missing columns to megha_stores table for invoice functionality
ALTER TABLE megha_stores 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'India',
ADD COLUMN IF NOT EXISTS tax_id VARCHAR(50), -- GST number or tax ID
ADD COLUMN IF NOT EXISTS pan_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS business_registration_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS features JSONB, -- {inventory: true, delivery: true, multiStore: true, etc.}
ADD COLUMN IF NOT EXISTS social_links JSONB, -- {facebook, instagram, twitter, linkedin, etc.}
ADD COLUMN IF NOT EXISTS settings JSONB, -- Store-specific settings and configurations
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS invoice_template_id BIGINT,
ADD COLUMN IF NOT EXISTS enable_products BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_cart BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_payments BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_inventory BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_invoices BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_customers BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_reports BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_prod_ready BOOLEAN DEFAULT false;

-- Add foreign key constraint for invoice_template_id
ALTER TABLE megha_stores 
ADD CONSTRAINT IF NOT EXISTS megha_stores_invoice_template_id_fkey 
    FOREIGN KEY (invoice_template_id) REFERENCES invoice_templates(id);

-- Create indexes for the new columns for better query performance
CREATE INDEX IF NOT EXISTS idx_megha_stores_city ON megha_stores(city);
CREATE INDEX IF NOT EXISTS idx_megha_stores_state ON megha_stores(state);
CREATE INDEX IF NOT EXISTS idx_megha_stores_tax_id ON megha_stores(tax_id);
CREATE INDEX IF NOT EXISTS idx_megha_stores_is_verified ON megha_stores(is_verified);
CREATE INDEX IF NOT EXISTS idx_megha_stores_invoice_template_id ON megha_stores(invoice_template_id);
CREATE INDEX IF NOT EXISTS idx_megha_stores_enable_invoices ON megha_stores(enable_invoices);
CREATE INDEX IF NOT EXISTS idx_megha_stores_is_prod_ready ON megha_stores(is_prod_ready);

-- Add comments for the new columns
COMMENT ON COLUMN megha_stores.description IS 'Store description and additional information';
COMMENT ON COLUMN megha_stores.address IS 'Physical address of the store';
COMMENT ON COLUMN megha_stores.city IS 'City where the store is located';
COMMENT ON COLUMN megha_stores.state IS 'State where the store is located';
COMMENT ON COLUMN megha_stores.postal_code IS 'Postal/ZIP code of the store';
COMMENT ON COLUMN megha_stores.country IS 'Country where the store is located (default: India)';
COMMENT ON COLUMN megha_stores.tax_id IS 'GST number or tax identification number';
COMMENT ON COLUMN megha_stores.pan_number IS 'PAN number for tax purposes';
COMMENT ON COLUMN megha_stores.business_registration_number IS 'Business registration number';
COMMENT ON COLUMN megha_stores.features IS 'JSON object defining enabled features like inventory, delivery, multiStore, etc.';
COMMENT ON COLUMN megha_stores.social_links IS 'JSON object with social media URLs';
COMMENT ON COLUMN megha_stores.settings IS 'JSON object for store-specific settings and configurations';
COMMENT ON COLUMN megha_stores.is_verified IS 'Whether the store has been verified';
COMMENT ON COLUMN megha_stores.deleted_at IS 'Soft delete timestamp';
COMMENT ON COLUMN megha_stores.invoice_template_id IS 'Reference to invoice template for this store';
COMMENT ON COLUMN megha_stores.enable_products IS 'Whether product management is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_cart IS 'Whether shopping cart is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_payments IS 'Whether payment processing is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_inventory IS 'Whether inventory management is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_invoices IS 'Whether invoice generation is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_customers IS 'Whether customer management is enabled for this store';
COMMENT ON COLUMN megha_stores.enable_reports IS 'Whether reporting is enabled for this store';
COMMENT ON COLUMN megha_stores.is_prod_ready IS 'Whether the store is ready for production use';

-- ============================================
-- Example data for the new columns
-- ============================================

-- Example features JSON structure:
-- {
--   "inventory": true,
--   "delivery": true,
--   "multiStore": true,
--   "userRoles": true,
--   "payment": true,
--   "analytics": true,
--   "loyaltyProgram": false
-- }

-- Example social_links JSON structure:
-- {
--   "facebook": "https://facebook.com/storename",
--   "instagram": "https://instagram.com/storename",
--   "twitter": "https://twitter.com/storename",
--   "linkedin": "https://linkedin.com/company/storename",
--   "youtube": "https://youtube.com/@storename"
-- }

-- Example settings JSON structure:
-- {
--   "currency": "INR",
--   "timezone": "Asia/Kolkata",
--   "dateFormat": "DD/MM/YYYY",
--   "numberFormat": "Indian",
--   "taxInclusive": true,
--   "autoGenerateInvoiceNumber": true,
--   "invoicePrefix": "INV",
--   "defaultPaymentMode": "Cash"
-- }

-- ============================================
-- Update existing stores with default values
-- ============================================

-- Set default values for existing stores
UPDATE megha_stores 
SET 
    country = 'India',
    enable_products = true,
    enable_cart = true,
    enable_payments = true,
    enable_inventory = true,
    enable_invoices = true,
    enable_customers = true,
    enable_reports = true,
    is_verified = false,
    is_prod_ready = false
WHERE 
    country IS NULL 
    OR enable_products IS NULL 
    OR enable_cart IS NULL 
    OR enable_payments IS NULL 
    OR enable_inventory IS NULL 
    OR enable_invoices IS NULL 
    OR enable_customers IS NULL 
    OR enable_reports IS NULL 
    OR is_verified IS NULL 
    OR is_prod_ready IS NULL;

-- ============================================
-- Verification Queries
-- ============================================

-- Check if all columns were added successfully
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'megha_stores' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check foreign key constraints
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name='megha_stores';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'megha_stores' 
AND schemaname = 'public'
ORDER BY indexname;
