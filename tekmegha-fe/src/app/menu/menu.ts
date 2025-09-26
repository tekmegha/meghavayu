import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';
import { ProductTileComponent } from '../shared/product-tile/product-tile';
import { Product } from '../shared/interfaces/product.interface';
import { SupabaseService, Product as SupabaseProduct } from '../shared/services/supabase.service';
import { FallbackDataService } from '../shared/services/fallback-data.service';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule, SkeletonLoaderComponent, ProductTileComponent],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  isLoading = true;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';

  categories = [
    { id: 'all', name: 'All Products' },
    { id: 'Espresso Drinks', name: 'Espresso Drinks' },
    { id: 'Brewed Coffee', name: 'Brewed Coffee' },
    { id: 'Pastries & Snacks', name: 'Pastries & Snacks' }
  ];

  constructor(
    private supabaseService: SupabaseService,
    private fallbackDataService: FallbackDataService
  ) {}

  async ngOnInit() {
    await this.loadProducts();
  }

  async loadProducts() {
    try {
      const { data, error } = await this.supabaseService.getProducts();
      if (error) {
        console.warn('Supabase error, using fallback data:', error.message);
        // Use fallback data when Supabase fails
        this.products = this.fallbackDataService.getFallbackProducts(this.supabaseService.getCurrentBrand());
        this.filteredProducts = this.products;
        this.isLoading = false;
        return;
      }
      
      // Transform Supabase products to local Product interface
      this.products = (data || []).map(this.transformSupabaseProduct);
      this.filteredProducts = this.products;
      this.isLoading = false;
    } catch (error) {
      console.warn('Network error, using fallback data:', error);
      // Use fallback data when network fails
      this.products = this.fallbackDataService.getFallbackProducts();
      this.filteredProducts = this.products;
      this.isLoading = false;
    }
  }

  private transformSupabaseProduct(supabaseProduct: SupabaseProduct): Product {
    return {
      id: supabaseProduct.id,
      name: supabaseProduct.name,
      price: supabaseProduct.price,
      rating: supabaseProduct.rating,
      reviewCount: supabaseProduct.review_count,
      serves: supabaseProduct.serves,
      description: supabaseProduct.description,
      imageUrl: supabaseProduct.image_url,
      customisable: supabaseProduct.customisable,
      category: supabaseProduct.category,
      discountPercentage: supabaseProduct.discount_percentage,
      oldPrice: supabaseProduct.old_price,
      brand_id: supabaseProduct.brand_id
    };
  }

  onCategoryChange(category: string) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  private applyFilters() {
    let filtered = this.products;

    // Apply category filter
    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    this.filteredProducts = filtered;
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
        imageUrl: 'assets/images/brew-buddy/pasta.jpg',
        customisable: true,
        category: 'Espresso Drinks', // Assign category
        discountPercentage: 17, // Example discount
        oldPrice: 5.99, // Example old price
        brand_id: 'brew-buddy'
      },
      {
        id: '2',
        name: 'Sprinkled Fries - New',
        price: 109,
        rating: 3.6,
        reviewCount: 46,
        serves: 1,
        description: 'Baked fries seasoned with peri peri',
        imageUrl: 'assets/images/brew-buddy/fries.jpg',
        customisable: false,
        initialQuantity: 1, // Example of an item already in cart
        category: 'Pastries & Snacks', // Assign category
        brand_id: 'brew-buddy'
      },
      {
        id: '3',
        name: 'Classic Espresso',
        price: 3.50,
        rating: 4.5,
        reviewCount: 120,
        serves: 1,
        description: 'A strong shot of our finest coffee',
        imageUrl: 'assets/images/brew-buddy/espresso.jpg',
        customisable: true,
        category: 'Espresso Drinks', // Assign category
        discountPercentage: 10, // Example discount
        oldPrice: 4.00, // Example old price
        brand_id: 'brew-buddy'
      },
      {
        id: '4',
        name: 'Creamy Latte',
        price: 4.50,
        rating: 4.7,
        reviewCount: 150,
        serves: 1,
        description: 'Espresso with steamed milk and a thin layer of foam',
        imageUrl: 'assets/images/brew-buddy/latte.jpg',
        customisable: false,
        category: 'Espresso Drinks', // Assign category
        brand_id: 'brew-buddy'
      },
      {
        id: '5',
        name: 'Blueberry Muffin',
        price: 3.50,
        rating: 4.2,
        reviewCount: 80,
        serves: 1,
        description: 'Freshly baked with juicy blueberries',
        imageUrl: 'assets/images/brew-buddy/muffin.jpg',
        customisable: false,
        category: 'Pastries & Snacks', // Assign category
        brand_id: 'brew-buddy'
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
