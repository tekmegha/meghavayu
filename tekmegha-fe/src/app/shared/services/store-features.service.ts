import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { StoreFeatures, StoreFeatureType } from '../interfaces/store-features.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreFeaturesService {
  private featuresCache = new Map<string, StoreFeatures>();
  private currentFeaturesSubject = new BehaviorSubject<StoreFeatures | null>(null);
  public currentFeatures$ = this.currentFeaturesSubject.asObservable();

  constructor(private supabase: SupabaseService) {}

  /**
   * Get store features for a specific store
   * Uses caching to avoid unnecessary database calls
   */
  async getStoreFeatures(storeCode: string): Promise<StoreFeatures | null> {
    // Check cache first
    if (this.featuresCache.has(storeCode)) {
      const cachedFeatures = this.featuresCache.get(storeCode)!;
      this.currentFeaturesSubject.next(cachedFeatures);
      return cachedFeatures;
    }

    try {
      const { data, error } = await this.supabase.getStoreFeatures(storeCode);
      
      if (error) {
        console.error('Error fetching store features:', error);
        return null;
      }

      if (data) {
        // Cache the features
        this.featuresCache.set(storeCode, data);
        this.currentFeaturesSubject.next(data);
        return data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching store features:', error);
      return null;
    }
  }

  /**
   * Check if a specific feature is enabled for the current store
   */
  async isFeatureEnabled(storeCode: string, feature: StoreFeatureType): Promise<boolean> {
    try {
      // Try to get from cache first
      const cachedFeatures = this.featuresCache.get(storeCode);
      if (cachedFeatures) {
        return this.getFeatureValue(cachedFeatures, feature);
      }

      // If not in cache, check directly from database
      return await this.supabase.isStoreFeatureEnabled(storeCode, feature);
    } catch (error) {
      console.error('Error checking feature:', error);
      return false;
    }
  }

  /**
   * Get feature value from StoreFeatures object
   */
  private getFeatureValue(features: StoreFeatures, feature: StoreFeatureType): boolean {
    switch (feature) {
      case 'products':
        return features.enableProducts;
      case 'cart':
        return features.enableCart;
      case 'payments':
        return features.enablePayments;
      case 'inventory':
        return features.enableInventory;
      case 'invoices':
        return features.enableInvoices;
      case 'customers':
        return features.enableCustomers;
      case 'reports':
        return features.enableReports;
      default:
        return false;
    }
  }

  /**
   * Convenience methods for common feature checks
   */
  async canShowProducts(storeCode: string): Promise<boolean> {
    return this.isFeatureEnabled(storeCode, 'products');
  }

  async canShowCart(storeCode: string): Promise<boolean> {
    return this.isFeatureEnabled(storeCode, 'cart');
  }

  async canShowPayments(storeCode: string): Promise<boolean> {
    return this.isFeatureEnabled(storeCode, 'payments');
  }

  async canShowInventory(storeCode: string): Promise<boolean> {
    return this.isFeatureEnabled(storeCode, 'inventory');
  }

  async canShowInvoices(storeCode: string): Promise<boolean> {
    return this.isFeatureEnabled(storeCode, 'invoices');
  }

  async canShowCustomers(storeCode: string): Promise<boolean> {
    return this.isFeatureEnabled(storeCode, 'customers');
  }

  async canShowReports(storeCode: string): Promise<boolean> {
    return this.isFeatureEnabled(storeCode, 'reports');
  }

  /**
   * Get current features from observable
   */
  getCurrentFeatures(): StoreFeatures | null {
    return this.currentFeaturesSubject.value;
  }

  /**
   * Clear cache for a specific store
   */
  clearCache(storeCode: string): void {
    this.featuresCache.delete(storeCode);
  }

  /**
   * Clear all cache
   */
  clearAllCache(): void {
    this.featuresCache.clear();
    this.currentFeaturesSubject.next(null);
  }

  /**
   * Refresh features for a store (force reload from database)
   */
  async refreshFeatures(storeCode: string): Promise<StoreFeatures | null> {
    this.clearCache(storeCode);
    return await this.getStoreFeatures(storeCode);
  }
}
