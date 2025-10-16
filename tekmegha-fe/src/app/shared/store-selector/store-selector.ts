import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreSessionService, StoreSession } from '../services/store-session.service';
import { SupabaseService } from '../services/supabase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-store-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="store-selector" *ngIf="showSelector">
      <div class="store-selector-header">
        <h3>Select Your Store</h3>
        <p>Choose a store to browse products and place orders</p>
      </div>
      
      <div class="stores-container" *ngIf="!isLoading; else loadingTemplate">
        <div *ngFor="let storeType of storeTypes" class="store-category">
          <h4 class="category-title">{{ getStoreTypeDisplayName(storeType) }}</h4>
          <div class="stores-grid">
            <div 
              *ngFor="let store of groupedStores[storeType]" 
              class="store-card"
              [class.selected]="isStoreSelected(store)"
              [style.--theme-primary]="getThemeColor(store.storeCode, 'primary')"
              [style.--theme-secondary]="getThemeColor(store.storeCode, 'secondary')"
              (click)="selectStore(store)"
            >
              <div class="store-icon">
                <img 
                  *ngIf="getStoreLogo(store)" 
                  [src]="getStoreLogo(store)" 
                  [alt]="store.storeName + ' logo'"
                  class="store-logo"
                >
                <span 
                  *ngIf="!getStoreLogo(store)" 
                  class="material-icons"
                  [style.background]="getIconBackground(store.storeCode)"
                >{{ getStoreIcon(store.storeCode) }}</span>
              </div>
              <div class="store-info">
                <h4>{{ store.storeName }}</h4>
                <p>{{ getStoreDescription(store.storeCode) }}</p>
                <span class="store-type">{{ store.storeType }}</span>
              </div>
              <div class="store-status" *ngIf="store.isActive">
                <span class="status-badge active">Open</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ng-template #loadingTemplate>
        <div class="loading-stores">
          <div class="skeleton-card" *ngFor="let i of [1,2,3]">
            <div class="skeleton-icon"></div>
            <div class="skeleton-content">
              <div class="skeleton-title"></div>
              <div class="skeleton-description"></div>
            </div>
          </div>
        </div>
      </ng-template>
      
      <div class="store-selector-footer" *ngIf="selectedStore">
        <p>Selected: <strong>{{ selectedStore.storeName }}</strong></p>
        <button class="continue-btn" (click)="continueWithStore()">
          Continue Shopping
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./store-selector.scss']
})
export class StoreSelectorComponent implements OnInit, OnDestroy {
  availableStores: StoreSession[] = [];
  groupedStores: { [key: string]: StoreSession[] } = {};
  storeTypes: string[] = [];
  selectedStore: StoreSession | null = null;
  isLoading = true;
  showSelector = true;
  private subscription = new Subscription();

  constructor(
    private storeSessionService: StoreSessionService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    this.loadStores();
    
    // Subscribe to store changes
    this.subscription.add(
      this.storeSessionService.selectedStore$.subscribe(store => {
        this.selectedStore = store;
        if (store) {
          this.showSelector = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async loadStores() {
    try {
      this.isLoading = true;
      this.availableStores = await this.storeSessionService.getAvailableStores();
      this.groupStoresByType();
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private groupStoresByType() {
    this.groupedStores = {};
    this.storeTypes = [];
    
    this.availableStores.forEach(store => {
      const storeType = store.storeType || 'other';
      if (!this.groupedStores[storeType]) {
        this.groupedStores[storeType] = [];
        this.storeTypes.push(storeType);
      }
      this.groupedStores[storeType].push(store);
    });
    
    // Sort store types for consistent display
    this.storeTypes.sort();
  }

  selectStore(store: StoreSession) {
    this.selectedStore = store;
    this.storeSessionService.setSelectedStore(store);
  }

  isStoreSelected(store: StoreSession): boolean {
    return this.selectedStore?.storeId === store.storeId;
  }

  continueWithStore() {
    if (this.selectedStore) {
      // Update URL to match selected store
      this.storeSessionService.updateUrlForStore(this.selectedStore.storeCode);
      this.showSelector = false;
    }
  }

  getStoreIcon(storeCode: string): string {
    switch (storeCode) {
      case 'brew-buddy':
        return 'local_cafe';
      case 'little-ducks':
        return 'toys';
      case 'majili':
        return 'shopping_bag';
      case 'royalfoods':
        return 'restaurant';
      case 'cctv-device':
        return 'security';
      default:
        return 'store';
    }
  }

  getStoreDescription(storeCode: string): string {
    switch (storeCode) {
      case 'brew-buddy':
        return 'Premium coffee and beverages';
      case 'little-ducks':
        return 'Educational toys and games';
      case 'majili':
        return 'Fashion and accessories';
      case 'royalfoods':
        return 'Fresh Indian breads specialist';
      case 'cctv-device':
        return 'Digital security solutions';
      default:
        return 'General store';
    }
  }

  getThemeColor(storeCode: string, colorType: 'primary' | 'secondary'): string {
    const themes: { [key: string]: { primary: string, secondary: string } } = {
      'brew-buddy': { primary: '#6366f1', secondary: '#ec4899' },
      'little-ducks': { primary: '#f59e0b', secondary: '#ec4899' },
      'majili': { primary: '#ec4899', secondary: '#8b5cf6' },
      'cctv-device': { primary: '#0ea5e9', secondary: '#3b82f6' },
      'royalfoods': { primary: '#d97706', secondary: '#f59e0b' }
    };
    
    const theme = themes[storeCode] || themes['brew-buddy'];
    return colorType === 'primary' ? theme.primary : theme.secondary;
  }

  getIconBackground(storeCode: string): string {
    const primary = this.getThemeColor(storeCode, 'primary');
    const secondary = this.getThemeColor(storeCode, 'secondary');
    return `linear-gradient(135deg, ${primary}, ${secondary})`;
  }

  getStoreLogo(store: any): string | null {
    // Check if store has theme_config and logo
    if (store.theme_config && store.theme_config.logo) {
      return store.theme_config.logo;
    }
    return null;
  }

  getStoreTypeDisplayName(storeType: string): string {
    const displayNames: { [key: string]: string } = {
      'coffee': 'Coffee & Beverages',
      'toys': 'Toys & Games',
      'fashion': 'Fashion & Clothing',
      'digitalsecurity': 'Security & Technology',
      'food': 'Food & Groceries',
      'insurance': 'Insurance & Finance',
      'dealer': 'Dealers & Wholesale',
      'other': 'Other Stores'
    };
    return displayNames[storeType] || storeType.charAt(0).toUpperCase() + storeType.slice(1);
  }
}