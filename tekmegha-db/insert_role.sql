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
  '5b1c9703-3767-42f6-a801-1a73cc79292b',
  '6fc1a96a-a609-46ef-a65d-e4338b8fc132',
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