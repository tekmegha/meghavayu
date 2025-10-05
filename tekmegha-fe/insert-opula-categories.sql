-- Insert sample categories for Opula fashion store
-- Store ID: 744160be-d602-443d-8616-d71673ae267f
-- Store Name: OPULA

INSERT INTO public.categories (
  name,
  description,
  slug,
  megha_store_id,
  parent_id,
  sort_order,
  is_active,
  image_url
) VALUES 
-- Main Categories
(
  'Women''s Clothing',
  'Elegant and trendy women''s fashion collection',
  'womens-clothing',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  null,
  1,
  true,
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'
),
(
  'Men''s Clothing',
  'Stylish and contemporary men''s fashion',
  'mens-clothing',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  null,
  2,
  true,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
),
(
  'Accessories',
  'Fashion accessories to complete your look',
  'accessories',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  null,
  3,
  true,
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
),
(
  'Shoes',
  'Comfortable and stylish footwear for every occasion',
  'shoes',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  null,
  4,
  true,
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
),
(
  'Jewelry',
  'Beautiful jewelry pieces to enhance your style',
  'jewelry',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  null,
  5,
  true,
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
);

-- Get the category IDs for subcategories
WITH womens_category AS (
  SELECT id FROM categories WHERE slug = 'womens-clothing' AND megha_store_id = '744160be-d602-443d-8616-d71673ae267f'
),
mens_category AS (
  SELECT id FROM categories WHERE slug = 'mens-clothing' AND megha_store_id = '744160be-d602-443d-8616-d71673ae267f'
),
accessories_category AS (
  SELECT id FROM categories WHERE slug = 'accessories' AND megha_store_id = '744160be-d602-443d-8616-d71673ae267f'
),
shoes_category AS (
  SELECT id FROM categories WHERE slug = 'shoes' AND megha_store_id = '744160be-d602-443d-8616-d71673ae267f'
),
jewelry_category AS (
  SELECT id FROM categories WHERE slug = 'jewelry' AND megha_store_id = '744160be-d602-443d-8616-d71673ae267f'
)

-- Insert subcategories
INSERT INTO public.categories (
  name,
  description,
  slug,
  megha_store_id,
  parent_id,
  sort_order,
  is_active,
  image_url
)
SELECT 
  'Dresses',
  'Elegant dresses for every occasion',
  'dresses',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  womens_category.id,
  1,
  true,
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'
FROM womens_category

UNION ALL

SELECT 
  'Tops & Blouses',
  'Stylish tops and blouses for women',
  'tops-blouses',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  womens_category.id,
  2,
  true,
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500'
FROM womens_category

UNION ALL

SELECT 
  'Bottoms',
  'Pants, skirts, and shorts for women',
  'bottoms',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  womens_category.id,
  3,
  true,
  'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500'
FROM womens_category

UNION ALL

SELECT 
  'Outerwear',
  'Jackets, coats, and blazers for women',
  'outerwear',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  womens_category.id,
  4,
  true,
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'
FROM womens_category

UNION ALL

SELECT 
  'Shirts',
  'Classic and casual shirts for men',
  'shirts',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  mens_category.id,
  1,
  true,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
FROM mens_category

UNION ALL

SELECT 
  'T-Shirts',
  'Comfortable and stylish t-shirts for men',
  't-shirts',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  mens_category.id,
  2,
  true,
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
FROM mens_category

UNION ALL

SELECT 
  'Pants',
  'Dress pants, jeans, and casual pants for men',
  'pants',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  mens_category.id,
  3,
  true,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
FROM mens_category

UNION ALL

SELECT 
  'Suits',
  'Professional and formal suits for men',
  'suits',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  mens_category.id,
  4,
  true,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
FROM mens_category

UNION ALL

SELECT 
  'Bags',
  'Handbags, purses, and tote bags',
  'bags',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  accessories_category.id,
  1,
  true,
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
FROM accessories_category

UNION ALL

SELECT 
  'Belts',
  'Leather and fabric belts for men and women',
  'belts',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  accessories_category.id,
  2,
  true,
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
FROM accessories_category

UNION ALL

SELECT 
  'Watches',
  'Elegant watches for men and women',
  'watches',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  accessories_category.id,
  3,
  true,
  'https://images.unsplash.com/photo-1523170335258-f5b88c6c54d9?w=500'
FROM accessories_category

UNION ALL

SELECT 
  'Sunglasses',
  'Stylish sunglasses and eyewear',
  'sunglasses',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  accessories_category.id,
  4,
  true,
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'
FROM accessories_category

UNION ALL

SELECT 
  'Heels',
  'Elegant high heels and pumps',
  'heels',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  shoes_category.id,
  1,
  true,
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500'
FROM shoes_category

UNION ALL

SELECT 
  'Sneakers',
  'Comfortable and stylish sneakers',
  'sneakers',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  shoes_category.id,
  2,
  true,
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'
FROM shoes_category

UNION ALL

SELECT 
  'Boots',
  'Ankle boots, knee-high boots, and winter boots',
  'boots',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  shoes_category.id,
  3,
  true,
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500'
FROM shoes_category

UNION ALL

SELECT 
  'Flats',
  'Comfortable flat shoes and loafers',
  'flats',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  shoes_category.id,
  4,
  true,
  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500'
FROM shoes_category

UNION ALL

SELECT 
  'Necklaces',
  'Elegant necklaces and pendants',
  'necklaces',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  jewelry_category.id,
  1,
  true,
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
FROM jewelry_category

UNION ALL

SELECT 
  'Earrings',
  'Beautiful earrings for every style',
  'earrings',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  jewelry_category.id,
  2,
  true,
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
FROM jewelry_category

UNION ALL

SELECT 
  'Rings',
  'Elegant rings and statement pieces',
  'rings',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  jewelry_category.id,
  3,
  true,
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
FROM jewelry_category

UNION ALL

SELECT 
  'Bracelets',
  'Stylish bracelets and bangles',
  'bracelets',
  '744160be-d602-443d-8616-d71673ae267f'::uuid,
  jewelry_category.id,
  4,
  true,
  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
FROM jewelry_category;

-- Verify the insert
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
