import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilterByPositionPipe } from '../filter-by-position-pipe';
import { NavbarItem } from '../shared/interfaces/navbar-item.interface';
import { CartService, CartState } from '../shared/services/cart-service';
import { Observable, Subscription } from 'rxjs';

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

  cartState$: Observable<CartState>;
  private subscription: Subscription = new Subscription();

  constructor(private cartService: CartService) {
    this.cartState$ = this.cartService.cartState$;
  }

  ngOnInit() {
    // Subscribe to cart state changes
    this.subscription.add(
      this.cartState$.subscribe(cartState => {
        // Cart state is now available for template binding
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onItemClick(item: NavbarItem) {
    if (item.action === 'toggleMenu') {
      this.menuToggle.emit();
    } else if (item.action === 'openSearch') {
      this.searchOpen.emit();
    } else if (item.action === 'openLogin') {
      this.loginOpen.emit();
    } else if (item.action === 'openCart') {
      this.cartOpen.emit();
    }
    // Handle route navigation if item.route exists and no action is specified
  }
}
