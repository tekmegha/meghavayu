-- ============================================
-- Test Store Data Loading for Invoice Creation
-- Verify that store data is properly structured for frontend
-- ============================================

-- 1. Check RR Agency store data structure
SELECT 
    'RR Agency Store Data' as test_type,
    store_code,
    store_name,
    address,
    support_phone,
    tax_id,
    contact_email,
    city,
    state,
    postal_code
FROM megha_stores 
WHERE store_code = 'rragency';

-- 2. Test the exact query that the frontend will use
SELECT 
    'Frontend Query Test' as test_type,
    store_name,
    address,
    support_phone,
    tax_id,
    contact_email,
    city,
    state,
    postal_code,
    settings->'bankDetails' as bank_details
FROM megha_stores 
WHERE store_code = 'rragency'
AND is_active = true;

-- 3. Verify all required fields are present
SELECT 
    'Required Fields Check' as test_type,
    CASE 
        WHEN store_name IS NOT NULL AND store_name != '' THEN '✓' 
        ELSE '✗' 
    END as store_name_ok,
    CASE 
        WHEN address IS NOT NULL AND address != '' THEN '✓' 
        ELSE '✗' 
    END as address_ok,
    CASE 
        WHEN support_phone IS NOT NULL AND support_phone != '' THEN '✓' 
        ELSE '✗' 
    END as support_phone_ok,
    CASE 
        WHEN tax_id IS NOT NULL AND tax_id != '' THEN '✓' 
        ELSE '✗' 
    END as tax_id_ok
FROM megha_stores 
WHERE store_code = 'rragency';

-- 4. Test the condition that the frontend checks
SELECT 
    'Frontend Condition Test' as test_type,
    CASE 
        WHEN store_name IS NOT NULL 
         AND address IS NOT NULL 
         AND support_phone IS NOT NULL 
        THEN 'Store data will be loaded successfully'
        ELSE 'Store data will fall back to dummy data'
    END as result
FROM megha_stores 
WHERE store_code = 'rragency';

-- 5. Show what the frontend will receive
SELECT 
    'Frontend Data Structure' as test_type,
    json_build_object(
        'store_name', store_name,
        'address', address,
        'support_phone', support_phone,
        'tax_id', tax_id,
        'contact_email', contact_email,
        'city', city,
        'state', state,
        'postal_code', postal_code
    ) as store_data_json
FROM megha_stores 
WHERE store_code = 'rragency';

-- ============================================
-- Expected Results:
-- ============================================
-- 1. Store Code: rragency
-- 2. Store Name: R R AGENCY
-- 3. Address: NH-16 Road, Old Police Station, Ranasthalam (Md), Srikakulam Dist. A.P-532407
-- 4. Support Phone: +91-XXXX-XXXXXX
-- 5. Tax ID: (should be populated from settings)
-- 6. All required fields should be ✓
-- 7. Frontend condition should pass
-- ============================================
