INSERT INTO user_roles (
  user_id,
  megha_store_id,
  role_name,
  permissions,
  is_active,
  created_at,
  updated_at
) VALUES
( 
  'cdfad50a-c229-4100-9b68-dc62c3bf5e1f',
  'a50930c7-1bb6-4884-a1c5-c0d480d3ec8d',
  'inventory_manager',
  '{
    "inventory": {
      "view": true,
      "create": true,
      "update": true,
      "delete": true
    },
    "products": {
      "view": true,
      "create": true,
      "update": true,
      "delete": true
    },
    "categories": {
      "view": true,
      "create": true,
      "update": true,
      "delete": true
    },
    "locations": {
      "view": true,
      "create": true,
      "update": true,
      "delete": true
    },
    "inventory_dashboard": {
      "view": true
    }
  }',
  true,
  NOW(),
  NOW());