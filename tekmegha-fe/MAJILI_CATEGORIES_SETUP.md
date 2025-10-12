# Majili Fashion Store Categories Setup

## Overview
This guide helps you set up comprehensive fashion categories for the Majili store with a hierarchical structure suitable for a fashion retail business.

## Store Information
- **Store ID**: `744160be-d602-443d-8616-d71673ae267f`
- **Store Name**: MAJILI
- **Store Type**: Fashion Retail

## Setup Steps

### 1. Run the Categories Script
Execute the SQL script in Supabase SQL Editor:

```sql
-- Copy and paste the contents of insert-majili-categories.sql
```

### 2. Verify Categories Creation
Check that categories were created successfully:

```sql
SELECT 
  c.name,
  c.slug,
  c.description,
  c.sort_order,
  c.is_active,
  CASE 
    WHEN c.parent_id IS NULL THEN 'Main Category'
    ELSE 'Subcategory of ' || p.name
  END as category_type
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id
WHERE c.megha_store_id = '744160be-d602-443d-8616-d71673ae267f'
ORDER BY c.sort_order, c.name;
```

## Category Structure

### Main Categories (5)

1. **Women's Clothing** 🚺
   - Dresses
   - Tops & Blouses
   - Bottoms
   - Outerwear

2. **Men's Clothing** 🚹
   - Shirts
   - T-Shirts
   - Pants
   - Suits

3. **Accessories** 🎒
   - Bags
   - Belts
   - Watches
   - Sunglasses

4. **Shoes** 👠
   - Heels
   - Sneakers
   - Boots
   - Flats

5. **Jewelry** 💎
   - Necklaces
   - Earrings
   - Rings
   - Bracelets

## Category Features

### Hierarchical Structure
- **5 Main Categories**: Women's Clothing, Men's Clothing, Accessories, Shoes, Jewelry
- **20 Subcategories**: Detailed breakdown of each main category
- **Store-Specific**: Categories are isolated to Majili store only

### Fashion-Focused Design
- **Women's Fashion**: Dresses, tops, bottoms, outerwear
- **Men's Fashion**: Shirts, t-shirts, pants, suits
- **Accessories**: Bags, belts, watches, sunglasses
- **Footwear**: Heels, sneakers, boots, flats
- **Jewelry**: Necklaces, earrings, rings, bracelets

### SEO-Optimized
- **Slug-Based URLs**: SEO-friendly category URLs
- **Descriptive Names**: Clear category names for better search ranking
- **Rich Descriptions**: Detailed category descriptions

### Visual Elements
- **Category Images**: High-quality Unsplash images for each category
- **Appropriate Icons**: Fashion-specific Material Icons
- **Sort Order**: Logical ordering for better user experience

## Icon Mapping

The application includes comprehensive icon mapping for fashion categories:

```typescript
// Main categories
'Women\'s Clothing': 'woman',
'Men\'s Clothing': 'man',
'Accessories': 'style',
'Shoes': 'directions_walk',
'Jewelry': 'diamond',

// Subcategories
'Dresses': 'checkroom',
'Bags': 'shopping_bag',
'Watches': 'schedule',
'Sunglasses': 'visibility',
// ... and more
```

## Usage in Application

### Category Loading
The application will automatically load Majili-specific categories when the store is selected:

```typescript
// Get main categories for Majili store
const { data, error } = await this.supabaseService.getMainCategories();
```

### Category Display
Categories will be displayed with appropriate icons and navigation:

```typescript
// Categories will show as:
// 👩 Women's Clothing
// 👨 Men's Clothing  
// 🎨 Accessories
// 👠 Shoes
// 💎 Jewelry
```

## Benefits for Fashion Store

### 1. **Comprehensive Coverage**
- Covers all major fashion categories
- Includes both men's and women's fashion
- Accessories and jewelry sections

### 2. **User-Friendly Navigation**
- Clear category hierarchy
- Intuitive naming conventions
- Logical sort order

### 3. **SEO Benefits**
- Slug-based URLs for better search ranking
- Descriptive category names
- Rich metadata

### 4. **Visual Appeal**
- High-quality category images
- Appropriate icons for each category
- Professional presentation

### 5. **Store Isolation**
- Categories are specific to Majili store
- No cross-contamination with other stores
- Independent category management

## Testing the Setup

### 1. Verify Categories Load
After running the script, check that categories appear in the application when Majili store is selected.

### 2. Test Category Navigation
Ensure that clicking on categories navigates properly and shows relevant products.

### 3. Check Icons
Verify that appropriate icons are displayed for each category.

### 4. Test Responsiveness
Ensure categories display properly on different screen sizes.

## Next Steps

### 1. Add Products
Create products for each category to populate the store with inventory.

### 2. Customize Images
Replace default Unsplash images with your own brand images.

### 3. Add More Subcategories
If needed, add more specific subcategories for specialized items.

### 4. SEO Optimization
Add meta descriptions and keywords for each category.

## Troubleshooting

### Common Issues

1. **Categories Not Loading**
   - Verify the store ID is correct
   - Check that the categories table exists
   - Ensure RLS policies are set up correctly

2. **Icons Not Displaying**
   - Check that Material Icons are loaded
   - Verify icon names in the mapping

3. **Categories Not Store-Specific**
   - Ensure `megha_store_id` is correctly set
   - Check that store context is properly loaded

### Verification Queries

```sql
-- Check if categories exist for Majili store
SELECT COUNT(*) as category_count 
FROM categories 
WHERE megha_store_id = '744160be-d602-443d-8616-d71673ae267f';

-- Check main categories only
SELECT name, slug, description 
FROM categories 
WHERE megha_store_id = '744160be-d602-443d-8616-d71673ae267f' 
AND parent_id IS NULL 
ORDER BY sort_order;

-- Check subcategories
SELECT c.name, p.name as parent_name 
FROM categories c 
JOIN categories p ON c.parent_id = p.id 
WHERE c.megha_store_id = '744160be-d602-443d-8616-d71673ae267f' 
ORDER BY p.sort_order, c.sort_order;
```

## Support

If you encounter issues:
1. Check the Supabase logs for detailed error messages
2. Verify the store ID is correct
3. Ensure the categories table exists and has proper RLS policies
4. Test with a simple category query first

The Majili fashion store now has a comprehensive category structure that will provide an excellent shopping experience for fashion customers!
