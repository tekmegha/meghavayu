import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { StoreSessionService, StoreSession } from '../services/store-session.service';
import { Layout } from '../../layout/layout';
import { LayoutFashion } from '../../layout-fashion/layout-fashion';
import { LayoutToys } from '../../layout-toys/layout-toys';
import { LayoutDigitalSecurity } from '../../layout-digitalsecurity/layout-digitalsecurity';
import { LayoutFood } from '../../layout-food/layout-food';
import { LayoutPetCare } from '../../layout-pet-care/layout-pet-care';
import { LayoutAcademy } from '../../layout-academy/layout-academy';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Layout,
    LayoutFashion,
    LayoutToys,
    LayoutDigitalSecurity,
    LayoutFood,
    LayoutPetCare,
    LayoutAcademy
  ],
  template: `
    <!-- Default Layout (All stores except specific ones) -->
    <app-layout *ngIf="!selectedStore || !isSpecialLayout(selectedStore.storeCode)">
      <router-outlet></router-outlet>
    </app-layout>

    <!-- Fashion Layout (Majili) -->
    <app-layout-fashion *ngIf="selectedStore?.storeCode === 'majili'">
      <router-outlet></router-outlet>
    </app-layout-fashion>

    <!-- Toys Layout (Little Ducks) -->
    <app-layout-toys *ngIf="selectedStore?.storeCode === 'little-ducks'">
      <router-outlet></router-outlet>
    </app-layout-toys>

    <!-- Digital Security Layout (CCTV Device) -->
    <app-layout-digitalsecurity *ngIf="selectedStore?.storeCode === 'cctv-device'">
      <router-outlet></router-outlet>
    </app-layout-digitalsecurity>

    <!-- Food Layout (Royal Foods) -->
    <app-layout-food *ngIf="selectedStore?.storeCode === 'royalfoods'">
      <router-outlet></router-outlet>
    </app-layout-food>

    <!-- Pet Care Layout (Paws Nexus) -->
    <app-layout-pet-care *ngIf="selectedStore?.storeCode === 'paws-nexus'">
      <router-outlet></router-outlet>
    </app-layout-pet-care>

    <!-- Academy Layout (SarcAcademy) -->
    <app-layout-academy *ngIf="selectedStore?.storeCode === 'sarcacademy'">
      <router-outlet></router-outlet>
    </app-layout-academy>
  `,
  styleUrls: ['./dynamic-layout.scss']
})
export class DynamicLayoutComponent implements OnInit, OnDestroy {
  selectedStore: StoreSession | null = null;
  private subscription = new Subscription();

  constructor(
    private storeSessionService: StoreSessionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Subscribe to store session changes
    this.subscription.add(
      this.storeSessionService.selectedStore$.subscribe(store => {
        this.selectedStore = store;
      })
    );

    // Auto-select store based on URL path
    this.detectStoreFromUrl();

    // Also listen to route changes to re-detect store when URL changes
    this.subscription.add(
      this.route.params.subscribe(() => {
        this.detectStoreFromUrl();
        // Store context is managed by StoreSessionService
      })
    );

    this.subscription.add(
      this.route.queryParams.subscribe(() => {
        this.detectStoreFromUrl();
        // Store context is managed by StoreSessionService
      })
    );
  }

  private detectStoreFromUrl() {
    console.log('DynamicLayoutComponent - Detecting store from URL:', window.location.pathname);
    
    // First check if we have a storeCode parameter from the route
    const storeCodeParam = this.route.snapshot.paramMap.get('storeCode');
    console.log('Store code from route param:', storeCodeParam);
    
    if (storeCodeParam) {
      console.log('Loading store by code from route param:', storeCodeParam);
      this.storeSessionService.loadStoreByCode(storeCodeParam);
      return;
    }

    // Check if we're on inventory-login and have a returnUrl with store code
    const currentPath = window.location.pathname;
    if (currentPath === '/inventory-login') {
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];
      if (returnUrl) {
        const storeCodeFromReturnUrl = this.extractStoreCodeFromPath(returnUrl);
        if (storeCodeFromReturnUrl) {
          this.storeSessionService.loadStoreByCode(storeCodeFromReturnUrl);
          return;
        }
      }
    }

    // Fallback to path-based detection for specific routes
    const path = window.location.pathname;
    let storeCode = '';

    console.log('Checking path-based detection for:', path);

    // Handle redirects first
    if (path.startsWith('/fashion')) {
      storeCode = 'majili';
    } else if (path.startsWith('/toys')) {
      storeCode = 'little-ducks';
    } else if (path.startsWith('/food')) {
      storeCode = 'royalfoods';
    } else if (path.startsWith('/insurance')) {
      storeCode = 'automobile-insurance';
    } else {
      // Extract store code from path dynamically
      const pathSegments = path.split('/').filter(segment => segment);
      if (pathSegments.length > 0) {
        const potentialStoreCode = pathSegments[0];
        const globalRoutes = ['home', 'menu', 'cart', 'stores', 'profile', 'login', 'inventory', 'invoice', 'insurances', 'tekmegha-clients', 'inventory-login'];
        
        if (!globalRoutes.includes(potentialStoreCode)) {
          storeCode = potentialStoreCode;
        }
      }
    }

    console.log('Detected store code from path:', storeCode);

    if (storeCode) {
      console.log('Loading store by code from path:', storeCode);
      this.storeSessionService.loadStoreByCode(storeCode);
    } else {
      console.log('No store code detected from path');
    }
  }

  private extractStoreCodeFromPath(path: string): string | null {
    // Remove leading slash and split by '/'
    const segments = path.replace(/^\//, '').split('/');
    if (segments.length > 0) {
      const potentialStoreCode = segments[0];
      // Check if it's not a known global route
      const globalRoutes = ['home', 'menu', 'cart', 'stores', 'profile', 'login', 'inventory', 'invoice', 'insurances', 'tekmegha-clients'];
      if (!globalRoutes.includes(potentialStoreCode)) {
        return potentialStoreCode;
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Check if a store code requires a special layout
   * @param storeCode The store code to check
   * @returns true if the store needs a special layout, false for default layout
   */
  isSpecialLayout(storeCode: string): boolean {
    const specialLayouts = ['majili', 'little-ducks', 'cctv-device', 'royalfoods', 'paws-nexus', 'sarcacademy'];
    return specialLayouts.includes(storeCode);
  }
}
