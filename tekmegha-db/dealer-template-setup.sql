-- ============================================
-- DEALER TEMPLATE SETUP
-- ============================================
-- This script sets up the dealer template for businesses dealing with
-- paint, rice, cement, and other bulk products like R R AGENCY

-- Insert the dealer template
INSERT INTO invoice_templates (
    template_code, 
    template_name, 
    template_description,
    default_payment_mode, 
    tax_rate, 
    invoice_prefix,
    primary_color, 
    is_system_template,
    
    -- Topbar Configuration
    topbar_text, 
    topbar_background_color, 
    topbar_text_color,
    
    -- Header Configuration
    header_company_name, 
    header_company_address, 
    header_company_contact,
    header_company_gstin,
    header_background_color, 
    header_text_color,
    
    -- Body Configuration
    body_layout_type, 
    body_table_headers_enabled, 
    body_table_borders_enabled,
    body_table_striped,
    body_background_color, 
    body_text_color,
    
    -- Table Configuration
    table_show_product, 
    table_show_quantity, 
    table_show_rate, 
    table_show_amount,
    table_show_discount, 
    table_show_final_amount,
    table_product_label, 
    table_quantity_label, 
    table_rate_label, 
    table_amount_label,
    table_discount_label, 
    table_final_amount_label,
    
    -- Footer Configuration
    footer_text, 
    footer_background_color, 
    footer_text_color
) VALUES (
    'dealer', 
    'Dealer Template', 
    'Template for dealers of paint, rice, cement, and other bulk products',
    'Cash', 
    18.00, 
    'DLR', 
    '#1f2937', 
    true,
    
    -- Topbar
    'Quality products for your business!', 
    '#f3f4f6', 
    '#1f2937',
    
    -- Header
    'R R AGENCY', 
    'NH-16 Road, Old Police Station, Ranasthalam (Md), Srikakulam Dist. A.P-532407', 
    '+91-9876543218',
    '37AABCU9603R1Z5',
    '#ffffff', 
    '#1f2937',
    
    -- Body
    'table', 
    true, 
    true,
    false,
    '#ffffff', 
    '#374151',
    
    -- Table
    true, 
    true, 
    true, 
    true,
    true, 
    true,
    'Product Description', 
    'Qty', 
    'Rate', 
    'Amount',
    'Discount', 
    'Final Amount',
    
    -- Footer
    'Certificate that the particulars given above are correct. For R R AGENCY', 
    '#f3f4f6', 
    '#1f2937'
) ON CONFLICT (template_code) DO UPDATE SET
    template_name = EXCLUDED.template_name,
    template_description = EXCLUDED.template_description,
    header_company_name = EXCLUDED.header_company_name,
    header_company_address = EXCLUDED.header_company_address,
    footer_text = EXCLUDED.footer_text;

-- Insert default items for dealer template
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
        -- Paint Products
        ('dealer', '8330 HE Paint (250ml)', 150.00, 1, 'Paint', 1),
        ('dealer', '8267 ASEI Paint (1L)', 450.00, 1, 'Paint', 2),
        ('dealer', '8270 HIY Paint (250ml)', 150.00, 1, 'Paint', 3),
        ('dealer', 'Primer Base Coat', 200.00, 1, 'Paint', 4),
        ('dealer', 'Top Coat Finish', 180.00, 1, 'Paint', 5),
        
        -- Rice & Grains
        ('dealer', 'Basmati Rice (50kg)', 2500.00, 1, 'Grains', 6),
        ('dealer', 'Regular Rice (50kg)', 2000.00, 1, 'Grains', 7),
        ('dealer', 'Wheat (50kg)', 1800.00, 1, 'Grains', 8),
        ('dealer', 'Dal (25kg)', 1200.00, 1, 'Grains', 9),
        
        -- Construction Materials
        ('dealer', 'Cement (50kg)', 350.00, 1, 'Construction', 10),
        ('dealer', 'Steel Rods (12mm)', 500.00, 10, 'Construction', 11),
        ('dealer', 'Sand (1 ton)', 800.00, 1, 'Construction', 12),
        ('dealer', 'Gravel (1 ton)', 600.00, 1, 'Construction', 13),
        ('dealer', 'Bricks (1000 pcs)', 5000.00, 1, 'Construction', 14),
        ('dealer', 'Tiles (1 sq ft)', 25.00, 100, 'Construction', 15),
        
        -- Hardware & Tools
        ('dealer', 'Nails (1 kg)', 80.00, 1, 'Hardware', 16),
        ('dealer', 'Screws (1 kg)', 120.00, 1, 'Hardware', 17),
        ('dealer', 'Wire (100m)', 200.00, 1, 'Hardware', 18),
        ('dealer', 'Pipe (6ft)', 150.00, 1, 'Hardware', 19)
        
) AS items(template_code, item_name, default_rate, default_quantity, category, sort_order)
WHERE it.template_code = 'dealer';

-- Create a sample store using the dealer template
INSERT INTO megha_stores (
    store_code,
    store_name,
    store_type,
    store_description,
    is_active,
    invoice_template_id,
    theme_config,
    business_hours,
    features,
    social_links
) VALUES (
    'rragency-bheem',
    'R R AGENCY',
    'dealer',
    'Dealer of paint, rice, cement, and construction materials',
    true,
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

-- Create sample invoice for R R AGENCY
INSERT INTO invoices (
    invoice_number,
    date,
    store_id,
    buyer_name,
    buyer_address,
    buyer_contact,
    buyer_gstin,
    subtotal,
    discount,
    sgst,
    cgst,
    total,
    balance_due,
    payment_mode,
    items
) VALUES (
    'DLR-001',
    CURRENT_DATE,
    (SELECT id FROM megha_stores WHERE store_code = 'rragency-bheem'),
    'Sample Customer',
    '123 Customer Street, City',
    '+91-9876543210',
    '29ABCDE1234F1Z5',
    750.00,
    0.00,
    67.50,
    67.50,
    885.00,
    885.00,
    'Cash',
    '[
        {
            "itemName": "8330 HE Paint (250ml)",
            "quantity": 1,
            "rate": 150.00,
            "amount": 150.00,
            "discount": 0.00,
            "finalAmount": 150.00
        },
        {
            "itemName": "8267 ASEI Paint (1L)",
            "quantity": 1,
            "rate": 450.00,
            "amount": 450.00,
            "discount": 0.00,
            "finalAmount": 450.00
        },
        {
            "itemName": "8270 HIY Paint (250ml)",
            "quantity": 1,
            "rate": 150.00,
            "amount": 150.00,
            "discount": 0.00,
            "finalAmount": 150.00
        }
    ]'::jsonb
);

-- Create function to get dealer-specific invoice template
CREATE OR REPLACE FUNCTION get_dealer_invoice_template()
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
    -- Header configuration
    header_enabled BOOLEAN,
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
        it.invoice_prefix,
        it.tax_rate,
        it.primary_color,
        it.default_payment_mode,
        -- Layout configuration
        it.topbar_enabled,
        it.topbar_text,
        it.topbar_background_color,
        it.topbar_text_color,
        -- Header configuration
        it.header_enabled,
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
    FROM invoice_templates it
    WHERE it.template_code = 'dealer'
    AND it.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create function to get dealer default items
CREATE OR REPLACE FUNCTION get_dealer_default_items()
RETURNS TABLE(
    item_name VARCHAR,
    default_rate DECIMAL,
    default_quantity INTEGER,
    category VARCHAR,
    sort_order INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        di.item_name,
        di.default_rate,
        di.default_quantity,
        di.category,
        di.sort_order
    FROM default_items di
    JOIN invoice_templates it ON di.template_id = it.id
    WHERE it.template_code = 'dealer'
    ORDER BY di.sort_order;
END;
$$ LANGUAGE plpgsql;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_invoice_templates_dealer ON invoice_templates(template_code) WHERE template_code = 'dealer';
CREATE INDEX IF NOT EXISTS idx_default_items_dealer ON default_items(template_id) WHERE template_id = (SELECT id FROM invoice_templates WHERE template_code = 'dealer');

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_dealer_invoice_template() TO authenticated;
GRANT EXECUTE ON FUNCTION get_dealer_default_items() TO authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify template creation
SELECT 'Dealer Template Created' as status, template_name, template_code 
FROM invoice_templates 
WHERE template_code = 'dealer';

-- Verify default items
SELECT 'Dealer Default Items' as status, COUNT(*) as item_count
FROM default_items di
JOIN invoice_templates it ON di.template_id = it.id
WHERE it.template_code = 'dealer';

-- Verify store creation
SELECT 'R R AGENCY Store Created' as status, store_name, store_code
FROM megha_stores 
WHERE store_code = 'rragency-bheem';

-- Verify sample invoice
SELECT 'Sample Invoice Created' as status, invoice_number, total
FROM invoices 
WHERE invoice_number = 'DLR-001';
