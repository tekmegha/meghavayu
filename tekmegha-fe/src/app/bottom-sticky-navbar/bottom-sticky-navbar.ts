import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarItem } from '../shared/interfaces/navbar-item.interface';
import { SupabaseService } from '../shared/services/supabase.service';
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
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    // Debug: Log the navbar items being passed to this component
    console.log('BottomStickyNavbar - navbarItems received:', this.navbarItems);
    
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

    // Handle store-specific routing
    const currentStore = this.supabaseService.getCurrentStore();
    const currentPath = window.location.pathname;
    
    console.log('Bottom navbar click:', {
      itemRoute: item.route,
      currentStore: currentStore,
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
        currentStore: currentStore
      });
      
      // If route is already store-specific, use it as-is
      if (isStoreSpecific) {
        console.log('Route is already store-specific, using as-is:', targetRoute);
        this.router.navigateByUrl(targetRoute);
        return;
      }
      
      // If route is not store-specific and we have a current store, make it store-specific
      if (!isStoreSpecific && currentStore) {
        if (targetRoute.startsWith('/')) {
          targetRoute = `/${currentStore}${targetRoute}`;
        } else {
          targetRoute = `/${currentStore}/${targetRoute}`;
        }
        console.log('Transformed route:', targetRoute);
      }
      
      console.log('Final navigation to:', targetRoute);
      this.router.navigateByUrl(targetRoute);
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
