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
  '26d71c6f-eac6-4696-bb75-a3a80a9e2e65',
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