-- Create Inventory Dashboard View
-- This should be run AFTER all tables are created (location_inventory, products, etc.)

-- Create a view for inventory dashboard
CREATE OR REPLACE VIEW inventory_dashboard AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.sku,
    p.category,
    p.price,
    p.is_available,
    p.is_featured,
    ms.store_name,
    ms.store_code,
    COUNT(li.id) as location_count,
    SUM(li.quantity) as total_quantity,
    SUM(li.reserved_quantity) as total_reserved,
    SUM(li.quantity - li.reserved_quantity) as available_quantity
FROM products p
JOIN megha_stores ms ON p.megha_store_id = ms.id
LEFT JOIN location_inventory li ON p.id = li.product_id
GROUP BY p.id, p.name, p.sku, p.category, p.price, p.is_available, p.is_featured, ms.store_name, ms.store_code;

-- Grant access to inventory dashboard for inventory users
GRANT SELECT ON inventory_dashboard TO authenticated;

-- Create RLS policy for inventory dashboard
CREATE POLICY "Inventory users can view dashboard"
ON inventory_dashboard
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.megha_store_id = (
            SELECT ms.id 
            FROM megha_stores ms 
            WHERE ms.store_code = inventory_dashboard.store_code
        )
        AND ur.role IN ('inventory_manager', 'inventory_specialist', 'super_admin')
        AND ur.is_active = true
    )
);

-- Create a function to get inventory summary for a store
CREATE OR REPLACE FUNCTION get_inventory_summary(p_store_code TEXT)
RETURNS TABLE (
    product_id UUID,
    product_name VARCHAR(255),
    sku VARCHAR(100),
    category VARCHAR(100),
    price DECIMAL(10,2),
    total_quantity BIGINT,
    available_quantity BIGINT,
    location_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id.id as product_id,
        id.product_name,
        id.sku,
        id.category,
        id.price,
        id.total_quantity,
        id.available_quantity,
        id.location_count
    FROM inventory_dashboard id
    WHERE id.store_code = p_store_code
    ORDER BY id.product_name;
END;
$$;

-- Create a function to get low stock products
CREATE OR REPLACE FUNCTION get_low_stock_products(p_store_code TEXT, p_threshold INTEGER DEFAULT 10)
RETURNS TABLE (
    product_id UUID,
    product_name VARCHAR(255),
    sku VARCHAR(100),
    total_quantity BIGINT,
    available_quantity BIGINT,
    reorder_level INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as product_id,
        p.name as product_name,
        p.sku,
        COALESCE(SUM(li.quantity), 0) as total_quantity,
        COALESCE(SUM(li.quantity - li.reserved_quantity), 0) as available_quantity,
        COALESCE(AVG(li.reorder_level), 10) as reorder_level
    FROM products p
    JOIN megha_stores ms ON p.megha_store_id = ms.id
    LEFT JOIN location_inventory li ON p.id = li.product_id
    WHERE ms.store_code = p_store_code
    GROUP BY p.id, p.name, p.sku
    HAVING COALESCE(SUM(li.quantity - li.reserved_quantity), 0) <= p_threshold
    ORDER BY available_quantity ASC;
END;
$$;

-- Verification queries
-- Check if inventory dashboard was created successfully
SELECT 
    product_name,
    store_name,
    total_quantity,
    available_quantity
FROM inventory_dashboard
LIMIT 10;

-- Check inventory summary for a specific store
SELECT * FROM get_inventory_summary('brew-buddy') LIMIT 5;

-- Check low stock products
SELECT * FROM get_low_stock_products('brew-buddy', 20) LIMIT 5;
