import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { SupabaseService, CartItem as SupabaseCartItem } from './supabase.service';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  serves: number;
  description: string;
  imageUrl: string;
  customisable: boolean;
  category: 'Espresso Drinks' | 'Brewed Coffee' | 'Pastries & Snacks';
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private _cartState = new BehaviorSubject<CartState>({
    items: [],
    totalQuantity: 0,
    totalAmount: 0
  });
  readonly cartState$: Observable<CartState> = this._cartState.asObservable();

  constructor(private supabaseService: SupabaseService) {
    // Load cart from Supabase on initialization
    this.loadCartFromSupabase();
    
    // Subscribe to auth changes to reload cart
    this.supabaseService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCartFromSupabase();
      } else {
        this.clearCart();
      }
    });
  }

  async addToCart(product: Product) {
    const user = this.supabaseService.getCurrentUser();
    if (!user || !this.supabaseService.isSupabaseReady()) {
      // Fallback to local storage for non-authenticated users or if Supabase isn't ready
      this.addToLocalCart(product);
      return;
    }

    try {
      const { error } = await this.supabaseService.addToCart(product.id, 1);
      if (error) {
        console.error('Error adding to cart:', error);
        // Fallback to local storage on error
        this.addToLocalCart(product);
        return;
      }
      await this.loadCartFromSupabase();
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to local storage on error
      this.addToLocalCart(product);
    }
  }

  async updateCartItemQuantity(product: Product, quantity: number) {
    const user = this.supabaseService.getCurrentUser();
    if (!user || !this.supabaseService.isSupabaseReady()) {
      // Fallback to local storage for non-authenticated users or if Supabase isn't ready
      this.updateLocalCartQuantity(product, quantity);
      return;
    }

    try {
      const currentState = this._cartState.getValue();
      const cartItem = currentState.items.find(item => item.id === product.id);
      
      if (!cartItem) return;

      // Find the Supabase cart item ID
      const { data: supabaseCartItems } = await this.supabaseService.getCartItems();
      const supabaseItem = supabaseCartItems?.find(item => item.product_id === product.id);
      
      if (!supabaseItem) return;

      const { error } = await this.supabaseService.updateCartItemQuantity(supabaseItem.id, quantity);
      if (error) {
        console.error('Error updating cart item:', error);
        // Fallback to local storage on error
        this.updateLocalCartQuantity(product, quantity);
        return;
      }
      await this.loadCartFromSupabase();
    } catch (error) {
      console.error('Error updating cart item:', error);
      // Fallback to local storage on error
      this.updateLocalCartQuantity(product, quantity);
    }
  }

  private _updateCart(items: CartItem[]) {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    this._cartState.next({
      items,
      totalQuantity,
      totalAmount
    });
  }

  getCartState(): CartState {
    return this._cartState.getValue();
  }

  async removeFromCart(productId: string) {
    const user = this.supabaseService.getCurrentUser();
    if (!user || !this.supabaseService.isSupabaseReady()) {
      // Fallback to local storage for non-authenticated users or if Supabase isn't ready
      this.removeFromLocalCart(productId);
      return;
    }

    try {
      const currentState = this._cartState.getValue();
      const cartItem = currentState.items.find(item => item.id === productId);
      
      if (!cartItem) return;

      // Find the Supabase cart item ID
      const { data: supabaseCartItems } = await this.supabaseService.getCartItems();
      const supabaseItem = supabaseCartItems?.find(item => item.product_id === productId);
      
      if (!supabaseItem) return;

      const { error } = await this.supabaseService.removeFromCart(supabaseItem.id);
      if (error) {
        console.error('Error removing from cart:', error);
        // Fallback to local storage on error
        this.removeFromLocalCart(productId);
        return;
      }
      await this.loadCartFromSupabase();
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Fallback to local storage on error
      this.removeFromLocalCart(productId);
    }
  }

  async clearCart() {
    const user = this.supabaseService.getCurrentUser();
    if (!user) {
      // Fallback to local storage for non-authenticated users
      this.clearLocalCart();
      return;
    }

    try {
      const { error } = await this.supabaseService.clearCart();
      if (error) {
        console.error('Error clearing cart:', error);
        return;
      }
      await this.loadCartFromSupabase();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  // Supabase integration methods
  private async loadCartFromSupabase() {
    const user = this.supabaseService.getCurrentUser();
    if (!user) {
      this._cartState.next({
        items: [],
        totalQuantity: 0,
        totalAmount: 0
      });
      return;
    }

    try {
      const { data, error } = await this.supabaseService.getCartItems();
      if (error) {
        console.error('Error loading cart from Supabase:', error);
        return;
      }

      const cartItems = data || [];
      const transformedItems: CartItem[] = cartItems.map(item => ({
        id: item.product?.id || item.product_id,
        name: item.product?.name || '',
        price: item.product?.price || 0,
        rating: item.product?.rating || 0,
        reviewCount: item.product?.review_count || 0,
        serves: item.product?.serves || 1,
        description: item.product?.description || '',
        imageUrl: item.product?.image_url || '',
        customisable: item.product?.customisable || false,
        category: item.product?.category || 'Brewed Coffee',
        quantity: item.quantity
      }));

      const totalQuantity = transformedItems.reduce((total, item) => total + item.quantity, 0);
      const totalAmount = transformedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      this._cartState.next({
        items: transformedItems,
        totalQuantity,
        totalAmount
      });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  // Local storage fallback methods for non-authenticated users
  private addToLocalCart(product: Product) {
    const currentState = this._cartState.getValue();
    const existingItemIndex = currentState.items.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      const updatedItems = currentState.items.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      this._updateCart(updatedItems);
    } else {
      const newItem: CartItem = { ...product, quantity: 1 };
      this._updateCart([...currentState.items, newItem]);
    }
  }

  private updateLocalCartQuantity(product: Product, quantity: number) {
    const currentState = this._cartState.getValue();
    const updatedItems = currentState.items.map(item => {
      if (item.id === product.id) {
        return { ...item, quantity: quantity };
      }
      return item;
    }).filter(item => item.quantity > 0);

    this._updateCart(updatedItems);
  }

  private removeFromLocalCart(productId: string) {
    const currentState = this._cartState.getValue();
    const updatedItems = currentState.items.filter(item => item.id !== productId);
    this._updateCart(updatedItems);
  }

  private clearLocalCart() {
    this._cartState.next({
      items: [],
      totalQuantity: 0,
      totalAmount: 0
    });
  }
}
