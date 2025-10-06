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
  private subscription: Subscription = new Subscription();

  constructor(
    private http: HttpClient, 
    private router: Router,
    private brandService: BrandService,
    private storeSessionService: StoreSessionService
  ) {}

  ngOnInit() {
    // Subscribe to brand changes
    this.subscription.add(
      this.brandService.currentBrand$.subscribe(brand => {
        this.currentBrand = brand;
        if (brand) {
          this.topNavbarConfig = brand.navigation.topNavbar;
          this.bottomNavbarConfig = brand.navigation.bottomNavbar;
        }
      })
    );

    // Brand will be initialized by home component based on store selection

    // Handle route changes
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.updateActiveNavItem(event.urlAfterRedirects);
        })
    );
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
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  onCartOpen() {
    console.log('Cart Opened!');
    // Navigate to cart page
    this.router.navigate(['/cart']);
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
    if (this.currentBrand?.navigation.bottomNavbar) {
      this.currentBrand.navigation.bottomNavbar.forEach(item => {
        item.active = url === item.route || (item.route === '/home' && url === '/');
      });
    }
  }
}
