-- Migration Script: Invoice Template System Refactoring
-- This script migrates from store-specific templates to reusable templates

-- Step 1: Backup existing data (optional but recommended)
CREATE TABLE IF NOT EXISTS invoice_templates_backup AS 
SELECT * FROM invoice_templates;

CREATE TABLE IF NOT EXISTS default_items_backup AS 
SELECT * FROM default_items;

-- Step 2: Create new template system
-- (This is already done by invoice-template-schema-refactored.sql)

-- Step 3: Migrate existing store-specific templates to new system
-- Create templates based on existing store data
INSERT INTO invoice_templates (
    template_code, template_name, template_description,
    default_payment_mode, tax_rate, invoice_prefix, primary_color,
    is_system_template
)
SELECT DISTINCT
    CASE 
        WHEN s.store_code LIKE '%brew%' OR s.store_code LIKE '%coffee%' THEN 'coffee'
        WHEN s.store_code LIKE '%food%' OR s.store_code LIKE '%royal%' THEN 'food'
        WHEN s.store_code LIKE '%insurance%' OR s.store_code LIKE '%dkassociates%' THEN 'insurance'
        WHEN s.store_code LIKE '%auto%' THEN 'automotive'
        WHEN s.store_code LIKE '%fashion%' THEN 'fashion'
        WHEN s.store_code LIKE '%electronic%' THEN 'electronics'
        WHEN s.store_code LIKE '%toy%' THEN 'toys'
        ELSE 'retail'
    END as template_code,
    CONCAT(s.store_name, ' Template') as template_name,
    CONCAT('Template for ', s.store_name) as template_description,
    COALESCE(it.default_payment_mode, 'Cash') as default_payment_mode,
    COALESCE(it.tax_rate, 9.00) as tax_rate,
    COALESCE(it.invoice_prefix, 'INV') as invoice_prefix,
    COALESCE(it.primary_color, '#dc2626') as primary_color,
    false as is_system_template
FROM megha_stores s
LEFT JOIN invoice_templates_backup it ON s.id = it.store_id
WHERE s.is_active = true
ON CONFLICT (template_code) DO NOTHING;

-- Step 4: Update megha_stores to reference new templates
UPDATE megha_stores 
SET invoice_template_id = (
    SELECT id FROM invoice_templates 
    WHERE template_code = CASE 
        WHEN store_code LIKE '%brew%' OR store_code LIKE '%coffee%' THEN 'coffee'
        WHEN store_code LIKE '%food%' OR store_code LIKE '%royal%' THEN 'food'
        WHEN store_code LIKE '%insurance%' OR store_code LIKE '%dkassociates%' THEN 'insurance'
        WHEN store_code LIKE '%auto%' THEN 'automotive'
        WHEN store_code LIKE '%fashion%' THEN 'fashion'
        WHEN store_code LIKE '%electronic%' THEN 'electronics'
        WHEN store_code LIKE '%toy%' THEN 'toys'
        ELSE 'retail'
    END
)
WHERE invoice_template_id IS NULL;

-- Step 5: Migrate default items from old system to new templates
INSERT INTO default_items (
    template_id, item_name, default_rate, default_quantity, 
    category, description, sort_order
)
SELECT 
    it.id as template_id,
    di.item_name,
    di.default_rate,
    di.default_quantity,
    di.category,
    di.description,
    COALESCE(di.sort_order, 0) as sort_order
FROM default_items_backup di
JOIN invoice_templates_backup it_old ON di.template_id = it_old.id
JOIN megha_stores s ON it_old.store_id = s.id
JOIN invoice_templates it ON (
    it.template_code = CASE 
        WHEN s.store_code LIKE '%brew%' OR s.store_code LIKE '%coffee%' THEN 'coffee'
        WHEN s.store_code LIKE '%food%' OR s.store_code LIKE '%royal%' THEN 'food'
        WHEN s.store_code LIKE '%insurance%' OR s.store_code LIKE '%dkassociates%' THEN 'insurance'
        WHEN s.store_code LIKE '%auto%' THEN 'automotive'
        WHEN s.store_code LIKE '%fashion%' THEN 'fashion'
        WHEN s.store_code LIKE '%electronic%' THEN 'electronics'
        WHEN s.store_code LIKE '%toy%' THEN 'toys'
        ELSE 'retail'
    END
)
ON CONFLICT DO NOTHING;

-- Step 6: Update invoice generation function to use new template system
CREATE OR REPLACE FUNCTION generate_invoice_number(store_code VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    next_number INTEGER;
    invoice_prefix VARCHAR(10);
    new_invoice_number VARCHAR(50);
BEGIN
    -- Get invoice prefix from template via store
    SELECT COALESCE(it.invoice_prefix, 'INV') INTO invoice_prefix
    FROM megha_stores s
    LEFT JOIN invoice_templates it ON s.invoice_template_id = it.id
    WHERE s.store_code = store_code AND s.is_active = true;
    
    -- If no template found, use default
    IF invoice_prefix IS NULL THEN
        invoice_prefix := 'INV';
    END IF;
    
    -- Get next sequential number
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO next_number
    FROM invoices i
    JOIN megha_stores s ON i.store_id = s.id
    WHERE s.store_code = store_code
    AND invoice_number ~ ('^' || invoice_prefix || '[0-9]+$');
    
    -- Format the invoice number
    new_invoice_number := invoice_prefix || LPAD(next_number::TEXT, 6, '0');
    
    RETURN new_invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Verification queries
-- Check template assignments
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

-- Check default items migration
SELECT 
    it.template_code,
    it.template_name,
    COUNT(di.id) as item_count
FROM invoice_templates it
LEFT JOIN default_items di ON it.id = di.template_id AND di.is_active = true
GROUP BY it.id, it.template_code, it.template_name
ORDER BY it.template_code;

-- Step 8: Clean up old tables (run this after verification)
-- DROP TABLE IF EXISTS invoice_templates_backup;
-- DROP TABLE IF EXISTS default_items_backup;

-- Step 9: Update RLS policies if needed
-- ALTER TABLE invoice_templates ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE default_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for templates
-- CREATE POLICY "Templates are viewable by authenticated users" ON invoice_templates
--     FOR SELECT TO authenticated USING (true);

-- CREATE POLICY "Default items are viewable by authenticated users" ON default_items
--     FOR SELECT TO authenticated USING (true);

-- CREATE POLICY "Only system admins can modify templates" ON invoice_templates
--     FOR ALL TO authenticated USING (false); -- Adjust based on your auth system

COMMENT ON TABLE invoice_templates_backup IS 'Backup of old store-specific templates before migration';
COMMENT ON TABLE default_items_backup IS 'Backup of old store-specific default items before migration';
