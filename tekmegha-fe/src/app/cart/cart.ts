import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';
import { CartService, CartState } from '../shared/services/cart-service';
import { SupabaseService } from '../shared/services/supabase.service';
import { BrandService } from '../shared/services/brand.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, SkeletonLoaderComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit, OnDestroy {
  isLoading = true;
  cartState$: Observable<CartState>;
  deliveryFee = 50; // Fixed delivery fee
  isLoggedIn = false;
  private authSubscription?: Subscription;

  constructor(
    private cartService: CartService,
    private supabaseService: SupabaseService,
    public router: Router,
    private brandService: BrandService
  ) {
    this.cartState$ = this.cartService.cartState$;
  }

  ngOnInit() {
    // Check authentication status
    this.checkAuthStatus();
    
    // Subscribe to authentication state changes
    this.authSubscription = this.supabaseService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    
    // Simulate data loading
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Show skeleton for 2 seconds
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async checkAuthStatus() {
    try {
      const user = await this.supabaseService.getCurrentUser();
      this.isLoggedIn = !!user;
    } catch (error) {
      console.error('Error checking auth status:', error);
      this.isLoggedIn = false;
    }
  }

  async refreshAuthStatus() {
    await this.checkAuthStatus();
  }

  getTotalWithDelivery(cartState: CartState): number {
    return cartState.totalAmount + this.deliveryFee;
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    const defaultImage = this.getBrandSpecificDefaultImage();
    
    // Prevent infinite loop
    if (imgElement.src !== defaultImage && !imgElement.src.includes('default.png')) {
      imgElement.src = defaultImage;
    } else if (!imgElement.src.includes('brew-buddy/default.png')) {
      imgElement.src = 'assets/images/brew-buddy/default.png';
    } else {
      imgElement.onerror = null; // Stop retrying
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
        return 'brew-buddy';
    }
  }

  async onRemoveItem(productId: string) {
    try {
      await this.cartService.removeFromCart(productId);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  }

  onIncrementQuantity(itemId: string) {
    const cartState = this.cartService.getCartState();
    const item = cartState.items.find(item => item.id === itemId);
    if (item) {
      this.cartService.updateCartItemQuantityById(itemId, item.quantity + 1);
    }
  }

  onDecrementQuantity(itemId: string) {
    const cartState = this.cartService.getCartState();
    const item = cartState.items.find(item => item.id === itemId);
    if (item) {
      if (item.quantity > 1) {
        this.cartService.updateCartItemQuantityById(itemId, item.quantity - 1);
      } else {
        this.cartService.removeFromCart(itemId);
      }
    }
  }

  async payWithRazorpay() {
    // Check if user is logged in
    if (!this.isLoggedIn) {
      const shouldLogin = confirm('You need to be logged in to proceed with checkout. Would you like to login now?');
      if (shouldLogin) {
        this.router.navigate(['/login']);
        return;
      } else {
        return;
      }
    }

    // Check if Razorpay is loaded
    if (typeof (window as any).Razorpay === 'undefined') {
      alert('Razorpay SDK not loaded. Please refresh the page and try again.');
      return;
    }

    // Get current cart state
    const cartState = this.cartService.getCartState();
    const totalAmount = this.getTotalWithDelivery(cartState);
    
    // Check if cart is empty
    if (cartState.items.length === 0) {
      alert('Your cart is empty. Please add some items before proceeding to payment.');
      return;
    }

    const options = {
      "key": "rzp_test_1DP5mmOlF5G5ag", // Updated test key
      "amount": (totalAmount * 100).toString(), // Convert to paise (₹1 = 100 paise)
      "currency": "INR",
      "name": "BrewBuddy",
      "description": "Coffee Order Payment",
      "image": "assets/images/brew-buddy/hero-brewbuddy.jpg",
      "order_id": "", // Remove order_id for direct payment
      "handler": (response: any) => {
        console.log('Payment successful:', response);
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // Clear cart after successful payment
        this.cartService.clearCart();
        // Here you would typically send this response to your backend for verification
        // and then redirect to success page or update order status
      },
      "prefill": {
        "name": "BrewBuddy Customer",
        "email": "customer@brewbuddy.com",
        "contact": "+919876543210"
      },
      "notes": {
        "address": "BrewBuddy Coffee Shop",
        "order_type": "Coffee Delivery",
        "items_count": cartState.items.length.toString()
      },
      "theme": {
        "color": "#003366" // Updated to German blue theme
      },
      "modal": {
        "ondismiss": () => {
          console.log('Payment modal dismissed');
        }
      }
    };

    try {
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        alert('Payment failed: ' + response.error.description);
      });
      rzp1.open();
    } catch (error) {
      console.error('Error initializing Razorpay:', error);
      alert('Error initializing payment. Please try again.');
    }
  }
}
