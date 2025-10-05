# Categories System Setup Guide

## Overview
This guide helps you set up the new dedicated categories system with store-specific categories, hierarchical structure, and proper database schema.

## Prerequisites
- Supabase project set up
- `megha_stores` table exists
- `user_roles` table exists
- `update_categories_updated_at()` function exists

## Setup Steps

### 1. Create the Categories Table
Run the SQL script in Supabase SQL Editor:

```sql
-- Copy and paste the contents of create-categories-table.sql
```

### 2. Insert Sample Categories
Run the sample categories script for Brew Buddy store:

```sql
-- Copy and paste the contents of insert-brew-buddy-categories.sql
```

### 3. Verify Table Creation
Check that the table was created successfully:

```sql
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;
```

### 4. Test RLS Policies
Verify that Row Level Security is working:

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'categories';

-- Check policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'categories';
```

### 5. Test Category Operations
Test that you can insert, select, update, and delete categories:

```sql
-- Insert a test category (replace with your store ID)
INSERT INTO categories (megha_store_id, name, slug, description) 
VALUES ('your-store-id', 'Test Category', 'test-category', 'Test description');

-- Select categories
SELECT * FROM categories WHERE megha_store_id = 'your-store-id';

-- Update a category
UPDATE categories SET description = 'Updated description' WHERE name = 'Test Category';

-- Delete test category
DELETE FROM categories WHERE name = 'Test Category';
```

## Table Schema Details

### Key Features
- **UUID Primary Key**: Uses `gen_random_uuid()` for unique identifiers
- **Store Isolation**: `megha_store_id` foreign key to `megha_stores` table
- **Hierarchical Structure**: `parent_id` for subcategories
- **Unique Constraints**: Name and slug unique per store
- **Sort Order**: Custom ordering within store
- **Slug System**: SEO-friendly URLs
- **Image Support**: Category images
- **Active Status**: Enable/disable categories

### Important Constraints
- `categories_name_megha_store_id_key`: Ensures category name uniqueness within each store
- `categories_slug_megha_store_id_key`: Ensures slug uniqueness within each store
- `categories_megha_store_id_fkey`: Foreign key constraint with CASCADE delete
- `categories_parent_id_fkey`: Self-referencing foreign key for hierarchy

### Indexes for Performance
- `idx_categories_store`: Fast store-based queries
- `idx_categories_parent`: Parent-child relationship queries
- `idx_categories_active`: Filter by active status
- `idx_categories_slug`: Slug-based lookups

## RLS Policies

The table includes comprehensive Row Level Security policies:

1. **SELECT Policy**: Users can only view categories from stores they have access to
2. **INSERT Policy**: Users can only create categories in stores where they have create permissions
3. **UPDATE Policy**: Users can only update categories in stores where they have update permissions
4. **DELETE Policy**: Users can only delete categories in stores where they have delete permissions

## Application Integration

### New Methods Added

1. **`getCategories()`**: Gets all categories for the current store
2. **`getMainCategories()`**: Gets only main categories (no parent)
3. **Category Interface**: TypeScript interface for type safety

### Updated Components

1. **Home Component**: Now loads store-specific categories dynamically
2. **Category Display**: Shows categories with proper icons and slugs
3. **Store Isolation**: Each store has its own category structure

## Sample Categories Structure

### Brew Buddy Store Categories

**Main Categories:**
- Coffee (with subcategories: Espresso Drinks, Brewed Coffee)
- Tea (with subcategories: Green Tea, Herbal Tea)
- Pastries (with subcategories: Sweet Pastries, Savory Pastries)
- Food (with subcategories: Breakfast, Lunch)

### Category Features

- **Hierarchical**: Main categories with subcategories
- **Store-Specific**: Each store has its own category structure
- **Sortable**: Custom sort order within each store
- **Slug-Based**: SEO-friendly URLs
- **Image Support**: Category images for better UX
- **Active Status**: Enable/disable categories

## Usage in Application

### Loading Categories

```typescript
// Get all categories for current store
const { data, error } = await this.supabaseService.getCategories();

// Get only main categories
const { data, error } = await this.supabaseService.getMainCategories();
```

### Category Display

```typescript
// Map categories for display
this.coffeeCategories = data.map(category => ({
  name: category.name,
  icon: this.getCategoryIcon(category.name),
  route: '/menu',
  slug: category.slug
}));
```

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Error**
   - Ensure `megha_stores` table exists and has data
   - Verify the `megha_store_id` you're using exists in `megha_stores`

2. **RLS Policy Errors**
   - Check that user has proper role in `user_roles` table
   - Verify user is authenticated
   - Ensure role has required permissions

3. **Unique Constraint Violation**
   - Category name must be unique within each store
   - Slug must be unique within each store
   - Check for duplicate names/slugs in the same store

### Verification Queries

```sql
-- Check table structure
\d categories

-- Check constraints
SELECT conname, contype, confrelid::regclass 
FROM pg_constraint 
WHERE conrelid = 'categories'::regclass;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'categories';

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'categories';
```

## Next Steps

After creating the categories table:

1. Update your application to use the new category system
2. Test category CRUD operations
3. Verify RLS policies work correctly
4. Add sample categories for other stores
5. Update any existing category-related code

## Benefits

- **Store Isolation**: Each store has its own category structure
- **Hierarchical**: Support for main categories and subcategories
- **Performance**: Optimized queries with proper indexing
- **Security**: Row Level Security for data protection
- **Flexibility**: Easy to add/remove categories per store
- **SEO-Friendly**: Slug-based URLs for better search ranking

## Support

If you encounter issues:
1. Check the Supabase logs for detailed error messages
2. Verify all prerequisites are met
3. Test with a simple category insert first
4. Check user permissions in the `user_roles` table
5. Ensure the `update_categories_updated_at()` function exists
