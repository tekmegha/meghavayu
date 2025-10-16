-- Invoice Template System - Refactored Schema
-- Templates are now store-agnostic and linked via megha_stores.template_id

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS default_items CASCADE;
DROP TABLE IF EXISTS invoice_templates CASCADE;

-- Create invoice_templates table (store-agnostic templates)
CREATE TABLE IF NOT EXISTS invoice_templates (
    id BIGSERIAL PRIMARY KEY,
    template_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'retail', 'food', 'insurance', 'coffee'
    template_name VARCHAR(100) NOT NULL,
    template_description TEXT,
    
    -- Layout Configuration
    topbar_enabled BOOLEAN DEFAULT true,
    topbar_text VARCHAR(255) DEFAULT 'Thank you for your business!',
    topbar_background_color VARCHAR(7) DEFAULT '#f3f4f6',
    topbar_text_color VARCHAR(7) DEFAULT '#374151',
    
    -- Header Configuration
    header_enabled BOOLEAN DEFAULT true,
    header_logo_enabled BOOLEAN DEFAULT true,
    header_company_name_enabled BOOLEAN DEFAULT true,
    header_company_name VARCHAR(255),
    header_company_address TEXT,
    header_company_contact VARCHAR(50),
    header_company_gstin VARCHAR(20),
    header_background_color VARCHAR(7) DEFAULT '#ffffff',
    header_text_color VARCHAR(7) DEFAULT '#111827',
    
    -- Body Configuration
    body_layout_type VARCHAR(20) DEFAULT 'table', -- 'table' or 'text'
    body_table_headers_enabled BOOLEAN DEFAULT true,
    body_table_borders_enabled BOOLEAN DEFAULT true,
    body_table_striped BOOLEAN DEFAULT false,
    body_text_content TEXT, -- For text-based layout
    body_background_color VARCHAR(7) DEFAULT '#ffffff',
    body_text_color VARCHAR(7) DEFAULT '#374151',
    
    -- Table Layout Configuration (when body_layout_type = 'table')
    table_show_product BOOLEAN DEFAULT true,
    table_show_quantity BOOLEAN DEFAULT true,
    table_show_rate BOOLEAN DEFAULT true,
    table_show_amount BOOLEAN DEFAULT true,
    table_show_discount BOOLEAN DEFAULT false,
    table_show_final_amount BOOLEAN DEFAULT false,
    table_product_label VARCHAR(50) DEFAULT 'Product',
    table_quantity_label VARCHAR(50) DEFAULT 'Qty',
    table_rate_label VARCHAR(50) DEFAULT 'Rate',
    table_amount_label VARCHAR(50) DEFAULT 'Amount',
    table_discount_label VARCHAR(50) DEFAULT 'Discount',
    table_final_amount_label VARCHAR(50) DEFAULT 'Final Amount',
    
    -- Footer Configuration
    footer_enabled BOOLEAN DEFAULT true,
    footer_text TEXT DEFAULT 'Terms and conditions apply. Thank you for your business!',
    footer_background_color VARCHAR(7) DEFAULT '#f9fafb',
    footer_text_color VARCHAR(7) DEFAULT '#6b7280',
    
    -- Invoice Settings
    default_payment_mode VARCHAR(50) DEFAULT 'Cash',
    tax_rate DECIMAL(5,2) DEFAULT 9.00,
    currency VARCHAR(10) DEFAULT 'INR',
    invoice_prefix VARCHAR(10) DEFAULT 'INV',
    auto_generate_number BOOLEAN DEFAULT true,
    
    -- Styling
    primary_color VARCHAR(7) DEFAULT '#dc2626',
    secondary_color VARCHAR(7) DEFAULT '#ffffff',
    header_text_color VARCHAR(7) DEFAULT '#ffffff',
    
    -- Template Metadata
    is_active BOOLEAN DEFAULT true,
    is_system_template BOOLEAN DEFAULT false, -- System templates cannot be deleted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by BIGINT,
    
    -- Constraints
    CONSTRAINT invoice_templates_template_code_check CHECK (template_code ~ '^[a-z0-9-]+$'),
    CONSTRAINT invoice_templates_tax_rate_check CHECK (tax_rate >= 0 AND tax_rate <= 100)
);

-- Add template_id column to megha_stores table
ALTER TABLE megha_stores 
ADD COLUMN IF NOT EXISTS invoice_template_id BIGINT,
ADD CONSTRAINT megha_stores_invoice_template_id_fkey 
    FOREIGN KEY (invoice_template_id) REFERENCES invoice_templates(id);

-- Create default_items table (now template-based instead of store-based)
CREATE TABLE IF NOT EXISTS default_items (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    default_rate DECIMAL(10,2) NOT NULL,
    default_quantity INTEGER DEFAULT 1,
    category VARCHAR(100),
    description TEXT,
    
    -- Metadata
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT default_items_template_id_fkey FOREIGN KEY (template_id) REFERENCES invoice_templates(id),
    CONSTRAINT default_items_rate_check CHECK (default_rate >= 0),
    CONSTRAINT default_items_quantity_check CHECK (default_quantity > 0)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoice_templates_template_code ON invoice_templates(template_code);
CREATE INDEX IF NOT EXISTS idx_invoice_templates_active ON invoice_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_invoice_templates_system ON invoice_templates(is_system_template);

CREATE INDEX IF NOT EXISTS idx_default_items_template_id ON default_items(template_id);
CREATE INDEX IF NOT EXISTS idx_default_items_active ON default_items(is_active);
CREATE INDEX IF NOT EXISTS idx_default_items_category ON default_items(category);

CREATE INDEX IF NOT EXISTS idx_megha_stores_template_id ON megha_stores(invoice_template_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_invoice_templates_updated_at BEFORE UPDATE ON invoice_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_default_items_updated_at BEFORE UPDATE ON default_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert system templates for different store types
INSERT INTO invoice_templates (
    template_code, template_name, template_description, 
    default_payment_mode, tax_rate, invoice_prefix, 
    primary_color, is_system_template,
    -- Layout configurations
    topbar_text, topbar_background_color, topbar_text_color,
    header_company_name, header_company_address, header_company_contact,
    body_layout_type, body_table_headers_enabled, body_table_borders_enabled,
    table_show_product, table_show_quantity, table_show_rate, table_show_amount, 
    table_show_discount, table_show_final_amount,
    table_product_label, table_quantity_label, table_rate_label, table_amount_label,
    table_discount_label, table_final_amount_label,
    footer_text, footer_background_color, footer_text_color
) VALUES 
    (
        'retail', 
        'Retail Store Template', 
        'Standard template for retail stores',
        'Cash', 9.00, 'INV', '#dc2626', true,
        'Welcome to our store!', '#f3f4f6', '#374151',
        'Retail Store', '123 Main Street, City', '+91-9876543210',
        'table', true, true,
        true, true, true, true, false, false,
        'Product', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Thank you for shopping with us!', '#f9fafb', '#6b7280'
    ),
    (
        'food', 
        'Food Store Template', 
        'Template optimized for food and grocery stores',
        'Cash', 5.00, 'FD', '#059669', true,
        'Fresh groceries delivered!', '#f0fdf4', '#166534',
        'Food Store', '456 Market Street, City', '+91-9876543211',
        'table', true, true,
        true, true, true, true, true, true,
        'Item', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Fresh and healthy products guaranteed!', '#f0fdf4', '#166534'
    ),
    (
        'coffee', 
        'Coffee Shop Template', 
        'Template designed for coffee shops and cafes',
        'Cash', 9.00, 'CB', '#92400e', true,
        'Brewed with love!', '#fef3c7', '#92400e',
        'Coffee Shop', '789 Coffee Lane, City', '+91-9876543212',
        'table', true, true,
        true, true, true, true, false, false,
        'Item', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Enjoy your coffee! Visit us again soon.', '#fef3c7', '#92400e'
    ),
    (
        'insurance', 
        'Insurance Agency Template', 
        'Template for insurance agencies and brokers',
        'Online', 18.00, 'INS', '#1e40af', true,
        'Your protection is our priority!', '#dbeafe', '#1e40af',
        'Insurance Agency', '321 Business Center, City', '+91-9876543213',
        'table', true, true,
        true, true, true, true, true, true,
        'Service', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Secure your future with us. Terms apply.', '#dbeafe', '#1e40af'
    ),
    (
        'automotive', 
        'Automotive Template', 
        'Template for automotive services and parts',
        'Cash', 18.00, 'AUTO', '#374151', true,
        'Quality automotive services!', '#f3f4f6', '#374151',
        'Auto Service Center', '654 Garage Road, City', '+91-9876543214',
        'table', true, true,
        true, true, true, true, true, true,
        'Service', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Your vehicle is in good hands!', '#f3f4f6', '#374151'
    ),
    (
        'fashion', 
        'Fashion Store Template', 
        'Template for fashion and clothing stores',
        'Card', 12.00, 'FSH', '#be185d', true,
        'Style that defines you!', '#fce7f3', '#be185d',
        'Fashion Store', '987 Style Avenue, City', '+91-9876543215',
        'table', true, true,
        true, true, true, true, true, true,
        'Item', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Look good, feel great!', '#fce7f3', '#be185d'
    ),
    (
        'electronics', 
        'Electronics Store Template', 
        'Template for electronics and digital products',
        'Online', 18.00, 'ELC', '#7c3aed', true,
        'Latest technology at your fingertips!', '#f3e8ff', '#7c3aed',
        'Electronics Store', '147 Tech Park, City', '+91-9876543216',
        'table', true, true,
        true, true, true, true, true, true,
        'Product', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Stay connected with the latest tech!', '#f3e8ff', '#7c3aed'
    ),
    (
        'toys', 
        'Toy Store Template', 
        'Template for toy stores and children products',
        'Cash', 12.00, 'TOY', '#ea580c', true,
        'Fun and learning for kids!', '#fed7aa', '#ea580c',
        'Toy Store', '258 Play Street, City', '+91-9876543217',
        'table', true, true,
        true, true, true, true, false, false,
        'Toy', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Bringing joy to children everywhere!', '#fed7aa', '#ea580c'
    ),
    (
        'dealer', 
        'Dealer Template', 
        'Template for dealers of paint, rice, cement, and other bulk products',
        'Cash', 18.00, 'DLR', '#1f2937', true,
        'Quality products for your business!', '#f3f4f6', '#1f2937',
        'R R AGENCY', 'NH-16 Road, Old Police Station, Ranasthalam (Md), Srikakulam Dist. A.P-532407', '+91-9876543218',
        'table', true, true,
        true, true, true, true, true, true,
        'Product Description', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Certificate that the particulars given above are correct. For R R AGENCY', '#f3f4f6', '#1f2937'
    )
ON CONFLICT (template_code) DO NOTHING;

-- Insert default items for each template
INSERT INTO default_items (template_id, item_name, default_rate, default_quantity, category, sort_order)
SELECT 
    it.id,
    items.item_name,
    items.default_rate,
    items.default_quantity,
    items.category,
    items.sort_order
FROM invoice_templates it
CROSS JOIN (
    VALUES 
        -- Retail Template
        ('retail', 'General Item', 100.00, 1, 'General', 1),
        ('retail', 'Service Fee', 50.00, 1, 'Service', 2),
        
        -- Food Template
        ('food', 'Rice (1kg)', 60.00, 2, 'Grains', 1),
        ('food', 'Wheat Flour (1kg)', 40.00, 1, 'Grains', 2),
        ('food', 'Cooking Oil (1L)', 120.00, 1, 'Oil', 3),
        ('food', 'Sugar (1kg)', 45.00, 1, 'Sweeteners', 4),
        
        -- Coffee Template
        ('coffee', 'Coffee Beans (250g)', 250.00, 1, 'Coffee', 1),
        ('coffee', 'Espresso Shot', 45.00, 2, 'Coffee', 2),
        ('coffee', 'Cappuccino', 55.00, 1, 'Coffee', 3),
        ('coffee', 'Latte', 65.00, 1, 'Coffee', 4),
        ('coffee', 'Pastry', 80.00, 1, 'Food', 5),
        
        -- Insurance Template
        ('insurance', 'Insurance Policy', 5000.00, 1, 'Insurance', 1),
        ('insurance', 'Processing Fee', 500.00, 1, 'Fee', 2),
        ('insurance', 'Documentation', 200.00, 1, 'Service', 3),
        ('insurance', 'Renewal Fee', 300.00, 1, 'Fee', 4),
        
        -- Automotive Template
        ('automotive', 'Service Charge', 800.00, 1, 'Service', 1),
        ('automotive', 'Parts', 500.00, 1, 'Parts', 2),
        ('automotive', 'Oil Change', 300.00, 1, 'Service', 3),
        ('automotive', 'Inspection', 200.00, 1, 'Service', 4),
        
        -- Fashion Template
        ('fashion', 'Clothing Item', 800.00, 1, 'Clothing', 1),
        ('fashion', 'Accessories', 200.00, 1, 'Accessories', 2),
        ('fashion', 'Footwear', 600.00, 1, 'Footwear', 3),
        
        -- Electronics Template
        ('electronics', 'Electronic Device', 5000.00, 1, 'Electronics', 1),
        ('electronics', 'Accessories', 300.00, 1, 'Accessories', 2),
        ('electronics', 'Installation', 500.00, 1, 'Service', 3),
        ('electronics', 'Warranty Extension', 800.00, 1, 'Service', 4),
        
        -- Toys Template
        ('toys', 'Educational Toy', 400.00, 1, 'Educational', 1),
        ('toys', 'Action Figure', 250.00, 1, 'Action', 2),
        ('toys', 'Board Game', 350.00, 1, 'Games', 3),
        ('toys', 'Puzzle', 150.00, 1, 'Educational', 4),
        
        -- Dealer Template (Paint, Rice, Cement, etc.)
        ('dealer', '8330 HE Paint', 150.00, 1, 'Paint', 1),
        ('dealer', '8267 ASEI Paint', 450.00, 1, 'Paint', 2),
        ('dealer', '8270 HIY Paint', 150.00, 1, 'Paint', 3),
        ('dealer', 'Rice (50kg)', 2000.00, 1, 'Grains', 4),
        ('dealer', 'Cement (50kg)', 350.00, 1, 'Construction', 5),
        ('dealer', 'Steel Rods (12mm)', 500.00, 10, 'Construction', 6),
        ('dealer', 'Sand (1 ton)', 800.00, 1, 'Construction', 7),
        ('dealer', 'Gravel (1 ton)', 600.00, 1, 'Construction', 8)
        
) AS items(template_code, item_name, default_rate, default_quantity, category, sort_order)
WHERE it.template_code = items.template_code;

-- Create function to get store's invoice template with layout configuration
CREATE OR REPLACE FUNCTION get_store_invoice_template(store_code_param VARCHAR)
RETURNS TABLE(
    template_id BIGINT,
    template_code VARCHAR,
    template_name VARCHAR,
    invoice_prefix VARCHAR,
    tax_rate DECIMAL,
    primary_color VARCHAR,
    default_payment_mode VARCHAR,
    -- Layout configuration
    topbar_enabled BOOLEAN,
    topbar_text VARCHAR,
    topbar_background_color VARCHAR,
    topbar_text_color VARCHAR,
    header_enabled BOOLEAN,
    header_logo_enabled BOOLEAN,
    header_company_name_enabled BOOLEAN,
    header_company_name VARCHAR,
    header_company_address TEXT,
    header_company_contact VARCHAR,
    header_company_gstin VARCHAR,
    header_background_color VARCHAR,
    header_text_color VARCHAR,
    body_layout_type VARCHAR,
    body_table_headers_enabled BOOLEAN,
    body_table_borders_enabled BOOLEAN,
    body_table_striped BOOLEAN,
    body_text_content TEXT,
    body_background_color VARCHAR,
    body_text_color VARCHAR,
    -- Table configuration
    table_show_product BOOLEAN,
    table_show_quantity BOOLEAN,
    table_show_rate BOOLEAN,
    table_show_amount BOOLEAN,
    table_show_discount BOOLEAN,
    table_show_final_amount BOOLEAN,
    table_product_label VARCHAR,
    table_quantity_label VARCHAR,
    table_rate_label VARCHAR,
    table_amount_label VARCHAR,
    table_discount_label VARCHAR,
    table_final_amount_label VARCHAR,
    footer_enabled BOOLEAN,
    footer_text TEXT,
    footer_background_color VARCHAR,
    footer_text_color VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        it.id,
        it.template_code,
        it.template_name,
        it.invoice_prefix,
        it.tax_rate,
        it.primary_color,
        it.default_payment_mode,
        -- Layout configuration
        it.topbar_enabled,
        it.topbar_text,
        it.topbar_background_color,
        it.topbar_text_color,
        it.header_enabled,
        it.header_logo_enabled,
        it.header_company_name_enabled,
        it.header_company_name,
        it.header_company_address,
        it.header_company_contact,
        it.header_company_gstin,
        it.header_background_color,
        it.header_text_color,
        it.body_layout_type,
        it.body_table_headers_enabled,
        it.body_table_borders_enabled,
        it.body_table_striped,
        it.body_text_content,
        it.body_background_color,
        it.body_text_color,
        -- Table configuration
        it.table_show_product,
        it.table_show_quantity,
        it.table_show_rate,
        it.table_show_amount,
        it.table_show_discount,
        it.table_show_final_amount,
        it.table_product_label,
        it.table_quantity_label,
        it.table_rate_label,
        it.table_amount_label,
        it.table_discount_label,
        it.table_final_amount_label,
        it.footer_enabled,
        it.footer_text,
        it.footer_background_color,
        it.footer_text_color
    FROM megha_stores s
    LEFT JOIN invoice_templates it ON s.invoice_template_id = it.id
    WHERE s.store_code = store_code_param
    AND s.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create function to get template's default items
CREATE OR REPLACE FUNCTION get_template_default_items(template_id_param BIGINT)
RETURNS TABLE(
    item_id BIGINT,
    item_name VARCHAR,
    default_rate DECIMAL,
    default_quantity INTEGER,
    category VARCHAR,
    sort_order INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        di.id,
        di.item_name,
        di.default_rate,
        di.default_quantity,
        di.category,
        di.sort_order
    FROM default_items di
    WHERE di.template_id = template_id_param
    AND di.is_active = true
    ORDER BY di.sort_order, di.item_name;
END;
$$ LANGUAGE plpgsql;

-- Create view for store template summary
CREATE OR REPLACE VIEW store_template_summary AS
SELECT 
    s.id as store_id,
    s.store_code,
    s.store_name,
    s.invoice_template_id,
    it.template_code,
    it.template_name,
    it.invoice_prefix,
    it.tax_rate,
    it.primary_color,
    COUNT(di.id) as default_items_count
FROM megha_stores s
LEFT JOIN invoice_templates it ON s.invoice_template_id = it.id
LEFT JOIN default_items di ON it.id = di.template_id AND di.is_active = true
WHERE s.is_active = true
GROUP BY s.id, s.store_code, s.store_name, s.invoice_template_id, 
         it.template_code, it.template_name, it.invoice_prefix, 
         it.tax_rate, it.primary_color;

-- Update existing stores to use appropriate templates
UPDATE megha_stores 
SET invoice_template_id = (
    SELECT id FROM invoice_templates 
    WHERE template_code = CASE 
        WHEN store_code LIKE '%brew%' OR store_code LIKE '%coffee%' THEN 'coffee'
        WHEN store_code LIKE '%food%' OR store_code LIKE '%royal%' THEN 'food'
        WHEN store_code LIKE '%insurance%' OR store_code LIKE '%dkassociates%' THEN 'insurance'
        WHEN store_code LIKE '%auto%' THEN 'automotive'
        WHEN store_code LIKE '%fashion%' THEN 'fashion'
        WHEN store_code LIKE '%electronic%' THEN 'electronics'
        WHEN store_code LIKE '%toy%' THEN 'toys'
        ELSE 'retail'
    END
)
WHERE invoice_template_id IS NULL;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON invoice_templates TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON default_items TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE invoice_templates_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE default_items_id_seq TO authenticated;
GRANT EXECUTE ON FUNCTION get_store_invoice_template(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION get_template_default_items(BIGINT) TO authenticated;

-- Comments
COMMENT ON TABLE invoice_templates IS 'Store-agnostic invoice templates that can be reused across multiple stores';
COMMENT ON TABLE default_items IS 'Default items associated with invoice templates';
COMMENT ON COLUMN megha_stores.invoice_template_id IS 'Reference to the invoice template used by this store';
COMMENT ON VIEW store_template_summary IS 'Summary view showing store-template relationships';
COMMENT ON FUNCTION get_store_invoice_template(VARCHAR) IS 'Get invoice template configuration for a specific store';
COMMENT ON FUNCTION get_template_default_items(BIGINT) IS 'Get default items for a specific template';

-- Sample queries for testing
/*
-- Get template for a specific store
SELECT * FROM get_store_invoice_template('brew-buddy');

-- Get default items for a template
SELECT * FROM get_template_default_items(1);

-- View all stores and their templates
SELECT * FROM store_template_summary;

-- Create a new custom template
INSERT INTO invoice_templates (template_code, template_name, template_description, invoice_prefix, primary_color)
VALUES ('custom', 'Custom Template', 'Custom business template', 'CST', '#ff6b6b');

-- Assign template to a store
UPDATE megha_stores SET invoice_template_id = (SELECT id FROM invoice_templates WHERE template_code = 'custom')
WHERE store_code = 'my-store';
*/
