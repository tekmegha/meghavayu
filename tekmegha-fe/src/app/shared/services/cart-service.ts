import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface'; // Corrected import path

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

  constructor() { }

  addToCart(product: Product) { // Changed type back to Product
    const currentState = this._cartState.getValue();
    const existingItemIndex = currentState.items.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Update quantity if item already exists
      const updatedItems = currentState.items.map((item, index) => {
        if (index === existingItemIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      this._updateCart(updatedItems);
    } else {
      // Add new item to cart
      const newItem: CartItem = { ...product, quantity: 1 };
      this._updateCart([...currentState.items, newItem]);
    }
  }

  updateCartItemQuantity(product: Product, quantity: number) { // Changed type back to Product
    const currentState = this._cartState.getValue();
    const updatedItems = currentState.items.map(item => {
      if (item.id === product.id) {
        return { ...item, quantity: quantity };
      }
      return item;
    }).filter(item => item.quantity > 0); // Remove item if quantity drops to 0

    this._updateCart(updatedItems);
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

  clearCart() {
    this._cartState.next({
      items: [],
      totalQuantity: 0,
      totalAmount: 0
    });
  }
}
