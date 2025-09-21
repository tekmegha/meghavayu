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
        imageUrl: 'https://images.unsplash.com/photo-1517457375837-97218698305f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1ODU1NDR8MHwxfHNlYXJjaHwxfHxQYXN0YXxlbnwwfHx8fDE3MjcwMTM5NDh8MA&ixlib=rb-4.0.3&q=80&w=400',
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
        imageUrl: 'https://images.unsplash.com/photo-1582234032269-8041d8e13710?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1ODU1NDR8MHwxfHNlYXJjaHwxfHxGcmllc3xlbnwwfHx8fDE3MjcwMTQxMDN8MA&ixlib=rb-4.0.3&q=80&w=400',
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
        imageUrl: 'https://images.unsplash.com/photo-1507133748805-728b2484a0d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1ODU1NDR8MHwxfHNlYXJjaHwxfHxFc3ByZXNzb3xlbnwwfHx8fDE3MjcwMTQyNTF8MA&ixlib=rb-4.0.3&q=80&w=400',
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
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688da5638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1ODU1NDR8MHwxfHNlYXJjaHwxfHxMYXR0ZXxlbnwwfHx8fDE3MjcwMTQyNjB8MA&ixlib=rb-4.0.3&q=80&w=400',
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
        imageUrl: 'https://images.unsplash.com/photo-1585641774213-3cebfd265a7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1ODU1NDR8MHwxfHNlYXJjaHwxfHxNdWZmaW58ZW58MHx8fHwxNzI3MDE0MzQ2fDA&ixlib=rb-40.3&q=80&w=400',
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
