import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FilterByPositionPipe } from '../filter-by-position-pipe';
import { NavbarItem } from '../shared/interfaces/navbar-item.interface';
import { CartService, CartState } from '../shared/services/cart-service';
import { StoreSessionService, StoreSession } from '../shared/services/store-session.service';
import { SupabaseService } from '../shared/services/supabase.service';
import { Observable, Subscription } from 'rxjs';
import { User } from '@supabase/supabase-js';

@Component({
  selector: 'app-top-navbar',
  standalone: true, // Added standalone: true
  imports: [CommonModule, RouterLink, FilterByPositionPipe],
  templateUrl: './top-navbar.html',
  styleUrl: './top-navbar.scss'
})
export class TopNavbar implements OnInit, OnDestroy {
  @Input() navbarItems: NavbarItem[] = [];
  @Output() menuToggle = new EventEmitter<void>();
  @Output() searchOpen = new EventEmitter<void>();
  @Output() loginOpen = new EventEmitter<void>();
  @Output() cartOpen = new EventEmitter<void>();
  @Output() exitApp = new EventEmitter<void>();

  cartState$: Observable<CartState>;
  selectedStore: StoreSession | null = null;
  appTitle = 'TekMegha';
  currentUser: User | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private storeSessionService: StoreSessionService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.cartState$ = this.cartService.cartState$;
  }

  ngOnInit() {
    // Subscribe to cart state changes
    this.subscription.add(
      this.cartState$.subscribe(cartState => {
        // Cart state is now available for template binding
      })
    );

    // Subscribe to store session changes
    this.subscription.add(
      this.storeSessionService.selectedStore$.subscribe(store => {
        this.selectedStore = store;
      })
    );

    // Subscribe to authentication state changes
    this.subscription.add(
      this.supabaseService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getDisplayTitle(): string {
    if (this.selectedStore) {
      return `${this.appTitle} : ${this.selectedStore.storeName}`;
    }
    return this.appTitle;
  }

  onItemClick(item: NavbarItem) {
    if (item.action === 'toggleMenu') {
      this.menuToggle.emit();
    } else if (item.action === 'openSearch') {
      this.searchOpen.emit();
    } else if (item.action === 'openLogin') {
      // Check if user is logged in to determine action
      if (this.currentUser) {
        // User is logged in, navigate to profile
        this.router.navigate(['/profile']);
      } else {
        // User is not logged in, navigate to login
        this.loginOpen.emit();
      }
    } else if (item.action === 'openCart') {
      this.cartOpen.emit();
    } else if (item.action === 'exitApp') {
      this.exitApp.emit();
    }
    // Handle route navigation if item.route exists and no action is specified
  }

  onExitClick() {
    this.exitApp.emit();
  }
}
