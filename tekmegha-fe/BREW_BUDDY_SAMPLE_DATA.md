# Brew Buddy Sample Data Setup

## Overview
This guide helps you insert sample product data for the Brew Buddy coffee shop store.

## Store Information
- **Store ID**: `de6fb86d-e6fd-4524-bed1-a9b326f0112f`
- **Store Name**: BREW BUDDY
- **Products**: 10 diverse coffee shop items

## Sample Products Included

### ☕ Coffee Products (4 items)
1. **Brew Buddy Signature Blend** - $4.99
   - Dark roast with chocolate and caramel notes
   - Customizable size, milk, and sweetener options
   - Featured product with 4.8★ rating

2. **Iced Vanilla Latte** - $5.49 (10% discount from $6.09)
   - Refreshing iced coffee with vanilla syrup
   - Customizable size, milk, and syrup options
   - Featured product with 4.6★ rating

3. **Classic Cappuccino** - $4.79
   - Traditional Italian cappuccino
   - Customizable size, milk, and foam options
   - 4.7★ rating

4. **Nitro Cold Brew** - $4.29
   - Smooth, creamy cold brew with nitrogen
   - Customizable size and additions
   - Featured product with 4.9★ rating

### 🍵 Tea Products (2 items)
5. **Premium Green Tea** - $2.99
   - High-quality green tea with antioxidants
   - Customizable size and sweetener
   - 4.4★ rating

6. **Spiced Chai Latte** - $4.99
   - Warm and comforting with aromatic spices
   - Customizable size, milk, and spice level
   - 4.5★ rating

### 🥐 Pastries (3 items)
7. **Chocolate Croissant** - $3.99
   - Buttery, flaky croissant with chocolate
   - 4.5★ rating

8. **Blueberry Muffin** - $3.49 (15% discount from $4.09)
   - Moist muffin with fresh blueberries
   - Featured product with 4.3★ rating

9. **Chocolate Chip Cookie** - $2.49 (20% discount from $3.09)
   - Soft and chewy with premium chocolate chips
   - Featured product with 4.7★ rating

### 🍽️ Food (1 item)
10. **Avocado Toast** - $7.99
    - Smashed avocado on artisan sourdough
    - Customizable bread and toppings
    - 4.6★ rating

## Setup Instructions

### 1. Run the SQL Script
Copy and paste the contents of `insert-brew-buddy-products.sql` into your Supabase SQL Editor and execute.

### 2. Verify Data Insertion
After running the script, verify the data was inserted correctly:

```sql
-- Check product count
SELECT COUNT(*) as total_products 
FROM products 
WHERE megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f';

-- Check featured products
SELECT name, price, is_featured, rating 
FROM products 
WHERE megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f' 
AND is_featured = true;

-- Check categories
SELECT category, COUNT(*) as count 
FROM products 
WHERE megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f' 
GROUP BY category;
```

### 3. Test Product Display
Navigate to your application and verify:
- Products appear in the menu
- Featured products are highlighted
- Categories are properly displayed
- Prices and discounts show correctly
- Product details are accessible

## Product Features

### 🎯 Customization Options
- **Coffee**: Size, milk type, sweetener options
- **Tea**: Size, sweetener options, spice levels
- **Food**: Bread type, topping options

### 🏷️ Categories
- **Coffee**: 4 products
- **Tea**: 2 products  
- **Pastries**: 3 products
- **Food**: 1 product

### ⭐ Ratings & Reviews
- All products have realistic ratings (4.3-4.9★)
- Review counts range from 45-203 reviews
- Featured products have higher ratings

### 💰 Pricing Strategy
- **Coffee**: $4.29 - $5.49
- **Tea**: $2.99 - $4.99
- **Pastries**: $2.49 - $3.99
- **Food**: $7.99
- **Discounts**: 10-20% off on select items

### 🏆 Featured Products
- Brew Buddy Signature Blend
- Iced Vanilla Latte
- Blueberry Muffin
- Nitro Cold Brew
- Chocolate Chip Cookie

## Data Structure

### Rich Metadata
- **Nutritional Info**: Calories, caffeine content, serving sizes
- **Allergen Info**: Gluten, dairy, eggs, caffeine warnings
- **Preparation Time**: 0-5 minutes
- **Gallery Images**: Multiple product photos
- **Tags**: Searchable keywords for each product

### JSONB Fields
- **gallery_images**: Array of image URLs
- **customization_options**: Available customizations
- **nutritional_info**: Health and nutrition data
- **allergen_info**: Allergy warnings
- **tags**: Searchable product tags

## Troubleshooting

### Common Issues

1. **Foreign Key Constraint Error**
   - Ensure the store ID exists in `megha_stores` table
   - Verify the store ID is correct: `de6fb86d-e6fd-4524-bed1-a9b326f0112f`

2. **Unique Constraint Violation**
   - Check for duplicate SKUs in the same store
   - Ensure SKUs are unique: `BB-COFFEE-001`, `BB-LATTE-002`, etc.

3. **JSONB Format Error**
   - Verify JSONB fields are properly formatted
   - Check for valid JSON syntax in arrays and objects

### Verification Queries

```sql
-- Check if store exists
SELECT id, name FROM megha_stores WHERE id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f';

-- Check product insertion
SELECT name, sku, price, category, is_featured 
FROM products 
WHERE megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f'
ORDER BY sort_order;

-- Check for any errors
SELECT * FROM products 
WHERE megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f' 
AND (name IS NULL OR price IS NULL);
```

## Next Steps

After inserting the sample data:

1. **Test the Application**: Navigate to the Brew Buddy store and verify products display correctly
2. **Check Categories**: Ensure products are properly categorized
3. **Test Customization**: Verify customization options work
4. **Check Featured Products**: Confirm featured products are highlighted
5. **Test Search**: Verify product search and filtering work
6. **Check Mobile View**: Ensure products display well on mobile devices

## Support

If you encounter issues:
1. Check the Supabase logs for detailed error messages
2. Verify the store ID exists in `megha_stores` table
3. Ensure all JSONB fields are properly formatted
4. Test with a single product insert first
5. Check for any constraint violations
