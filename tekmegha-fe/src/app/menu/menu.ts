import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';
import { ProductTileComponent } from '../shared/product-tile/product-tile';
import { Product } from '../shared/interfaces/product.interface';
import { FilterByCategoryPipe } from '../shared/filter-by-category.pipe';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, SkeletonLoaderComponent, ProductTileComponent, FilterByCategoryPipe],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  isLoading = true;
  products: Product[] = [];

  ngOnInit() {
    // Simulate data loading
    setTimeout(() => {
      this.products = this.getDummyProducts(); // Load dummy products
      this.isLoading = false;
    }, 2000); // Show skeleton for 2 seconds
  }

  getDummyProducts(): Product[] {
    return [
      {
        id: '1',
        name: 'Spicy Red Schezwan Pasta',
        price: 179,
        rating: 3.9,
        reviewCount: 5,
        serves: 1,
        description: 'Fusilli pasta baked in spicy schezwan sauce',
        imageUrl: 'https://via.placeholder.com/150x150?text=Schezwan+Pasta',
        customisable: true,
        category: 'Espresso Drinks' // Assign category
      },
      {
        id: '2',
        name: 'Sprinkled Fries - New',
        price: 109,
        rating: 3.6,
        reviewCount: 46,
        serves: 1,
        description: 'Baked fries seasoned with peri peri',
        imageUrl: 'https://via.placeholder.com/150x150?text=Sprinkled+Fries',
        customisable: false,
        initialQuantity: 1, // Example of an item already in cart
        category: 'Pastries & Snacks' // Assign category
      },
      {
        id: '3',
        name: 'Classic Espresso',
        price: 3.50,
        rating: 4.5,
        reviewCount: 120,
        serves: 1,
        description: 'A strong shot of our finest coffee',
        imageUrl: 'https://via.placeholder.com/150x150?text=Espresso',
        customisable: true,
        category: 'Espresso Drinks' // Assign category
      },
      {
        id: '4',
        name: 'Creamy Latte',
        price: 4.50,
        rating: 4.7,
        reviewCount: 150,
        serves: 1,
        description: 'Espresso with steamed milk and a thin layer of foam',
        imageUrl: 'https://via.placeholder.com/150x150?text=Latte',
        customisable: false,
        category: 'Espresso Drinks' // Assign category
      },
      {
        id: '5',
        name: 'Blueberry Muffin',
        price: 3.50,
        rating: 4.2,
        reviewCount: 80,
        serves: 1,
        description: 'Freshly baked with juicy blueberries',
        imageUrl: 'https://via.placeholder.com/150x150?text=Muffin',
        customisable: false,
        category: 'Pastries & Snacks' // Assign category
      }
    ];
  }

  onAddProduct(product: Product) {
    console.log('Added product:', product.name);
    // Implement actual add to cart logic here
  }

  onUpdateQuantity(event: { product: Product; quantity: number }) {
    console.log(`Updated ${event.product.name} quantity to ${event.quantity}`);
    // Implement actual update cart quantity logic here
  }
}
