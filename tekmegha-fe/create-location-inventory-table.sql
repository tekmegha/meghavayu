-- Create Location Inventory Table
-- This table tracks inventory levels at specific store locations

-- Create location_inventory table
CREATE TABLE IF NOT EXISTS location_inventory (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    location_id UUID NOT NULL REFERENCES store_locations(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER DEFAULT 10,
    max_quantity INTEGER DEFAULT 1000,
    is_available BOOLEAN DEFAULT true,
    last_restocked_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique product-location combinations
    UNIQUE(product_id, location_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_location_inventory_product ON location_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_location_inventory_location ON location_inventory(location_id);
CREATE INDEX IF NOT EXISTS idx_location_inventory_available ON location_inventory(is_available);
CREATE INDEX IF NOT EXISTS idx_location_inventory_quantity ON location_inventory(quantity);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_location_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_location_inventory_updated_at
    BEFORE UPDATE ON location_inventory
    FOR EACH ROW
    EXECUTE FUNCTION update_location_inventory_updated_at();

-- Enable RLS
ALTER TABLE location_inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policies for location_inventory
-- Public can read available inventory
CREATE POLICY "Public can read available inventory"
ON location_inventory
FOR SELECT
TO anon, authenticated
USING (is_available = true AND quantity > 0);

-- Authenticated users can read inventory for their stores
CREATE POLICY "Users can read inventory for their stores"
ON location_inventory
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_roles ur 
        JOIN store_locations sl ON ur.megha_store_id = sl.megha_store_id
        WHERE ur.user_id = auth.uid() 
        AND sl.id = location_inventory.location_id
        AND ur.is_active = true
    )
);

-- Store admins and managers can manage inventory
CREATE POLICY "Store admins can manage inventory"
ON location_inventory
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_roles ur 
        JOIN store_locations sl ON ur.megha_store_id = sl.megha_store_id
        WHERE ur.user_id = auth.uid() 
        AND sl.id = location_inventory.location_id
        AND ur.role IN ('store_admin', 'store_manager', 'inventory_manager', 'super_admin')
        AND ur.is_active = true
    )
);

-- Create a function to get available quantity
CREATE OR REPLACE FUNCTION get_available_quantity(p_product_id UUID, p_location_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    available_qty INTEGER;
BEGIN
    SELECT (quantity - reserved_quantity) INTO available_qty
    FROM location_inventory
    WHERE product_id = p_product_id 
    AND location_id = p_location_id
    AND is_available = true;
    
    RETURN COALESCE(available_qty, 0);
END;
$$;

-- Create a function to reserve inventory
CREATE OR REPLACE FUNCTION reserve_inventory(
    p_product_id UUID, 
    p_location_id UUID, 
    p_quantity INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_qty INTEGER;
    current_reserved INTEGER;
BEGIN
    -- Get current inventory
    SELECT quantity, reserved_quantity 
    INTO current_qty, current_reserved
    FROM location_inventory
    WHERE product_id = p_product_id 
    AND location_id = p_location_id;
    
    -- Check if enough inventory is available
    IF current_qty - current_reserved >= p_quantity THEN
        -- Update reserved quantity
        UPDATE location_inventory
        SET reserved_quantity = reserved_quantity + p_quantity,
            updated_at = NOW()
        WHERE product_id = p_product_id 
        AND location_id = p_location_id;
        
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;

-- Create a function to release reserved inventory
CREATE OR REPLACE FUNCTION release_inventory(
    p_product_id UUID, 
    p_location_id UUID, 
    p_quantity INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update reserved quantity
    UPDATE location_inventory
    SET reserved_quantity = GREATEST(0, reserved_quantity - p_quantity),
        updated_at = NOW()
    WHERE product_id = p_product_id 
    AND location_id = p_location_id;
    
    RETURN TRUE;
END;
$$;

-- Insert some sample inventory data (optional)
-- You can uncomment this if you want to add sample data

/*
-- Add sample inventory for existing products and locations
INSERT INTO location_inventory (product_id, location_id, quantity, reserved_quantity, reorder_level, max_quantity)
SELECT 
    p.id,
    sl.id,
    FLOOR(RANDOM() * 100) + 10,  -- Random quantity between 10-110
    0,  -- No reserved quantity initially
    10, -- Reorder level
    200 -- Max quantity
FROM products p
CROSS JOIN store_locations sl
WHERE sl.is_active = true
ON CONFLICT (product_id, location_id) DO NOTHING;
*/

-- Verification query
SELECT 
    p.name as product_name,
    sl.name as location_name,
    li.quantity,
    li.reserved_quantity,
    (li.quantity - li.reserved_quantity) as available_quantity,
    li.is_available
FROM location_inventory li
JOIN products p ON li.product_id = p.id
JOIN store_locations sl ON li.location_id = sl.id
ORDER BY p.name, sl.name;
