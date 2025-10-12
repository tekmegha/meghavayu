# Categories Troubleshooting Guide

## Overview
This guide helps you diagnose and fix issues with categories not loading from the backend.

## Step 1: Check Database Setup

### 1.1 Verify Categories Table Exists
Run this in Supabase SQL Editor:

```sql
-- Check if categories table exists
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;
```

**Expected Result**: Should show all columns of the categories table.

### 1.2 Check if Categories Data Exists
```sql
-- Check total categories
SELECT COUNT(*) as total_categories FROM categories;

-- Check categories for Brew Buddy store
SELECT COUNT(*) as brew_buddy_categories 
FROM categories 
WHERE megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid;

-- Check categories for Majili store
SELECT COUNT(*) as majili_categories 
FROM categories 
WHERE megha_store_id = '744160be-d602-443d-8616-d71673ae267f'::uuid;
```

**Expected Result**: Should show > 0 categories for each store.

## Step 2: Check RLS Policies

### 2.1 Verify RLS is Enabled
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'categories';
```

**Expected Result**: `rowsecurity` should be `true`.

### 2.2 Check RLS Policies
```sql
-- Check RLS policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'categories';
```

**Expected Result**: Should show policies for SELECT, INSERT, UPDATE, DELETE.

## Step 3: Test Categories Query Manually

### 3.1 Test Brew Buddy Categories
```sql
-- Test Brew Buddy categories query
SELECT 
  name, 
  slug, 
  description, 
  sort_order, 
  is_active,
  CASE WHEN parent_id IS NULL THEN 'Main Category' ELSE 'Subcategory' END as category_type
FROM categories 
WHERE megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid
  AND is_active = true
  AND parent_id IS NULL
ORDER BY sort_order, name;
```

### 3.2 Test Majili Categories
```sql
-- Test Majili categories query
SELECT 
  name, 
  slug, 
  description, 
  sort_order, 
  is_active,
  CASE WHEN parent_id IS NULL THEN 'Main Category' ELSE 'Subcategory' END as category_type
FROM categories 
WHERE megha_store_id = '744160be-d602-443d-8616-d71673ae267f'::uuid
  AND is_active = true
  AND parent_id IS NULL
ORDER BY sort_order, name;
```

## Step 4: Check Application Logs

### 4.1 Open Browser Developer Tools
1. Open your application in the browser
2. Press F12 to open Developer Tools
3. Go to the Console tab
4. Select a store (Brew Buddy or Majili)
5. Look for category-related logs

### 4.2 Expected Log Messages
You should see these logs in the console:

```
🔄 Loading categories for store...
Current store: {store details}
🔍 Fetching main categories for store: {store-id}
🔗 Supabase client ready: true
📡 Supabase query result: {data, error}
✅ Found main categories: {count}
📋 Categories data: [array of categories]
✅ Loaded categories from backend: {count} categories
🎨 Mapped categories for display: [mapped categories]
```

### 4.3 Common Error Messages

**"Supabase client not ready"**:
- Supabase is not initialized properly
- Check if Supabase credentials are correct

**"Store not found"**:
- Store ID is not being passed correctly
- Check store session service

**"Error fetching main categories"**:
- Database connection issue
- RLS policy blocking access
- Table doesn't exist

**"No categories found for store"**:
- Categories table is empty
- Wrong store ID
- Categories are inactive

## Step 5: Common Issues and Solutions

### 5.1 Categories Table Doesn't Exist
**Solution**: Run the categories table creation script:
```sql
-- Copy and paste create-categories-table.sql
```

### 5.2 No Categories Data
**Solution**: Run the sample data scripts:
```sql
-- For Brew Buddy store
-- Copy and paste insert-brew-buddy-categories.sql

-- For Majili store  
-- Copy and paste insert-majili-categories.sql
```

### 5.3 RLS Policy Issues
**Solution**: Check if user has proper permissions:
```sql
-- Check user roles
SELECT * FROM user_roles WHERE user_id = auth.uid();

-- Check if user has access to the store
SELECT * FROM user_roles 
WHERE user_id = auth.uid() 
AND megha_store_id = 'your-store-id'::uuid;
```

### 5.4 Store ID Not Found
**Solution**: Check store session service:
1. Verify store is selected
2. Check if store ID is being passed correctly
3. Ensure store exists in `megha_stores` table

## Step 6: Debug Steps

### 6.1 Enable Debug Logging
The application now has comprehensive debug logging. Check the browser console for:

- 🔄 Category loading start
- 🔍 Store ID being used
- 🔗 Supabase client status
- 📡 Database query results
- ✅ Success messages
- ❌ Error messages

### 6.2 Test Different Stores
1. Try selecting Brew Buddy store
2. Try selecting Majili store
3. Check if categories load for each store
4. Compare console logs between stores

### 6.3 Check Network Tab
1. Open Developer Tools → Network tab
2. Select a store
3. Look for Supabase API calls
4. Check if requests are successful (200 status)
5. Check response data

## Step 7: Verification Checklist

- [ ] Categories table exists
- [ ] Categories data exists for the store
- [ ] RLS policies are set up correctly
- [ ] User has proper permissions
- [ ] Store ID is being passed correctly
- [ ] Supabase client is ready
- [ ] No JavaScript errors in console
- [ ] Network requests are successful
- [ ] Categories are being mapped correctly
- [ ] Categories are displaying in the UI

## Step 8: Quick Fixes

### 8.1 Reset Categories
If categories are not loading, try:
1. Clear browser cache
2. Refresh the page
3. Reselect the store
4. Check console for errors

### 8.2 Re-run Setup Scripts
If data is missing:
1. Run `create-categories-table.sql`
2. Run `insert-brew-buddy-categories.sql`
3. Run `insert-majili-categories.sql`
4. Test the application

### 8.3 Check Store Selection
Ensure the correct store is selected:
1. Check store selector component
2. Verify store session service
3. Confirm store ID in console logs

## Support

If you're still having issues:
1. Check the browser console for specific error messages
2. Verify all setup scripts have been run
3. Test the database queries manually in Supabase
4. Check if the user has proper authentication and permissions

The debug logging should provide detailed information about what's happening during category loading!
