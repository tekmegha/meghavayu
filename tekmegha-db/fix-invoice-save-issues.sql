-- ============================================
-- Fix Invoice Save Issues
-- Address potential problems in invoice creation
-- ============================================

-- 1. Ensure store_id is properly handled as UUID
-- Check if store_id column in invoices table is UUID type
SELECT 
    'Store ID Type Check' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'invoices' 
AND column_name = 'store_id';

-- 2. Verify invoice_items table structure
SELECT 
    'Invoice Items Structure' as check_type,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'invoice_items'
ORDER BY ordinal_position;

-- 3. Check if there are any existing invoices for RR Agency
SELECT 
    'Existing RR Agency Invoices' as check_type,
    COUNT(*) as invoice_count,
    MAX(created_at) as latest_invoice
FROM invoices i
JOIN megha_stores s ON i.store_id = s.id
WHERE s.store_code = 'rragency';

-- 4. Test invoice creation with RR Agency store
-- This will help identify any issues with the save process
INSERT INTO invoices (
    invoice_number, 
    date, 
    store_id, 
    store_name, 
    store_address, 
    store_contact,
    buyer_name, 
    buyer_address, 
    buyer_contact, 
    subtotal, 
    discount, 
    sgst, 
    cgst, 
    total, 
    balance_due, 
    payment_mode
)
SELECT 
    'TEST-' || EXTRACT(EPOCH FROM NOW())::TEXT,
    CURRENT_DATE,
    id,
    store_name,
    address,
    support_phone,
    'Test Customer',
    'Test Address',
    '+91-9999999999',
    300.00,
    0.00,
    27.00,
    27.00,
    354.00,
    354.00,
    'Cash'
FROM megha_stores 
WHERE store_code = 'rragency'
LIMIT 1;

-- 5. Test invoice items creation
INSERT INTO invoice_items (
    invoice_id, 
    item_name, 
    rate, 
    quantity, 
    amount, 
    final_amount, 
    sort_order
)
SELECT 
    (SELECT id FROM invoices WHERE invoice_number LIKE 'TEST-%' ORDER BY created_at DESC LIMIT 1),
    'Test Paint Item',
    150.00,
    2.00,
    300.00,
    300.00,
    1;

-- 6. Verify the test invoice was created successfully
SELECT 
    'Test Invoice Created' as status,
    i.invoice_number,
    i.store_name,
    i.buyer_name,
    i.total,
    COUNT(ii.id) as item_count
FROM invoices i
LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
WHERE i.invoice_number LIKE 'TEST-%'
GROUP BY i.id, i.invoice_number, i.store_name, i.buyer_name, i.total;

-- 7. Clean up test data
DELETE FROM invoice_items 
WHERE invoice_id IN (
    SELECT id FROM invoices WHERE invoice_number LIKE 'TEST-%'
);

DELETE FROM invoices 
WHERE invoice_number LIKE 'TEST-%';

-- ============================================
-- Summary of Potential Issues:
-- ============================================
-- 1. Store ID type compatibility (UUID vs string)
-- 2. FormArray items handling for simple form
-- 3. Tax calculation flexibility
-- 4. Error handling for missing store data
-- 5. Invoice number generation uniqueness
-- ============================================
