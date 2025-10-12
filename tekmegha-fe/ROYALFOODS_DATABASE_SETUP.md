# Royal Foods Database Setup Guide

## Overview
This guide helps you set up the complete database schema for Royal Foods restaurant, including store information, categories, and sample products.

## Prerequisites
- Supabase project with the base schema (megha_stores, categories, products tables)
- Access to Supabase SQL Editor

## Setup Steps

### Step 1: Insert Royal Foods Store
Run the following script in Supabase SQL Editor:

```sql
-- File: insert-royalfoods-store.sql
```

This will create:
- Store record in `megha_stores` table
- Store code: `royalfoods`
- Store type: `food`
- Business hours: 11:00 AM - 11:00 PM (extended hours on weekends)

**Verification**:
```sql
SELECT id, store_name, store_code, store_type, is_active
FROM megha_stores 
WHERE store_code = 'royalfoods';
```

Expected result: 1 row with Royal Foods store details

### Step 2: Insert Food Categories
Run the categories script:

```sql
-- File: insert-royalfoods-categories.sql
```

This will create:
- **4 Main Categories** (Indian Breads):
  1. Chapati
  2. Poori
  3. Pulka
  4. Parota

**Verification**:
```sql
SELECT 
  name,
  slug,
  CASE 
    WHEN parent_id IS NULL THEN 'Main Category'
    ELSE 'Subcategory'
  END as category_type
FROM categories 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'royalfoods')
ORDER BY sort_order, name;
```

Expected result: 4 categories (all main categories, no subcategories)

### Step 3: Insert Sample Products
Run the products script:

```sql
-- File: insert-royalfoods-products.sql
```

This will create **14 sample products** (Indian Breads):

**Chapati (3)**:
- Plain Chapati - ₹15
- Butter Chapati - ₹20 (Featured)
- Ghee Chapati - ₹25

**Poori (3)**:
- Plain Poori - ₹30
- Masala Poori - ₹35
- Kashmiri Poori - ₹40 (Featured)

**Pulka (3)**:
- Plain Pulka - ₹12
- Ghee Pulka - ₹18
- Jowar Pulka - ₹20 (Gluten-free)

**Parota (5)**:
- Plain Parota - ₹35
- Malabar Parota - ₹40 (Featured, Kerala style)
- Coin Parota - ₹45 (Bite-sized)
- Wheat Parota - ₹38
- Cheese Parota - ₹55 (Premium, stuffed)

**Verification**:
```sql
SELECT 
  name,
  category,
  price,
  rating,
  is_featured
FROM products
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'royalfoods')
ORDER BY sort_order;
```

Expected result: 14 products

## Product Features

### SKU Format
All products use the format: `RF-XXX-###`
- `RF` - Royal Foods prefix
- `XXX` - Category code (APP, MC, BIR, BRD, DES, BEV)
- `###` - Sequential number

### Product Attributes
- ✅ **Ratings**: 4.4 to 4.9 stars
- ✅ **Reviews**: 156 to 892 reviews
- ✅ **Customizable**: Many dishes support customization
- ✅ **Preparation Time**: 5-45 minutes
- ✅ **Featured Items**: Top sellers marked as featured
- ✅ **Discounts**: Some items have promotional discounts
- ✅ **Tags**: Searchable tags (vegetarian, spicy, popular, etc.)

### Image URLs
Products use the pattern:
```
assets/images/royalfoods/products/[1-15].png
```

## Category Structure

### Main Categories (4) - Indian Breads

1. **Chapati** 🫓
   - Soft whole wheat flatbread
   - Available in plain, butter, and ghee varieties
   - Healthy staple option

2. **Poori** 🥯
   - Deep-fried puffed bread
   - Crispy and golden
   - Available in plain, masala, and Kashmiri styles

3. **Pulka** 🥖
   - Thin unleavened flatbread
   - Light and healthy
   - Available in wheat and jowar (gluten-free)

4. **Parota** 🥐
   - Multi-layered flatbread
   - Flaky and indulgent
   - Various regional styles (Malabar, Coin, Cheese-stuffed)

## Store Configuration

### Business Hours
```json
{
  "monday": {"open": "11:00", "close": "23:00"},
  "tuesday": {"open": "11:00", "close": "23:00"},
  "wednesday": {"open": "11:00", "close": "23:00"},
  "thursday": {"open": "11:00", "close": "23:00"},
  "friday": {"open": "11:00", "close": "23:30"},
  "saturday": {"open": "11:00", "close": "23:30"},
  "sunday": {"open": "11:00", "close": "23:00"}
}
```

### Contact Information
- Email: info@royalfoods.com
- Phone: +91-9876543211
- Domain: royalfoods.com

## Theme Configuration

### Colors (JSON in database)
```json
{
  "primaryColor": "#d97706",
  "secondaryColor": "#f59e0b",
  "accentColor": "#ef4444",
  "backgroundColor": "#fff7ed",
  "surfaceColor": "#ffffff",
  "textPrimary": "#1f2937",
  "textSecondary": "#6b7280",
  "fontFamily": "Roboto, sans-serif",
  "logo": "assets/images/royalfoods/logo.png",
  "layout": "layout-food"
}
```

## Testing the Setup

### 1. Verify Store Creation
```sql
SELECT COUNT(*) as store_count 
FROM megha_stores 
WHERE store_code = 'royalfoods';
```
Expected: 1

### 2. Verify Categories
```sql
SELECT COUNT(*) as category_count 
FROM categories 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'royalfoods');
```
Expected: 20 (6 main + 14 subcategories)

### 3. Verify Products
```sql
SELECT COUNT(*) as product_count 
FROM products 
WHERE megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'royalfoods');
```
Expected: 15 products

### 4. Test in Application
1. Navigate to: `http://localhost:4200/royalfoods/home`
2. Verify food theme (amber/orange colors) is applied
3. Check menu shows food categories
4. Verify products display correctly
5. Test add to cart functionality

## Inventory Access Setup

To give users access to Royal Foods inventory, update the user roles:

```sql
-- Grant inventory access for Royal Foods
INSERT INTO user_roles (user_id, megha_store_id, role, permissions)
SELECT 
  au.id,
  ms.id,
  'inventory_manager',
  '["read", "write", "delete"]'::jsonb
FROM auth.users au
CROSS JOIN megha_stores ms
WHERE au.email = 'your-email@example.com'
AND ms.store_code = 'royalfoods'
ON CONFLICT (user_id, megha_store_id) 
DO UPDATE SET 
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions;
```

## Expected Results

After completing all steps:
- ✅ **1 store**: Royal Foods
- ✅ **4 main categories**: Chapati, Poori, Pulka, Parota
- ✅ **14 products**: Indian bread varieties
- ✅ **Food theme**: Amber/orange color scheme
- ✅ **Layout**: Custom layout-food component
- ✅ **Specialization**: Indian breads specialist

## Troubleshooting

### Issue: Categories not showing
**Solution**: 
1. Verify store ID exists
2. Check category megha_store_id matches
3. Verify is_active = true

### Issue: Products not displaying
**Solution**:
1. Check products have correct megha_store_id
2. Verify is_available = true
3. Check image URLs are valid

### Issue: Theme not applying
**Solution**:
1. Verify store_code is 'royalfoods'
2. Check layout-food component is loaded
3. Clear browser cache

## Additional Customization

### Add More Categories
```sql
INSERT INTO categories (name, description, slug, megha_store_id, sort_order, is_active)
SELECT 
  'Your Category',
  'Description',
  'your-category',
  id,
  7,
  true
FROM megha_stores 
WHERE store_code = 'royalfoods';
```

### Add More Products
Use the same pattern as sample products with:
- Unique SKU
- Appropriate category
- Relevant tags
- Product images in `/royalfoods/products/`

## Summary

Royal Foods is now fully set up with:
- Complete database schema
- 4 Indian bread categories (Chapati, Poori, Pulka, Parota)
- 14 sample products (bread varieties)
- Food-themed layout with amber/orange colors
- Custom layout-food component
- Specialization in traditional Indian breads
- Ready for production use

Access at: `/royalfoods` or `/food` 🍽️

