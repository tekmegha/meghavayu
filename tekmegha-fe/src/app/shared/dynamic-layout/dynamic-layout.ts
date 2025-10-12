import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StoreSessionService, StoreSession } from '../services/store-session.service';
import { Layout } from '../../layout/layout';
import { LayoutFashion } from '../../layout-fashion/layout-fashion';
import { LayoutToys } from '../../layout-toys/layout-toys';
import { LayoutDigitalSecurity } from '../../layout-digitalsecurity/layout-digitalsecurity';
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
    LayoutDigitalSecurity
  ],
  template: `
    <!-- Default Layout (Brew Buddy) -->
    <app-layout *ngIf="!selectedStore || selectedStore.storeCode === 'brew-buddy' || selectedStore.storeCode === 'tekmegha-clients'">
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
  `,
  styleUrls: ['./dynamic-layout.scss']
})
export class DynamicLayoutComponent implements OnInit, OnDestroy {
  selectedStore: StoreSession | null = null;
  private subscription = new Subscription();

  constructor(private storeSessionService: StoreSessionService) {}

  ngOnInit() {
    // Subscribe to store session changes
    this.subscription.add(
      this.storeSessionService.selectedStore$.subscribe(store => {
        this.selectedStore = store;
      })
    );

    // Auto-select store based on URL path
    this.detectStoreFromUrl();
  }

  private detectStoreFromUrl() {
    const path = window.location.pathname;
    let storeCode = '';

    if (path.startsWith('/brew-buddy')) {
      storeCode = 'brew-buddy';
    } else if (path.startsWith('/little-ducks')) {
      storeCode = 'little-ducks';
    } else if (path.startsWith('/majili')) {
      storeCode = 'majili';
    } else if (path.startsWith('/cctv-device')) {
      storeCode = 'cctv-device';
    } else if (path.startsWith('/fashion')) {
      storeCode = 'majili';
    } else if (path.startsWith('/toys')) {
      storeCode = 'little-ducks';
    }

    if (storeCode) {
      this.storeSessionService.loadStoreByCode(storeCode);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
