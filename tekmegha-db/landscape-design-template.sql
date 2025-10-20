-- Landscape Design Invoice Template
-- Template for landscaping businesses, garden design services, and outdoor design companies
-- Features natural green colors and outdoor aesthetic

-- Insert the landscape design template
INSERT INTO invoice_templates (
    template_code, 
    template_name, 
    template_description,
    
    -- Layout Configuration
    topbar_enabled,
    topbar_text,
    topbar_background_color,
    topbar_text_color,
    
    -- Header Configuration
    header_enabled,
    header_logo_enabled,
    header_company_name_enabled,
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
    body_text_content,
    body_background_color,
    body_text_color,
    
    -- Table Layout Configuration
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
    footer_enabled,
    footer_text,
    footer_background_color,
    footer_text_color,
    
    -- Invoice Settings
    default_payment_mode,
    tax_rate,
    currency,
    invoice_prefix,
    auto_generate_number,
    
    -- Styling
    primary_color,
    secondary_color,
    
    -- Template Metadata
    is_active,
    is_system_template,
    created_at,
    updated_at
) VALUES (
    'landscape-design',
    'Landscape Design Template',
    'Professional template for landscaping businesses, garden design services, and outdoor design companies with natural green aesthetic',
    
    -- Layout Configuration
    true,
    'Transforming outdoor spaces into beautiful landscapes!',
    '#D1FAE5',  -- Light green background
    '#065F46',  -- Dark green text
    
    -- Header Configuration
    true,
    true,
    true,
    'Landscape Design Studio',
    '456 Garden Lane, Nature District, City',
    '+91-9876543220',
    'GSTIN123456790',
    '#ffffff',  -- White background
    '#064E3B',  -- Dark green text
    
    -- Body Configuration
    'table',
    true,
    true,
    false,  -- No striping for clean look
    NULL,
    '#ffffff',  -- White background
    '#374151',  -- Dark gray text
    
    -- Table Layout Configuration
    true,
    true,
    true,
    true,
    true,  -- Show discount for design services
    true,  -- Show final amount
    'SERVICE',  -- Landscape services
    'QTY',
    'RATE',
    'AMOUNT',
    'DISCOUNT',
    'TOTAL',
    
    -- Footer Configuration
    true,
    'Creating sustainable and beautiful outdoor environments. All work guaranteed with 1-year warranty on plants and installations.',
    '#D1FAE5',  -- Light green background
    '#047857',  -- Medium green text
    
    -- Invoice Settings
    'Card',  -- Landscape design typically uses card payments
    12.00,  -- 12% tax rate for design services
    'INR',
    'LS',  -- Landscape Services prefix
    true,
    
    -- Styling
    '#059669',  -- Green primary color
    '#ffffff',  -- White secondary color
    
    -- Template Metadata
    true,
    true,
    NOW(),
    NOW()
);

-- Note: Default items are not needed as store-specific overrides 
-- will come from megha_stores table when displaying invoices

-- Create a comment for the template
COMMENT ON TABLE invoice_templates IS 'Store-agnostic invoice templates that can be reused across multiple stores';

-- Add specific comment for landscape design template
INSERT INTO pg_description (objoid, classoid, objsubid, description)
SELECT 
    oid, 
    'pg_class'::regclass::oid, 
    0, 
    'Landscape Design Template: Professional template with natural green colors and outdoor aesthetic for landscaping businesses'
FROM pg_class 
WHERE relname = 'invoice_templates';

-- Verify the template was created successfully
SELECT 
    template_code,
    template_name,
    template_description,
    invoice_prefix,
    tax_rate,
    primary_color,
    topbar_background_color,
    header_background_color,
    footer_background_color,
    is_system_template
FROM invoice_templates 
WHERE template_code = 'landscape-design';

-- Template created successfully - store-specific items will be managed via megha_stores
