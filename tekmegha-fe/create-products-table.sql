-- Create products table with proper schema
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  megha_store_id uuid NULL,
  sku character varying(100) NULL,
  name character varying(255) NOT NULL,
  price numeric(10, 2) NOT NULL,
  rating numeric(3, 2) NULL DEFAULT 0.0,
  review_count integer NULL DEFAULT 0,
  serves integer NULL DEFAULT 1,
  description text NULL,
  image_url character varying(500) NULL,
  gallery_images jsonb NULL,
  customisable boolean NULL DEFAULT false,
  customization_options jsonb NULL,
  category character varying(50) NULL,
  tags jsonb NULL,
  discount_percentage integer NULL DEFAULT 0,
  old_price numeric(10, 2) NULL,
  nutritional_info jsonb NULL,
  allergen_info jsonb NULL,
  preparation_time integer NULL,
  is_available boolean NULL DEFAULT true,
  is_featured boolean NULL DEFAULT false,
  sort_order integer NULL DEFAULT 0,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT unique_store_sku UNIQUE (megha_store_id, sku),
  CONSTRAINT products_megha_store_id_fkey FOREIGN KEY (megha_store_id) REFERENCES megha_stores (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_megha_store_id ON public.products USING btree (megha_store_id) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_products_category_store ON public.products USING btree (megha_store_id, category) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_products_available ON public.products USING btree (is_available) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products USING btree (is_featured) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products USING btree (rating) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products USING btree (megha_store_id, sku) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_products_store ON public.products USING btree (megha_store_id) TABLESPACE pg_default;

-- Create trigger for updating updated_at column
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view products for their store" ON public.products
  FOR SELECT USING (
    megha_store_id IN (
      SELECT ur.megha_store_id 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.is_active = true
    )
  );

CREATE POLICY "Users can insert products for their store" ON public.products
  FOR INSERT WITH CHECK (
    megha_store_id IN (
      SELECT ur.megha_store_id 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.is_active = true
      AND ur.permissions->>'products'->>'create' = 'true'
    )
  );

CREATE POLICY "Users can update products for their store" ON public.products
  FOR UPDATE USING (
    megha_store_id IN (
      SELECT ur.megha_store_id 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.is_active = true
      AND ur.permissions->>'products'->>'update' = 'true'
    )
  );

CREATE POLICY "Users can delete products for their store" ON public.products
  FOR DELETE USING (
    megha_store_id IN (
      SELECT ur.megha_store_id 
      FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.is_active = true
      AND ur.permissions->>'products'->>'delete' = 'true'
    )
  );

-- Grant permissions
GRANT ALL ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
