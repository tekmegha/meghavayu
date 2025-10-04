import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { StoreSessionService, StoreSession } from '../services/store-session.service';
import { Layout } from '../../layout/layout';
import { LayoutFashion } from '../../layout-fashion/layout-fashion';
import { LayoutToys } from '../../layout-toys/layout-toys';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dynamic-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    Layout,
    LayoutFashion,
    LayoutToys
  ],
  template: `
    <!-- Default Layout (Brew Buddy) -->
    <app-layout *ngIf="!selectedStore || selectedStore.storeCode === 'brew-buddy'">
      <router-outlet></router-outlet>
    </app-layout>

    <!-- Fashion Layout (Opula) -->
    <app-layout-fashion *ngIf="selectedStore?.storeCode === 'opula'">
      <router-outlet></router-outlet>
    </app-layout-fashion>

    <!-- Toys Layout (Little Ducks) -->
    <app-layout-toys *ngIf="selectedStore?.storeCode === 'little-ducks'">
      <router-outlet></router-outlet>
    </app-layout-toys>
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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
