-- ============================================
-- BETTER APPROACH: PRODUCT CATALOG SYSTEM
-- ============================================
-- Instead of default_items, use a proper product catalog
-- that can be shared across stores and templates

-- Create products table for catalog management
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'pcs', -- pcs, kg, L, ton, etc.
    base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    hsn_code VARCHAR(20), -- For GST compliance
    gst_rate DECIMAL(5,2) DEFAULT 18.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT products_base_price_check CHECK (base_price >= 0),
    CONSTRAINT products_gst_rate_check CHECK (gst_rate >= 0 AND gst_rate <= 100)
);

-- Create store_products table for store-specific pricing
CREATE TABLE IF NOT EXISTS store_products (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    store_price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT store_products_store_id_fkey 
        FOREIGN KEY (store_id) REFERENCES megha_stores(id) ON DELETE CASCADE,
    CONSTRAINT store_products_product_id_fkey 
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT store_products_price_check CHECK (store_price >= 0),
    CONSTRAINT store_products_stock_check CHECK (stock_quantity >= 0),
    CONSTRAINT store_products_reorder_check CHECK (reorder_level >= 0),
    UNIQUE(store_id, product_id)
);

-- Create function to get products for a store
CREATE OR REPLACE FUNCTION get_store_products(store_code_param VARCHAR)
RETURNS TABLE(
    product_id BIGINT,
    product_code VARCHAR,
    product_name VARCHAR,
    product_description TEXT,
    category VARCHAR,
    subcategory VARCHAR,
    unit VARCHAR,
    store_price DECIMAL,
    hsn_code VARCHAR,
    gst_rate DECIMAL,
    stock_quantity INTEGER,
    is_available BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.product_code,
        p.product_name,
        p.product_description,
        p.category,
        p.subcategory,
        p.unit,
        COALESCE(sp.store_price, p.base_price) as store_price,
        p.hsn_code,
        p.gst_rate,
        COALESCE(sp.stock_quantity, 0) as stock_quantity,
        COALESCE(sp.is_available, p.is_active) as is_available
    FROM products p
    LEFT JOIN store_products sp ON p.id = sp.product_id
    LEFT JOIN megha_stores s ON sp.store_id = s.id
    WHERE s.store_code = store_code_param
    AND s.is_active = true
    AND p.is_active = true
    ORDER BY p.category, p.product_name;
END;
$$ LANGUAGE plpgsql;

-- Create function to get products by category
CREATE OR REPLACE FUNCTION get_products_by_category(store_code_param VARCHAR, category_param VARCHAR)
RETURNS TABLE(
    product_id BIGINT,
    product_code VARCHAR,
    product_name VARCHAR,
    store_price DECIMAL,
    unit VARCHAR,
    hsn_code VARCHAR,
    stock_quantity INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.product_code,
        p.product_name,
        COALESCE(sp.store_price, p.base_price) as store_price,
        p.unit,
        p.hsn_code,
        COALESCE(sp.stock_quantity, 0) as stock_quantity
    FROM products p
    LEFT JOIN store_products sp ON p.id = sp.product_id
    LEFT JOIN megha_stores s ON sp.store_id = s.id
    WHERE s.store_code = store_code_param
    AND p.category = category_param
    AND s.is_active = true
    AND p.is_active = true
    AND COALESCE(sp.is_available, p.is_active) = true
    ORDER BY p.product_name;
END;
$$ LANGUAGE plpgsql;

-- Insert sample products for different categories
INSERT INTO products (product_code, product_name, product_description, category, subcategory, unit, base_price, hsn_code, gst_rate) VALUES
-- Paint Products
('PAINT-001', '8330 HE Paint', 'High-quality paint 250ml', 'Paint', 'Interior', 'ml', 150.00, '3208.10.00', 18.00),
('PAINT-002', '8267 ASEI Paint', 'Premium paint 1L', 'Paint', 'Exterior', 'L', 450.00, '3208.10.00', 18.00),
('PAINT-003', '8270 HIY Paint', 'Specialty paint 250ml', 'Paint', 'Special', 'ml', 150.00, '3208.10.00', 18.00),
('PAINT-004', 'Primer Base Coat', 'Base primer for walls', 'Paint', 'Primer', 'L', 200.00, '3208.10.00', 18.00),
('PAINT-005', 'Top Coat Finish', 'Final finish coat', 'Paint', 'Finish', 'L', 180.00, '3208.10.00', 18.00),

-- Rice & Grains
('RICE-001', 'Basmati Rice', 'Premium basmati rice 50kg', 'Grains', 'Rice', 'kg', 50.00, '1006.30.00', 5.00),
('RICE-002', 'Regular Rice', 'Standard rice 50kg', 'Grains', 'Rice', 'kg', 40.00, '1006.30.00', 5.00),
('GRAIN-001', 'Wheat', 'Whole wheat 50kg', 'Grains', 'Wheat', 'kg', 36.00, '1001.11.00', 5.00),
('GRAIN-002', 'Dal', 'Mixed dal 25kg', 'Grains', 'Pulses', 'kg', 48.00, '0713.10.00', 5.00),

-- Construction Materials
('CEMENT-001', 'Cement', 'Portland cement 50kg', 'Construction', 'Cement', 'kg', 7.00, '2523.29.00', 18.00),
('STEEL-001', 'Steel Rods', '12mm steel rods', 'Construction', 'Steel', 'pcs', 50.00, '7214.20.00', 18.00),
('SAND-001', 'Sand', 'Construction sand 1 ton', 'Construction', 'Sand', 'ton', 800.00, '2505.10.00', 18.00),
('GRAVEL-001', 'Gravel', 'Construction gravel 1 ton', 'Construction', 'Gravel', 'ton', 600.00, '2517.10.00', 18.00),
('BRICK-001', 'Bricks', 'Red clay bricks 1000 pcs', 'Construction', 'Bricks', 'pcs', 5.00, '6904.10.00', 18.00),
('TILE-001', 'Tiles', 'Ceramic tiles 1 sq ft', 'Construction', 'Tiles', 'sqft', 25.00, '6908.10.00', 18.00),

-- Hardware & Tools
('HARD-001', 'Nails', 'Construction nails 1kg', 'Hardware', 'Fasteners', 'kg', 80.00, '7317.00.00', 18.00),
('HARD-002', 'Screws', 'Steel screws 1kg', 'Hardware', 'Fasteners', 'kg', 120.00, '7318.15.00', 18.00),
('HARD-003', 'Wire', 'Electrical wire 100m', 'Hardware', 'Electrical', 'm', 2.00, '8544.42.00', 18.00),
('HARD-004', 'Pipe', 'PVC pipe 6ft', 'Hardware', 'Plumbing', 'ft', 25.00, '3917.21.00', 18.00),

-- General Items
('GEN-001', 'General Item', 'General purpose item', 'General', 'Misc', 'pcs', 100.00, '9999.99.99', 18.00),
('SERVICE-001', 'Service Fee', 'Service charge', 'Service', 'Fee', 'pcs', 50.00, '9999.99.99', 18.00)

ON CONFLICT (product_code) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_store_products_store_id ON store_products(store_id);
CREATE INDEX IF NOT EXISTS idx_store_products_product_id ON store_products(product_id);
CREATE INDEX IF NOT EXISTS idx_store_products_available ON store_products(is_available);

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_store_products(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION get_products_by_category(VARCHAR, VARCHAR) TO authenticated;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_products_updated_at 
    BEFORE UPDATE ON store_products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
