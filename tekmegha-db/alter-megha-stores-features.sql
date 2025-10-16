-- Add feature control columns to megha_stores table
-- This helps avoid unnecessary frontend calls by checking feature flags first

-- Add new columns for feature control
ALTER TABLE megha_stores 
ADD COLUMN IF NOT EXISTS enable_products BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_cart BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_payments BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_inventory BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_invoices BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_customers BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_reports BOOLEAN DEFAULT true;

-- Add comments for documentation
COMMENT ON COLUMN megha_stores.enable_products IS 'Controls whether products/catalog is available for this store';
COMMENT ON COLUMN megha_stores.enable_cart IS 'Controls whether shopping cart functionality is available';
COMMENT ON COLUMN megha_stores.enable_payments IS 'Controls whether payment processing is available';
COMMENT ON COLUMN megha_stores.enable_inventory IS 'Controls whether inventory management is available';
COMMENT ON COLUMN megha_stores.enable_invoices IS 'Controls whether invoice generation is available';
COMMENT ON COLUMN megha_stores.enable_customers IS 'Controls whether customer management is available';
COMMENT ON COLUMN megha_stores.enable_reports IS 'Controls whether reporting features are available';

-- Create indexes for better performance on feature queries
CREATE INDEX IF NOT EXISTS idx_megha_stores_enable_products ON megha_stores(enable_products);
CREATE INDEX IF NOT EXISTS idx_megha_stores_enable_cart ON megha_stores(enable_cart);
CREATE INDEX IF NOT EXISTS idx_megha_stores_enable_payments ON megha_stores(enable_payments);
CREATE INDEX IF NOT EXISTS idx_megha_stores_enable_inventory ON megha_stores(enable_inventory);
CREATE INDEX IF NOT EXISTS idx_megha_stores_enable_invoices ON megha_stores(enable_invoices);
CREATE INDEX IF NOT EXISTS idx_megha_stores_enable_customers ON megha_stores(enable_customers);
CREATE INDEX IF NOT EXISTS idx_megha_stores_enable_reports ON megha_stores(enable_reports);

-- Update existing stores with appropriate feature flags based on store type
UPDATE megha_stores 
SET 
  enable_products = true,
  enable_cart = true,
  enable_payments = true,
  enable_inventory = true,
  enable_invoices = true,
  enable_customers = true,
  enable_reports = true
WHERE store_type IN ('coffee', 'toys', 'fashion', 'food', 'digitalsecurity');

-- Update insurance stores (different feature set)
UPDATE megha_stores 
SET 
  enable_products = false,
  enable_cart = false,
  enable_payments = false,
  enable_inventory = false,
  enable_invoices = true,
  enable_customers = true,
  enable_reports = true
WHERE store_type = 'insurance';

-- Update dealer stores (different feature set)
UPDATE megha_stores 
SET 
  enable_products = true,
  enable_cart = false,
  enable_payments = false,
  enable_inventory = true,
  enable_invoices = true,
  enable_customers = true,
  enable_reports = true
WHERE store_type = 'dealer';

-- Create a function to get store features
CREATE OR REPLACE FUNCTION get_store_features(store_code_param VARCHAR)
RETURNS TABLE(
    store_id UUID,
    store_code VARCHAR,
    store_name VARCHAR,
    store_type VARCHAR,
    enable_products BOOLEAN,
    enable_cart BOOLEAN,
    enable_payments BOOLEAN,
    enable_inventory BOOLEAN,
    enable_invoices BOOLEAN,
    enable_customers BOOLEAN,
    enable_reports BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.store_code,
        s.store_name,
        s.store_type,
        s.enable_products,
        s.enable_cart,
        s.enable_payments,
        s.enable_inventory,
        s.enable_invoices,
        s.enable_customers,
        s.enable_reports
    FROM megha_stores s
    WHERE s.store_code = store_code_param
    AND s.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_store_features(VARCHAR) TO authenticated;

-- Create a function to check if a specific feature is enabled for a store
CREATE OR REPLACE FUNCTION is_store_feature_enabled(store_code_param VARCHAR, feature_name VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    feature_enabled BOOLEAN := false;
BEGIN
    SELECT CASE 
        WHEN feature_name = 'products' THEN enable_products
        WHEN feature_name = 'cart' THEN enable_cart
        WHEN feature_name = 'payments' THEN enable_payments
        WHEN feature_name = 'inventory' THEN enable_inventory
        WHEN feature_name = 'invoices' THEN enable_invoices
        WHEN feature_name = 'customers' THEN enable_customers
        WHEN feature_name = 'reports' THEN enable_reports
        ELSE false
    END INTO feature_enabled
    FROM megha_stores
    WHERE store_code = store_code_param
    AND is_active = true;
    
    RETURN COALESCE(feature_enabled, false);
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION is_store_feature_enabled(VARCHAR, VARCHAR) TO authenticated;

-- Insert sample data for testing (optional)
-- This shows how different store types can have different feature sets

-- Example: Insurance store with limited features
-- UPDATE megha_stores 
-- SET 
--   enable_products = false,
--   enable_cart = false,
--   enable_payments = false,
--   enable_inventory = false,
--   enable_invoices = true,
--   enable_customers = true,
--   enable_reports = true
-- WHERE store_code = 'dkassociates';

-- Example: Dealer store with wholesale features
-- UPDATE megha_stores 
-- SET 
--   enable_products = true,
--   enable_cart = false,
--   enable_payments = false,
--   enable_inventory = true,
--   enable_invoices = true,
--   enable_customers = true,
--   enable_reports = true
-- WHERE store_code = 'rragency-bheem';

-- Verify the changes
SELECT 
    store_code,
    store_name,
    store_type,
    enable_products,
    enable_cart,
    enable_payments,
    enable_inventory,
    enable_invoices,
    enable_customers,
    enable_reports
FROM megha_stores
ORDER BY store_code;
