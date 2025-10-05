-- Create categories table with proper schema
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying(100) NOT NULL,
  description text NULL,
  slug character varying(100) NOT NULL,
  megha_store_id uuid NOT NULL,
  parent_id uuid NULL,
  sort_order integer NULL DEFAULT 0,
  is_active boolean NULL DEFAULT true,
  image_url text NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_name_megha_store_id_key UNIQUE (name, megha_store_id),
  CONSTRAINT categories_slug_megha_store_id_key UNIQUE (slug, megha_store_id),
  CONSTRAINT categories_megha_store_id_fkey FOREIGN KEY (megha_store_id) REFERENCES megha_stores (id) ON DELETE CASCADE,
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE SET NULL
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_store ON public.categories USING btree (megha_store_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories USING btree (parent_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories USING btree (is_active) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories USING btree (slug) TABLESPACE pg_default;

-- Create trigger for updating updated_at column
CREATE TRIGGER trigger_update_categories_updated_at 
  BEFORE UPDATE ON categories 
  FOR EACH ROW 
  EXECUTE FUNCTION update_categories_updated_at();

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view categories for their store" ON public.categories
  FOR SELECT USING (
    megha_store_id IN (
      SELECT ur.megha_store_id 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.is_active = true
    )
  );

CREATE POLICY "Users can insert categories for their store" ON public.categories
  FOR INSERT WITH CHECK (
    megha_store_id IN (
      SELECT ur.megha_store_id 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.is_active = true
      AND ur.permissions->>'categories'->>'create' = 'true'
    )
  );

CREATE POLICY "Users can update categories for their store" ON public.categories
  FOR UPDATE USING (
    megha_store_id IN (
      SELECT ur.megha_store_id 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.is_active = true
      AND ur.permissions->>'categories'->>'update' = 'true'
    )
  );

CREATE POLICY "Users can delete categories for their store" ON public.categories
  FOR DELETE USING (
    megha_store_id IN (
      SELECT ur.megha_store_id 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.is_active = true
      AND ur.permissions->>'categories'->>'delete' = 'true'
    )
  );

-- Grant permissions
GRANT ALL ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;