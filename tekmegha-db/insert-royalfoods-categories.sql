-- Insert categories for Royal Foods - Indian Breads Specialist
-- Royal Foods specializes in traditional Indian breads
-- Categories: Chapati, Poori, Pulka, Parota

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
-- Main Categories - Indian Breads
(
  'Chapati',
  'Soft whole wheat flatbread, a staple in Indian cuisine',
  'chapati',
  (SELECT id FROM megha_stores WHERE store_code = 'royalfoods')::uuid,
  null,
  1,
  true,
  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500'
),
(
  'Poori',
  'Deep-fried puffed bread, crispy and golden',
  'poori',
  (SELECT id FROM megha_stores WHERE store_code = 'royalfoods')::uuid,
  null,
  2,
  true,
  'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500'
),
(
  'Pulka',
  'Thin unleavened flatbread, light and healthy',
  'pulka',
  (SELECT id FROM megha_stores WHERE store_code = 'royalfoods')::uuid,
  null,
  3,
  true,
  'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500'
),
(
  'Parota',
  'Layered flatbread, flaky and delicious',
  'parota',
  (SELECT id FROM megha_stores WHERE store_code = 'royalfoods')::uuid,
  null,
  4,
  true,
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500'
);

-- Verify the categories insertion
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
WHERE c.megha_store_id = (SELECT id FROM megha_stores WHERE store_code = 'royalfoods')
ORDER BY c.sort_order, c.name;

