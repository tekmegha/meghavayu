export interface Product {
  id: string;
  megha_store_id?: string; // Store identifier (replaces brand_id) - made optional for backward compatibility
  sku?: string;
  name: string;
  price: number;
  rating: number;
  review_count?: number; // Made optional for backward compatibility
  serves: number;
  description: string;
  image_url?: string; // Made optional for backward compatibility
  gallery_images?: any[]; // JSONB array of image URLs
  customisable: boolean;
  customization_options?: any; // JSONB for customization options
  category: string; // Flexible category system
  tags?: any[]; // JSONB array of tags
  discount_percentage?: number;
  old_price?: number;
  nutritional_info?: any; // JSONB for nutritional information
  allergen_info?: any; // JSONB for allergen information
  preparation_time?: number;
  is_available?: boolean; // Made optional for backward compatibility
  is_featured?: boolean; // Made optional for backward compatibility
  sort_order?: number;
  created_at?: string; // Made optional for backward compatibility
  updated_at?: string; // Made optional for backward compatibility
  
  // Legacy compatibility properties
  reviewCount?: number;
  imageUrl?: string;
  discountPercentage?: number;
  oldPrice?: number;
  brand_id?: string; // Legacy compatibility
}

export interface MeghaStore {
  id: string;
  store_code: string;
  store_name: string;
  store_type: string;
  domain?: string;
  theme_config?: any; // JSONB for theme configuration
  business_hours?: any; // JSONB for business hours
  contact_email?: string;
  support_phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreLocation {
  id: string;
  megha_store_id: string;
  location_code?: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  latitude?: number;
  longitude?: number;
  is_flagship: boolean;
  delivery_radius_km: number;
  min_order_amount: number;
  has_parking: boolean;
  has_wifi: boolean;
  has_drive_through: boolean;
  capacity?: number;
  manager_contact?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LocationInventory {
  id: string;
  store_location_id: string;
  product_id: string;
  stock_quantity: number;
  reserved_quantity: number;
  low_stock_threshold: number;
  max_stock_capacity: number;
  cost_price?: number;
  last_restocked_at?: string;
  created_at: string;
  updated_at: string;
}
