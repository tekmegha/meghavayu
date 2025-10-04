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

  constructor(private supabaseService: SupabaseService) {
    // Initialize with stored session or default
    this.initializeStoreSession();
  }

  private async initializeStoreSession() {
    // Check if there's a stored session
    const storedStore = localStorage.getItem('selected-store');
    if (storedStore) {
      try {
        const storeSession = JSON.parse(storedStore);
        this.selectedStoreSubject.next(storeSession);
        return;
      } catch (error) {
        console.error('Error parsing stored store session:', error);
        localStorage.removeItem('selected-store');
      }
    }

    // If no stored session, try to get current store from URL or default
    const currentStore = this.supabaseService.getCurrentStore();
    await this.loadStoreByCode(currentStore);
  }

  async loadStoreByCode(storeCode: string): Promise<StoreSession | null> {
    try {
      const { data, error } = await this.supabaseService.getSupabaseClient()
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
      const { data, error } = await this.supabaseService.getSupabaseClient()
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
    // Store in localStorage for persistence
    localStorage.setItem('selected-store', JSON.stringify(store));
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
    localStorage.removeItem('selected-store');
  }

  // Get all available stores for selection
  async getAvailableStores(): Promise<StoreSession[]> {
    try {
      const { data, error } = await this.supabaseService.getSupabaseClient()
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

  // Check if current store is selected
  isCurrentStoreSelected(): boolean {
    const selectedStore = this.getSelectedStore();
    if (!selectedStore) return false;

    const currentStoreCode = this.supabaseService.getCurrentStore();
    return selectedStore.storeCode === currentStoreCode;
  }

  // Update URL to match selected store
  updateUrlForStore(storeCode: string): void {
    const currentPath = window.location.pathname;
    
    // Remove existing store prefix
    const pathWithoutStore = currentPath.replace(/^\/(brew-buddy|little-ducks|opula)/, '');
    
    // Add new store prefix
    const newPath = `/${storeCode}${pathWithoutStore}`;
    
    // Update URL without page reload
    window.history.replaceState({}, '', newPath);
  }
}
