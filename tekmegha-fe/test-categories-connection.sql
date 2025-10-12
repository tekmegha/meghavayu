-- Test script to check categories table and data
-- Run this in Supabase SQL Editor to verify categories are working

-- 1. Check if categories table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;

-- 2. Check if there are any categories for any store
SELECT COUNT(*) as total_categories FROM categories;

-- 3. Check categories for Brew Buddy store
SELECT 
  name, 
  slug, 
  description, 
  sort_order, 
  is_active,
  CASE WHEN parent_id IS NULL THEN 'Main Category' ELSE 'Subcategory' END as category_type
FROM categories 
WHERE megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid
ORDER BY sort_order, name;

-- 4. Check categories for Majili store
SELECT 
  name, 
  slug, 
  description, 
  sort_order, 
  is_active,
  CASE WHEN parent_id IS NULL THEN 'Main Category' ELSE 'Subcategory' END as category_type
FROM categories 
WHERE megha_store_id = '744160be-d602-443d-8616-d71673ae267f'::uuid
ORDER BY sort_order, name;

-- 5. Check RLS policies on categories table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'categories';

-- 6. Check if there are any RLS policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'categories';
