-- ============================================
-- SIMPLE INVOICE SCHEMA - NO SAMPLE ITEMS
-- ============================================
-- Store owners will add items manually while billing
-- No need for default_items, sample_items, or product catalogs

-- Create invoice_templates table (store-agnostic templates)
CREATE TABLE IF NOT EXISTS invoice_templates (
    id BIGSERIAL PRIMARY KEY,
    template_code VARCHAR(50) UNIQUE NOT NULL,
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
    body_layout_type VARCHAR(20) DEFAULT 'table',
    body_table_headers_enabled BOOLEAN DEFAULT true,
    body_table_borders_enabled BOOLEAN DEFAULT true,
    body_table_striped BOOLEAN DEFAULT false,
    body_text_content TEXT,
    body_background_color VARCHAR(7) DEFAULT '#ffffff',
    body_text_color VARCHAR(7) DEFAULT '#374151',
    
    -- Table Layout Configuration
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
    
    -- Template Metadata
    is_active BOOLEAN DEFAULT true,
    is_system_template BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT invoice_templates_template_code_check CHECK (template_code ~ '^[a-z0-9-]+$'),
    CONSTRAINT invoice_templates_tax_rate_check CHECK (tax_rate >= 0 AND tax_rate <= 100)
);

-- Add template_id column to megha_stores table
ALTER TABLE megha_stores 
ADD COLUMN IF NOT EXISTS invoice_template_id BIGINT,
ADD CONSTRAINT megha_stores_invoice_template_id_fkey 
    FOREIGN KEY (invoice_template_id) REFERENCES invoice_templates(id);

-- Insert system templates
INSERT INTO invoice_templates (
    template_code, template_name, template_description, 
    default_payment_mode, tax_rate, invoice_prefix, 
    primary_color, is_system_template,
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
        'retail', 'Retail Store Template', 'Standard template for retail stores',
        'Cash', 9.00, 'INV', '#dc2626', true,
        'Welcome to our store!', '#f3f4f6', '#374151',
        'Retail Store', '123 Main Street, City', '+91-9876543210',
        'table', true, true,
        true, true, true, true, false, false,
        'Product', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Thank you for shopping with us!', '#f9fafb', '#6b7280'
    ),
    (
        'food', 'Food Store Template', 'Template optimized for food and grocery stores',
        'Cash', 5.00, 'FD', '#059669', true,
        'Fresh groceries delivered!', '#f0fdf4', '#166534',
        'Food Store', '456 Market Street, City', '+91-9876543211',
        'table', true, true,
        true, true, true, true, true, true,
        'Item', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Fresh and healthy products guaranteed!', '#f0fdf4', '#166534'
    ),
    (
        'coffee', 'Coffee Shop Template', 'Template designed for coffee shops and cafes',
        'Cash', 9.00, 'CB', '#92400e', true,
        'Brewed with love!', '#fef3c7', '#92400e',
        'Coffee Shop', '789 Coffee Lane, City', '+91-9876543212',
        'table', true, true,
        true, true, true, true, false, false,
        'Item', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Enjoy your coffee! Visit us again soon.', '#fef3c7', '#92400e'
    ),
    (
        'insurance', 'Insurance Agency Template', 'Template for insurance agencies and brokers',
        'Online', 18.00, 'INS', '#1e40af', true,
        'Your protection is our priority!', '#dbeafe', '#1e40af',
        'Insurance Agency', '321 Business Center, City', '+91-9876543213',
        'table', true, true,
        true, true, true, true, true, true,
        'Service', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Secure your future with us. Terms apply.', '#dbeafe', '#1e40af'
    ),
    (
        'automotive', 'Automotive Template', 'Template for automotive services and parts',
        'Cash', 18.00, 'AUTO', '#374151', true,
        'Quality automotive services!', '#f3f4f6', '#374151',
        'Auto Service Center', '654 Garage Road, City', '+91-9876543214',
        'table', true, true,
        true, true, true, true, true, true,
        'Service', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Your vehicle is in good hands!', '#f3f4f6', '#374151'
    ),
    (
        'fashion', 'Fashion Store Template', 'Template for fashion and clothing stores',
        'Card', 12.00, 'FSH', '#be185d', true,
        'Style that defines you!', '#fce7f3', '#be185d',
        'Fashion Store', '987 Style Avenue, City', '+91-9876543215',
        'table', true, true,
        true, true, true, true, true, true,
        'Item', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Look good, feel great!', '#fce7f3', '#be185d'
    ),
    (
        'electronics', 'Electronics Store Template', 'Template for electronics and digital products',
        'Online', 18.00, 'ELC', '#7c3aed', true,
        'Latest technology at your fingertips!', '#f3e8ff', '#7c3aed',
        'Electronics Store', '147 Tech Park, City', '+91-9876543216',
        'table', true, true,
        true, true, true, true, true, true,
        'Product', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Stay connected with the latest tech!', '#f3e8ff', '#7c3aed'
    ),
    (
        'toys', 'Toy Store Template', 'Template for toy stores and children products',
        'Cash', 12.00, 'TOY', '#ea580c', true,
        'Fun and learning for kids!', '#fed7aa', '#ea580c',
        'Toy Store', '258 Play Street, City', '+91-9876543217',
        'table', true, true,
        true, true, true, true, false, false,
        'Toy', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Bringing joy to children everywhere!', '#fed7aa', '#ea580c'
    ),
    (
        'dealer', 'Dealer Template', 'Template for dealers of paint, rice, cement, and other bulk products',
        'Cash', 18.00, 'DLR', '#1f2937', true,
        'Quality products for your business!', '#f3f4f6', '#1f2937',
        'R R AGENCY', 'NH-16 Road, Old Police Station, Ranasthalam (Md), Srikakulam Dist. A.P-532407', '+91-9876543218',
        'table', true, true,
        true, true, true, true, true, true,
        'Product Description', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
        'Certificate that the particulars given above are correct. For R R AGENCY', '#f3f4f6', '#1f2937'
    )
ON CONFLICT (template_code) DO NOTHING;

-- Create function to get store's invoice template
CREATE OR REPLACE FUNCTION get_store_invoice_template(store_code_param VARCHAR)
RETURNS TABLE(
    template_id BIGINT,
    template_code VARCHAR,
    template_name VARCHAR,
    template_description TEXT,
    invoice_prefix VARCHAR,
    tax_rate DECIMAL,
    primary_color VARCHAR,
    default_payment_mode VARCHAR,
    currency VARCHAR,
    auto_generate_number BOOLEAN,
    -- Layout configuration
    topbar_enabled BOOLEAN,
    topbar_text VARCHAR,
    topbar_background_color VARCHAR,
    topbar_text_color VARCHAR,
    -- Header configuration
    header_enabled BOOLEAN,
    header_logo_enabled BOOLEAN,
    header_company_name_enabled BOOLEAN,
    header_company_name VARCHAR,
    header_company_address TEXT,
    header_company_contact VARCHAR,
    header_company_gstin VARCHAR,
    header_background_color VARCHAR,
    header_text_color VARCHAR,
    -- Body configuration
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
    -- Footer configuration
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
        it.template_description,
        it.invoice_prefix,
        it.tax_rate,
        it.primary_color,
        it.default_payment_mode,
        it.currency,
        it.auto_generate_number,
        -- Layout configuration
        it.topbar_enabled,
        it.topbar_text,
        it.topbar_background_color,
        it.topbar_text_color,
        -- Header configuration
        it.header_enabled,
        it.header_logo_enabled,
        it.header_company_name_enabled,
        it.header_company_name,
        it.header_company_address,
        it.header_company_contact,
        it.header_company_gstin,
        it.header_background_color,
        it.header_text_color,
        -- Body configuration
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
        -- Footer configuration
        it.footer_enabled,
        it.footer_text,
        it.footer_background_color,
        it.footer_text_color
    FROM megha_stores s
    LEFT JOIN invoice_templates it ON s.invoice_template_id = it.id
    WHERE s.store_code = store_code_param
    AND s.is_active = true
    AND it.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invoice_templates_template_code ON invoice_templates(template_code);
CREATE INDEX IF NOT EXISTS idx_invoice_templates_active ON invoice_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_invoice_templates_system ON invoice_templates(is_system_template);

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_store_invoice_template(VARCHAR) TO authenticated;

-- Create R R AGENCY store with dealer template
INSERT INTO megha_stores (
    store_code, store_name, store_type, store_description, is_active,
    invoice_template_id, theme_config, business_hours, features, social_links
) VALUES (
    'rragency-bheem', 'R R AGENCY', 'dealer', 
    'Dealer of paint, rice, cement, and construction materials', true,
    (SELECT id FROM invoice_templates WHERE template_code = 'dealer'),
    '{
        "primaryColor": "#1f2937",
        "secondaryColor": "#374151",
        "accentColor": "#6b7280",
        "backgroundGradient": "linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)",
        "navbarGradient": "linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)"
    }'::jsonb,
    '{
        "monday": {"open": "09:00", "close": "18:00"},
        "tuesday": {"open": "09:00", "close": "18:00"},
        "wednesday": {"open": "09:00", "close": "18:00"},
        "thursday": {"open": "09:00", "close": "18:00"},
        "friday": {"open": "09:00", "close": "18:00"},
        "saturday": {"open": "09:00", "close": "16:00"},
        "sunday": {"closed": true}
    }'::jsonb,
    '{
        "inventory": true,
        "delivery": true,
        "multiStore": false,
        "userRoles": true,
        "payment": true,
        "gst": true,
        "bulkOrders": true
    }'::jsonb,
    '{
        "website": "https://rragency.com",
        "phone": "+91-9876543218",
        "email": "info@rragency.com"
    }'::jsonb
) ON CONFLICT (store_code) DO UPDATE SET
    store_name = EXCLUDED.store_name,
    store_type = EXCLUDED.store_type,
    invoice_template_id = EXCLUDED.invoice_template_id,
    theme_config = EXCLUDED.theme_config;
