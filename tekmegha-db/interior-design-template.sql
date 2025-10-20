-- Interior Design Invoice Template
-- Based on the sophisticated, modern aesthetic with soft neutral colors and clean layout

-- Insert the interior design template
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
    'interior-design',
    'Interior Design Template',
    'Sophisticated template for interior design businesses with modern aesthetic, soft neutral colors, and clean layout',
    
    -- Layout Configuration
    true,
    'Creating beautiful spaces for you!',
    '#E0D8C7',  -- Light beige/tan background
    '#374151',  -- Dark gray text
    
    -- Header Configuration
    true,
    true,
    true,
    'Interior Design Studio',
    '123 Design Avenue, Creative District, City',
    '+91-9876543219',
    'GSTIN123456789',
    '#ffffff',  -- White background
    '#111827',  -- Dark text
    
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
    'DESCRIPTION',  -- Match the image labels
    'QTY',
    'PRICE',
    'TOTAL',
    'DISCOUNT',
    'FINAL AMOUNT',
    
    -- Footer Configuration
    true,
    'The origins of the first constellations date back to prehistoric times. Their purpose was to tell stories of their beliefs, experiences.',
    '#E0D8C7',  -- Light beige/tan background
    '#6b7280',  -- Medium gray text
    
    -- Invoice Settings
    'Card',  -- Interior design typically uses card payments
    12.00,  -- 12% tax rate for design services
    'INR',
    'ID',  -- Interior Design prefix
    true,
    
    -- Styling
    '#8B7355',  -- Warm brown primary color
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

-- Add specific comment for interior design template
INSERT INTO pg_description (objoid, classoid, objsubid, description)
SELECT 
    oid, 
    'pg_class'::regclass::oid, 
    0, 
    'Interior Design Template: Sophisticated template with soft neutral colors, clean layout, and modern aesthetic for interior design businesses'
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
WHERE template_code = 'interior-design';

-- Template created successfully - store-specific items will be managed via megha_stores
