import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarItem } from '../shared/interfaces/navbar-item.interface';
import { StoreSessionService } from '../shared/services/store-session.service';
import { NavbarConfigService } from '../shared/services/navbar-config.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-sticky-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bottom-sticky-navbar.html',
  styleUrl: './bottom-sticky-navbar.scss'
})
export class BottomStickyNavbar implements OnInit, OnDestroy {
  @Input() navbarItems: NavbarItem[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private storeSessionService: StoreSessionService,
    private navbarConfigService: NavbarConfigService
  ) {}

  ngOnInit() {
    // Debug: Log the navbar items being passed to this component
    console.log('BottomStickyNavbar - navbarItems received:', this.navbarItems);
    
    // Subscribe to store session changes to reload navbar configuration
    this.subscription.add(
      this.storeSessionService.selectedStore$.subscribe(store => {
        if (store) {
          console.log('BottomStickyNavbar - Store changed, reloading navbar config for:', store.storeCode);
          this.reloadNavbarConfig();
        }
      })
    );
    
    // Handle route changes to update active state
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

  onNavItemClick(item: NavbarItem) {
    // Check if item is disabled
    if (item.disabled) {
      console.log('Navbar item is disabled:', item.label);
      return;
    }

    // Get current store from store session service
    const currentStore = this.storeSessionService.getSelectedStore();
    const currentPath = window.location.pathname;
    
    console.log('Bottom navbar click:', {
      itemRoute: item.route,
      currentStore: currentStore?.storeCode,
      currentPath: currentPath,
      itemLabel: item.label,
      disabled: item.disabled
    });
    
    if (item.route) {
      let targetRoute = item.route;
      
      // Check if the route is already store-specific (starts with /store-code/)
      const isStoreSpecific = /^\/[^\/]+\//.test(targetRoute);
      
      console.log('Route analysis:', {
        targetRoute: targetRoute,
        isStoreSpecific: isStoreSpecific,
        currentStore: currentStore?.storeCode
      });
      
      // If route is already store-specific, use it as-is
      if (isStoreSpecific) {
        console.log('Route is already store-specific, using as-is:', targetRoute);
        this.router.navigateByUrl(targetRoute);
        return;
      }
      
      // If route is not store-specific and we have a current store, make it store-specific
      if (!isStoreSpecific && currentStore?.storeCode) {
        if (targetRoute.startsWith('/')) {
          targetRoute = `/${currentStore.storeCode}${targetRoute}`;
        } else {
          targetRoute = `/${currentStore.storeCode}/${targetRoute}`;
        }
        console.log('Transformed route:', targetRoute);
      }
      
      console.log('Final navigation to:', targetRoute);
      this.router.navigateByUrl(targetRoute);
    }
  }

  private async reloadNavbarConfig() {
    try {
      console.log('BottomStickyNavbar - Reloading navbar configuration...');
      
      // Get current store from store session service
      const currentStore = this.storeSessionService.getSelectedStore();
      
      if (currentStore) {
        // Store data is already available from store session service
        // No need to make additional API calls
        console.log('BottomStickyNavbar - Using store data from store session:', currentStore);
        await this.navbarConfigService.loadNavbarConfig();
      } else {
        // No store selected, use default config
        await this.navbarConfigService.loadNavbarConfig();
      }
      
      // Update navbar items from the service
      this.navbarItems = this.navbarConfigService.getBottomNavbarItems();
      console.log('BottomStickyNavbar - Navbar items updated:', this.navbarItems);
    } catch (error) {
      console.error('BottomStickyNavbar - Error reloading navbar config:', error);
    }
  }

  private updateActiveNavItem(url: string) {
    // Update active state for navbar items
    this.navbarItems.forEach(item => {
      if (item.route) {
        // Check if the current URL matches this item's route
        item.active = url === item.route || 
                     url.startsWith(item.route + '/') ||
                     (item.route === '/home' && (url === '/' || url.endsWith('/home')));
      }
    });
  }
}
