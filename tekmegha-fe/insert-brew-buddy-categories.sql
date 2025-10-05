-- Insert sample categories for Brew Buddy store
-- Store ID: de6fb86d-e6fd-4524-bed1-a9b326f0112f
-- Store Name: BREW BUDDY

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
  'Coffee',
  'Premium coffee beverages and espresso drinks',
  'coffee',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  null,
  1,
  true,
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'
),
(
  'Tea',
  'Refreshing tea beverages and herbal infusions',
  'tea',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  null,
  2,
  true,
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'
),
(
  'Pastries',
  'Fresh baked pastries and sweet treats',
  'pastries',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  null,
  3,
  true,
  'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500'
),
(
  'Food',
  'Light meals and savory options',
  'food',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  null,
  4,
  true,
  'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500'
);

-- Get the category IDs for subcategories
WITH coffee_category AS (
  SELECT id FROM categories WHERE slug = 'coffee' AND megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f'
),
tea_category AS (
  SELECT id FROM categories WHERE slug = 'tea' AND megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f'
),
pastries_category AS (
  SELECT id FROM categories WHERE slug = 'pastries' AND megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f'
),
food_category AS (
  SELECT id FROM categories WHERE slug = 'food' AND megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f'
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
  'Espresso Drinks',
  'Rich espresso-based beverages',
  'espresso-drinks',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  coffee_category.id,
  1,
  true,
  'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500'
FROM coffee_category

UNION ALL

SELECT 
  'Brewed Coffee',
  'Traditional brewed coffee options',
  'brewed-coffee',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  coffee_category.id,
  2,
  true,
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'
FROM coffee_category

UNION ALL

SELECT 
  'Green Tea',
  'Antioxidant-rich green tea varieties',
  'green-tea',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  tea_category.id,
  1,
  true,
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'
FROM tea_category

UNION ALL

SELECT 
  'Herbal Tea',
  'Caffeine-free herbal infusions',
  'herbal-tea',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  tea_category.id,
  2,
  true,
  'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500'
FROM tea_category

UNION ALL

SELECT 
  'Sweet Pastries',
  'Indulgent sweet pastries and desserts',
  'sweet-pastries',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  pastries_category.id,
  1,
  true,
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500'
FROM pastries_category

UNION ALL

SELECT 
  'Savory Pastries',
  'Savory baked goods and snacks',
  'savory-pastries',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  pastries_category.id,
  2,
  true,
  'https://images.unsplash.com/photo-1499636136210-6f4ee6a84526?w=500'
FROM pastries_category

UNION ALL

SELECT 
  'Breakfast',
  'Morning meal options',
  'breakfast',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  food_category.id,
  1,
  true,
  'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500'
FROM food_category

UNION ALL

SELECT 
  'Lunch',
  'Light lunch and midday meals',
  'lunch',
  'de6fb86d-e6fd-4524-bed1-a9b326f0112f'::uuid,
  food_category.id,
  2,
  true,
  'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=500'
FROM food_category;

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
WHERE c.megha_store_id = 'de6fb86d-e6fd-4524-bed1-a9b326f0112f'
ORDER BY c.sort_order, c.name;
