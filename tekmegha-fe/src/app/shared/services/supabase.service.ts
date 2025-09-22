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
  category: 'Espresso Drinks' | 'Brewed Coffee' | 'Pastries & Snacks';
  discount_percentage?: number;
  old_price?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
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
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabase.url, environment.supabase.anonKey);
    this.initializeAuth();
  }

  private async initializeAuth() {
    // Get initial session
    const { data: { session } } = await this.supabase.auth.getSession();
    this.currentUserSubject.next(session?.user ?? null);

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUserSubject.next(session?.user ?? null);
    });
  }

  // Authentication Methods
  async signInWithPhone(phone: string) {
    const { data, error } = await this.supabase.auth.signInWithOtp({
      phone: `+91${phone}`,
      options: {
        channel: 'sms'
      }
    });
    return { data, error };
  }

  async verifyOtp(phone: string, token: string) {
    const { data, error } = await this.supabase.auth.verifyOtp({
      phone: `+91${phone}`,
      token,
      type: 'sms'
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Product Methods
  async getProducts(): Promise<{ data: Product[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async getProductsByCategory(category: string): Promise<{ data: Product[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    return { data, error };
  }

  async getProduct(id: string): Promise<{ data: Product | null; error: any }> {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    return { data, error };
  }

  // Cart Methods
  async getCartItems(): Promise<{ data: CartItem[] | null; error: any }> {
    const user = this.getCurrentUser();
    if (!user) return { data: null, error: 'User not authenticated' };

    const { data, error } = await this.supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)
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
      const { data, error } = await this.supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity
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
    const { data, error } = await this.supabase
      .from('stores')
      .select('*')
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
