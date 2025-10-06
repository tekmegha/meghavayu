import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  theme: 'coffee' | 'toys' | 'fashion';
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
    bottomNavbar: Array<{
      icon: string;
      label: string;
      route: string;
      active?: boolean;
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

  private brands: BrandConfig[] = [
    {
      id: 'brewbuddy',
      name: 'brewbuddy',
      displayName: 'BrewBuddy',
      description: 'Premium Coffee Delivery',
      logo: 'assets/images/brew-buddy/logo.png',
      primaryColor: '#6366f1',
      secondaryColor: '#ec4899',
      accentColor: '#f59e0b',
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      navbarGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      theme: 'coffee',
      domain: 'brewbuddy.com',
      features: {
        inventory: true,
        delivery: true,
        multiStore: true,
        userRoles: true,
        payment: true
      },
      navigation: {
        topNavbar: [
          { icon: 'menu_book', position: 'left', action: 'toggleMenu' },
          { icon: 'account_circle', position: 'right', action: 'openLogin', route: '/login' },
          { icon: 'shopping_cart', position: 'right', action: 'openCart', route: '/cart' }
        ],
        bottomNavbar: [
          { icon: 'home', label: 'Home', route: '/home', active: true },
          { icon: 'restaurant_menu', label: 'Menu', route: '/menu' },
          { icon: 'shopping_cart', label: 'Cart', route: '/cart' },
          { icon: 'inventory', label: 'Inventory', route: '/inventory' },
          { icon: 'location_on', label: 'Stores', route: '/stores' },
          { icon: 'person', label: 'Profile', route: '/profile' }
        ]
      },
      content: {
        heroTitle: 'Premium Coffee Delivered',
        heroSubtitle: 'Freshly brewed coffee from local roasters',
        heroImage: 'assets/images/brew-buddy/hero-brewbuddy.jpg',
        categories: [
          { name: 'Espresso Drinks', icon: 'local_cafe', route: '/menu?category=espresso' },
          { name: 'Brewed Coffee', icon: 'coffee', route: '/menu?category=brewed' },
          { name: 'Pastries', icon: 'bakery_dining', route: '/menu?category=pastries' }
        ]
      }
    },
    {
      id: 'littleducks',
      name: 'littleducks',
      displayName: 'Little Ducks',
      description: 'Adorable Toys & Games',
      logo: 'assets/images/little-ducks/logo.png',
      primaryColor: '#f59e0b',
      secondaryColor: '#ec4899',
      accentColor: '#10b981',
      backgroundGradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      navbarGradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      theme: 'toys',
      domain: 'littleducks.com',
      features: {
        inventory: true,
        delivery: true,
        multiStore: false,
        userRoles: true,
        payment: true
      },
      navigation: {
        topNavbar: [
          { icon: 'menu', position: 'left', action: 'toggleMenu' },
          { icon: 'account_circle', position: 'right', action: 'openLogin', route: '/login' },
          { icon: 'shopping_cart', position: 'right', action: 'openCart', route: '/cart' }
        ],
        bottomNavbar: [
          { icon: 'home', label: 'Home', route: '/home', active: true },
          { icon: 'toys', label: 'Toys', route: '/menu' },
          { icon: 'shopping_cart', label: 'Cart', route: '/cart' },
          { icon: 'inventory', label: 'Inventory', route: '/inventory' },
          { icon: 'person', label: 'Profile', route: '/profile' }
        ]
      },
      content: {
        heroTitle: 'Adorable Toys & Games',
        heroSubtitle: 'Bringing joy to children everywhere',
        heroImage: 'assets/images/little-ducks/hero-toys.jpg',
        categories: [
          { name: 'Educational Toys', icon: 'school', route: '/menu?category=educational' },
          { name: 'Action Figures', icon: 'sports_esports', route: '/menu?category=action' },
          { name: 'Board Games', icon: 'casino', route: '/menu?category=games' }
        ]
      }
    },
    {
      id: 'opula',
      name: 'opula',
      displayName: 'Opula',
      description: 'Trendy Fashion & Style',
      logo: 'assets/images/opula/logo.png',
      primaryColor: '#ec4899',
      secondaryColor: '#8b5cf6',
      accentColor: '#f59e0b',
      backgroundGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      navbarGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      theme: 'fashion',
      domain: 'opula.com',
      features: {
        inventory: true,
        delivery: true,
        multiStore: false,
        userRoles: true,
        payment: true
      },
      navigation: {
        topNavbar: [
          { icon: 'menu', position: 'left', action: 'toggleMenu' },
          { icon: 'account_circle', position: 'right', action: 'openLogin', route: '/login' },
          { icon: 'shopping_cart', position: 'right', action: 'openCart', route: '/cart' }
        ],
        bottomNavbar: [
          { icon: 'home', label: 'Home', route: '/home', active: true },
          { icon: 'checkroom', label: 'Fashion', route: '/menu' },
          { icon: 'shopping_cart', label: 'Cart', route: '/cart' },
          { icon: 'inventory', label: 'Inventory', route: '/inventory' },
          { icon: 'person', label: 'Profile', route: '/profile' }
        ]
      },
      content: {
        heroTitle: 'Trendy Fashion & Style',
        heroSubtitle: 'Express your unique style',
        heroImage: 'assets/images/opula/hero-fashion.jpg',
        categories: [
          { name: 'Women\'s Fashion', icon: 'woman', route: '/menu?category=womens' },
          { name: 'Men\'s Fashion', icon: 'man', route: '/menu?category=mens' },
          { name: 'Accessories', icon: 'watch', route: '/menu?category=accessories' }
        ]
      }
    }
  ];

  constructor() {
    // Initialize with default brand (BrewBuddy)
    this.setCurrentBrand('brewbuddy');
  }

  getBrands(): BrandConfig[] {
    return this.brands;
  }

  getBrand(brandId: string): BrandConfig | undefined {
    return this.brands.find(brand => brand.id === brandId);
  }

  setCurrentBrand(brandId: string): void {
    const brand = this.getBrand(brandId);
    if (brand) {
      this.currentBrandSubject.next(brand);
      this.updateCSSVariables(brand);
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

  detectBrandFromDomain(): string {
    const hostname = window.location.hostname;
    
    if (hostname.includes('littleducks') || hostname.includes('toys')) {
      return 'littleducks';
    } else if (hostname.includes('opula') || hostname.includes('fashion')) {
      return 'opula';
    } else {
      return 'brewbuddy';
    }
  }

  initializeBrand(): void {
    const detectedBrand = this.detectBrandFromDomain();
    this.setCurrentBrand(detectedBrand);
  }
}
