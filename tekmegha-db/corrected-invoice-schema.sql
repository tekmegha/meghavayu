-- ============================================
-- CORRECTED INVOICE SCHEMA
-- ============================================
-- This is the proper schema for invoices and invoice_items tables

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;

-- Create invoices table with proper structure
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    date DATE NOT NULL,
    store_id UUID NOT NULL,
    
    -- Store Information
    store_name VARCHAR(255) NOT NULL,
    store_address TEXT,
    store_contact VARCHAR(50),
    store_gstin VARCHAR(20),
    
    -- Buyer Information
    buyer_name VARCHAR(255) NOT NULL,
    buyer_address TEXT,
    buyer_contact VARCHAR(50),
    buyer_gstin VARCHAR(20),
    
    -- Financial Details
    subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount DECIMAL(12,2) NOT NULL DEFAULT 0,
    sgst DECIMAL(12,2) NOT NULL DEFAULT 0,
    cgst DECIMAL(12,2) NOT NULL DEFAULT 0,
    total DECIMAL(12,2) NOT NULL DEFAULT 0,
    balance_due DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_mode VARCHAR(50) NOT NULL DEFAULT 'Cash',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by BIGINT,
    
    -- Constraints
    CONSTRAINT invoices_store_id_fkey FOREIGN KEY (store_id) REFERENCES megha_stores(id),
    CONSTRAINT invoices_total_check CHECK (total >= 0),
    CONSTRAINT invoices_subtotal_check CHECK (subtotal >= 0),
    CONSTRAINT invoices_discount_check CHECK (discount >= 0)
);

-- Create invoice_items table with proper structure
CREATE TABLE invoice_items (
    id BIGSERIAL PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    amount DECIMAL(12,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(12,2) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT invoice_items_invoice_id_fkey FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    CONSTRAINT invoice_items_rate_check CHECK (rate >= 0),
    CONSTRAINT invoice_items_quantity_check CHECK (quantity > 0),
    CONSTRAINT invoice_items_amount_check CHECK (amount >= 0)
);

-- Create indexes for better performance
CREATE INDEX idx_invoices_store_id ON invoices(store_id);
CREATE INDEX idx_invoices_date ON invoices(date);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_buyer_name ON invoices(buyer_name);
CREATE INDEX idx_invoices_created_at ON invoices(created_at);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
CREATE INDEX idx_invoice_items_item_name ON invoice_items(item_name);

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number(store_code_param VARCHAR, template_prefix VARCHAR DEFAULT 'INV')
RETURNS VARCHAR AS $$
DECLARE
    next_number INTEGER;
    invoice_number VARCHAR(50);
BEGIN
    -- Get the next invoice number for this store
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM LENGTH(template_prefix) + 1) AS INTEGER)), 0) + 1
    INTO next_number
    FROM invoices i
    JOIN megha_stores s ON i.store_id = s.id
    WHERE s.store_code = store_code_param
    AND invoice_number LIKE template_prefix || '%';
    
    -- Format the invoice number
    invoice_number := template_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
    
    RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate invoice totals
CREATE OR REPLACE FUNCTION calculate_invoice_totals(invoice_id_param BIGINT)
RETURNS VOID AS $$
DECLARE
    invoice_record RECORD;
    subtotal_calc DECIMAL(12,2) := 0;
    total_calc DECIMAL(12,2) := 0;
    tax_rate DECIMAL(5,2) := 18.00; -- Default tax rate
BEGIN
    -- Get invoice details
    SELECT * INTO invoice_record FROM invoices WHERE id = invoice_id_param;
    
    -- Calculate subtotal from items
    SELECT COALESCE(SUM(amount), 0) INTO subtotal_calc
    FROM invoice_items 
    WHERE invoice_id = invoice_id_param;
    
    -- Calculate total with tax
    total_calc := subtotal_calc + (subtotal_calc * tax_rate / 100);
    
    -- Update invoice with calculated totals
    UPDATE invoices 
    SET 
        subtotal = subtotal_calc,
        sgst = (subtotal_calc * tax_rate / 200), -- Half of total tax
        cgst = (subtotal_calc * tax_rate / 200), -- Half of total tax
        total = total_calc,
        balance_due = total_calc,
        updated_at = NOW()
    WHERE id = invoice_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate totals when items change
CREATE OR REPLACE FUNCTION trigger_calculate_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate totals for the affected invoice
    PERFORM calculate_invoice_totals(COALESCE(NEW.invoice_id, OLD.invoice_id));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_invoice_items_totals
    AFTER INSERT OR UPDATE OR DELETE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION trigger_calculate_invoice_totals();

-- Grant permissions
GRANT ALL ON invoices TO authenticated;
GRANT ALL ON invoice_items TO authenticated;
GRANT EXECUTE ON FUNCTION generate_invoice_number(VARCHAR, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_invoice_totals(BIGINT) TO authenticated;

-- Insert sample invoice for testing (only if rragency-bheem store exists)
INSERT INTO invoices (
    invoice_number, date, store_id, store_name, store_address, store_contact,
    buyer_name, buyer_address, buyer_contact, subtotal, discount, sgst, cgst, total, balance_due, payment_mode
)
SELECT 
    'DLR-0001', CURRENT_DATE,
    id,
    'R R AGENCY', 'NH-16 Road, Old Police Station, Ranasthalam (Md), Srikakulam Dist. A.P-532407', '+91-9876543218',
    'Sample Customer', '123 Customer Street, City', '+91-9876543210',
    750.00, 0.00, 67.50, 67.50, 885.00, 885.00, 'Cash'
FROM megha_stores 
WHERE store_code = 'rragency-bheem'
LIMIT 1;

-- Insert sample invoice items
INSERT INTO invoice_items (invoice_id, item_name, rate, quantity, amount, final_amount, sort_order)
SELECT 
    (SELECT id FROM invoices WHERE invoice_number = 'DLR-0001'),
    items.item_name,
    items.rate,
    items.quantity,
    items.amount,
    items.final_amount,
    items.sort_order
FROM (VALUES 
    ('8330 HE Paint (250ml)', 150.00, 1, 150.00, 150.00, 1),
    ('8267 ASEI Paint (1L)', 450.00, 1, 450.00, 450.00, 2),
    ('8270 HIY Paint (250ml)', 150.00, 1, 150.00, 150.00, 3)
) AS items(item_name, rate, quantity, amount, final_amount, sort_order);

-- Verify the setup
SELECT 'Invoice Schema Setup Complete' as status;

-- Show sample data
SELECT 
    'Sample Invoice Created' as item,
    invoice_number,
    buyer_name,
    total,
    payment_mode
FROM invoices 
WHERE invoice_number = 'DLR-0001';

-- Show sample items
SELECT 
    'Sample Items Created' as item,
    COUNT(*) as item_count
FROM invoice_items 
WHERE invoice_id = (SELECT id FROM invoices WHERE invoice_number = 'DLR-0001');
