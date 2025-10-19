import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';

export interface StoreSession {
  storeId: string;
  storeName: string;
  storeCode: string;
  storeType: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StoreSessionService {
  private selectedStoreSubject = new BehaviorSubject<StoreSession | null>(null);
  public selectedStore$ = this.selectedStoreSubject.asObservable();

  constructor(
    private supabaseService: SupabaseService
  ) {
    // Initialize with stored session or default
    this.initializeStoreSession();
  }

  // Alias for backward compatibility
  getCurrentStore() {
    return this.selectedStore$;
  }

  private async initializeStoreSession() {
    // Always determine store from URL (URL-driven approach)
    const currentStore = this.detectStoreFromUrl();
    if (currentStore) {
      await this.loadStoreByCode(currentStore);
      return;
    }

    // No store detected from URL - this is normal for global routes
    console.log('No store detected from URL - using global context');
    this.selectedStoreSubject.next(null);
  }

  private detectStoreFromUrl(): string | null {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment);
    
    if (segments.length > 0) {
      const potentialStoreCode = segments[0];
      // Check if it's not a known global route
      const globalRoutes = ['inventory-login', 'tekmegha-clients'];
      if (!globalRoutes.includes(potentialStoreCode)) {
        return potentialStoreCode;
      }
    }
    return null;
  }

  async loadStoreByCode(storeCode: string): Promise<StoreSession | null> {
    try {
      // Check if Supabase is ready
      if (!this.supabaseService.isSupabaseReady()) {
        console.log('Supabase not ready, retrying in 100ms...');
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.loadStoreByCode(storeCode);
      }

      const supabaseClient = this.supabaseService.getSupabaseClient();
      if (!supabaseClient) {
        console.error('Supabase client is not available');
        return null;
      }

      const { data, error } = await supabaseClient
        .from('megha_stores')
        .select('*')
        .eq('store_code', storeCode)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error loading store:', error);
        return null;
      }

      const storeSession: StoreSession = {
        storeId: data.id,
        storeName: data.store_name,
        storeCode: data.store_code,
        storeType: data.store_type,
        isActive: data.is_active
      };

      this.setSelectedStore(storeSession);
      return storeSession;
    } catch (error) {
      console.error('Error loading store by code:', error);
      return null;
    }
  }

  async loadStoreById(storeId: string): Promise<StoreSession | null> {
    try {
      // Check if Supabase is ready
      if (!this.supabaseService.isSupabaseReady()) {
        console.log('Supabase not ready, retrying in 100ms...');
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.loadStoreById(storeId);
      }

      const supabaseClient = this.supabaseService.getSupabaseClient();
      if (!supabaseClient) {
        console.error('Supabase client is not available');
        return null;
      }

      const { data, error } = await supabaseClient
        .from('megha_stores')
        .select('*')
        .eq('id', storeId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error loading store:', error);
        return null;
      }

      const storeSession: StoreSession = {
        storeId: data.id,
        storeName: data.store_name,
        storeCode: data.store_code,
        storeType: data.store_type,
        isActive: data.is_active
      };

      this.setSelectedStore(storeSession);
      return storeSession;
    } catch (error) {
      console.error('Error loading store by ID:', error);
      return null;
    }
  }

  setSelectedStore(store: StoreSession): void {
    this.selectedStoreSubject.next(store);
    // Note: No localStorage storage - store context is URL-driven
    console.log('Store session set from URL:', store);
  }

  getSelectedStore(): StoreSession | null {
    return this.selectedStoreSubject.value;
  }

  getSelectedStoreId(): string | null {
    return this.selectedStoreSubject.value?.storeId || null;
  }

  getSelectedStoreCode(): string | null {
    return this.selectedStoreSubject.value?.storeCode || null;
  }

  clearSelectedStore(): void {
    this.selectedStoreSubject.next(null);
    // Navigate to global home instead of clearing localStorage
    window.location.href = '/home';
    console.log('Cleared store session - navigating to global home');
  }

  // Get all available stores for selection
  async getAvailableStores(): Promise<StoreSession[]> {
    try {
      // Check if Supabase is ready
      if (!this.supabaseService.isSupabaseReady()) {
        console.log('Supabase not ready, retrying in 100ms...');
        await new Promise(resolve => setTimeout(resolve, 100));
        return this.getAvailableStores();
      }

      const supabaseClient = this.supabaseService.getSupabaseClient();
      if (!supabaseClient) {
        console.error('Supabase client is not available');
        return [];
      }

      const { data, error } = await supabaseClient
        .from('megha_stores')
        .select('*')
        .eq('is_active', true)
        .order('store_name');

      if (error) {
        console.error('Error loading stores:', error);
        return [];
      }

      return data.map(store => ({
        storeId: store.id,
        storeName: store.store_name,
        storeCode: store.store_code,
        storeType: store.store_type,
        isActive: store.is_active
      }));
    } catch (error) {
      console.error('Error loading available stores:', error);
      return [];
    }
  }

  // Check if current store matches URL store
  isCurrentStoreFromUrl(): boolean {
    const selectedStore = this.getSelectedStore();
    if (!selectedStore) return false;

    const urlStoreCode = this.supabaseService.getCurrentStore();
    return selectedStore.storeCode === urlStoreCode;
  }

  // Navigate to store-specific URL
  navigateToStore(storeCode: string, path: string = 'home'): void {
    const storeUrl = `/${storeCode}/${path}`;
    window.location.href = storeUrl;
    console.log('Navigating to store URL:', storeUrl);
  }

  // Update URL to match selected store
  updateUrlForStore(storeCode: string): void {
    const currentPath = window.location.pathname;
    
    // Remove existing store prefix by finding the first segment that's not a global route
    const segments = currentPath.split('/').filter(segment => segment);
    const globalRoutes = ['inventory-login', 'tekmegha-clients'];
    
    let pathWithoutStore = currentPath;
    if (segments.length > 0 && !globalRoutes.includes(segments[0])) {
      // Remove the first segment (store code) and reconstruct the path
      const remainingSegments = segments.slice(1);
      pathWithoutStore = remainingSegments.length > 0 ? `/${remainingSegments.join('/')}` : '';
    }
    
    // Add new store prefix
    const newPath = `/${storeCode}${pathWithoutStore}`;
    
    // Update URL without page reload
    window.history.replaceState({}, '', newPath);
  }
}
