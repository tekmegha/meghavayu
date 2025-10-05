export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  megha_store_id: string;
  parent_id?: string;
  sort_order?: number;
  is_active?: boolean;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  
  // For hierarchical display
  children?: Category[];
  parent?: Category;
}

export interface CategoryWithChildren extends Category {
  children: Category[];
}

export interface CategoryTree {
  main_categories: Category[];
  subcategories: { [parentId: string]: Category[] };
}
