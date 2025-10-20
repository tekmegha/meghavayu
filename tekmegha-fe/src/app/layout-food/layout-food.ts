import { Component, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-layout-food',
  standalone: true,
  imports: [
    RouterOutlet, 
    TopNavbar, 
    BottomStickyNavbar, 
    CheckoutBannerComponent, 
    NetworkStatusComponent, 
    LocationBarComponent
  ],
  templateUrl: './layout-food.html',
  styleUrl: './layout-food.scss'
})
export class LayoutFood implements OnInit, OnDestroy {
  showLocationBar: boolean = true;
  private subscription = new Subscription();

  constructor(
    private router: Router,
    private brandService: BrandService,
    private storeSessionService: StoreSessionService
  ) {}

  ngOnInit() {
    // Subscribe to brand changes
    this.subscription.add(
      this.brandService.currentBrand$.subscribe(brand => {
        if (brand) {
          console.log('Food layout loaded for brand:', brand.displayName);
        }
      })
    );

    // Handle route changes to update location bar visibility
    this.subscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.updateLocationBarVisibility(event.urlAfterRedirects);
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getTopNavbarItems(): NavbarItem[] {
    const brand = this.brandService.getCurrentBrand();
    return brand?.navigation.topNavbar || [];
  }

  getBottomNavbarItems(): NavbarItem[] {
    const brand = this.brandService.getCurrentBrand();
    return brand?.navigation.bottomNavbar || [];
  }

  onLoginOpen() {
    this.router.navigate(['/login']);
  }

  onCartOpen() {
    this.router.navigate(['/cart']);
  }

  onExitApp() {
    console.log('Exit App clicked!');
    // Clear store session to show app selector
    this.storeSessionService.clearSelectedStore();
    // Navigate to home page to show app selector
    this.router.navigate(['/home']);
  }

  private updateLocationBarVisibility(url: string) {
    // Hide location bar for invoice and inventory pages
    const hideLocationBarRoutes = ['/invoices', '/inventory'];
    
    // Check if current URL contains any of the routes that should hide location bar
    this.showLocationBar = !hideLocationBarRoutes.some(route => 
      url.includes(route) || url.endsWith(route)
    );
    
    console.log('Location bar visibility (food layout):', { url, showLocationBar: this.showLocationBar });
  }
}

