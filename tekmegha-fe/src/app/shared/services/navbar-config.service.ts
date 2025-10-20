import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { NavbarItem } from '../interfaces/navbar-item.interface';

export interface NavbarConfig {
  bottomNavbar: {
    enabled: boolean;
    items: {
      [key: string]: {
        enabled: boolean;
        label: string;
        icon: string;
        route: string;
      };
    };
  };
  topNavbar: {
    enabled: boolean;
    items: {
      [key: string]: {
        enabled: boolean;
        label: string;
        icon: string;
        action: string;
      };
    };
  };
}

export interface StoreNavbarData {
  store_code: string;
  store_name: string;
  navbar_config: NavbarConfig;
  enable_navbar_home: boolean;
  enable_navbar_menu: boolean;
  enable_navbar_cart: boolean;
  enable_navbar_inventory: boolean;
  enable_navbar_invoices: boolean;
  enable_navbar_profile: boolean;
  enable_products: boolean;
  enable_cart: boolean;
  enable_inventory: boolean;
  enable_invoices: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NavbarConfigService {
  private bottomNavbarSubject = new BehaviorSubject<NavbarItem[]>([]);
  private topNavbarSubject = new BehaviorSubject<NavbarItem[]>([]);
  private storeNavbarDataSubject = new BehaviorSubject<StoreNavbarData | null>(null);

  public bottomNavbar$ = this.bottomNavbarSubject.asObservable();
  public topNavbar$ = this.topNavbarSubject.asObservable();
  public storeNavbarData$ = this.storeNavbarDataSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {}

  async loadNavbarConfig(): Promise<void> {
    try {
      const { data, error } = await this.supabaseService.getStoreNavbarConfig();
      
      if (error) {
        console.error('Error loading navbar config:', error);
        this.setDefaultNavbarConfig();
        return;
      }

      if (data) {
        console.log('Navbar config loaded:', data);
        this.storeNavbarDataSubject.next(data);
        this.processNavbarConfig(data);
      } else {
        console.log('No navbar config data, using defaults');
        this.setDefaultNavbarConfig();
      }
    } catch (error) {
      console.error('Error loading navbar config:', error);
      this.setDefaultNavbarConfig();
    }
  }

  private processNavbarConfig(storeData: StoreNavbarData): void {
    const storeCode = storeData.store_code;
    const navbarConfig = storeData.navbar_config;
    
    console.log('NavbarConfigService - processing config for store:', storeCode);
    console.log('NavbarConfigService - storeData:', storeData);
    console.log('NavbarConfigService - navbarConfig:', navbarConfig);

    // Process bottom navbar
    if (navbarConfig?.bottomNavbar?.enabled) {
      const bottomNavbarItems: NavbarItem[] = [];
      
      // Add home item
      if (navbarConfig.bottomNavbar.items['home']?.enabled) {
        bottomNavbarItems.push({
          icon: navbarConfig.bottomNavbar.items['home'].icon,
          label: navbarConfig.bottomNavbar.items['home'].label,
          route: `/${storeCode}${navbarConfig.bottomNavbar.items['home'].route}`,
          active: false,
          disabled: !storeData.enable_navbar_home
        });
      }

      // Add menu item
      if (navbarConfig.bottomNavbar.items['menu']?.enabled) {
        bottomNavbarItems.push({
          icon: navbarConfig.bottomNavbar.items['menu'].icon,
          label: navbarConfig.bottomNavbar.items['menu'].label,
          route: `/${storeCode}${navbarConfig.bottomNavbar.items['menu'].route}`,
          active: false,
          disabled: !storeData.enable_navbar_menu
        });
      }

      // Add cart item
      if (navbarConfig.bottomNavbar.items['cart']?.enabled) {
        bottomNavbarItems.push({
          icon: navbarConfig.bottomNavbar.items['cart'].icon,
          label: navbarConfig.bottomNavbar.items['cart'].label,
          route: `/${storeCode}${navbarConfig.bottomNavbar.items['cart'].route}`,
          active: false,
          disabled: !storeData.enable_navbar_cart || !storeData.enable_cart
        });
      }

      // Add inventory item
      if (navbarConfig.bottomNavbar.items['inventory']?.enabled) {
        bottomNavbarItems.push({
          icon: navbarConfig.bottomNavbar.items['inventory'].icon,
          label: navbarConfig.bottomNavbar.items['inventory'].label,
          route: `/${storeCode}${navbarConfig.bottomNavbar.items['inventory'].route}`,
          active: false,
          disabled: !storeData.enable_navbar_inventory || !storeData.enable_inventory
        });
      }

      // Add invoices item
      if (navbarConfig.bottomNavbar.items['invoices']?.enabled) {
        bottomNavbarItems.push({
          icon: navbarConfig.bottomNavbar.items['invoices'].icon,
          label: navbarConfig.bottomNavbar.items['invoices'].label,
          route: `/${storeCode}${navbarConfig.bottomNavbar.items['invoices'].route}`,
          active: false,
          disabled: !storeData.enable_navbar_invoices || !storeData.enable_invoices
        });
      }

      // Add profile item
      if (navbarConfig.bottomNavbar.items['profile']?.enabled) {
        bottomNavbarItems.push({
          icon: navbarConfig.bottomNavbar.items['profile'].icon,
          label: navbarConfig.bottomNavbar.items['profile'].label,
          route: `/${storeCode}${navbarConfig.bottomNavbar.items['profile'].route}`,
          active: false,
          disabled: !storeData.enable_navbar_profile
        });
      }

      this.bottomNavbarSubject.next(bottomNavbarItems);
    }

    // Process top navbar
    if (navbarConfig?.topNavbar?.enabled) {
      const topNavbarItems: NavbarItem[] = [];
      
      // Add menu toggle
      if (navbarConfig.topNavbar.items['menu']?.enabled) {
        topNavbarItems.push({
          icon: navbarConfig.topNavbar.items['menu'].icon,
          label: navbarConfig.topNavbar.items['menu'].label,
          action: navbarConfig.topNavbar.items['menu'].action as 'toggleMenu' | 'openSearch' | 'openLogin' | 'openCart',
          position: 'left'
        });
      }

      // Add search
      if (navbarConfig.topNavbar.items['search']?.enabled) {
        topNavbarItems.push({
          icon: navbarConfig.topNavbar.items['search'].icon,
          label: navbarConfig.topNavbar.items['search'].label,
          action: navbarConfig.topNavbar.items['search'].action as 'toggleMenu' | 'openSearch' | 'openLogin' | 'openCart',
          position: 'center'
        });
      }

      // Add login
      if (navbarConfig.topNavbar.items['login']?.enabled) {
        topNavbarItems.push({
          icon: navbarConfig.topNavbar.items['login'].icon,
          label: navbarConfig.topNavbar.items['login'].label,
          action: navbarConfig.topNavbar.items['login'].action as 'toggleMenu' | 'openSearch' | 'openLogin' | 'openCart',
          route: `/${storeCode}/login`,
          position: 'right'
        });
      }

      // Add cart
      if (storeData.enable_cart && navbarConfig.topNavbar.items['cart']?.enabled) {
        topNavbarItems.push({
          icon: navbarConfig.topNavbar.items['cart'].icon,
          label: navbarConfig.topNavbar.items['cart'].label,
          action: navbarConfig.topNavbar.items['cart'].action as 'toggleMenu' | 'openSearch' | 'openLogin' | 'openCart',
          route: `/${storeCode}/cart`,
          position: 'right'
        });
      }

      this.topNavbarSubject.next(topNavbarItems);
    }
  }

  private setDefaultNavbarConfig(): void {
    const storeCode = this.supabaseService.getCurrentStore() || 'megha';
    
    console.log('NavbarConfigService - using default config for store:', storeCode);
    console.log('NavbarConfigService - getCurrentStore() returned:', this.supabaseService.getCurrentStore());
    
    // Default bottom navbar
    const defaultBottomNavbar: NavbarItem[] = [
      { icon: 'home', label: 'Home', route: `/${storeCode}/home`, active: false },
      { icon: 'restaurant_menu', label: 'Menu', route: `/${storeCode}/menu`, active: false },
      { icon: 'shopping_cart', label: 'Cart', route: `/${storeCode}/cart`, active: false },
      { icon: 'inventory', label: 'Inventory', route: `/${storeCode}/inventory`, active: false },
      { icon: 'receipt', label: 'Bill', route: `/${storeCode}/invoices`, active: false },
      { icon: 'person', label: 'Profile', route: `/${storeCode}/profile`, active: false }
    ];

    // Default top navbar
    const defaultTopNavbar: NavbarItem[] = [
      { icon: 'menu_book', label: 'Menu', action: 'toggleMenu', position: 'left' },
      { icon: 'search', label: 'Search', action: 'openSearch', position: 'center' },
      { icon: 'account_circle', label: 'Login', action: 'openLogin', route: `/${storeCode}/login`, position: 'right' },
      { icon: 'shopping_cart', label: 'Cart', action: 'openCart', route: `/${storeCode}/cart`, position: 'right' }
    ];

    this.bottomNavbarSubject.next(defaultBottomNavbar);
    this.topNavbarSubject.next(defaultTopNavbar);
  }

  getBottomNavbarItems(): NavbarItem[] {
    return this.bottomNavbarSubject.value;
  }

  getTopNavbarItems(): NavbarItem[] {
    return this.topNavbarSubject.value;
  }

  getStoreNavbarData(): StoreNavbarData | null {
    return this.storeNavbarDataSubject.value;
  }
}
