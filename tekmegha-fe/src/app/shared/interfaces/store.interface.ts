// Legacy Store interface for backward compatibility
export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  imageUrl?: string;
  brand_id: string; // Deprecated - use megha_store_id instead
  megha_store_id?: string; // New schema compatibility
  is_available?: boolean; // New schema compatibility
  is_featured?: boolean; // New schema compatibility
  created_at?: string; // New schema compatibility
  updated_at?: string; // New schema compatibility
}

// New comprehensive store interfaces matching the schema
export interface CartItem {
  id: string;
  megha_store_id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  customizations?: any; // JSONB for product customizations
  special_instructions?: string;
  unit_price: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  megha_store_id: string;
  user_id: string;
  store_location_id?: string;
  pickup_location_id?: string;
  customer_address_id?: string;
  order_type: 'delivery' | 'pickup' | 'dine_in';
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method?: string;
  payment_id?: string;
  delivery_address?: any; // JSONB
  billing_address?: any; // JSONB
  phone_number?: string;
  customer_notes?: string;
  staff_notes?: string;
  estimated_preparation_time?: number;
  actual_preparation_time?: number;
  estimated_delivery_time?: string;
  delivered_at?: string;
  cancelled_reason?: string;
  refund_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  customizations?: any; // JSONB
  special_instructions?: string;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  megha_store_id: string;
  role_name: 'super_admin' | 'store_admin' | 'manager' | 'inventory_staff' | 'store_manager' | 'customer' | 'delivery_partner' | 'inventory_manager';
  permissions?: any; // JSONB
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}
