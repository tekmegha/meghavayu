import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CartService, CartState } from '../services/cart-service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-checkout-banner',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout-banner.html',
  styleUrl: './checkout-banner.scss'
})
export class CheckoutBannerComponent {
  cartState$: Observable<CartState>;
  totalQuantity$: Observable<number>;
  totalAmount$: Observable<number>;
  isCartPage$: Observable<boolean>;

  constructor(private cartService: CartService, private router: Router) {
    this.cartState$ = this.cartService.cartState$;
    this.totalQuantity$ = this.cartState$.pipe(map(state => state.totalQuantity));
    this.totalAmount$ = this.cartState$.pipe(map(state => state.totalAmount));

    this.isCartPage$ = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        const isCart = event.urlAfterRedirects.includes('/cart');
        console.log('Current URL after redirects:', event.urlAfterRedirects, 'Is Cart Page:', isCart);
        return isCart;
      })
    );
  }
}
