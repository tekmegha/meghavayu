-- Test script for Landscape Design Template
-- This script validates the template creation and functionality

-- Test 1: Verify template was created
SELECT 
    'Template Creation Test' as test_name,
    CASE 
        WHEN COUNT(*) = 1 THEN 'PASS'
        ELSE 'FAIL'
    END as result,
    COUNT(*) as template_count
FROM invoice_templates 
WHERE template_code = 'landscape-design';

-- Test 2: Verify template has correct styling
SELECT 
    'Template Styling Test' as test_name,
    CASE 
        WHEN primary_color = '#059669' 
         AND topbar_background_color = '#D1FAE5'
         AND header_background_color = '#ffffff'
         AND footer_background_color = '#D1FAE5'
        THEN 'PASS'
        ELSE 'FAIL'
    END as result
FROM invoice_templates 
WHERE template_code = 'landscape-design';

-- Test 3: Verify template is system template
SELECT 
    'System Template Test' as test_name,
    CASE 
        WHEN is_system_template = true THEN 'PASS'
        ELSE 'FAIL'
    END as result
FROM invoice_templates 
WHERE template_code = 'landscape-design';

-- Test 4: Verify template constraints
SELECT 
    'Template Constraints Test' as test_name,
    CASE 
        WHEN template_code ~ '^[a-z0-9-]+$' 
         AND tax_rate >= 0 
         AND tax_rate <= 100
         AND is_active = true
         AND is_system_template = true
        THEN 'PASS'
        ELSE 'FAIL'
    END as result
FROM invoice_templates 
WHERE template_code = 'landscape-design';

-- Test 5: Show template summary
SELECT 
    'Template Summary' as info_type,
    template_code,
    template_name,
    invoice_prefix,
    tax_rate,
    primary_color,
    topbar_text,
    footer_text
FROM invoice_templates 
WHERE template_code = 'landscape-design';

-- Test 6: Show template configuration summary
SELECT 
    'Template Configuration Summary' as info_type,
    template_code,
    template_name,
    invoice_prefix,
    tax_rate,
    primary_color,
    is_system_template
FROM invoice_templates 
WHERE template_code = 'landscape-design';

-- Test 7: Test template function
SELECT 
    'Template Function Test' as test_name,
    CASE 
        WHEN template_code = 'landscape-design' THEN 'PASS'
        ELSE 'FAIL'
    END as result
FROM get_store_invoice_template('landscape-design')
WHERE template_code = 'landscape-design';

-- Test 8: Verify color scheme consistency
SELECT 
    'Color Scheme Test' as test_name,
    CASE 
        WHEN primary_color LIKE '#%' 
         AND topbar_background_color LIKE '#%'
         AND header_background_color LIKE '#%'
         AND footer_background_color LIKE '#%'
         AND topbar_text_color LIKE '#%'
         AND header_text_color LIKE '#%'
         AND footer_text_color LIKE '#%'
        THEN 'PASS'
        ELSE 'FAIL'
    END as result
FROM invoice_templates 
WHERE template_code = 'landscape-design';

-- Final validation message
SELECT 'Landscape Design Template Validation Complete!' as status;
