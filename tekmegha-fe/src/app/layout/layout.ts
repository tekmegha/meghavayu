import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { TopNavbar } from '../top-navbar/top-navbar';
import { BottomStickyNavbar } from '../bottom-sticky-navbar/bottom-sticky-navbar';
import { CheckoutBannerComponent } from '../shared/checkout-banner/checkout-banner';
import { NetworkStatusComponent } from '../shared/network-status/network-status';
import { LocationBarComponent } from '../shared/location-bar/location-bar';
import { NavbarItem } from '../shared/interfaces/navbar-item.interface';
import { BrandService, BrandConfig } from '../shared/services/brand.service';
import { StoreSessionService } from '../shared/services/store-session.service';
import { NavbarConfigService } from '../shared/services/navbar-config.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface LayoutConfig {
  topNavbar: NavbarItem[];
  bottomNavbar: NavbarItem[];
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, TopNavbar, BottomStickyNavbar, CheckoutBannerComponent, NetworkStatusComponent, LocationBarComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit, OnDestroy {
  topNavbarConfig: NavbarItem[] = [];
  bottomNavbarConfig: NavbarItem[] = [];
  currentBrand: BrandConfig | null = null;
  showLocationBar: boolean = true;
  private subscription: Subscription = new Subscription();

  constructor(
    private http: HttpClient, 
    private router: Router,
    private brandService: BrandService,
    private storeSessionService: StoreSessionService,
    private navbarConfigService: NavbarConfigService
  ) {}

  ngOnInit() {
    // Load navbar configuration from database
    this.loadNavbarConfig();

    // Subscribe to navbar configuration changes
    this.subscription.add(
      this.navbarConfigService.topNavbar$.subscribe(items => {
        this.topNavbarConfig = items;
      })
    );

    this.subscription.add(
      this.navbarConfigService.bottomNavbar$.subscribe(items => {
        this.bottomNavbarConfig = items;
      })
    );

    // Subscribe to brand changes (for theme and other brand-specific features)
    this.subscription.add(
      this.brandService.currentBrand$.subscribe(brand => {
        this.currentBrand = brand;
      })
    );

    // Subscribe to store session changes to reload navbar configuration
    this.subscription.add(
      this.storeSessionService.selectedStore$.subscribe(store => {
        if (store) {
          console.log('Layout - Store changed, reloading navbar config for:', store.storeCode);
          this.loadNavbarConfig();
        }
      })
    );

    // Handle route changes
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.updateActiveNavItem(event.urlAfterRedirects);
          this.updateLocationBarVisibility(event.urlAfterRedirects);
        })
    );
  }

  private async loadNavbarConfig() {
    try {
      // Get current store from store session service
      const currentStore = this.storeSessionService.getSelectedStore();
      
      if (currentStore) {
        // Store data is already available from store session service
        // No need to make additional API calls
        console.log('Layout - Using store data from store session:', currentStore);
        await this.navbarConfigService.loadNavbarConfig();
      } else {
        // No store selected, use default config
        await this.navbarConfigService.loadNavbarConfig();
      }
    } catch (error) {
      console.error('Error loading navbar config:', error);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onMenuToggle() {
    console.log('Menu Toggled!');
    // Implement actual menu toggle logic here (e.g., open a side navigation)
  }

  onSearchOpen() {
    console.log('Search Opened!');
    // Implement actual search opening logic here (e.g., open a search overlay)
  }

  onLoginOpen() {
    console.log('Login Opened!');
    // Navigate to login page with store context
    const currentStore = this.storeSessionService.getSelectedStore();
    if (currentStore) {
      this.router.navigate([`/${currentStore.storeCode}/login`]);
    } else {
      this.router.navigate(['/megha/login']);
    }
  }

  onCartOpen() {
    console.log('Cart Opened!');
    // Navigate to cart page with store context
    const currentStore = this.storeSessionService.getSelectedStore();
    if (currentStore) {
      this.router.navigate([`/${currentStore.storeCode}/cart`]);
    } else {
      this.router.navigate(['/megha/cart']);
    }
  }

  onExitApp() {
    console.log('Exit App clicked!');
    // Clear store session to show app selector
    this.storeSessionService.clearSelectedStore();
    // Navigate to home page to show app selector
    this.router.navigate(['/home']);
  }

  private updateActiveNavItem(url: string) {
    // Update active state for bottom navbar items
    const bottomNavbarItems = this.navbarConfigService.getBottomNavbarItems();
    bottomNavbarItems.forEach(item => {
      item.active = url === item.route || (item.route === '/home' && url === '/');
    });
  }

  private updateLocationBarVisibility(url: string) {
    // Hide location bar for invoice and inventory pages
    const hideLocationBarRoutes = ['/invoices', '/inventory'];
    
    // Check if current URL contains any of the routes that should hide location bar
    this.showLocationBar = !hideLocationBarRoutes.some(route => 
      url.includes(route) || url.endsWith(route)
    );
    
    console.log('Location bar visibility:', { url, showLocationBar: this.showLocationBar });
  }
}
