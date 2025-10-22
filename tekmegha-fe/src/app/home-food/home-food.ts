import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';
import { ProductTileComponent } from '../shared/product-tile/product-tile';
import { StoreSelectorComponent } from '../shared/store-selector/store-selector';
import { Product } from '../shared/interfaces/product.interface';
import { Category } from '../shared/interfaces/category.interface';
import { NetworkStatusService } from '../shared/services/network-status.service';
import { StoreSessionService, StoreSession } from '../shared/services/store-session.service';
import { BrandService } from '../shared/services/brand.service';
import { SupabaseService } from '../shared/services/supabase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-food',
  imports: [CommonModule, RouterLink, SkeletonLoaderComponent, ProductTileComponent, StoreSelectorComponent],
  templateUrl: './home-food.html',
  styleUrl: './home-food.scss'
})
export class HomeFood implements OnInit, OnDestroy {
  isLoading = true;
  products: Product[] = [];
  isOnline = true;
  selectedStore: StoreSession | null = null;
  showStoreSelector = false;
  private subscription = new Subscription();
  
  foodCategories: { name: string; icon: string; route: string; slug: string }[] = [];

  constructor(
    private networkStatus: NetworkStatusService,
    private storeSessionService: StoreSessionService,
    private brandService: BrandService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isOnline = this.networkStatus.isOnline();
    this.networkStatus.isOnline$.subscribe(online => {
      this.isOnline = online;
    });

    // Subscribe to store session changes
    this.subscription.add(
      this.storeSessionService.selectedStore$.subscribe(store => {
        this.selectedStore = store;
        this.showStoreSelector = !store;
        if (store) {
          this.loadProductsForStore(store);
          this.initializeBrandForStore(store);
        }
      })
    );

    // Check if we need to show store selector
    const currentStore = this.storeSessionService.getSelectedStore();
    if (!currentStore) {
      this.showStoreSelector = true;
    } else {
      this.selectedStore = currentStore;
      this.loadProductsForStore(currentStore);
      this.initializeBrandForStore(currentStore);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private async loadProductsForStore(store: StoreSession) {
    try {
      this.isLoading = true;
      const { data, error } = await this.supabaseService.getProducts();
      
      if (error) {
        console.error('Error loading products:', error);
        return;
      }

      this.products = data || [];
      this.foodCategories = this.getCategoriesForStore(store);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private getCategoriesForStore(store: StoreSession): { name: string; icon: string; route: string; slug: string }[] {
    // Food-specific categories
    return [
      { name: 'Chapati', icon: 'bakery_dining', route: '/menu?category=chapati', slug: 'chapati' },
      { name: 'Poori', icon: 'breakfast_dining', route: '/menu?category=poori', slug: 'poori' },
      { name: 'Pulka', icon: 'restaurant', route: '/menu?category=pulka', slug: 'pulka' },
      { name: 'Parota', icon: 'ramen_dining', route: '/menu?category=parota', slug: 'parota' }
    ];
  }

  private initializeBrandForStore(store: StoreSession) {
    console.log('HomeFood component - Store selected:', { storeCode: store.storeCode, storeName: store.storeName });
    
    // Brand service now automatically handles brand detection from store session
    // No need to manually set brand - it's handled by the brand service initialization
    
    // Apply store-specific theme to body
    document.body.className = document.body.className.replace(/-\w+-theme/g, '');
    document.body.classList.add(`${store.storeCode}-theme`);
    
    // Only redirect if we're not on the global home route
    const currentPath = window.location.pathname;
    if (currentPath === '/home') {
      // Stay on global home route - don't redirect
      console.log('HomeFood component - Staying on global home route for store selector');
      return;
    }
    
    // For store-specific routes, navigate to store root (empty path)
    if (!currentPath.includes(`/${store.storeCode}`)) {
      // Navigate to store root (empty path)
      this.router.navigateByUrl(`/${store.storeCode}`, { replaceUrl: true });
    }
  }

  getStoreDescription(storeCode: string): string {
    switch (storeCode) {
      case 'megha':
        return 'Multi-Store Management Platform';
      case 'brew-buddy':
        return 'Premium Coffee Delivery';
      case 'little-ducks':
        return 'Educational toys and games';
      case 'majili':
        return 'Fashion and accessories';
      case 'sarc-academy':
        return 'Competitive exam preparation courses';
      case 'cctv-device':
        return 'Digital security and surveillance solutions';
      case 'royalfoods':
        return 'Fresh Indian breads specialist';
      case 'rragency':
        return 'Paint dealer - Automotive and industrial paints';
      default:
        return 'Business application';
    }
  }
}
