-- ============================================
-- QUICK DEALER TEMPLATE SETUP
-- ============================================
-- This script quickly applies the dealer template to an existing store
-- or creates a new store with the dealer template

-- Step 1: Ensure the dealer template exists
INSERT INTO invoice_templates (
    template_code, template_name, template_description,
    default_payment_mode, tax_rate, invoice_prefix, primary_color, is_system_template,
    topbar_text, topbar_background_color, topbar_text_color,
    header_company_name, header_company_address, header_company_contact, header_company_gstin,
    header_background_color, header_text_color,
    body_layout_type, body_table_headers_enabled, body_table_borders_enabled,
    body_table_striped, body_background_color, body_text_color,
    table_show_product, table_show_quantity, table_show_rate, table_show_amount,
    table_show_discount, table_show_final_amount,
    table_product_label, table_quantity_label, table_rate_label, table_amount_label,
    table_discount_label, table_final_amount_label,
    footer_text, footer_background_color, footer_text_color
) VALUES (
    'dealer', 'Dealer Template', 'Template for dealers of paint, rice, cement, and other bulk products',
    'Cash', 18.00, 'DLR', '#1f2937', true,
    'Quality products for your business!', '#f3f4f6', '#1f2937',
    'R R AGENCY', 'NH-16 Road, Old Police Station, Ranasthalam (Md), Srikakulam Dist. A.P-532407', 
    '+91-9876543218', '37AABCU9603R1Z5',
    '#ffffff', '#1f2937',
    'table', true, true, false, '#ffffff', '#374151',
    true, true, true, true, true, true,
    'Product Description', 'Qty', 'Rate', 'Amount', 'Discount', 'Final Amount',
    'Certificate that the particulars given above are correct. For R R AGENCY', '#f3f4f6', '#1f2937'
) ON CONFLICT (template_code) DO UPDATE SET
    template_name = EXCLUDED.template_name,
    template_description = EXCLUDED.template_description,
    header_company_name = EXCLUDED.header_company_name,
    header_company_address = EXCLUDED.header_company_address,
    footer_text = EXCLUDED.footer_text;

-- Step 2: Add default items for dealer template
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
        ('dealer', '8330 HE Paint (250ml)', 150.00, 1, 'Paint', 1),
        ('dealer', '8267 ASEI Paint (1L)', 450.00, 1, 'Paint', 2),
        ('dealer', '8270 HIY Paint (250ml)', 150.00, 1, 'Paint', 3),
        ('dealer', 'Rice (50kg)', 2000.00, 1, 'Grains', 4),
        ('dealer', 'Cement (50kg)', 350.00, 1, 'Construction', 5),
        ('dealer', 'Steel Rods (12mm)', 500.00, 10, 'Construction', 6),
        ('dealer', 'Sand (1 ton)', 800.00, 1, 'Construction', 7),
        ('dealer', 'Gravel (1 ton)', 600.00, 1, 'Construction', 8)
) AS items(template_code, item_name, default_rate, default_quantity, category, sort_order)
WHERE it.template_code = 'dealer'
ON CONFLICT (template_id, item_name) DO NOTHING;

-- Step 3: Create or update R R AGENCY store
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

-- Step 4: Create sample invoice
INSERT INTO invoices (
    invoice_number, date, store_id, buyer_name, buyer_address, buyer_contact,
    subtotal, discount, sgst, cgst, total, balance_due, payment_mode, items
) VALUES (
    'DLR-001', CURRENT_DATE,
    (SELECT id FROM megha_stores WHERE store_code = 'rragency-bheem'),
    'Sample Customer', '123 Customer Street, City', '+91-9876543210',
    750.00, 0.00, 67.50, 67.50, 885.00, 885.00, 'Cash',
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
) ON CONFLICT (invoice_number, store_id) DO NOTHING;

-- Step 5: Verification queries
SELECT 'Dealer Template Setup Complete' as status;

-- Show template details
SELECT 
    'Template Created' as item,
    template_name,
    template_code,
    invoice_prefix,
    tax_rate
FROM invoice_templates 
WHERE template_code = 'dealer';

-- Show default items count
SELECT 
    'Default Items' as item,
    COUNT(*) as count
FROM default_items di
JOIN invoice_templates it ON di.template_id = it.id
WHERE it.template_code = 'dealer';

-- Show store details
SELECT 
    'Store Created' as item,
    store_name,
    store_code,
    store_type
FROM megha_stores 
WHERE store_code = 'rragency-bheem';

-- Show sample invoice
SELECT 
    'Sample Invoice' as item,
    invoice_number,
    buyer_name,
    total,
    payment_mode
FROM invoices 
WHERE invoice_number = 'DLR-001';

-- Success message
SELECT 'Dealer template setup completed successfully! You can now access http://localhost:4200/rragency-bheem/invoice' as message;
