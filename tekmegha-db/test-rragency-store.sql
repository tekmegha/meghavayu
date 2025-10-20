-- ============================================
-- Test RR Agency Store Setup
-- Verify store details are properly configured
-- ============================================

-- Check if RR Agency store exists
SELECT 
    'Store Exists Check' as test_type,
    store_code,
    store_name,
    store_type,
    address,
    city,
    state,
    postal_code,
    contact_email,
    support_phone,
    is_active,
    is_verified,
    is_prod_ready
FROM megha_stores 
WHERE store_code = 'rragency';

-- Check store settings and bank details
SELECT 
    'Store Settings Check' as test_type,
    store_code,
    store_name,
    settings->'bankDetails' as bank_details,
    settings->'businessDetails' as business_details,
    social_links
FROM megha_stores 
WHERE store_code = 'rragency';

-- Check categories created for RR Agency
SELECT 
    'Categories Check' as test_type,
    c.name as category_name,
    c.description,
    c.slug,
    c.sort_order,
    c.is_active
FROM categories c
JOIN megha_stores ms ON c.megha_store_id = ms.id
WHERE ms.store_code = 'rragency'
ORDER BY c.sort_order;

-- Check products created for RR Agency
SELECT 
    'Products Check' as test_type,
    p.sku,
    p.name,
    p.price,
    p.description,
    p.category,
    p.is_available,
    p.is_featured
FROM products p
JOIN megha_stores ms ON p.megha_store_id = ms.id
WHERE ms.store_code = 'rragency'
ORDER BY p.name;

-- Test invoice creation data structure
SELECT 
    'Invoice Data Test' as test_type,
    store_code,
    store_name,
    address as store_address,
    support_phone as store_contact,
    settings->'businessDetails'->>'gstin' as store_gstin
FROM megha_stores 
WHERE store_code = 'rragency';

-- ============================================
-- Expected Results for RR Agency Store:
-- ============================================
-- Store Code: rragency
-- Store Name: R R AGENCY
-- Store Type: paint
-- Address: NH-16 Road, Old Police Station, Ranasthalam (Md), Srikakulam Dist. A.P-532407
-- City: Ranasthalam
-- State: Andhra Pradesh
-- Postal Code: 532407
-- Bank: HDFC BANK, A/C: 50200074652200, IFSC: HDFC0004002
-- Categories: Automotive Paints, Industrial Paints, Paint Accessories
-- Products: 8330 HE Paint, 8267 ASTI Paint, 8270 HIY Paint
-- ============================================
