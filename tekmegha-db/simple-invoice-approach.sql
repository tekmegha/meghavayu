-- ============================================
-- SIMPLE APPROACH: USE EXISTING INVOICE_ITEMS
-- ============================================
-- No need for default_items table
-- Just use invoice_items table for all invoice line items

-- Create function to get sample items for a template (optional)
CREATE OR REPLACE FUNCTION get_template_sample_items(template_code_param VARCHAR)
RETURNS TABLE(
    item_name VARCHAR,
    suggested_rate DECIMAL,
    suggested_quantity INTEGER,
    category VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        items.item_name,
        items.suggested_rate,
        items.suggested_quantity,
        items.category
    FROM (
        VALUES 
            -- Retail Template
            ('retail', 'General Item', 100.00, 1, 'General'),
            ('retail', 'Service Fee', 50.00, 1, 'Service'),
            
            -- Food Template
            ('food', 'Rice (1kg)', 60.00, 2, 'Grains'),
            ('food', 'Wheat Flour (1kg)', 40.00, 1, 'Grains'),
            ('food', 'Cooking Oil (1L)', 120.00, 1, 'Oil'),
            ('food', 'Sugar (1kg)', 45.00, 1, 'Sweeteners'),
            
            -- Coffee Template
            ('coffee', 'Coffee Beans (250g)', 250.00, 1, 'Coffee'),
            ('coffee', 'Espresso Shot', 45.00, 2, 'Coffee'),
            ('coffee', 'Cappuccino', 55.00, 1, 'Coffee'),
            ('coffee', 'Latte', 65.00, 1, 'Coffee'),
            ('coffee', 'Pastry', 80.00, 1, 'Food'),
            
            -- Insurance Template
            ('insurance', 'Insurance Policy', 5000.00, 1, 'Insurance'),
            ('insurance', 'Processing Fee', 500.00, 1, 'Fee'),
            ('insurance', 'Documentation', 200.00, 1, 'Service'),
            ('insurance', 'Renewal Fee', 300.00, 1, 'Fee'),
            
            -- Automotive Template
            ('automotive', 'Service Charge', 800.00, 1, 'Service'),
            ('automotive', 'Parts', 500.00, 1, 'Parts'),
            ('automotive', 'Oil Change', 300.00, 1, 'Service'),
            ('automotive', 'Inspection', 200.00, 1, 'Service'),
            
            -- Fashion Template
            ('fashion', 'Clothing Item', 800.00, 1, 'Clothing'),
            ('fashion', 'Accessories', 200.00, 1, 'Accessories'),
            ('fashion', 'Footwear', 600.00, 1, 'Footwear'),
            
            -- Electronics Template
            ('electronics', 'Electronic Device', 5000.00, 1, 'Electronics'),
            ('electronics', 'Accessories', 300.00, 1, 'Accessories'),
            ('electronics', 'Installation', 500.00, 1, 'Service'),
            ('electronics', 'Warranty Extension', 800.00, 1, 'Service'),
            
            -- Toys Template
            ('toys', 'Educational Toy', 400.00, 1, 'Educational'),
            ('toys', 'Action Figure', 250.00, 1, 'Action'),
            ('toys', 'Board Game', 350.00, 1, 'Games'),
            ('toys', 'Puzzle', 150.00, 1, 'Educational'),
            
            -- Dealer Template (Paint, Rice, Cement, etc.)
            ('dealer', '8330 HE Paint (250ml)', 150.00, 1, 'Paint'),
            ('dealer', '8267 ASEI Paint (1L)', 450.00, 1, 'Paint'),
            ('dealer', '8270 HIY Paint (250ml)', 150.00, 1, 'Paint'),
            ('dealer', 'Rice (50kg)', 2000.00, 1, 'Grains'),
            ('dealer', 'Cement (50kg)', 350.00, 1, 'Construction'),
            ('dealer', 'Steel Rods (12mm)', 500.00, 10, 'Construction'),
            ('dealer', 'Sand (1 ton)', 800.00, 1, 'Construction'),
            ('dealer', 'Gravel (1 ton)', 600.00, 1, 'Construction')
            
    ) AS items(template_code, item_name, suggested_rate, suggested_quantity, category)
    WHERE items.template_code = template_code_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to add sample items to a new invoice
CREATE OR REPLACE FUNCTION add_sample_items_to_invoice(invoice_id_param BIGINT, template_code_param VARCHAR)
RETURNS VOID AS $$
DECLARE
    item_record RECORD;
    item_counter INTEGER := 1;
BEGIN
    -- Add sample items based on template
    FOR item_record IN 
        SELECT * FROM get_template_sample_items(template_code_param)
    LOOP
        INSERT INTO invoice_items (
            invoice_id,
            item_name,
            quantity,
            rate,
            amount,
            discount,
            final_amount,
            sort_order
        ) VALUES (
            invoice_id_param,
            item_record.item_name,
            item_record.suggested_quantity,
            item_record.suggested_rate,
            item_record.suggested_rate * item_record.suggested_quantity,
            0.00,
            item_record.suggested_rate * item_record.suggested_quantity,
            item_counter
        );
        
        item_counter := item_counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_template_sample_items(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION add_sample_items_to_invoice(BIGINT, VARCHAR) TO authenticated;

-- Example usage:
-- 1. Get sample items for dealer template
-- SELECT * FROM get_template_sample_items('dealer');

-- 2. Add sample items to a new invoice
-- SELECT add_sample_items_to_invoice(1, 'dealer');
