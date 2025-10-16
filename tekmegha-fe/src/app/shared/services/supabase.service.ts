import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StoreContextService } from './store-context.service';

// Import new interfaces
import { Product, MeghaStore, StoreLocation, LocationInventory } from '../interfaces/product.interface';
import { CartItem, Order, OrderItem, UserRole } from '../interfaces/store.interface';
import { Category } from '../interfaces/category.interface';
import { StoreFeatures, StoreFeatureType } from '../interfaces/store-features.interface';

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
    
    // Check specific known routes first
    if (path.startsWith('/fashion') || path.startsWith('/majili')) {
      return 'majili';
    } else if (path.startsWith('/toys') || path.startsWith('/little-ducks')) {
      return 'little-ducks';
    } else if (path.startsWith('/food') || path.startsWith('/royalfoods')) {
      return 'royalfoods';
    } else if (path.startsWith('/clients') || path.startsWith('/tekmegha-clients')) {
      return 'tekmegha-clients';
    } else if (path.startsWith('/brew-buddy')) {
      return 'brew-buddy';
    } else if (path.startsWith('/cctv-device')) {
      return 'cctv-device';
    } else if (path.startsWith('/dkassociates')) {
      return 'dkassociates';
    } else if (path.startsWith('/automobile-insurance')) {
      return 'automobile-insurance';
    } else if (path.startsWith('/insurance')) {
      return 'automobile-insurance';
    } else if (path === '/inventory-login' || path === '/login') {
      // Special case for login pages - check returnUrl parameter
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');
      if (returnUrl) {
        const storeCode = this.extractStoreCodeFromPath(returnUrl);
        if (storeCode) {
          return storeCode;
        }
      }
    } else {
      // Check if path starts with a store code pattern (e.g., /any-store-code/...)
      const pathSegments = path.split('/').filter(segment => segment);
      if (pathSegments.length > 0) {
        const potentialStoreCode = pathSegments[0];
        // Check if it's not a known global route
        const globalRoutes = ['home', 'menu', 'cart', 'stores', 'profile', 'login', 'inventory', 'invoice', 'insurances', 'tekmegha-clients', 'inventory-login'];
        if (!globalRoutes.includes(potentialStoreCode)) {
          return potentialStoreCode;
        }
      }
    }
    return ''; // No default store - let user choose
  }

  private extractStoreCodeFromPath(path: string): string | null {
    // Remove leading slash and split by '/'
    const segments = path.replace(/^\//, '').split('/');
    if (segments.length > 0) {
      const potentialStoreCode = segments[0];
      // Check if it's not a known global route
      const globalRoutes = ['home', 'menu', 'cart', 'stores', 'profile', 'login', 'inventory', 'invoice', 'insurances', 'tekmegha-clients'];
      if (!globalRoutes.includes(potentialStoreCode)) {
        return potentialStoreCode;
      }
    }
    return null;
  }

  // Legacy method for backward compatibility
  getCurrentBrand(): string {
    return this.getCurrentStore();
  }

  // Get current store ID from URL-based store context
  async getCurrentStoreId(): Promise<string | null> {
    try {
      // Always get store ID from URL-based context
      const storeCode = this.getCurrentStore();
      if (!storeCode) {
        console.log('No store code detected from URL');
        return null;
      }

      const { data, error } = await this.supabase
        .from('megha_stores')
        .select('id')
        .eq('store_code', storeCode)
        .eq('is_active', true);
      
      if (error) {
        console.error('Error fetching store ID from URL:', error);
        return null;
      }
      
      const storeId = data?.[0]?.id?.toString() || null;
      console.log('Store ID from URL:', { storeCode, storeId });
      return storeId;
    } catch (error) {
      console.error('Error getting store ID from URL:', error);
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

  async getCategories(): Promise<{ data: Category[] | null; error: any }> {
    try {
      // Check if Supabase is ready
      if (!this.isSupabaseReady()) {
        console.log('Supabase not ready, waiting...');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.isSupabaseReady()) {
          return { data: null, error: { message: 'Supabase client not ready' } };
        }
      }

      const storeId = await this.getCurrentStoreId();
      if (!storeId) {
        return { data: null, error: { message: 'Store not found' } };
      }

      console.log('Fetching categories for store:', storeId);

      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('megha_store_id', storeId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching categories:', error);
        return { data: null, error };
      }

      console.log('Found categories:', data?.length || 0);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in getCategories:', error);
      return { data: null, error };
    }
  }

  async getMainCategories(): Promise<{ data: Category[] | null; error: any }> {
    try {
      // Check if Supabase is ready
      if (!this.isSupabaseReady()) {
        console.log('Supabase not ready, waiting...');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.isSupabaseReady()) {
          return { data: null, error: { message: 'Supabase client not ready' } };
        }
      }

      const storeId = await this.getCurrentStoreId();
      if (!storeId) {
        return { data: null, error: { message: 'Store not found' } };
      }

      console.log('🔍 Fetching main categories for store:', storeId);
      console.log('🔗 Supabase client ready:', this.isSupabaseReady());

      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('megha_store_id', storeId)
        .eq('is_active', true)
        .is('parent_id', null)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      console.log('📡 Supabase query result:', { data, error });

      if (error) {
        console.error('❌ Error fetching main categories:', error);
        return { data: null, error };
      }

      console.log('✅ Found main categories:', data?.length || 0);
      console.log('📋 Categories data:', data);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in getMainCategories:', error);
      return { data: null, error };
    }
  }

  // Method specifically for inventory management - gets all categories (main and sub)
  async getCategoriesForInventory(): Promise<{ data: Category[] | null; error: any }> {
    try {
      // Check if Supabase is ready
      if (!this.isSupabaseReady()) {
        console.log('Supabase not ready, waiting...');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.isSupabaseReady()) {
          return { data: null, error: { message: 'Supabase client not ready' } };
        }
      }

      const storeId = await this.getCurrentStoreId();
      if (!storeId) {
        return { data: null, error: { message: 'Store not found' } };
      }

      console.log('🔍 Fetching all categories for inventory management, store:', storeId);

      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('megha_store_id', storeId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      console.log('📡 Inventory categories query result:', { data, error });

      if (error) {
        console.error('❌ Error fetching categories for inventory:', error);
        return { data: null, error };
      }

      console.log('✅ Found categories for inventory:', data?.length || 0);
      console.log('📋 Inventory categories data:', data);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error in getCategoriesForInventory:', error);
      return { data: null, error };
    }
  }

  async getProductsByCategory(category: string): Promise<{ data: Product[] | null; error: any }> {
    try {
      // Check if Supabase is ready
      if (!this.isSupabaseReady()) {
        console.log('Supabase not ready, waiting...');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.isSupabaseReady()) {
          return { data: null, error: { message: 'Supabase client not ready' } };
        }
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
    try {
      // Check if Supabase is ready
      if (!this.isSupabaseReady()) {
        console.log('Supabase not ready, waiting...');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.isSupabaseReady()) {
          return { data: null, error: { message: 'Supabase client not ready' } };
        }
      }

      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      return { data, error };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { data: null, error };
    }
  }

  async addProduct(product: Partial<Product>): Promise<{ data: Product | null; error: any }> {
    try {
      // Check if Supabase is ready
      if (!this.isSupabaseReady()) {
        console.log('Supabase not ready, waiting...');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.isSupabaseReady()) {
          return { data: null, error: { message: 'Supabase client not ready' } };
        }
      }

      const storeId = await this.getCurrentStoreId();
      if (!storeId) {
        return { data: null, error: { message: 'Store not found' } };
      }

      // Map component fields to database schema
      const productData = {
        megha_store_id: storeId,
        sku: product.sku || null,
        name: product.name,
        price: product.price,
        rating: product.rating || 0.0,
        review_count: product.review_count || 0,
        serves: product.serves || 1,
        description: product.description || null,
        image_url: product.image_url || null,
        gallery_images: product.gallery_images || null,
        customisable: product.customisable || false,
        customization_options: product.customization_options || null,
        category: product.category || null,
        tags: product.tags || null,
        discount_percentage: product.discount_percentage || 0,
        old_price: product.old_price || null,
        nutritional_info: product.nutritional_info || null,
        allergen_info: product.allergen_info || null,
        preparation_time: product.preparation_time || null,
        is_available: product.is_available !== false,
        is_featured: product.is_featured || false,
        sort_order: product.sort_order || 0
      };

      console.log('Adding product with data:', productData);

      const { data, error } = await this.supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        return { data: null, error };
      }

      console.log('Product added successfully:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error in addProduct:', error);
      return { data: null, error };
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ data: Product | null; error: any }> {
    try {
      // Check if Supabase is ready
      if (!this.isSupabaseReady()) {
        console.log('Supabase not ready, waiting...');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.isSupabaseReady()) {
          return { data: null, error: { message: 'Supabase client not ready' } };
        }
      }

      const storeId = await this.getCurrentStoreId();
      if (!storeId) {
        return { data: null, error: { message: 'Store not found' } };
      }

      // Map component fields to database schema for updates
      const updateData: any = {};
      
      // Only include fields that are being updated
      if (updates.sku !== undefined) updateData.sku = updates.sku;
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.rating !== undefined) updateData.rating = updates.rating;
      if (updates.review_count !== undefined) updateData.review_count = updates.review_count;
      if (updates.serves !== undefined) updateData.serves = updates.serves;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.image_url !== undefined) updateData.image_url = updates.image_url;
      if (updates.gallery_images !== undefined) updateData.gallery_images = updates.gallery_images;
      if (updates.customisable !== undefined) updateData.customisable = updates.customisable;
      if (updates.customization_options !== undefined) updateData.customization_options = updates.customization_options;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.discount_percentage !== undefined) updateData.discount_percentage = updates.discount_percentage;
      if (updates.old_price !== undefined) updateData.old_price = updates.old_price;
      if (updates.nutritional_info !== undefined) updateData.nutritional_info = updates.nutritional_info;
      if (updates.allergen_info !== undefined) updateData.allergen_info = updates.allergen_info;
      if (updates.preparation_time !== undefined) updateData.preparation_time = updates.preparation_time;
      if (updates.is_available !== undefined) updateData.is_available = updates.is_available;
      if (updates.is_featured !== undefined) updateData.is_featured = updates.is_featured;
      if (updates.sort_order !== undefined) updateData.sort_order = updates.sort_order;

      console.log('Updating product with data:', updateData);

      const { data, error } = await this.supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .eq('megha_store_id', storeId)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        return { data: null, error };
      }

      console.log('Product updated successfully:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error in updateProduct:', error);
      return { data: null, error };
    }
  }

  async deleteProduct(id: string): Promise<{ error: any }> {
    try {
      // Check if Supabase is ready
      if (!this.isSupabaseReady()) {
        console.log('Supabase not ready, waiting...');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.isSupabaseReady()) {
          return { error: { message: 'Supabase client not ready' } };
        }
      }

      const storeId = await this.getCurrentStoreId();
      if (!storeId) {
        return { error: { message: 'Store not found' } };
      }

      console.log('Deleting product:', id);

      const { error } = await this.supabase
        .from('products')
        .delete()
        .eq('id', id)
        .eq('megha_store_id', storeId);

      if (error) {
        console.error('Error deleting product:', error);
        return { error };
      }

      console.log('Product deleted successfully');
      return { error: null };
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      return { error };
    }
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
      // Check if Supabase is ready
      if (!this.isSupabaseReady()) {
        console.log('Supabase not ready, waiting...');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.isSupabaseReady()) {
          return { data: null, error: { message: 'Supabase client not ready' } };
        }
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

  // Store Features Methods
  async getStoreFeatures(storeCode: string): Promise<{ data: StoreFeatures | null, error: any }> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_store_features', { store_code_param: storeCode });

      if (error) {
        console.error('Error fetching store features:', error);
        return { data: null, error };
      }

      const features = data?.[0] ? {
        storeId: data[0].store_id,
        storeCode: data[0].store_code,
        storeName: data[0].store_name,
        storeType: data[0].store_type,
        enableProducts: data[0].enable_products,
        enableCart: data[0].enable_cart,
        enablePayments: data[0].enable_payments,
        enableInventory: data[0].enable_inventory,
        enableInvoices: data[0].enable_invoices,
        enableCustomers: data[0].enable_customers,
        enableReports: data[0].enable_reports
      } : null;

      return { data: features, error: null };
    } catch (error) {
      console.error('Error fetching store features:', error);
      return { data: null, error };
    }
  }

  async isStoreFeatureEnabled(storeCode: string, feature: StoreFeatureType): Promise<boolean> {
    try {
      const { data, error } = await this.supabase
        .rpc('is_store_feature_enabled', { 
          store_code_param: storeCode, 
          feature_name: feature 
        });

      if (error) {
        console.error('Error checking store feature:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error checking store feature:', error);
      return false;
    }
  }

  // Convenience methods for common feature checks
  async canShowProducts(storeCode: string): Promise<boolean> {
    return this.isStoreFeatureEnabled(storeCode, 'products');
  }

  async canShowCart(storeCode: string): Promise<boolean> {
    return this.isStoreFeatureEnabled(storeCode, 'cart');
  }

  async canShowPayments(storeCode: string): Promise<boolean> {
    return this.isStoreFeatureEnabled(storeCode, 'payments');
  }

  async canShowInventory(storeCode: string): Promise<boolean> {
    return this.isStoreFeatureEnabled(storeCode, 'inventory');
  }

  async canShowInvoices(storeCode: string): Promise<boolean> {
    return this.isStoreFeatureEnabled(storeCode, 'invoices');
  }

  async canShowCustomers(storeCode: string): Promise<boolean> {
    return this.isStoreFeatureEnabled(storeCode, 'customers');
  }

  async canShowReports(storeCode: string): Promise<boolean> {
    return this.isStoreFeatureEnabled(storeCode, 'reports');
  }
}
 