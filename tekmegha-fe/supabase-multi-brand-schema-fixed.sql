-- ===================================================================
-- FIXED SUPABASE MULTI-BRAND SCHEMA
-- Fixed infinite recursion in user_roles RLS policies
-- ===================================================================

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Store admins can manage store roles" ON user_roles;

-- Create a function to check user roles without RLS
CREATE OR REPLACE FUNCTION get_user_role(p_user_id UUID, p_store_id UUID DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- This function bypasses RLS to check roles
  SELECT role INTO user_role
  FROM user_roles 
  WHERE user_id = p_user_id 
    AND (p_store_id IS NULL OR megha_store_id = p_store_id)
  ORDER BY 
    CASE role 
      WHEN 'super_admin' THEN 1
      WHEN 'store_admin' THEN 2
      WHEN 'manager' THEN 3
      WHEN 'store_manager' THEN 4
      WHEN 'inventory_staff' THEN 5
      WHEN 'delivery_partner' THEN 6
      WHEN 'customer' THEN 7
      ELSE 8
    END
  LIMIT 1;
  
  RETURN user_role;
END;
$$;

-- Create a function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = p_user_id 
      AND role = 'super_admin'
  );
END;
$$;

-- Create a function to check if user is store admin
CREATE OR REPLACE FUNCTION is_store_admin(p_user_id UUID, p_store_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = p_user_id 
      AND megha_store_id = p_store_id
      AND role IN ('super_admin', 'store_admin')
  );
END;
$$;

-- Fixed user_roles policies without recursion
CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own roles" ON user_roles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Super admins can manage all roles" ON user_roles
  FOR ALL USING (is_super_admin(auth.uid()));

CREATE POLICY "Store admins can manage store roles" ON user_roles
  FOR ALL USING (is_store_admin(auth.uid(), megha_store_id));

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_user_role(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_store_admin(UUID, UUID) TO authenticated;

-- ===================================================================
-- ALTERNATIVE SIMPLIFIED APPROACH
-- If the above doesn't work, use this simpler approach:
-- ===================================================================

/*
-- Drop all user_roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can insert their own roles" ON user_roles;
DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Store admins can manage store roles" ON user_roles;

-- Simple policies without recursion
CREATE POLICY "Authenticated users can view user_roles" ON user_roles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert user_roles" ON user_roles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Authenticated users can update user_roles" ON user_roles
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Authenticated users can delete user_roles" ON user_roles
  FOR DELETE TO authenticated
  USING (auth.uid()::text = user_id::text);
*/

-- ===================================================================
-- USAGE INSTRUCTIONS
-- ===================================================================

/*
To apply this fix:

1. Connect to your Supabase database
2. Run this SQL script to fix the recursion issue
3. Test the user_roles table operations

The fixed approach uses SECURITY DEFINER functions that bypass RLS
when checking user roles, preventing infinite recursion.

Alternative approach (commented out) uses simpler policies without
role-based access control for user_roles table.
*/
