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
      
      <div class="stores-grid" *ngIf="!isLoading; else loadingTemplate">
        <div 
          *ngFor="let store of availableStores" 
          class="store-card"
          [class.selected]="isStoreSelected(store)"
          (click)="selectStore(store)"
        >
          <div class="store-icon">
            <span class="material-icons">{{ getStoreIcon(store.storeCode) }}</span>
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
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      this.isLoading = false;
    }
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
      default:
        return 'General store';
    }
  }
}