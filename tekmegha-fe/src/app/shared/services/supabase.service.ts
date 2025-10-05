import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StoreContextService } from './store-context.service';

// Import new interfaces
import { Product, MeghaStore, StoreLocation, LocationInventory } from '../interfaces/product.interface';
import { CartItem, Order, OrderItem, UserRole } from '../interfaces/store.interface';

// Re-export interfaces for backward compatibility
export type { Product, MeghaStore, StoreLocation, LocationInventory } from '../interfaces/product.interface';
export type { CartItem, Order, OrderItem, UserRole } from '../interfaces/store.interface';

// Export Store alias for backward compatibility
export type Store = MeghaStore;


@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase!: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private storeContextService: StoreContextService) {
    // Add a small delay to prevent lock conflicts
    setTimeout(() => {
      this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          flowType: 'pkce'
        },
        global: {
          headers: {
            'X-Client-Info': 'brewbuddy-app'
          }
        }
      });
      this.initializeAuth();
    }, 100);
  }

  // Get current store based on URL path - returns store_code for new schema
  getCurrentStore(): string {
    const path = window.location.pathname;
    if (path.startsWith('/fashion') || path.startsWith('/opula')) {
      return 'opula';
    } else if (path.startsWith('/toys') || path.startsWith('/little-ducks')) {
      return 'little-ducks';
    } else if (path.startsWith('/clients') || path.startsWith('/tekmegha-clients')) {
      return 'tekmegha-clients';
    } else if (path.startsWith('/brew-buddy')) {
      return 'brew-buddy';
    } else {
      return ''; // No default store - let user choose
    }
  }

  // Legacy method for backward compatibility
  getCurrentBrand(): string {
    return this.getCurrentStore();
  }

  // Get current store ID from store context service
  async getCurrentStoreId(): Promise<string | null> {
    try {
      const currentStoreId = this.storeContextService.getCurrentStoreId();
      if (currentStoreId) {
        return currentStoreId;
      }
      
      // Fallback to URL-based detection if no store context
      const storeCode = this.getCurrentStore();
      if (storeCode) {
        const { data, error } = await this.supabase
          .from('megha_stores')
          .select('id')
          .eq('store_code', storeCode)
          .eq('is_active', true);
        
        if (error) {
          console.error('Error fetching store ID:', error);
          return null;
        }
        
        return data?.[0]?.id || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting store ID:', error);
      return null;
    }
  }

  private async initializeAuth() {
    try {
      // Get initial session
      const { data: { session } } = await this.supabase.auth.getSession();
      this.currentUserSubject.next(session?.user ?? null);

      // Listen for auth changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        this.currentUserSubject.next(session?.user ?? null);
      });
    } catch (error) {
      console.warn('Auth initialization error (non-critical):', error);
      // Set user as null if auth fails to initialize
      this.currentUserSubject.next(null);
    }
  }

  // Authentication Methods
  async signInWithPhone(phone: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithOtp({
        phone: `+91${phone}`,
        options: {
          channel: 'sms'
        }
      });
      return { data, error };
    } catch (error) {
      console.error('Phone sign-in error:', error);
      return { data: null, error: { message: 'Failed to send OTP. Please try again.' } };
    }
  }

  async verifyOtp(phone: string, token: string) {
    try {
      const { data, error } = await this.supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token,
        type: 'sms'
      });
      return { data, error };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { data: null, error: { message: 'Failed to verify OTP. Please try again.' } };
    }
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });
      return { data, error };
    } catch (error) {
      console.error('Email sign-in error:', error);
      return { data: null, error: { message: 'Failed to sign in. Please check your credentials.' } };
    }
  }

  async signUpWithEmail(email: string, password: string, fullName?: string) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
            phone: ''
          }
        }
      });
      return { data, error };
    } catch (error) {
      console.error('Email sign-up error:', error);
      return { data: null, error: { message: 'Failed to create account. Please try again.' } };
    }
  }

  async resetPassword(email: string) {
    try {
      const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });
      return { data, error };
    } catch (error) {
      console.error('Password reset error:', error);
      return { data: null, error: { message: 'Failed to send reset email. Please try again.' } };
    }
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isSupabaseReady(): boolean {
    return !!this.supabase;
  }

  // Get supabase client for direct access (used by other services)
  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }

  // Product Methods - Updated for new schema

  async getProductsByCategory(category: string): Promise<{ data: Product[] | null; error: any }> {
    try {
      if (!this.supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      const storeId = await this.getCurrentStoreId();
      if (!storeId) {
        return { data: null, error: { message: 'Store not found' } };
      }

      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          megha_stores!inner(store_name, store_code)
        `)
        .eq('megha_store_id', storeId)
        .eq('category', category)
        .eq('is_available', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Network error fetching products by category:', error);
      return { 
        data: null, 
        error: { 
          message: 'Network error: Unable to connect to server.',
          code: 'NETWORK_ERROR'
        } 
      };
    }
  }

  async getProduct(id: string): Promise<{ data: Product | null; error: any }> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  }

  async addProduct(product: Partial<Product>): Promise<{ data: Product | null; error: any }> {
    const storeId = await this.getCurrentStoreId();
    if (!storeId) {
      return { data: null, error: 'Store not found' };
    }

    const { data, error } = await this.supabase
      .from('products')
      .insert([{
        ...product,
        megha_store_id: storeId
      }])
      .select()
      .single();
    return { data, error };
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ data: Product | null; error: any }> {
    const storeId = await this.getCurrentStoreId();
    if (!storeId) {
      return { data: null, error: 'Store not found' };
    }

    const { data, error } = await this.supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .eq('megha_store_id', storeId)
      .select()
      .single();
    return { data, error };
  }

  async deleteProduct(id: string): Promise<{ error: any }> {
    const storeId = await this.getCurrentStoreId();
    if (!storeId) {
      return { error: 'Store not found' };
    }

    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id)
      .eq('megha_store_id', storeId);
    return { error };
  }

  // Delivery Methods
  async createDeliveryRequest(request: any): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase
      .from('delivery_requests')
      .insert([request])
      .select()
      .single();
    return { data, error };
  }

  async updateDeliveryStatus(orderId: string, status: string): Promise<{ error: any }> {
    const { error } = await this.supabase
      .from('delivery_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('order_id', orderId);
    return { error };
  }

  async getDeliveryTracking(orderId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase
      .from('delivery_requests')
      .select('*')
      .eq('order_id', orderId)
      .single();
    return { data, error };
  }


  // Cart Methods
  async clearCart(): Promise<{ data: any; error: any }> {
    const user = this.getCurrentUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const storeId = await this.getCurrentStoreId();
    if (!storeId) {
      return { data: null, error: 'Store not found' };
    }

    const { data, error } = await this.supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('megha_store_id', storeId)
      .select();
    return { data, error };
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<{ data: any; error: any }> {
    if (quantity <= 0) {
      return this.removeFromCart(cartItemId);
    }

    const { data, error } = await this.supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select();
    return { data, error };
  }

  async removeFromCart(cartItemId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .select();
    return { data, error };
  }




  async getOrder(id: string): Promise<{ data: Order | null; error: any }> {
    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products(*)
        )
      `)
      .eq('id', id)
      .single();
    return { data, error };
  }


  // Real-time subscriptions
  subscribeToCartChanges(callback: (payload: any) => void) {
    const user = this.getCurrentUser();
    if (!user) return null;

    return this.supabase
      .channel('cart_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'cart_items',
        filter: `user_id=eq.${user.id}`
      }, callback)
      .subscribe();
  }

  subscribeToOrderChanges(callback: (payload: any) => void) {
    const user = this.getCurrentUser();
    if (!user) return null;

    return this.supabase
      .channel('order_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `user_id=eq.${user.id}`
      }, callback)
      .subscribe();
  }

  // ===================================================================
  // NEW SCHEMA METHODS
  // ===================================================================

  // Store Management Methods
  async getMeghaStores(): Promise<{ data: MeghaStore[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('megha_stores')
        .select('*')
        .eq('is_active', true)
        .order('store_name');
      return { data, error };
    } catch (error) {
      console.error('Error fetching stores:', error);
      return { data: null, error };
    }
  }

  async getMeghaStore(storeCode: string): Promise<{ data: MeghaStore | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('megha_stores')
        .select('*')
        .eq('store_code', storeCode)
        .eq('is_active', true);
      
      if (error) {
        return { data: null, error };
      }
      
      return { data: data?.[0] || null, error: null };
    } catch (error) {
      console.error('Error fetching store:', error);
      return { data: null, error };
    }
  }

  // Store Locations Methods
  async getStoreLocations(storeIdInput?: string): Promise<{ data: StoreLocation[] | null; error: any }> {
    try {
      let storeId = storeIdInput || await this.getCurrentStoreId();
      let query = this.supabase
        .from('store_locations')
        .select('*')
        .eq('is_active', true);

      if (storeId) {
        query = query.eq('megha_store_id', storeId);
      }

      const { data, error } = await query.order('name');
      return { data, error };
    } catch (error) {
      console.error('Error fetching store locations:', error);
      return { data: null, error };
    }
  }

  // Product Methods
  async getProducts(): Promise<{ data: Product[] | null; error: any }> {
    try {
      const storeId = await this.getCurrentStoreId();
      if (!storeId) {
        return { data: null, error: { message: 'Store not found' } };
      }

      const { data, error } = await this.supabase
        .from('products')
        .select(`
          *,
          megha_stores!inner(store_name, store_code)
        `)
        .eq('megha_store_id', storeId)
        .eq('is_available', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: null, error };
    }
  }

  async getProductsWithInventory(locationId?: string): Promise<{ data: any[] | null; error: any }> {
    try {
      const storeId = await this.getCurrentStoreId();
      if (!storeId) {
        return { data: null, error: { message: 'Store not found' } };
      }

      let query = this.supabase
        .from('products')
        .select(`
          *,
          megha_stores!inner(store_name, store_code),
          location_inventory!left(
            stock_quantity,
            reserved_quantity,
            low_stock_threshold,
            store_location_id
          )
        `)
        .eq('megha_store_id', storeId)
        .eq('is_available', true);

      if (locationId) {
        query = query.eq('location_inventory.store_location_id', locationId);
      }

      const { data, error } = await query.order('sort_order');
      return { data, error };
    } catch (error) {
      console.error('Error fetching products with inventory:', error);
      return { data: null, error };
    }
  }

  // Cart Methods
  async getCartItems(): Promise<{ data: any[] | null; error: any }> {
    try {
      const user = this.getCurrentUser();
      const storeId = await this.getCurrentStoreId();
      
      if (!user || !storeId) {
        return { data: null, error: { message: 'User not authenticated or store not found' } };
      }

      const { data, error } = await this.supabase
        .from('cart_items')
        .select(`
          *,
          products!inner(
            id,
            name,
            price,
            image_url,
            category,
            discount_percentage,
            old_price
          )
        `)
        .eq('user_id', user.id)
        .eq('megha_store_id', storeId)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return { data: null, error };
    }
  }

  async addToCart(productId: string, quantity: number = 1, customizations?: any): Promise<{ data: any; error: any }> {
    try {
      const user = this.getCurrentUser();
      const storeId = await this.getCurrentStoreId();
      
      if (!user || !storeId) {
        return { data: null, error: { message: 'User not authenticated or store not found' } };
      }

      // Get product price
      const { data: product, error: productError } = await this.supabase
        .from('products')
        .select('price')
        .eq('id', productId)
        .eq('megha_store_id', storeId)
        .single();

      if (productError || !product) {
        return { data: null, error: { message: 'Product not found' } };
      }

      const { data, error } = await this.supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          megha_store_id: storeId,
          quantity: quantity,
          customizations: customizations,
          unit_price: product.price
        }, {
          onConflict: 'user_id,product_id,megha_store_id'
        })
        .select();

      return { data, error };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { data: null, error };
    }
  }

  // Order Methods
  async createOrder(orderData: Partial<Order>): Promise<{ data: Order | null; error: any }> {
    try {
      const user = this.getCurrentUser();
      const storeId = await this.getCurrentStoreId();
      
      if (!user || !storeId) {
        return { data: null, error: { message: 'User not authenticated or store not found' } };
      }

      const { data, error } = await this.supabase
        .from('orders')
        .insert({
          ...orderData,
          user_id: user.id,
          megha_store_id: storeId,
          order_type: orderData.order_type || 'delivery',
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating order:', error);
      return { data: null, error };
    }
  }

  async getOrders(): Promise<{ data: Order[] | null; error: any }> {
    try {
      const user = this.getCurrentUser();
      const storeId = await this.getCurrentStoreId();
      
      if (!user || !storeId) {
        return { data: null, error: { message: 'User not authenticated or store not found' } };
      }

      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(
              id,
              name,
              price,
              image_url
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('megha_store_id', storeId)
        .order('created_at', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { data: null, error };
    }
  }

  // User Role Methods
  async getUserRole(storeId?: string): Promise<{ data: UserRole | null; error: any }> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        console.log('getUserRole: User not authenticated');
        return { data: null, error: { message: 'User not authenticated' } };
      }

      const targetStoreId = storeId || await this.getCurrentStoreId();
      if (!targetStoreId) {
        console.log('getUserRole: Store not found, storeId:', storeId, 'targetStoreId:', targetStoreId);
        return { data: null, error: { message: 'Store not found' } };
      }

      console.log('getUserRole: Fetching role for user:', user.id, 'store:', targetStoreId);

      const { data, error } = await this.supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('megha_store_id', targetStoreId)
        .eq('is_active', true);

      if (error) {
        console.error('getUserRole: Database error:', error);
        return { data: null, error };
      }

      console.log('getUserRole: Found roles:', data);
      return { data: data?.[0] || null, error: null };
    } catch (error) {
      console.error('Error fetching user role:', error);
      return { data: null, error };
    }
  }

  async createUserRole(userId: string, storeId: string, role: string, permissions?: any): Promise<{ data: UserRole | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          megha_store_id: storeId,
          role: role,
          permissions: permissions
        })
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error creating user role:', error);
      return { data: null, error };
    }
  }

  // Inventory Management Methods
  async getLocationInventory(locationId: string): Promise<{ data: LocationInventory[] | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('location_inventory')
        .select(`
          *,
          products(
            id,
            name,
            sku,
            category
          )
        `)
        .eq('store_location_id', locationId)
        .order('products.name');

      return { data, error };
    } catch (error) {
      console.error('Error fetching location inventory:', error);
      return { data: null, error };
    }
  }

  async updateInventory(locationId: string, productId: string, stockQuantity: number): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('location_inventory')
        .upsert({
          store_location_id: locationId,
          product_id: productId,
          stock_quantity: stockQuantity
        }, {
          onConflict: 'store_location_id,product_id'
        })
        .select();

      return { data, error };
    } catch (error) {
      console.error('Error updating inventory:', error);
      return { data: null, error };
    }
  }
}
 