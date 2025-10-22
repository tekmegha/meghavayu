-- ============================================
-- Add Navbar Control Fields to megha_stores
-- ============================================

-- Add navbar configuration fields to megha_stores table
ALTER TABLE megha_stores 
ADD COLUMN IF NOT EXISTS navbar_config JSONB DEFAULT '{
  "bottomNavbar": {
    "enabled": true,
    "items": {
      "home": {"enabled": true, "label": "Home", "icon": "home", "route": "/home"},
      "menu": {"enabled": true, "label": "Menu", "icon": "restaurant_menu", "route": "/menu"},
      "cart": {"enabled": true, "label": "Cart", "icon": "shopping_cart", "route": "/cart"},
      "inventory": {"enabled": true, "label": "Inventory", "icon": "inventory", "route": "/inventory"},
      "invoices": {"enabled": true, "label": "Bill", "icon": "receipt", "route": "/invoices"},
      "profile": {"enabled": true, "label": "Profile", "icon": "person", "route": "/profile"}
    }
  },
  "topNavbar": {
    "enabled": true,
    "items": {
      "menu": {"enabled": true, "label": "Menu", "icon": "menu_book", "action": "toggleMenu"},
      "search": {"enabled": true, "label": "Search", "icon": "search", "action": "openSearch"},
      "login": {"enabled": true, "label": "Login", "icon": "account_circle", "action": "openLogin"},
      "cart": {"enabled": true, "label": "Cart", "icon": "shopping_cart", "action": "openCart"}
    }
  }
}'::jsonb;

-- Add individual navbar item control fields
ALTER TABLE megha_stores 
ADD COLUMN IF NOT EXISTS enable_navbar_home BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_navbar_menu BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_navbar_cart BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_navbar_inventory BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_navbar_invoices BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS enable_navbar_profile BOOLEAN DEFAULT true;

-- Add comments for documentation
COMMENT ON COLUMN megha_stores.navbar_config IS 'JSON configuration for navbar items and their enabled/disabled state';
COMMENT ON COLUMN megha_stores.enable_navbar_home IS 'Whether home menu item is enabled in bottom navbar';
COMMENT ON COLUMN megha_stores.enable_navbar_menu IS 'Whether menu item is enabled in bottom navbar';
COMMENT ON COLUMN megha_stores.enable_navbar_cart IS 'Whether cart item is enabled in bottom navbar';
COMMENT ON COLUMN megha_stores.enable_navbar_inventory IS 'Whether inventory item is enabled in bottom navbar';
COMMENT ON COLUMN megha_stores.enable_navbar_invoices IS 'Whether invoices/bill item is enabled in bottom navbar';
COMMENT ON COLUMN megha_stores.enable_navbar_profile IS 'Whether profile item is enabled in bottom navbar';

-- Create index for navbar configuration queries
CREATE INDEX IF NOT EXISTS idx_megha_stores_navbar_config ON megha_stores USING GIN (navbar_config);

-- Update existing stores with default navbar configuration
UPDATE megha_stores 
SET navbar_config = '{
  "bottomNavbar": {
    "enabled": true,
    "items": {
      "home": {"enabled": true, "label": "Home", "icon": "home", "route": "/home"},
      "menu": {"enabled": true, "label": "Menu", "icon": "restaurant_menu", "route": "/menu"},
      "cart": {"enabled": true, "label": "Cart", "icon": "shopping_cart", "route": "/cart"},
      "inventory": {"enabled": true, "label": "Inventory", "icon": "inventory", "route": "/inventory"},
      "invoices": {"enabled": true, "label": "Bill", "icon": "receipt", "route": "/invoices"},
      "profile": {"enabled": true, "label": "Profile", "icon": "person", "route": "/profile"}
    }
  },
  "topNavbar": {
    "enabled": true,
    "items": {
      "menu": {"enabled": true, "label": "Menu", "icon": "menu_book", "action": "toggleMenu"},
      "search": {"enabled": true, "label": "Search", "icon": "search", "action": "openSearch"},
      "login": {"enabled": true, "label": "Login", "icon": "account_circle", "action": "openLogin"},
      "cart": {"enabled": true, "label": "Cart", "icon": "shopping_cart", "action": "openCart"}
    }
  }
}'::jsonb
WHERE navbar_config IS NULL;

-- Update JSICare store with specific navbar configuration
UPDATE megha_stores 
SET 
  navbar_config = '{
    "bottomNavbar": {
      "enabled": true,
      "items": {
        "home": {"enabled": true, "label": "Home", "icon": "home", "route": "/home"},
        "menu": {"enabled": true, "label": "Menu", "icon": "restaurant_menu", "route": "/menu"},
        "cart": {"enabled": true, "label": "Cart", "icon": "shopping_cart", "route": "/cart"},
        "inventory": {"enabled": true, "label": "Inventory", "icon": "inventory", "route": "/inventory"},
        "invoices": {"enabled": true, "label": "Bill", "icon": "receipt", "route": "/invoices"},
        "profile": {"enabled": true, "label": "Profile", "icon": "person", "route": "/profile"}
      }
    },
    "topNavbar": {
      "enabled": true,
      "items": {
        "menu": {"enabled": true, "label": "Menu", "icon": "menu_book", "action": "toggleMenu"},
        "search": {"enabled": true, "label": "Search", "icon": "search", "action": "openSearch"},
        "login": {"enabled": true, "label": "Login", "icon": "account_circle", "action": "openLogin"},
        "cart": {"enabled": true, "label": "Cart", "icon": "shopping_cart", "action": "openCart"}
      }
    }
  }'::jsonb,
  enable_navbar_home = true,
  enable_navbar_menu = true,
  enable_navbar_cart = true,
  enable_navbar_inventory = true,
  enable_navbar_invoices = true,
  enable_navbar_profile = true
WHERE store_code = 'jsicare';

-- Update Megha store with specific navbar configuration
UPDATE megha_stores 
SET 
  navbar_config = '{
    "bottomNavbar": {
      "enabled": true,
      "items": {
        "home": {"enabled": true, "label": "Home", "icon": "home", "route": "/home"},
        "menu": {"enabled": true, "label": "Menu", "icon": "restaurant_menu", "route": "/menu"},
        "cart": {"enabled": true, "label": "Cart", "icon": "shopping_cart", "route": "/cart"},
        "inventory": {"enabled": true, "label": "Inventory", "icon": "inventory", "route": "/inventory"},
        "invoices": {"enabled": true, "label": "Bill", "icon": "receipt", "route": "/invoices"},
        "profile": {"enabled": true, "label": "Profile", "icon": "person", "route": "/profile"}
      }
    },
    "topNavbar": {
      "enabled": true,
      "items": {
        "menu": {"enabled": true, "label": "Menu", "icon": "menu_book", "action": "toggleMenu"},
        "search": {"enabled": true, "label": "Search", "icon": "search", "action": "openSearch"},
        "login": {"enabled": true, "label": "Login", "icon": "account_circle", "action": "openLogin"},
        "cart": {"enabled": true, "label": "Cart", "icon": "shopping_cart", "action": "openCart"}
      }
    }
  }'::jsonb,
  enable_navbar_home = true,
  enable_navbar_menu = true,
  enable_navbar_cart = true,
  enable_navbar_inventory = true,
  enable_navbar_invoices = true,
  enable_navbar_profile = true
WHERE store_code = 'megha';

-- Update RR Agency store with specific navbar configuration
UPDATE megha_stores 
SET 
  navbar_config = '{
    "bottomNavbar": {
      "enabled": true,
      "items": {
        "home": {"enabled": true, "label": "Home", "icon": "home", "route": "/home"},
        "inventory": {"enabled": true, "label": "Inventory", "icon": "inventory", "route": "/inventory"},
        "invoices": {"enabled": true, "label": "Bill", "icon": "receipt", "route": "/invoices"},
        "profile": {"enabled": true, "label": "Profile", "icon": "person", "route": "/profile"}
      }
    },
    "topNavbar": {
      "enabled": true,
      "items": {
         
        "login": {"enabled": true, "label": "Login", "icon": "account_circle", "action": "openLogin"},
        "cart": {"enabled": true, "label": "Cart", "icon": "shopping_cart", "action": "openCart"}
      }
    }
  }'::jsonb,
  enable_navbar_home = true,
  enable_navbar_menu = false,
  enable_navbar_cart = true,
  enable_navbar_inventory = true,
  enable_navbar_invoices = true,
  enable_navbar_profile = true
WHERE store_code = 'rragency';

//add navbar config for paws_nexus brand 
-- Add navbar config for paws_nexus brand
UPDATE megha_stores 
SET 
  navbar_config = '{
    "bottomNavbar": {
      "enabled": true,
      "items": {
        "home":     { "enabled": true, "label": "Home",       "icon": "home",         "route": "/home" },
        "services": { "enabled": true, "label": "Services",   "icon": "pets",         "route": "/services" },
        "shop":     { "enabled": true, "label": "Shop",       "icon": "shopping_bag", "route": "/shop" },
        "invoices": { "enabled": true, "label": "Bill",       "icon": "receipt",      "route": "/invoices" },
        "profile":  { "enabled": true, "label": "Profile",    "icon": "person",       "route": "/profile" }
      }
    },
    "topNavbar": {
      "enabled": true,
      "items": {
        "search": { "enabled": true, "label": "Search", "icon": "search", "action": "openSearch" },
        "login":  { "enabled": true, "label": "Login",  "icon": "account_circle", "action": "openLogin" },
        "cart":   { "enabled": true, "label": "Cart",   "icon": "shopping_cart", "action": "openCart" }
      }
    }
  }'::jsonb,
  enable_navbar_home = true,
  enable_navbar_menu = false,
  enable_navbar_cart = true,
  enable_navbar_inventory = false,
  enable_navbar_invoices = true,
  enable_navbar_profile = true
WHERE store_code = 'paws_nexus';




-- Update RR Agency store with specific navbar configuration
UPDATE megha_stores 
SET 
  navbar_config = '{
    "bottomNavbar": {
      "enabled": true,
      "items": {
        "home": {"enabled": true, "label": "Home", "icon": "home", "route": "/home"},
        "services": {"enabled": true, "label": "Services", "icon": "services", "route": "/services"},
        "invoices": {"enabled": true, "label": "Bill", "icon": "receipt", "route": "/invoices"},
        "profile": {"enabled": true, "label": "Profile", "icon": "person", "route": "/profile"}
      }
    },
    "topNavbar": {
      "enabled": true,
      "items": {
        
        "search": {"enabled": true, "label": "Search", "icon": "search", "action": "openSearch"},
        "login": {"enabled": true, "label": "Login", "icon": "account_circle", "action": "openLogin"},
        "cart": {"enabled": true, "label": "Cart", "icon": "shopping_cart", "action": "openCart"}
      }
    }
  }'::jsonb,
  enable_navbar_home = true,
  enable_navbar_menu = true,
  enable_navbar_cart = true,
  enable_navbar_inventory = true,
  enable_navbar_invoices = true,
  enable_navbar_profile = true
WHERE store_code = 'jsicare';

-- Example: Disable inventory menu for a specific store
-- UPDATE megha_stores 
-- SET 
--   enable_navbar_inventory = false,
--   navbar_config = jsonb_set(
--     navbar_config, 
--     '{bottomNavbar,items,inventory,enabled}', 
--     'false'::jsonb
--   )
-- WHERE store_code = 'some-store';

-- Example: Disable invoices menu for a specific store
-- UPDATE megha_stores 
-- SET 
--   enable_navbar_invoices = false,
--   navbar_config = jsonb_set(
--     navbar_config, 
--     '{bottomNavbar,items,invoices,enabled}', 
--     'false'::jsonb
--   )
-- WHERE store_code = 'some-store';

-- ============================================
-- Query Examples for Navbar Control
-- ============================================

-- Get navbar configuration for a specific store
-- SELECT store_code, store_name, navbar_config 
-- FROM megha_stores 
-- WHERE store_code = 'jsicare';

-- Get stores with inventory menu enabled
-- SELECT store_code, store_name 
-- FROM megha_stores 
-- WHERE enable_navbar_inventory = true;

-- Get stores with invoices menu disabled
-- SELECT store_code, store_name 
-- FROM megha_stores 
-- WHERE enable_navbar_invoices = false;

-- Get navbar items configuration for a store
-- SELECT 
--   store_code,
--   navbar_config->'bottomNavbar'->'items' as bottom_navbar_items,
--   navbar_config->'topNavbar'->'items' as top_navbar_items
-- FROM megha_stores 
-- WHERE store_code = 'jsicare';
