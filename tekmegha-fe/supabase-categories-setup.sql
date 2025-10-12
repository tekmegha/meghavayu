-- Supabase Categories Setup
-- This creates the categories table and provides the correct way to access it

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    slug VARCHAR(100) NOT NULL,
    megha_store_id UUID NOT NULL REFERENCES megha_stores(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique category names per store
    UNIQUE(name, megha_store_id),
    UNIQUE(slug, megha_store_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_store ON categories(megha_store_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_categories_updated_at();

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
-- Public can read active categories
CREATE POLICY "Public can read active categories"
ON categories
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Authenticated users can read all categories for their stores
CREATE POLICY "Users can read categories for their stores"
ON categories
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.megha_store_id = categories.megha_store_id
        AND ur.is_active = true
    )
);

-- Store admins and managers can manage categories
CREATE POLICY "Store admins can manage categories"
ON categories
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.megha_store_id = categories.megha_store_id
        AND ur.role IN ('store_admin', 'store_manager', 'inventory_manager', 'super_admin')
        AND ur.is_active = true
    )
);

-- Insert default categories for each store
INSERT INTO categories (name, description, slug, megha_store_id, sort_order, is_active)
SELECT 
    'Coffee & Beverages',
    'Hot and cold coffee drinks, teas, and other beverages',
    'coffee-beverages',
    ms.id,
    1,
    true
FROM megha_stores ms
WHERE ms.store_code = 'brew-buddy'
ON CONFLICT (name, megha_store_id) DO NOTHING;

INSERT INTO categories (name, description, slug, megha_store_id, sort_order, is_active)
SELECT 
    'Food & Snacks',
    'Pastries, sandwiches, and light meals',
    'food-snacks',
    ms.id,
    2,
    true
FROM megha_stores ms
WHERE ms.store_code = 'brew-buddy'
ON CONFLICT (name, megha_store_id) DO NOTHING;

INSERT INTO categories (name, description, slug, megha_store_id, sort_order, is_active)
SELECT 
    'Toys & Games',
    'Educational toys, action figures, and board games',
    'toys-games',
    ms.id,
    1,
    true
FROM megha_stores ms
WHERE ms.store_code = 'little-ducks'
ON CONFLICT (name, megha_store_id) DO NOTHING;

INSERT INTO categories (name, description, slug, megha_store_id, sort_order, is_active)
SELECT 
    'Educational',
    'Learning toys and educational materials',
    'educational',
    ms.id,
    2,
    true
FROM megha_stores ms
WHERE ms.store_code = 'little-ducks'
ON CONFLICT (name, megha_store_id) DO NOTHING;

INSERT INTO categories (name, description, slug, megha_store_id, sort_order, is_active)
SELECT 
    'Clothing',
    'Fashion clothing and accessories',
    'clothing',
    ms.id,
    1,
    true
FROM megha_stores ms
WHERE ms.store_code = 'majili'
ON CONFLICT (name, megha_store_id) DO NOTHING;

INSERT INTO categories (name, description, slug, megha_store_id, sort_order, is_active)
SELECT 
    'Accessories',
    'Fashion accessories and jewelry',
    'accessories',
    ms.id,
    2,
    true
FROM megha_stores ms
WHERE ms.store_code = 'majili'
ON CONFLICT (name, megha_store_id) DO NOTHING;

-- Verification query
SELECT 
    c.name as category_name,
    c.slug,
    ms.store_name,
    ms.store_code,
    c.sort_order,
    c.is_active
FROM categories c
JOIN megha_stores ms ON c.megha_store_id = ms.id
ORDER BY ms.store_code, c.sort_order, c.name;
