-- ===================================================================
-- IMMEDIATE FIX FOR USER_ROLES INFINITE RECURSION
-- Run these commands in your Supabase SQL editor
-- ===================================================================

-- Step 1: Drop the problematic policies
DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Store admins can manage store roles" ON user_roles;

-- Step 2: Create helper functions that bypass RLS
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

-- Step 3: Create new policies using the helper functions
CREATE POLICY "Super admins can manage all roles" ON user_roles
  FOR ALL USING (is_super_admin(auth.uid()));

CREATE POLICY "Store admins can manage store roles" ON user_roles
  FOR ALL USING (is_store_admin(auth.uid(), megha_store_id));

-- Step 4: Grant permissions
GRANT EXECUTE ON FUNCTION is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_store_admin(UUID, UUID) TO authenticated;

-- ===================================================================
-- ALTERNATIVE SIMPLE FIX (if above doesn't work)
-- ===================================================================

/*
-- If you still get recursion errors, use this simpler approach:

-- Drop all policies
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Super admins can manage all roles" ON user_roles;
DROP POLICY IF EXISTS "Store admins can manage store roles" ON user_roles;

-- Create simple policies without role checking
CREATE POLICY "Authenticated users can manage user_roles" ON user_roles
  FOR ALL TO authenticated
  USING (true);
*/
