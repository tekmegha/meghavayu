-- Quick Setup Script for Invoice Template System
-- Run this script to set up the new template-based invoice system

-- Step 1: Apply the refactored schema
\i invoice-template-schema-refactored.sql

-- Step 2: Run migration if upgrading from old system
-- \i migrate-invoice-templates.sql

-- Step 3: Verify the setup
SELECT 'Template System Setup Complete!' as status;

-- Show all available templates
SELECT 
    template_code,
    template_name,
    invoice_prefix,
    tax_rate,
    primary_color,
    is_system_template
FROM invoice_templates
ORDER BY template_code;

-- Show store-template assignments
SELECT 
    s.store_code,
    s.store_name,
    it.template_code,
    it.template_name,
    it.invoice_prefix
FROM megha_stores s
LEFT JOIN invoice_templates it ON s.invoice_template_id = it.id
WHERE s.is_active = true
ORDER BY s.store_code;

-- Show default items count per template
SELECT 
    it.template_code,
    it.template_name,
    COUNT(di.id) as default_items_count
FROM invoice_templates it
LEFT JOIN default_items di ON it.id = di.template_id AND di.is_active = true
GROUP BY it.id, it.template_code, it.template_name
ORDER BY it.template_code;

-- Test template functions
SELECT 'Testing template functions...' as test_status;

-- Test get_store_invoice_template function
SELECT 
    'brew-buddy' as store_code,
    template_code,
    template_name,
    invoice_prefix,
    tax_rate
FROM get_store_invoice_template('brew-buddy');

-- Test get_template_default_items function
SELECT 
    'coffee template items' as test_type,
    item_name,
    default_rate,
    category
FROM get_template_default_items(
    (SELECT id FROM invoice_templates WHERE template_code = 'coffee')
);

SELECT 'Setup verification complete!' as final_status;
