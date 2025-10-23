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

  onCartCounterClick() {
    // When cart counter is clicked, increment quantity
    this.onIncrement();
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    const defaultImage = this.getBrandSpecificDefaultImage();
    
    // Prevent infinite loop - only set if not already the default
    if (imgElement.src !== defaultImage && !imgElement.src.includes('default.png')) {
      imgElement.src = defaultImage;
    } else if (!imgElement.src.includes('brew-buddy/default.png')) {
      // Final fallback to brew-buddy default
      imgElement.src = 'assets/images/brew-buddy/default.png';
    } else {
      // Remove the error handler to prevent further calls
      imgElement.onerror = null;
    }
  }

  private getBrandSpecificDefaultImage(): string {
    if (!this.brandService.getCurrentBrand()) {
      return 'assets/images/brew-buddy/default.png'; // Default fallback
    }
    
    const brandId = this.brandService.getCurrentBrand()?.id;
    const folderName = this.mapBrandIdToFolder(brandId);
    return `assets/images/${folderName}/default.png`;
  }

  private mapBrandIdToFolder(brandId: string | undefined): string {
    // Map brand IDs to their actual folder names
    switch (brandId) {
      case 'brewbuddy':
        return 'brew-buddy';
      case 'littleducks':
        return 'little-ducks';
      case 'majili':
        return 'majili';
      case 'cctv-device':
        return 'cctv-device';
      case 'royalfoods':
        return 'royalfoods';
      default:
        return 'brew-buddy'; // Default fallback
    }
  }
}
