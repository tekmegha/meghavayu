-- Inventory Access Schema for TekMegha Team
-- This script sets up inventory access for team members

-- First, ensure the users exist in auth.users (they should be created through Supabase Auth)
-- Note: These users need to sign up through the application first, then we can assign roles

-- Create inventory access roles for team members
-- This assumes the users have already registered and have user IDs in auth.users

-- For tm@tekmegha.com - Team Manager (full access)
INSERT INTO user_roles (user_id, megha_store_id, role, permissions, created_at, updated_at)
SELECT 
    au.id,
    ms.id,
    'inventory_manager',
    '["read", "write", "delete", "manage_users"]'::jsonb,
    NOW(),
    NOW()
FROM auth.users au
CROSS JOIN megha_stores ms
WHERE au.email = 'tm@tekmegha.com'
AND ms.store_code IN ('brew-buddy', 'little-ducks', 'opula')
ON CONFLICT (user_id, megha_store_id) 
DO UPDATE SET 
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    updated_at = NOW();

-- For sarada@tekmegha.com - Inventory Specialist (read/write access)
INSERT INTO user_roles (user_id, megha_store_id, role, permissions, created_at, updated_at)
SELECT 
    au.id,
    ms.id,
    'inventory_specialist',
    '["read", "write"]'::jsonb,
    NOW(),
    NOW()
FROM auth.users au
CROSS JOIN megha_stores ms
WHERE au.email = 'sarada@tekmegha.com'
AND ms.store_code IN ('brew-buddy', 'little-ducks', 'opula')
ON CONFLICT (user_id, megha_store_id) 
DO UPDATE SET 
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    updated_at = NOW();

-- Create a function to check if user has inventory access
CREATE OR REPLACE FUNCTION has_inventory_access(p_user_id UUID, p_store_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM user_roles ur 
        WHERE ur.user_id = p_user_id 
        AND ur.megha_store_id = p_store_id
        AND ur.role IN ('inventory_manager', 'inventory_specialist', 'super_admin')
        AND ur.is_active = true
    );
END;
$$;

-- Create a function to get user's inventory permissions
CREATE OR REPLACE FUNCTION get_inventory_permissions(p_user_id UUID, p_store_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_permissions JSONB;
BEGIN
    SELECT ur.permissions INTO user_permissions
    FROM user_roles ur 
    WHERE ur.user_id = p_user_id 
    AND ur.megha_store_id = p_store_id
    AND ur.is_active = true
    ORDER BY 
        CASE ur.role 
            WHEN 'super_admin' THEN 1
            WHEN 'inventory_manager' THEN 2
            WHEN 'inventory_specialist' THEN 3
            ELSE 4
        END
    LIMIT 1;
    
    RETURN COALESCE(user_permissions, '[]'::jsonb);
END;
$$;

-- Update RLS policies for inventory access
-- Products table - allow inventory users to manage products
DROP POLICY IF EXISTS "Inventory users can manage products" ON products;
CREATE POLICY "Inventory users can manage products"
ON products
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.megha_store_id = products.megha_store_id
        AND ur.role IN ('inventory_manager', 'inventory_specialist', 'super_admin')
        AND ur.is_active = true
    )
);

-- Note: Categories table needs to be created first using create-categories-table.sql
-- Categories table - allow inventory users to manage categories (after table creation)
-- DROP POLICY IF EXISTS "Inventory users can manage categories" ON categories;
-- CREATE POLICY "Inventory users can manage categories"
-- ON categories
-- FOR ALL
-- TO authenticated
-- USING (
--     EXISTS (
--         SELECT 1 
--         FROM user_roles ur 
--         WHERE ur.user_id = auth.uid() 
--         AND ur.megha_store_id = categories.megha_store_id
--         AND ur.role IN ('inventory_manager', 'inventory_specialist', 'super_admin')
--         AND ur.is_active = true
--     )
-- );

-- Store locations table - allow inventory users to view store locations
DROP POLICY IF EXISTS "Inventory users can view store locations" ON store_locations;
CREATE POLICY "Inventory users can view store locations"
ON store_locations
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.megha_store_id = store_locations.megha_store_id
        AND ur.role IN ('inventory_manager', 'inventory_specialist', 'super_admin')
        AND ur.is_active = true
    )
);

-- Note: Location inventory table needs to be created first using create-location-inventory-table.sql
-- Location inventory table - allow inventory users to manage inventory (after table creation)
-- DROP POLICY IF EXISTS "Inventory users can manage location inventory" ON location_inventory;
-- CREATE POLICY "Inventory users can manage location inventory"
-- ON location_inventory
-- FOR ALL
-- TO authenticated
-- USING (
--     EXISTS (
--         SELECT 1 
--         FROM user_roles ur 
--         WHERE ur.user_id = auth.uid() 
--         AND ur.megha_store_id = (
--             SELECT sl.megha_store_id 
--             FROM store_locations sl 
--             WHERE sl.id = location_inventory.location_id
--         )
--         AND ur.role IN ('inventory_manager', 'inventory_specialist', 'super_admin')
--         AND ur.is_active = true
--     )
-- );

-- Note: Inventory dashboard view requires location_inventory table to be created first
-- Create a view for inventory dashboard (after location_inventory table is created)
-- CREATE OR REPLACE VIEW inventory_dashboard AS
-- SELECT 
--     p.id as product_id,
--     p.name as product_name,
--     p.sku,
--     p.category,
--     p.price,
--     p.is_available,
--     p.is_featured,
--     ms.store_name,
--     ms.store_code,
--     COUNT(li.id) as location_count,
--     SUM(li.quantity) as total_quantity,
--     SUM(li.reserved_quantity) as total_reserved,
--     SUM(li.quantity - li.reserved_quantity) as available_quantity
-- FROM products p
-- JOIN megha_stores ms ON p.megha_store_id = ms.id
-- LEFT JOIN location_inventory li ON p.id = li.product_id
-- GROUP BY p.id, p.name, p.sku, p.category, p.price, p.is_available, p.is_featured, ms.store_name, ms.store_code;

-- Note: These require the inventory_dashboard view to be created first
-- Grant access to inventory dashboard for inventory users
-- GRANT SELECT ON inventory_dashboard TO authenticated;

-- Create RLS policy for inventory dashboard
-- CREATE POLICY "Inventory users can view dashboard"
-- ON inventory_dashboard
-- FOR SELECT
-- TO authenticated
-- USING (
--     EXISTS (
--         SELECT 1 
--         FROM user_roles ur 
--         WHERE ur.user_id = auth.uid() 
--         AND ur.megha_store_id = (
--             SELECT ms.id 
--             FROM megha_stores ms 
--             WHERE ms.store_code = inventory_dashboard.store_code
--         )
--         AND ur.role IN ('inventory_manager', 'inventory_specialist', 'super_admin')
--         AND ur.is_active = true
--     )
-- );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_store ON user_roles(user_id, megha_store_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_products_store ON products(megha_store_id);
-- Note: This index requires location_inventory table to be created first
-- CREATE INDEX IF NOT EXISTS idx_location_inventory_product ON location_inventory(product_id);

-- Insert some sample inventory data for testing (optional)
-- You can uncomment these if you want to add sample data

/*
-- Add sample products for each store
INSERT INTO products (name, description, sku, price, category, megha_store_id, is_available, is_featured)
SELECT 
    'Sample Product ' || ms.store_code,
    'Sample product description for ' || ms.store_name,
    'SKU-' || ms.store_code || '-001',
    99.99,
    'General',
    ms.id,
    true,
    true
FROM megha_stores ms
WHERE ms.is_active = true;
*/

-- Verification queries (run these to check if setup was successful)
-- Check if users have been assigned roles
SELECT 
    au.email,
    ur.role,
    ur.permissions,
    ms.store_name,
    ur.created_at
FROM auth.users au
JOIN user_roles ur ON au.id = ur.user_id
JOIN megha_stores ms ON ur.megha_store_id = ms.id
WHERE au.email IN ('tm@tekmegha.com', 'sarada@tekmegha.com')
ORDER BY au.email, ms.store_name;

-- Note: Inventory dashboard view needs to be created after location_inventory table
-- Check inventory dashboard access (after view is created)
-- SELECT 
--     product_name,
--     store_name,
--     total_quantity,
--     available_quantity
-- FROM inventory_dashboard
-- LIMIT 10;

-- Alternative: Check products and inventory without dashboard
SELECT 
    p.name as product_name,
    ms.store_name,
    p.is_available,
    p.is_featured
FROM products p
JOIN megha_stores ms ON p.megha_store_id = ms.id
ORDER BY ms.store_code, p.name
LIMIT 10;
