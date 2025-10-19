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
      theme: 'coffee' | 'toys' | 'fashion' | 'digitalsecurity' | 'food' | 'insurance' | 'silver-jewelry';
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
          { icon: 'receipt', label: 'Bill', route: '/invoices' },
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
      id: 'majili',
      name: 'majili',
      displayName: 'Majili',
      description: 'Trendy Fashion & Style',
      logo: 'assets/images/majili/logo.png',
      primaryColor: '#ec4899',
      secondaryColor: '#8b5cf6',
      accentColor: '#f59e0b',
      backgroundGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      navbarGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
      theme: 'fashion',
      domain: 'majili.com',
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
        heroImage: 'assets/images/majili/hero-fashion.jpg',
        categories: [
          { name: 'Women\'s Fashion', icon: 'woman', route: '/menu?category=womens' },
          { name: 'Men\'s Fashion', icon: 'man', route: '/menu?category=mens' },
          { name: 'Accessories', icon: 'watch', route: '/menu?category=accessories' }
        ]
      }
    },
    {
      id: 'cctv-device',
      name: 'cctv-device',
      displayName: 'CCTV Device',
      description: 'Digital Security Solutions',
      logo: 'assets/images/cctv-device/logo.png',
      primaryColor: '#0ea5e9',
      secondaryColor: '#3b82f6',
      accentColor: '#10b981',
      backgroundGradient: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #1e40af 100%)',
      navbarGradient: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #1e40af 100%)',
      theme: 'digitalsecurity',
      domain: 'cctvdevice.com',
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
          { icon: 'security', label: 'Products', route: '/menu' },
          { icon: 'shopping_cart', label: 'Cart', route: '/cart' },
          { icon: 'inventory', label: 'Inventory', route: '/inventory' },
          { icon: 'person', label: 'Profile', route: '/profile' }
        ]
      },
      content: {
        heroTitle: 'Digital Security Solutions',
        heroSubtitle: 'Professional CCTV and security systems',
        heroImage: 'assets/images/cctv-device/hero-security.jpg',
        categories: [
          { name: 'CCTV Cameras', icon: 'videocam', route: '/menu?category=cctv-cameras' },
          { name: 'Security Systems', icon: 'security', route: '/menu?category=security-systems' },
          { name: 'Access Control', icon: 'lock', route: '/menu?category=access-control' }
        ]
      }
    },
    {
      id: 'royalfoods',
      name: 'royalfoods',
      displayName: 'Royal Foods',
      description: 'Fresh Indian Breads Specialist',
      logo: 'assets/images/royalfoods/logo.png',
      primaryColor: '#d97706',
      secondaryColor: '#f59e0b',
      accentColor: '#ef4444',
      backgroundGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      navbarGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
      theme: 'food',
      domain: 'royalfoods.com',
      features: {
        inventory: true,
        delivery: true,
        multiStore: true,
        userRoles: true,
        payment: true
      },
      navigation: {
        topNavbar: [
          { icon: 'restaurant_menu', position: 'left', action: 'toggleMenu' },
          { icon: 'account_circle', position: 'right', action: 'openLogin', route: '/login' },
          { icon: 'shopping_cart', position: 'right', action: 'openCart', route: '/cart' }
        ],
        bottomNavbar: [
          { icon: 'home', label: 'Home', route: '/home', active: true },
          { icon: 'restaurant', label: 'Menu', route: '/menu' },
          { icon: 'shopping_cart', label: 'Cart', route: '/cart' },
          { icon: 'inventory', label: 'Inventory', route: '/inventory' },
          { icon: 'receipt', label: 'Bill', route: '/invoices' },
          { icon: 'person', label: 'Profile', route: '/profile' }
        ]
      },
      content: {
        heroTitle: 'Fresh Indian Breads',
        heroSubtitle: 'Traditional breads made fresh daily',
        heroImage: 'assets/images/royalfoods/hero-food.jpg',
        categories: [
          { name: 'Chapati', icon: 'bakery_dining', route: '/menu?category=chapati' },
          { name: 'Poori', icon: 'breakfast_dining', route: '/menu?category=poori' },
          { name: 'Pulka', icon: 'restaurant', route: '/menu?category=pulka' },
          { name: 'Parota', icon: 'ramen_dining', route: '/menu?category=parota' }
        ]
      }
    },
    {
      id: 'automobile-insurance',
      name: 'automobile-insurance',
      displayName: 'Automobile Insurance',
      description: 'Vehicle Insurance Policy Management',
      logo: 'assets/images/automobile-insurance/logo.png',
      primaryColor: '#0891b2',
      secondaryColor: '#06b6d4',
      accentColor: '#14b8a6',
      backgroundGradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #0e7490 100%)',
      navbarGradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #0e7490 100%)',
      theme: 'insurance',
      domain: 'autoinsurance.com',
      features: {
        inventory: true,
        delivery: false,
        multiStore: false,
        userRoles: true,
        payment: true
      },
      navigation: {
        topNavbar: [
          { icon: 'menu', position: 'left', action: 'toggleMenu' },
          { label: 'Automobile Insurance', position: 'center' },
          { icon: 'account_circle', position: 'right', action: 'openLogin', route: '/login' }
        ],
        bottomNavbar: [
          { icon: 'home', label: 'Home', route: '/home', active: true },
          { icon: 'description', label: 'Policies', route: '/menu' },
          { icon: 'add_circle', label: 'New Policy', route: '/cart' },
          { icon: 'analytics', label: 'Reports', route: '/inventory' },
          { icon: 'person', label: 'Profile', route: '/profile' }
        ]
      },
      content: {
        heroTitle: 'Vehicle Insurance Management',
        heroSubtitle: 'Manage all your vehicle insurance policies in one place',
        heroImage: 'assets/images/automobile-insurance/hero-insurance.jpg',
        categories: [
          { name: 'Two Wheeler', icon: 'two_wheeler', route: '/menu?category=two-wheeler' },
          { name: 'Four Wheeler', icon: 'directions_car', route: '/menu?category=four-wheeler' },
          { name: 'Commercial Vehicle', icon: 'local_shipping', route: '/menu?category=commercial' },
          { name: 'Renewals', icon: 'autorenew', route: '/menu?category=renewals' }
        ]
      }
    },
    {
      id: 'visakha-vendi',
      name: 'visakha-vendi',
      displayName: 'Visakha Vendi',
      description: 'Silver Exchange Service',
      logo: 'assets/images/visakha-vendi/logo.png',
      primaryColor: '#C0C0C0',
      secondaryColor: '#FF69B4',
      accentColor: '#1B365D',
      backgroundGradient: 'linear-gradient(135deg, #C0C0C0 0%, #E5E7EB 50%, #FF69B4 100%)',
      navbarGradient: 'linear-gradient(135deg, #C0C0C0 0%, #FF69B4 100%)',
      theme: 'silver-jewelry',
      domain: 'visakhavendi.com',
      features: {
        inventory: true,
        delivery: false,
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
          { icon: 'calculate', label: 'Calculator', route: '/home#price-calculator' },
          { icon: 'receipt', label: 'Bill', route: '/invoices' },
          { icon: 'phone', label: 'Contact', route: '/home#contact' },
          { icon: 'person', label: 'Profile', route: '/profile' }
        ]
      },
      content: {
        heroTitle: 'Visakha Vendi - Silver Exchange Service',
        heroSubtitle: 'Transform your old silver jewelry into cash or exchange for beautiful new pieces',
        heroImage: 'assets/images/visakha-vendi/hero-silver-exchange.jpg',
        categories: [
          { name: 'Sell Silver', icon: 'sell', route: '/home#services' },
          { name: 'Exchange Jewelry', icon: 'swap_horiz', route: '/home#services' },
          { name: 'Price Calculator', icon: 'calculate', route: '/home#price-calculator' },
          { name: 'Store Locator', icon: 'location_on', route: '/home#store-locations' }
        ]
      }
    },
    {
      id: 'megha',
      name: 'megha',
      displayName: 'Megha',
      description: 'Multi-Store Management Platform',
      logo: 'assets/images/megha/logo.png',
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      accentColor: '#10b981',
      backgroundGradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #0ea5e9 100%)',
      navbarGradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      theme: 'coffee',
      domain: 'megha.com',
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
          { label: 'Megha', position: 'center' },
          { icon: 'account_circle', position: 'right', action: 'openLogin', route: '/megha/login' },
          { icon: 'shopping_cart', position: 'right', action: 'openCart', route: '/megha/cart' }
        ],
        bottomNavbar: [
          { icon: 'home', label: 'Home', route: '/megha/home', active: true },
          { icon: 'restaurant_menu', label: 'Menu', route: '/megha/menu' },
          { icon: 'shopping_cart', label: 'Cart', route: '/megha/cart' },
          { icon: 'inventory', label: 'Inventory', route: '/megha/inventory' },
          { icon: 'receipt', label: 'Bill', route: '/megha/invoices' },
          { icon: 'person', label: 'Profile', route: '/megha/profile' }
        ]
      },
      content: {
        heroTitle: 'Multi-Store Management Platform',
        heroSubtitle: 'Manage all your stores from one place',
        heroImage: 'assets/images/megha/hero-megha.jpg',
        categories: [
          { name: 'Store Management', icon: 'store', route: '/menu?category=stores' },
          { name: 'Inventory', icon: 'inventory', route: '/menu?category=inventory' },
          { name: 'Billing', icon: 'receipt', route: '/menu?category=billing' }
        ]
      }
    }  ];

  constructor() {
    // Initialize with default brand (Megha)
    this.setCurrentBrand('megha');
  }

  getBrands(): BrandConfig[] {
    return this.brands;
  }

  getBrand(brandId: string): BrandConfig | undefined {
    return this.brands.find(brand => brand.id === brandId);
  }

  setCurrentBrand(brandId: string): void {
    console.log('BrandService.setCurrentBrand called with:', brandId);
    const brand = this.getBrand(brandId);
    console.log('Found brand:', brand);
    if (brand) {
      this.currentBrandSubject.next(brand);
      this.updateCSSVariables(brand);
      console.log('Brand updated successfully:', brand.displayName);
    } else {
      console.warn('Brand not found for ID:', brandId);
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
    } else if (hostname.includes('majili') || hostname.includes('fashion')) {
      return 'majili';
    } else if (hostname.includes('royalfoods') || hostname.includes('food')) {
      return 'royalfoods';
    } else if (hostname.includes('dkassociates') || hostname.includes('automobile-insurance') || hostname.includes('autoinsurance') || hostname.includes('insurance')) {
      return 'automobile-insurance';
    } else if (hostname.includes('megha') || hostname.includes('tekmegha')) {
      return 'megha';
    } else {
      return 'brewbuddy';
    }
  }

  initializeBrand(): void {
    const detectedBrand = this.detectBrandFromDomain();
    this.setCurrentBrand(detectedBrand);
  }
}
