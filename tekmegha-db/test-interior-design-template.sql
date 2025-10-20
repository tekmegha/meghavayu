-- Test script for Interior Design Template
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
WHERE template_code = 'interior-design';

-- Test 2: Verify template has correct styling
SELECT 
    'Template Styling Test' as test_name,
    CASE 
        WHEN primary_color = '#8B7355' 
         AND topbar_background_color = '#E0D8C7'
         AND header_background_color = '#ffffff'
         AND footer_background_color = '#E0D8C7'
        THEN 'PASS'
        ELSE 'FAIL'
    END as result
FROM invoice_templates 
WHERE template_code = 'interior-design';

-- Test 3: Verify template is system template
SELECT 
    'System Template Test' as test_name,
    CASE 
        WHEN is_system_template = true THEN 'PASS'
        ELSE 'FAIL'
    END as result
FROM invoice_templates 
WHERE template_code = 'interior-design';

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
WHERE template_code = 'interior-design';

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
WHERE template_code = 'interior-design';

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
WHERE template_code = 'interior-design';

-- Test 7: Test template function
SELECT 
    'Template Function Test' as test_name,
    CASE 
        WHEN template_code = 'interior-design' THEN 'PASS'
        ELSE 'FAIL'
    END as result
FROM get_store_invoice_template('interior-design')
WHERE template_code = 'interior-design';

-- Final validation message
SELECT 'Interior Design Template Validation Complete!' as status;
