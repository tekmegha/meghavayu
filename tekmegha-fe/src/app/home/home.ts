import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';
import { ProductTileComponent } from '../shared/product-tile/product-tile';
import { Product } from '../shared/interfaces/product.interface';
import { NetworkStatusService } from '../shared/services/network-status.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, SkeletonLoaderComponent, ProductTileComponent], // Add RouterLink and ProductTileComponent
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  isLoading = true;
  products: Product[] = [];
  isOnline = true;
  coffeeCategories = [
    { name: 'Espresso', icon: 'local_cafe', route: '/menu' },
    { name: 'Latte', icon: 'coffee', route: '/menu' },
    { name: 'Cappuccino', icon: 'local_drink', route: '/menu' },
    { name: 'Cold Brew', icon: 'ac_unit', route: '/menu' },
    { name: 'Pastries', icon: 'bakery_dining', route: '/menu' },
    { name: 'Tea', icon: 'emoji_food_beverage', route: '/menu' }
  ];

  constructor(private networkStatus: NetworkStatusService) {}

  ngOnInit() {
    this.isOnline = this.networkStatus.isOnline();
    this.networkStatus.isOnline$.subscribe(online => {
      this.isOnline = online;
    });

    // Simulate data loading
    setTimeout(() => {
      this.isLoading = false;
      this.products = [
          {
            id: 'home-product1',
            name: 'Espresso Blend',
            price: 4.50,
            rating: 4.8,
            reviewCount: 120,
            serves: 1,
            description: 'A rich and intense coffee experience.',
            imageUrl: 'assets/images/brew-buddy/espresso.jpg',
            customisable: false,
            category: 'Brewed Coffee',
            discountPercentage: 15,
            oldPrice: 5.29,
            brand_id: 'brew-buddy'
          },
          {
            id: 'home-product2',
            name: 'Vanilla Latte',
            price: 5.25,
            rating: 4.7,
            reviewCount: 95,
            serves: 1,
            description: 'Smooth latte with a hint of sweet vanilla.',
            imageUrl: 'assets/images/brew-buddy/latte.jpg',
            customisable: true,
            category: 'Espresso Drinks',
            discountPercentage: 10,
            oldPrice: 5.85,
            brand_id: 'brew-buddy'
          },
          {
            id: 'home-product3',
            name: 'Chocolate Croissant',
            price: 3.00,
            rating: 4.6,
            reviewCount: 80,
            serves: 1,
            description: 'Flaky pastry with a rich chocolate filling.',
            imageUrl: 'assets/images/brew-buddy/muffin.jpg',
            customisable: false,
            category: 'Pastries & Snacks',
            brand_id: 'brew-buddy'
          },
          {
            id: 'home-product4',
            name: 'Cappuccino',
            price: 4.75,
            rating: 4.9,
            reviewCount: 150,
            serves: 1,
            description: 'Perfect balance of espresso, steamed milk, and foam.',
            imageUrl: 'assets/images/brew-buddy/cappuccino.jpg',
            customisable: true,
            category: 'Espresso Drinks',
            discountPercentage: 12,
            oldPrice: 5.40,
            brand_id: 'brew-buddy'
          },
          {
            id: 'home-product5',
            name: 'Cold Brew',
            price: 4.25,
            rating: 4.5,
            reviewCount: 75,
            serves: 1,
            description: 'Smooth and refreshing cold-brewed coffee.',
            imageUrl: 'assets/images/brew-buddy/cold-brew.jpg',
            customisable: false,
            category: 'Brewed Coffee',
            discountPercentage: 8,
            oldPrice: 4.62,
            brand_id: 'brew-buddy'
          },
          {
            id: 'home-product6',
            name: 'Caramel Macchiato',
            price: 5.50,
            rating: 4.8,
            reviewCount: 110,
            serves: 1,
            description: 'Rich espresso with vanilla and caramel drizzle.',
            imageUrl: 'assets/images/brew-buddy/macchiato.jpg',
            customisable: true,
            category: 'Espresso Drinks',
            discountPercentage: 15,
            oldPrice: 6.47,
            brand_id: 'brew-buddy'
          },
          {
            id: 'home-product7',
            name: 'Blueberry Muffin',
            price: 3.25,
            rating: 4.4,
            reviewCount: 65,
            serves: 1,
            description: 'Fresh baked muffin with juicy blueberries.',
            imageUrl: 'assets/images/brew-buddy/blueberry-muffin.jpg',
            customisable: false,
            category: 'Pastries & Snacks',
            brand_id: 'brew-buddy'
          },
          {
            id: 'home-product8',
            name: 'Americano',
            price: 3.75,
            rating: 4.6,
            reviewCount: 85,
            serves: 1,
            description: 'Classic espresso with hot water for a clean taste.',
            imageUrl: 'assets/images/brew-buddy/americano.jpg',
            customisable: false,
            category: 'Espresso Drinks',
            brand_id: 'brew-buddy'
          }
        ];
    }, 2000); // Show skeleton for 2 seconds
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/brew-buddy/default.png';
  }
}
