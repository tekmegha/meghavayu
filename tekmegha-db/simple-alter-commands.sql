-- ============================================
-- Simple ALTER Commands for Missing Columns
-- Fixed version without IF NOT EXISTS for constraints
-- ============================================

-- Add Business Information Columns
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS state VARCHAR(100);
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'India';

-- Add Tax and Legal Information Columns
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS tax_id VARCHAR(50);
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS pan_number VARCHAR(20);
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS business_registration_number VARCHAR(100);

-- Add Feature Management Columns
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS features JSONB;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS social_links JSONB;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS settings JSONB;

-- Add Invoice-Specific Columns
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS invoice_template_id BIGINT;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS enable_products BOOLEAN DEFAULT true;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS enable_cart BOOLEAN DEFAULT true;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS enable_payments BOOLEAN DEFAULT true;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS enable_inventory BOOLEAN DEFAULT true;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS enable_invoices BOOLEAN DEFAULT true;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS enable_customers BOOLEAN DEFAULT true;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS enable_reports BOOLEAN DEFAULT true;

-- Add Status and Verification Columns
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS is_prod_ready BOOLEAN DEFAULT false;
ALTER TABLE megha_stores ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Add Foreign Key Constraint (with error handling)
-- Note: This will fail if the constraint already exists, which is expected
ALTER TABLE megha_stores 
ADD CONSTRAINT megha_stores_invoice_template_id_fkey 
    FOREIGN KEY (invoice_template_id) REFERENCES invoice_templates(id);

-- Create Indexes for Better Performance
CREATE INDEX IF NOT EXISTS idx_megha_stores_city ON megha_stores(city);
CREATE INDEX IF NOT EXISTS idx_megha_stores_state ON megha_stores(state);
CREATE INDEX IF NOT EXISTS idx_megha_stores_tax_id ON megha_stores(tax_id);
CREATE INDEX IF NOT EXISTS idx_megha_stores_is_verified ON megha_stores(is_verified);
CREATE INDEX IF NOT EXISTS idx_megha_stores_invoice_template_id ON megha_stores(invoice_template_id);
CREATE INDEX IF NOT EXISTS idx_megha_stores_enable_invoices ON megha_stores(enable_invoices);
CREATE INDEX IF NOT EXISTS idx_megha_stores_is_prod_ready ON megha_stores(is_prod_ready);

-- Add Comments for Documentation
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
COMMENT ON COLUMN megha_stores.deleted_at IS 'Soft delete timestamp';

-- Update existing records with default values
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
