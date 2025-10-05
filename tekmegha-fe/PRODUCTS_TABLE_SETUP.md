# Products Table Setup Guide

## Overview
This guide helps you create the `products` table in your Supabase database with proper schema, indexes, and Row Level Security (RLS) policies.

## Prerequisites
- Supabase project set up
- `megha_stores` table exists
- `user_roles` table exists
- `update_updated_at_column()` function exists

## Setup Steps

### 1. Create the Products Table
Run the SQL script in Supabase SQL Editor:

```sql
-- Copy and paste the contents of create-products-table.sql
```

### 2. Verify Table Creation
Check that the table was created successfully:

```sql
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;
```

### 3. Test RLS Policies
Verify that Row Level Security is working:

```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'products';

-- Check policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'products';
```

### 4. Test Basic Operations
Test that you can insert, select, update, and delete products:

```sql
-- Insert a test product (replace with your store ID)
INSERT INTO products (megha_store_id, name, price, category) 
VALUES ('your-store-id', 'Test Product', 10.99, 'Beverages');

-- Select products
SELECT * FROM products WHERE megha_store_id = 'your-store-id';

-- Update a product
UPDATE products SET price = 12.99 WHERE name = 'Test Product';

-- Delete test product
DELETE FROM products WHERE name = 'Test Product';
```

## Table Schema Details

### Key Features
- **UUID Primary Key**: Uses `gen_random_uuid()` for unique identifiers
- **Store Isolation**: `megha_store_id` foreign key to `megha_stores` table
- **SKU Management**: Unique SKU per store with `unique_store_sku` constraint
- **Flexible Pricing**: Support for discounts and old prices
- **Rich Metadata**: JSONB fields for gallery images, customization options, nutritional info, etc.
- **Performance Indexes**: Optimized for common query patterns
- **Auto-timestamps**: Automatic `created_at` and `updated_at` tracking

### Important Constraints
- `unique_store_sku`: Ensures SKU uniqueness within each store
- `products_megha_store_id_fkey`: Foreign key constraint with CASCADE delete
- `products_pkey`: Primary key constraint

### Indexes for Performance
- `idx_products_megha_store_id`: Fast store-based queries
- `idx_products_category_store`: Category filtering within stores
- `idx_products_available`: Filter by availability
- `idx_products_featured`: Featured products queries
- `idx_products_rating`: Rating-based sorting
- `idx_products_sku`: SKU lookups
- `idx_products_store`: General store queries

## RLS Policies

The table includes comprehensive Row Level Security policies:

1. **SELECT Policy**: Users can only view products from stores they have access to
2. **INSERT Policy**: Users can only create products in stores where they have create permissions
3. **UPDATE Policy**: Users can only update products in stores where they have update permissions
4. **DELETE Policy**: Users can only delete products in stores where they have delete permissions

## Usage in Application

The products table integrates with your existing multi-store architecture:

- Products are automatically filtered by `megha_store_id`
- User permissions are checked through the `user_roles` table
- The application will use this table for all product-related operations

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
   - SKU must be unique within each store
   - Check for duplicate SKUs in the same store

### Verification Queries

```sql
-- Check table structure
\d products

-- Check constraints
SELECT conname, contype, confrelid::regclass 
FROM pg_constraint 
WHERE conrelid = 'products'::regclass;

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'products';

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'products';
```

## Next Steps

After creating the products table:

1. Update your application to use the new schema
2. Test product CRUD operations
3. Verify RLS policies work correctly
4. Add sample products for testing
5. Update any existing product-related code

## Support

If you encounter issues:
1. Check the Supabase logs for detailed error messages
2. Verify all prerequisites are met
3. Test with a simple product insert first
4. Check user permissions in the `user_roles` table
