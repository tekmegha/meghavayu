import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreSessionService, StoreSession } from '../services/store-session.service';
import { SupabaseService } from '../services/supabase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-store-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './store-selector.html',
  styleUrls: ['./store-selector.scss']
})
export class StoreSelectorComponent implements OnInit, OnDestroy {
  availableStores: StoreSession[] = [];
  filteredStores: StoreSession[] = [];
  groupedStores: { [key: string]: StoreSession[] } = {};
  storeTypes: string[] = [];
  selectedStore: StoreSession | null = null;
  isLoading = true;
  showSelector = true;
  searchQuery = '';
  private subscription = new Subscription();

  constructor(
    private storeSessionService: StoreSessionService,
    private supabaseService: SupabaseService,
    private router: Router
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
      this.filteredStores = [...this.availableStores];
      this.groupStoresByType();
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onSearchChange() {
    this.filterStores();
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterStores();
  }

  private filterStores() {
    if (!this.searchQuery.trim()) {
      this.filteredStores = [...this.availableStores];
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredStores = this.availableStores.filter(store => 
        store.storeName.toLowerCase().includes(query) ||
        store.storeCode.toLowerCase().includes(query) ||
        this.getStoreDescription(store).toLowerCase().includes(query) ||
        (store.storeType && store.storeType.toLowerCase().includes(query))
      );
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
    
    // Navigate to the selected store's root (empty path is home)
    this.router.navigate([`/${store.storeCode}`]);
    
    // Optional: Reload the page to ensure all components get the new store context
    // Uncomment the line below if you want to force a page reload when store changes
    // window.location.reload();
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
      case 'megha':
        return 'business';
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
      case 'automobile-insurance':
        return 'directions_car';
      case 'dkassociates':
        return 'directions_car';
      case 'paws-nexus':
        return 'pets';
      case 'sarcacademy':
        return 'school';
      case 'visakha-vendi':
        return 'diamond';
      default:
        return 'store';
    }
  }

  getStoreTypeIcon(storeType: string): string {
    switch (storeType.toLowerCase()) {
      case 'coffee':
      case 'food':
        return 'local_cafe';
      case 'toys':
      case 'games':
        return 'toys';
      case 'fashion':
      case 'clothing':
        return 'shopping_bag';
      case 'digitalsecurity':
      case 'security':
        return 'security';
      case 'insurance':
      case 'finance':
        return 'account_balance';
      case 'automobile':
      case 'vehicle':
        return 'directions_car';
      case 'pet':
      case 'veterinary':
        return 'pets';
      case 'education':
      case 'academy':
        return 'school';
      case 'jewelry':
      case 'silver':
        return 'diamond';
      case 'business':
      case 'management':
        return 'business';
      default:
        return 'store';
    }
  }

  onLogoError(store: any) {
    store.logoError = true;
  }

  getStoreDescription(store: any): string {
    return store.storeType || 'General store';
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
    // Check if store has theme_config and logoUrl
    if (store.theme_config && store.theme_config.logoUrl) {
      return store.theme_config.logoUrl;
    }
    // Fallback to logo if logoUrl doesn't exist
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