import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreSessionService } from './store-session.service';

export interface BrandConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundGradient: string;
  navbarGradient: string;
  theme: any;
  domain: string;
  features: {
    inventory: boolean;
    delivery: boolean;
    multiStore: boolean;
    userRoles: boolean;
    payment: boolean;
  };
  navigation: {
    topNavbar: Array<{
      icon?: string;
      position: 'left' | 'center' | 'right';
      action?: 'toggleMenu' | 'openSearch' | 'openLogin' | 'openCart';
      route?: string;
      label?: string;
    }>;
  };
  content: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    categories: Array<{
      name: string;
      icon: string;
      route: string;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private currentBrandSubject = new BehaviorSubject<BrandConfig | null>(null);
  public currentBrand$: Observable<BrandConfig | null> = this.currentBrandSubject.asObservable();

  constructor(
    private storeSessionService: StoreSessionService
  ) {
    // Skip brand initialization for global routes
    if (window.location.pathname === '/home' || window.location.pathname === '/tekmegha-clients') {
      return;
    }
    // Initialize brand from store session or URL
    this.initializeBrand();
  }

  async initializeBrand(): Promise<void> {
    try {
      // Skip brand initialization for global routes
      if (window.location.pathname === '/home' || window.location.pathname === '/tekmegha-clients') {
        console.log('BrandService - Skipping brand initialization for global route');
        return;
      }
      
      // First, try to get store from store session service
      const currentStore = this.storeSessionService.getSelectedStore();
      
      if (currentStore) {
        console.log('BrandService - Using store from session:', currentStore);
        await this.loadBrandFromStore(currentStore);
      } else {
        // If no store in session, detect from URL path
        const storeCode = this.detectStoreFromUrl();
        if (storeCode) {
          console.log('BrandService - Detected store from URL:', storeCode);
          await this.loadBrandFromStoreCode(storeCode);
        } else {
          console.log('BrandService - No store detected, no brand configuration available');
        }
      }
    } catch (error) {
      console.error('Error initializing brand:', error);
      // No default brand - let the application handle this case
      console.log('BrandService - Error initializing brand, no fallback available');
    }
  }

  private detectStoreFromUrl(): string | null {
    const path = window.location.pathname;
    const segments = path.split('/').filter(segment => segment);
    
    if (segments.length > 0) {
      const storeCode = segments[0];
      console.log('BrandService - Detected store code from URL:', storeCode);
      return storeCode;
    }
    
    return null;
  }

  private async loadBrandFromStore(store: any): Promise<void> {
    try {
      const brandConfig = this.convertStoreToBrandConfig(store);
      this.currentBrandSubject.next(brandConfig);
      this.updateCSSVariables(brandConfig);
      console.log('BrandService - Brand loaded from store session:', brandConfig.displayName);
    } catch (error) {
      console.error('Error loading brand from store:', error);
      // No default brand - let the application handle this case
      console.log('BrandService - Error loading brand from store, no fallback available');
    }
  }

  private async loadBrandFromStoreCode(storeCode: string): Promise<void> {
    try {
      // Get store details from store session service
      const storeData = await this.storeSessionService.loadStoreByCode(storeCode);
      
      if (storeData) {
        console.log('BrandService - Store data from API:', storeData);
        const brandConfig = this.convertStoreToBrandConfig(storeData);
        this.currentBrandSubject.next(brandConfig);
        this.updateCSSVariables(brandConfig);
        
        // Set store in session service
        this.storeSessionService.setSelectedStore(storeData);
        console.log('BrandService - Brand loaded from API:', brandConfig.displayName);
      } else {
        console.log('BrandService - No store found for code:', storeCode);
        // No default brand - let the application handle this case
        console.log('BrandService - No brand configuration available');
      }
    } catch (error) {
      console.error('Error loading brand from store code:', error);
      // No default brand - let the application handle this case
      console.log('BrandService - Error loading brand, no fallback available');
    }
  }


  private convertStoreToBrandConfig(store: any): BrandConfig {
    const themeConfig = store.theme_config || {};
    
    return {
      id: store.store_code || store.id,
      name: store.store_code || store.id,
      displayName: store.store_name || 'Store',
      description: store.description || 'Store Description',
      logo: themeConfig.logoUrl || 'assets/images/default-logo.png',
      primaryColor: themeConfig.primaryColor || '#1e40af',
      secondaryColor: themeConfig.secondaryColor || '#3b82f6',
      accentColor: themeConfig.accentColor || '#10b981',
      backgroundGradient: themeConfig.backgroundColor ? 
        `linear-gradient(135deg, ${themeConfig.backgroundColor} 0%, ${themeConfig.accentColor || '#10b981'} 100%)` :
        'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #0ea5e9 100%)',
      navbarGradient: themeConfig.primaryColor ? 
        `linear-gradient(135deg, ${themeConfig.primaryColor} 0%, ${themeConfig.secondaryColor || themeConfig.primaryColor} 100%)` :
        'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      theme: store.store_type || 'default',
      domain: store.domain || 'localhost',
      features: {
        inventory: store.enable_inventory || false,
        delivery: store.enable_delivery || false,
        multiStore: store.enable_multi_store || false,
        userRoles: store.enable_user_roles || false,
        payment: store.enable_payments || false
      },
      navigation: {
        topNavbar: this.getTopNavbarFromStore(store)
      },
      content: {
        heroTitle: store.store_name || 'Welcome',
        heroSubtitle: store.description || 'Store Description',
        heroImage: 'assets/images/default-hero.jpg',
        categories: this.getCategoriesFromStore(store)
      }
    };
  }

  private getTopNavbarFromStore(store: any): Array<{
    icon?: string;
    position: 'left' | 'center' | 'right';
    action?: 'toggleMenu' | 'openSearch' | 'openLogin' | 'openCart';
    route?: string;
    label?: string;
  }> {
    const navbarConfig = store.navbar_config?.topNavbar;
    
    if (navbarConfig?.items) {
      const items = [];
      
      if (navbarConfig.items.menu?.enabled) {
        items.push({
          icon: navbarConfig.items.menu.icon || 'menu',
          position: 'left' as const,
          action: 'toggleMenu' as const
        });
      }
      
      if (navbarConfig.items.search?.enabled) {
        items.push({
          icon: navbarConfig.items.search.icon || 'search',
          position: 'right' as const,
          action: 'openSearch' as const
        });
      }
      
      if (navbarConfig.items.login?.enabled) {
        items.push({
          icon: navbarConfig.items.login.icon || 'account_circle',
          position: 'right' as const,
          action: 'openLogin' as const,
          route: '/login'
        });
      }
      
      if (navbarConfig.items.cart?.enabled) {
        items.push({
          icon: navbarConfig.items.cart.icon || 'shopping_cart',
          position: 'right' as const,
          action: 'openCart' as const,
          route: '/cart'
        });
      }
      
      return items;
    }
    
    // Default navbar
    return [
          { icon: 'menu', position: 'left', action: 'toggleMenu' },
          { icon: 'account_circle', position: 'right', action: 'openLogin', route: '/login' },
          { icon: 'shopping_cart', position: 'right', action: 'openCart', route: '/cart' }
    ];
  }

  private getCategoriesFromStore(store: any): Array<{
    name: string;
    icon: string;
    route: string;
  }> {
    // Default categories based on store type
    const storeType = store.store_type;
    
    switch (storeType) {
      case 'fashion':
        return [
          { name: 'Women\'s Fashion', icon: 'woman', route: '/menu?category=womens' },
          { name: 'Men\'s Fashion', icon: 'man', route: '/menu?category=mens' },
          { name: 'Accessories', icon: 'watch', route: '/menu?category=accessories' }
        ];
      case 'food':
        return [
          { name: 'Chapati', icon: 'bakery_dining', route: '/menu?category=chapati' },
          { name: 'Poori', icon: 'breakfast_dining', route: '/menu?category=poori' },
          { name: 'Pulka', icon: 'restaurant', route: '/menu?category=pulka' }
        ];
      case 'toys':
        return [
          { name: 'Educational Toys', icon: 'school', route: '/menu?category=educational' },
          { name: 'Action Figures', icon: 'sports_esports', route: '/menu?category=action' },
          { name: 'Board Games', icon: 'casino', route: '/menu?category=games' }
        ];
      default:
        return [
          { name: 'Products', icon: 'inventory', route: '/menu' },
          { name: 'Categories', icon: 'category', route: '/menu?category=all' }
        ];
    }
  }


  getCurrentBrand(): BrandConfig | null {
    return this.currentBrandSubject.value;
  }

  private updateCSSVariables(brand: BrandConfig): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', brand.primaryColor);
    root.style.setProperty('--secondary-color', brand.secondaryColor);
    root.style.setProperty('--accent-color', brand.accentColor);
    root.style.setProperty('--gradient-primary', brand.backgroundGradient);
    root.style.setProperty('--navbar-gradient', brand.navbarGradient);
    
    // Also set on body to ensure higher specificity
    document.body.style.setProperty('--navbar-gradient', brand.navbarGradient);
    document.body.style.setProperty('--primary-color', brand.primaryColor);
    document.body.style.setProperty('--secondary-color', brand.secondaryColor);
    document.body.style.setProperty('--accent-color', brand.accentColor);
  }

  // Method to refresh brand when store changes
  async refreshBrand(): Promise<void> {
    await this.initializeBrand();
  }
}
