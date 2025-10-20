-- ============================================
-- Insert RR Agency Store
-- Paint Dealer Store Setup
-- ============================================

-- Insert RR Agency store with details from the bill image
INSERT INTO megha_stores (
    store_code,
    store_name,
    store_type,
    address,
    city,
    state,
    postal_code,
    country,
    contact_email,
    support_phone,
    description,
    business_hours,
    features,
    theme_config,
    settings,
    enable_products,
    enable_cart,
    enable_payments,
    enable_inventory,
    enable_invoices,
    enable_customers,
    enable_reports,
    is_active,
    is_verified,
    is_prod_ready
) VALUES (
    'rragency',  -- Store code as requested
    'R R AGENCY',  -- Store name from the bill
    'paint',  -- Store type for paint dealer
    'NH-16 Road, Old Police Station, Ranasthalam (Md), Srikakulam Dist. A.P-532407',  -- Full address from the bill
    'Ranasthalam',  -- City
    'Andhra Pradesh',  -- State
    '532407',  -- Postal code
    'India',  -- Country
    'contact@rragency.com',  -- Contact email (placeholder)
    '+91-XXXX-XXXXXX',  -- Support phone (placeholder)
    'R R AGENCY - Paint dealer specializing in automotive and industrial paints. Located in Ranasthalam, Srikakulam District, Andhra Pradesh.',  -- Description
    '{
        "monday": {"open": "09:00", "close": "18:00"},
        "tuesday": {"open": "09:00", "close": "18:00"},
        "wednesday": {"open": "09:00", "close": "18:00"},
        "thursday": {"open": "09:00", "close": "18:00"},
        "friday": {"open": "09:00", "close": "18:00"},
        "saturday": {"open": "09:00", "close": "14:00"},
        "sunday": {"open": null, "close": null, "closed": true}
    }'::jsonb,  -- Business hours
    '{
        "inventory": true,
        "delivery": true,
        "multiStore": false,
        "userRoles": true,
        "payment": true,
        "analytics": true,
        "loyaltyProgram": false,
        "invoiceGeneration": true,
        "customerManagement": true,
        "productCatalog": true
    }'::jsonb,  -- Features
    '{
        "primaryColor": "#1e40af",
        "secondaryColor": "#3b82f6",
        "accentColor": "#06b6d4",
        "warningColor": "#f59e0b",
        "dangerColor": "#dc2626",
        "backgroundColor": "#f8fafc",
        "surfaceColor": "#ffffff",
        "textPrimary": "#1f2937",
        "textSecondary": "#6b7280",
        "fontFamily": "Inter, sans-serif",
        "logo": "assets/images/rragency/logo.png",
        "layout": "modern"
    }'::jsonb,  -- Theme config with paint/industrial colors
    '{
        "currency": "INR",
        "timezone": "Asia/Kolkata",
        "language": "en",
        "taxEnabled": true,
        "gstEnabled": true,
        "invoiceNumbering": "auto",
        "defaultPaymentMethod": "cash",
        "allowPartialPayments": true,
        "autoGenerateInvoice": true
    }'::jsonb,  -- Settings
    true,   -- enable_products
    true,   -- enable_cart
    true,   -- enable_payments
    true,   -- enable_inventory
    true,   -- enable_invoices
    true,   -- enable_customers
    true,   -- enable_reports
    true,   -- is_active
    false,  -- is_verified (to be verified later)
    false   -- is_prod_ready (to be set when ready for production)
);

-- Add bank details to settings (extracted from the bill)
UPDATE megha_stores 
SET settings = settings || '{
    "bankDetails": {
        "bankName": "HDFC BANK",
        "accountNumber": "50200074652200",
        "ifscCode": "HDFC0004002",
        "branch": "Ranasthalam"
    },
    "businessDetails": {
        "gstin": "",
        "panNumber": "",
        "businessRegistration": "",
        "stateCode": "37"
    }
}'::jsonb
WHERE store_code = 'rragency';

-- Add social links placeholder
UPDATE megha_stores 
SET social_links = '{
    "facebook": "",
    "instagram": "",
    "twitter": "",
    "linkedin": "",
    "youtube": ""
}'::jsonb
WHERE store_code = 'rragency';

-- Verify the insertion
SELECT 
    store_code,
    store_name,
    store_type,
    address,
    city,
    state,
    postal_code,
    contact_email,
    support_phone,
    description,
    is_active,
    is_verified,
    is_prod_ready,
    created_at
FROM megha_stores 
WHERE store_code = 'rragency';

-- ============================================
-- Additional Setup for RR Agency
-- ============================================

-- Create a basic product category for paints
INSERT INTO categories (
    name,
    description,
    slug,
    megha_store_id,
    sort_order,
    is_active
) 
SELECT 
    'Automotive Paints',
    'Automotive paint products and accessories',
    'automotive-paints',
    id,
    1,
    true
FROM megha_stores 
WHERE store_code = 'rragency';

INSERT INTO categories (
    name,
    description,
    slug,
    megha_store_id,
    sort_order,
    is_active
) 
SELECT 
    'Industrial Paints',
    'Industrial paint products and coatings',
    'industrial-paints',
    id,
    2,
    true
FROM megha_stores 
WHERE store_code = 'rragency';

INSERT INTO categories (
    name,
    description,
    slug,
    megha_store_id,
    sort_order,
    is_active
) 
SELECT 
    'Paint Accessories',
    'Paint brushes, rollers, and other accessories',
    'paint-accessories',
    id,
    3,
    true
FROM megha_stores 
WHERE store_code = 'rragency';

-- Add some sample products based on the bill items
INSERT INTO products (
    megha_store_id,
    sku,
    name,
    price,
    description,
    category,
    is_available,
    is_featured
) 
SELECT 
    id,
    '8330-HE-250ML',
    '8330 HE Paint - 250ml',
    150.00,
    'High-quality automotive paint - 250ml container',
    'Automotive Paints',
    true,
    true
FROM megha_stores 
WHERE store_code = 'rragency';

INSERT INTO products (
    megha_store_id,
    sku,
    name,
    price,
    description,
    category,
    is_available,
    is_featured
) 
SELECT 
    id,
    '8267-ASTI-1L',
    '8267 ASTI Paint - 1L',
    450.00,
    'Premium automotive paint - 1L container',
    'Automotive Paints',
    true,
    true
FROM megha_stores 
WHERE store_code = 'rragency';

INSERT INTO products (
    megha_store_id,
    sku,
    name,
    price,
    description,
    category,
    is_available,
    is_featured
) 
SELECT 
    id,
    '8270-HIY-250ML',
    '8270 HIY Paint - 250ml',
    150.00,
    'High-quality automotive paint - 250ml container',
    'Automotive Paints',
    true,
    true
FROM megha_stores 
WHERE store_code = 'rragency';

-- Verify the complete setup
SELECT 
    'Store Created' as status,
    store_code,
    store_name,
    store_type,
    address,
    city,
    state
FROM megha_stores 
WHERE store_code = 'rragency';

SELECT 
    'Categories Created' as status,
    COUNT(*) as category_count
FROM categories c
JOIN megha_stores ms ON c.megha_store_id = ms.id
WHERE ms.store_code = 'rragency';

SELECT 
    'Products Created' as status,
    COUNT(*) as product_count
FROM products p
JOIN megha_stores ms ON p.megha_store_id = ms.id
WHERE ms.store_code = 'rragency';

-- ============================================
-- Setup Complete for RR Agency
-- ============================================
-- Store Code: rragency
-- Store Name: R R AGENCY
-- Store Type: paint
-- Address: NH-16 Road, Old Police Station, Ranasthalam (Md), Srikakulam Dist. A.P-532407
-- Bank Details: HDFC BANK, A/C: 50200074652200, IFSC: HDFC0004002
-- Features: Inventory, Invoicing, Customer Management, Product Catalog
-- ============================================
