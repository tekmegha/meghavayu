import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  review_count: number;
  serves: number;
  description: string;
  image_url: string;
  customisable: boolean;
  category: 'Espresso Drinks' | 'Brewed Coffee' | 'Pastries & Snacks' | 'Educational' | 'Action Figures' | 'Board Games' | 'Dolls' | 'Outdoor' | 'Puzzles' | 'Dresses' | 'Men\'s' | 'Accessories' | 'Footwear' | 'Jewelry';
  discount_percentage?: number;
  old_price?: number;
  brand_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  brand_id: string;
  created_at?: string;
  updated_at?: string;
  product?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  delivery_fee: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  payment_id?: string;
  delivery_address?: string;
  phone_number?: string;
  brand_id: string;
  created_at?: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  brand_id: string;
  product?: Product;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  latitude?: number;
  longitude?: number;
  brand_id: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase!: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
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

  // Get current brand based on URL path
  getCurrentBrand(): string {
    const path = window.location.pathname;
    if (path.startsWith('/fashion')) {
      return 'opula';
    } else if (path.startsWith('/toys')) {
      return 'little-ducks';
    } else {
      return 'brew-buddy'; // Default brand
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

  // Product Methods
  async getProducts(): Promise<{ data: Product[] | null; error: any }> {
    try {
      if (!this.supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      const currentBrand = this.getCurrentBrand();
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('brand_id', currentBrand)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Network error fetching products:', error);
      return { 
        data: null, 
        error: { 
          message: 'Network error: Unable to connect to server. Please check your internet connection.',
          code: 'NETWORK_ERROR'
        } 
      };
    }
  }

  async getProductsByCategory(category: string): Promise<{ data: Product[] | null; error: any }> {
    try {
      if (!this.supabase) {
        throw new Error('Supabase client not initialized');
      }
      
      const currentBrand = this.getCurrentBrand();
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('brand_id', currentBrand)
        .eq('category', category)
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
    const { data, error } = await this.supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    return { data, error };
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ data: Product | null; error: any }> {
    const { data, error } = await this.supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  }

  async deleteProduct(id: string): Promise<{ error: any }> {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);
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

  // User Role Management
  async getUserRole(userId: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    return { data, error };
  }

  async createUserRole(userId: string, role: string): Promise<{ data: any; error: any }> {
    const { data, error } = await this.supabase
      .from('user_roles')
      .insert([{ user_id: userId, role }])
      .select()
      .single();
    return { data, error };
  }

  // Cart Methods
  async getCartItems(): Promise<{ data: CartItem[] | null; error: any }> {
    const user = this.getCurrentUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const currentBrand = this.getCurrentBrand();
    const { data, error } = await this.supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)
      .eq('brand_id', currentBrand)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async addToCart(productId: string, quantity: number = 1): Promise<{ data: any; error: any }> {
    const user = this.getCurrentUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    // Check if item already exists in cart
    const { data: existingItem } = await this.supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { data, error } = await this.supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select();
      return { data, error };
    } else {
      // Add new item
      const currentBrand = this.getCurrentBrand();
      const { data, error } = await this.supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity,
          brand_id: currentBrand
        })
        .select();
      return { data, error };
    }
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

  async clearCart(): Promise<{ data: any; error: any }> {
    const user = this.getCurrentUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await this.supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .select();
    return { data, error };
  }

  // Order Methods
  async createOrder(orderData: Partial<Order>): Promise<{ data: Order | null; error: any }> {
    const user = this.getCurrentUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await this.supabase
      .from('orders')
      .insert({
        ...orderData,
        user_id: user.id
      })
      .select()
      .single();
    return { data, error };
  }

  async getOrders(): Promise<{ data: Order[] | null; error: any }> {
    const user = this.getCurrentUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await this.supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
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

  // Store Methods
  async getStores(): Promise<{ data: Store[] | null; error: any }> {
    const currentBrand = this.getCurrentBrand();
    const { data, error } = await this.supabase
      .from('stores')
      .select('*')
      .eq('brand_id', currentBrand)
      .order('name', { ascending: true });
    return { data, error };
  }

  async getStore(id: string): Promise<{ data: Store | null; error: any }> {
    const { data, error } = await this.supabase
      .from('stores')
      .select('*')
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
}
