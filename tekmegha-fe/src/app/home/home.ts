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
  selector: 'app-home',
  imports: [CommonModule, RouterLink, SkeletonLoaderComponent, ProductTileComponent, StoreSelectorComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, OnDestroy {
  isLoading = true;
  products: Product[] = [];
  isOnline = true;
  selectedStore: StoreSession | null = null;
  showStoreSelector = false;
  private subscription = new Subscription();
  
  coffeeCategories: { name: string; icon: string; route: string; slug: string }[] = [];

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
      console.log('Loading products for store:', store.storeName);
      
      const { data, error } = await this.supabaseService.getProducts();
      
      if (error) {
        console.error('Error loading products:', error);
        this.products = [];
        this.isLoading = false;
        return;
      }
      
      if (data && data.length > 0) {
        console.log('Loaded products:', data.length);
        console.log('First product data:', data[0]);
        
        // Map database fields to component interface
        this.products = data.map(product => ({
          ...product,
          // Map snake_case to camelCase for component compatibility
          imageUrl: product.image_url,
          reviewCount: product.review_count,
          discountPercentage: product.discount_percentage,
          oldPrice: product.old_price,
          // Ensure required fields have defaults
          rating: product.rating || 0,
          serves: product.serves || 1,
          customisable: product.customisable || false,
          is_available: product.is_available !== false,
          is_featured: product.is_featured || false
        }));
        
        console.log('Mapped products:', this.products.length);
        console.log('First mapped product:', this.products[0]);
      } else {
        console.log('No products found for store:', store.storeName);
        this.products = [];
      }
      
      // Load store-specific categories regardless of products
      await this.loadStoreCategories();
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error in loadProductsForStore:', error);
      this.products = [];
      this.isLoading = false;
    }
  }

  private async loadStoreCategories() {
    try {
      console.log('🔄 Loading categories for store...');
      console.log('Current store:', this.selectedStore);
      
      const { data, error } = await this.supabaseService.getMainCategories();
      
      console.log('📊 Categories API Response:', { data, error });
      
      if (error) {
        console.error('❌ Error loading categories:', error);
        this.coffeeCategories = [];
        return;
      }
      
      if (data && data.length > 0) {
        console.log('✅ Loaded categories from backend:', data.length, 'categories');
        console.log('📋 Categories data:', data);
        
        // Map categories to display format with appropriate icons
        this.coffeeCategories = data.map(category => ({
          name: category.name,
          icon: this.getCategoryIcon(category.name),
          route: '/menu',
          slug: category.slug
        }));
        
        console.log('🎨 Mapped categories for display:', this.coffeeCategories);
      } else {
        console.log('⚠️ No categories found for store');
        this.coffeeCategories = [];
      }
    } catch (error) {
      console.error('💥 Error in loadStoreCategories:', error);
      this.coffeeCategories = [];
    }
  }

  private getCategoryIcon(category: string): string {
    const categoryIcons: { [key: string]: string } = {
      // Coffee/Food categories
      'Coffee': 'local_cafe',
      'Espresso': 'local_cafe',
      'Latte': 'coffee',
      'Cappuccino': 'local_drink',
      'Cold Brew': 'ac_unit',
      'Tea': 'emoji_food_beverage',
      'Pastries': 'bakery_dining',
      'Food': 'restaurant',
      'Beverages': 'local_drink',
      'Snacks': 'cookie',
      'Desserts': 'cake',
      'Breakfast': 'breakfast_dining',
      'Lunch': 'lunch_dining',
      'Dinner': 'dinner_dining',
      
      // Fashion categories
      'Women\'s Clothing': 'woman',
      'Men\'s Clothing': 'man',
      'Accessories': 'style',
      'Shoes': 'directions_walk',
      'Jewelry': 'diamond',
      'Dresses': 'checkroom',
      'Tops & Blouses': 'checkroom',
      'Bottoms': 'checkroom',
      'Outerwear': 'checkroom',
      'Shirts': 'checkroom',
      'T-Shirts': 'checkroom',
      'Pants': 'checkroom',
      'Suits': 'checkroom',
      'Bags': 'shopping_bag',
      'Belts': 'style',
      'Watches': 'schedule',
      'Sunglasses': 'visibility',
      'Heels': 'directions_walk',
      'Sneakers': 'directions_walk',
      'Boots': 'directions_walk',
      'Flats': 'directions_walk',
      'Necklaces': 'diamond',
      'Earrings': 'diamond',
      'Rings': 'diamond',
      'Bracelets': 'diamond'
    };
    
    return categoryIcons[category] || 'category';
  }

  // Method to load categories independently (useful for inventory management)
  async loadCategoriesOnly() {
    try {
      console.log('🔄 Loading categories only (independent of products)...');
      await this.loadStoreCategories();
    } catch (error) {
      console.error('💥 Error loading categories only:', error);
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/brew-buddy/default.png';
  }

  getStoreDescription(storeCode: string): string {
    switch (storeCode) {
      case 'brew-buddy':
        return 'Premium coffee and beverages';
      case 'little-ducks':
        return 'Educational toys and games';
      case 'opula':
        return 'Fashion and accessories';
      default:
        return 'General store';
    }
  }

  private initializeBrandForStore(store: StoreSession) {
    // Set the brand based on the selected store
    this.brandService.setCurrentBrand(store.storeCode);
    
    // Apply store-specific theme to body
    document.body.className = document.body.className.replace(/-\w+-theme/g, '');
    document.body.classList.add(`${store.storeCode}-theme`);
    
    // Update URL to include store code if not already present
    const currentPath = window.location.pathname;
    if (!currentPath.includes(`/${store.storeCode}`)) {
      const newPath = `/${store.storeCode}${currentPath}`;
      this.router.navigateByUrl(newPath, { replaceUrl: true });
    }
  }
}
