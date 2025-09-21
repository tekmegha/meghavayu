import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../interfaces/product.interface';
import { CartService } from '../services/cart-service'; // Import CartService

@Component({
  selector: 'app-product-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-tile.html',
  styleUrl: './product-tile.scss'
})
export class ProductTileComponent implements OnInit {
  @Input() product!: Product;
  // Removed @Output() addProduct and @Output() updateQuantity as CartService will handle this
  quantity: number = 0;

  constructor(private cartService: CartService) { } // Inject CartService

  ngOnInit() {
    if (this.product) {
      const cartItem = this.cartService.getCartState().items.find(item => item.id === this.product.id);
      if (cartItem) {
        this.quantity = cartItem.quantity;
      }
    }
  }

  onAdd() {
    this.cartService.addToCart(this.product);
    this.quantity = 1; // Update local quantity display immediately
  }

  onIncrement() {
    this.quantity++;
    this.cartService.updateCartItemQuantity(this.product, this.quantity);
  }

  onDecrement() {
    if (this.quantity > 0) {
      this.quantity--;
      this.cartService.updateCartItemQuantity(this.product, this.quantity);
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/brew-buddy/default.png';
  }
}
