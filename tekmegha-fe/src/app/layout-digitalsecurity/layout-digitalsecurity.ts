import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { TopNavbar } from '../top-navbar/top-navbar';
import { BottomStickyNavbar } from '../bottom-sticky-navbar/bottom-sticky-navbar';
import { CheckoutBannerComponent } from '../shared/checkout-banner/checkout-banner';
import { NetworkStatusComponent } from '../shared/network-status/network-status';
import { LocationBarComponent } from '../shared/location-bar/location-bar';
import { BrandService, BrandConfig } from '../shared/services/brand.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout-digitalsecurity',
  imports: [
    CommonModule,
    RouterOutlet,
    TopNavbar,
    BottomStickyNavbar,
    CheckoutBannerComponent,
    NetworkStatusComponent,
    LocationBarComponent
  ],
  templateUrl: './layout-digitalsecurity.html',
  styleUrl: './layout-digitalsecurity.scss'
})
export class LayoutDigitalSecurity implements OnInit, OnDestroy {
  currentBrand: BrandConfig | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private brandService: BrandService
  ) {}

  ngOnInit() {
    // Subscribe to brand changes
    this.subscription.add(
      this.brandService.currentBrand$.subscribe(brand => {
        this.currentBrand = brand;
      })
    );

    // Initialize brand
    this.brandService.initializeBrand();

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

  onLoginOpen() {
    this.router.navigate(['/login']);
  }

  onCartOpen() {
    this.router.navigate(['/cart']);
  }

  onExitApp() {
    console.log('Exit App clicked!');
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

  getTopNavbarItems() {
    return this.currentBrand?.navigation.topNavbar || [];
  }

  getBottomNavbarItems() {
    return this.currentBrand?.navigation.bottomNavbar || [];
  }
}
