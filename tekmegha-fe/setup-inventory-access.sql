-- Quick Setup: Inventory Access for TekMegha Team
-- Run this after the users have registered in your application

-- Step 1: Check if users exist (run this first to verify)
SELECT email, id, created_at 
FROM auth.users 
WHERE email IN ('tm@tekmegha.com', 'sarada@tekmegha.com');

-- Step 2: Get store IDs (run this to get the correct store IDs)
SELECT id, store_name, store_code 
FROM megha_stores 
WHERE is_active = true;

-- Step 3: Assign roles (replace USER_ID_1 and USER_ID_2 with actual IDs from Step 1)
-- Replace STORE_ID_1, STORE_ID_2, STORE_ID_3 with actual store IDs from Step 2

-- For tm@tekmegha.com (Team Manager)
INSERT INTO user_roles (user_id, megha_store_id, role, permissions, is_active, created_at, updated_at)
VALUES 
    ('USER_ID_1', 'STORE_ID_1', 'inventory_manager', '["read", "write", "delete", "manage_users"]'::jsonb, true, NOW(), NOW()),
    ('USER_ID_1', 'STORE_ID_2', 'inventory_manager', '["read", "write", "delete", "manage_users"]'::jsonb, true, NOW(), NOW()),
    ('USER_ID_1', 'STORE_ID_3', 'inventory_manager', '["read", "write", "delete", "manage_users"]'::jsonb, true, NOW(), NOW())
ON CONFLICT (user_id, megha_store_id) 
DO UPDATE SET 
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    updated_at = NOW();

-- For sarada@tekmegha.com (Inventory Specialist)
INSERT INTO user_roles (user_id, megha_store_id, role, permissions, is_active, created_at, updated_at)
VALUES 
    ('USER_ID_2', 'STORE_ID_1', 'inventory_specialist', '["read", "write"]'::jsonb, true, NOW(), NOW()),
    ('USER_ID_2', 'STORE_ID_2', 'inventory_specialist', '["read", "write"]'::jsonb, true, NOW(), NOW()),
    ('USER_ID_2', 'STORE_ID_3', 'inventory_specialist', '["read", "write"]'::jsonb, true, NOW(), NOW())
ON CONFLICT (user_id, megha_store_id) 
DO UPDATE SET 
    role = EXCLUDED.role,
    permissions = EXCLUDED.permissions,
    updated_at = NOW();

-- Step 4: Verify the setup
SELECT 
    au.email,
    ur.role,
    ur.permissions,
    ms.store_name,
    ur.is_active
FROM auth.users au
JOIN user_roles ur ON au.id = ur.user_id
JOIN megha_stores ms ON ur.megha_store_id = ms.id
WHERE au.email IN ('tm@tekmegha.com', 'sarada@tekmegha.com')
ORDER BY au.email, ms.store_name;
