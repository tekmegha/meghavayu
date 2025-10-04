import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { Product } from '../interfaces/product.interface';

export interface InventoryProduct extends Product {
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  supplier?: string;
  cost_price?: number;
  margin_percentage?: number;
}

export interface InventoryStats {
  totalProducts: number;
  activeProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private productsSubject = new BehaviorSubject<InventoryProduct[]>([]);
  public products$ = this.productsSubject.asObservable();

  private statsSubject = new BehaviorSubject<InventoryStats>({
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalValue: 0
  });
  public stats$ = this.statsSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {}

  async loadProducts(): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.getProducts();
      if (error) {
        console.error('Error loading products:', error);
        return;
      }

      // Convert to inventory products with default values
      const inventoryProducts: InventoryProduct[] = (data || []).map(product => ({
        ...product,
        stock_quantity: 100, // Default stock
        low_stock_threshold: 10, // Default threshold
        is_active: true,
        supplier: 'Default Supplier',
        cost_price: product.price * 0.6, // 40% margin
        margin_percentage: 40
      }));

      this.productsSubject.next(inventoryProducts);
      this.calculateStats();
    } catch (error) {
      console.error('Error loading inventory products:', error);
    }
  }

  async addProduct(product: Partial<InventoryProduct>): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabaseService.addProduct({
        name: product.name || '',
        price: product.price || 0,
        description: product.description || '',
        image_url: product.image_url || '',
        category: product.category || 'Espresso Drinks',
        rating: product.rating || 0,
        review_count: product.review_count || 0,
        serves: product.serves || 1,
        customisable: product.customisable || false,
        discount_percentage: product.discount_percentage,
        old_price: product.old_price,
        brand_id: this.supabaseService.getCurrentBrand()
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Add inventory-specific data
      const inventoryProduct: InventoryProduct = {
        ...data!,
        stock_quantity: product.stock_quantity || 100,
        low_stock_threshold: product.low_stock_threshold || 10,
        is_active: product.is_active ?? true,
        supplier: product.supplier || 'Default Supplier',
        cost_price: product.cost_price || (product.price || 0) * 0.6,
        margin_percentage: product.margin_percentage || 40
      };

      const currentProducts = this.productsSubject.value;
      this.productsSubject.next([...currentProducts, inventoryProduct]);
      this.calculateStats();

      return { success: true };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: false, error: 'Failed to add product' };
    }
  }

  async updateProduct(id: string, updates: Partial<InventoryProduct>): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabaseService.updateProduct(id, {
        name: updates.name,
        price: updates.price,
        description: updates.description,
        image_url: updates.image_url,
        category: updates.category,
        rating: updates.rating,
        review_count: updates.review_count,
        serves: updates.serves,
        customisable: updates.customisable,
        discount_percentage: updates.discount_percentage,
        old_price: updates.old_price,
        brand_id: this.supabaseService.getCurrentBrand()
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Update local inventory data
      const currentProducts = this.productsSubject.value;
      const updatedProducts = currentProducts.map(product => 
        product.id === id 
          ? { 
              ...product, 
              ...updates,
              stock_quantity: updates.stock_quantity ?? product.stock_quantity,
              low_stock_threshold: updates.low_stock_threshold ?? product.low_stock_threshold,
              is_active: updates.is_active ?? product.is_active,
              supplier: updates.supplier ?? product.supplier,
              cost_price: updates.cost_price ?? product.cost_price,
              margin_percentage: updates.margin_percentage ?? product.margin_percentage
            }
          : product
      );

      this.productsSubject.next(updatedProducts);
      this.calculateStats();

      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: false, error: 'Failed to update product' };
    }
  }

  async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabaseService.deleteProduct(id);

      if (error) {
        return { success: false, error: error.message };
      }

      const currentProducts = this.productsSubject.value;
      const filteredProducts = currentProducts.filter(product => product.id !== id);
      this.productsSubject.next(filteredProducts);
      this.calculateStats();

      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      return { success: false, error: 'Failed to delete product' };
    }
  }

  async updateStock(id: string, newStock: number): Promise<{ success: boolean; error?: string }> {
    try {
      const currentProducts = this.productsSubject.value;
      const product = currentProducts.find(p => p.id === id);
      
      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      const updatedProducts = currentProducts.map(p => 
        p.id === id ? { ...p, stock_quantity: newStock } : p
      );

      this.productsSubject.next(updatedProducts);
      this.calculateStats();

      return { success: true };
    } catch (error) {
      console.error('Error updating stock:', error);
      return { success: false, error: 'Failed to update stock' };
    }
  }

  async toggleProductStatus(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const currentProducts = this.productsSubject.value;
      const product = currentProducts.find(p => p.id === id);
      
      if (!product) {
        return { success: false, error: 'Product not found' };
      }

      const updatedProducts = currentProducts.map(p => 
        p.id === id ? { ...p, is_active: !p.is_active } : p
      );

      this.productsSubject.next(updatedProducts);
      this.calculateStats();

      return { success: true };
    } catch (error) {
      console.error('Error toggling product status:', error);
      return { success: false, error: 'Failed to toggle product status' };
    }
  }

  getProducts(): InventoryProduct[] {
    return this.productsSubject.value;
  }

  getProduct(id: string): InventoryProduct | undefined {
    return this.productsSubject.value.find(product => product.id === id);
  }

  getLowStockProducts(): InventoryProduct[] {
    return this.productsSubject.value.filter(product => 
      product.stock_quantity <= product.low_stock_threshold && product.is_active
    );
  }

  getOutOfStockProducts(): InventoryProduct[] {
    return this.productsSubject.value.filter(product => 
      product.stock_quantity === 0 && product.is_active
    );
  }

  getActiveProducts(): InventoryProduct[] {
    return this.productsSubject.value.filter(product => product.is_active);
  }

  private calculateStats(): void {
    const products = this.productsSubject.value;
    const stats: InventoryStats = {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.is_active).length,
      lowStockProducts: products.filter(p => 
        p.stock_quantity <= p.low_stock_threshold && p.is_active
      ).length,
      outOfStockProducts: products.filter(p => 
        p.stock_quantity === 0 && p.is_active
      ).length,
      totalValue: products.reduce((sum, product) => 
        sum + (product.price * product.stock_quantity), 0
      )
    };

    this.statsSubject.next(stats);
  }
}
