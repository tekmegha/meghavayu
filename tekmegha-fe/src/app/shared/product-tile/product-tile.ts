import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../interfaces/product.interface';
import { CartService } from '../services/cart-service'; // Import CartService
import { BrandService } from '../services/brand.service';

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

  constructor(
    private cartService: CartService,
    private brandService: BrandService
  ) { } // Inject CartService and BrandService

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
    const defaultImage = this.getBrandSpecificDefaultImage();
    (event.target as HTMLImageElement).src = defaultImage;
  }

  private getBrandSpecificDefaultImage(): string {
    if (!this.brandService.getCurrentBrand()) {
      return 'assets/images/brew-buddy/default.png'; // Default fallback
    }
    
    const brandId = this.brandService.getCurrentBrand()?.id;
    switch (brandId) {
      case 'brewbuddy':
        return 'assets/images/brew-buddy/default.png';
      case 'littleducks':
        return 'assets/images/little-ducks/default.png';
      case 'opula':
        return 'assets/images/opula/default.png';
      case 'cctv-device':
        return 'assets/images/cctv-device/default.png';
      default:
        return 'assets/images/brew-buddy/default.png'; // Default fallback
    }
  }
}
