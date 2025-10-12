import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';
import { ProductTileComponent } from '../shared/product-tile/product-tile';
import { Product } from '../shared/interfaces/product.interface';
import { Category } from '../shared/interfaces/category.interface';
import { SupabaseService } from '../shared/services/supabase.service';
import { FallbackDataService } from '../shared/services/fallback-data.service';
import { ProductTransformService } from '../shared/services/product-transform.service';
import { BrandService, BrandConfig } from '../shared/services/brand.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule, SkeletonLoaderComponent, ProductTileComponent],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit, OnDestroy {
  isLoading = true;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedCategory: string = 'all';
  searchQuery: string = '';
  currentBrand: BrandConfig | null = null;
  private subscription = new Subscription();

  categories: { id: string; name: string }[] = [
    { id: 'all', name: 'All Products' }
  ];

  constructor(
    private supabaseService: SupabaseService,
    private fallbackDataService: FallbackDataService,
    private productTransformService: ProductTransformService,
    private brandService: BrandService
  ) {}

  async ngOnInit() {
    // Subscribe to brand changes
    this.subscription.add(
      this.brandService.currentBrand$.subscribe(brand => {
        console.log('Menu component received brand change:', brand);
        this.currentBrand = brand;
      })
    );

    await this.loadProducts();
    await this.loadCategories();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
      this.products = this.productTransformService.transformSupabaseProducts(data || []);
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

  async loadCategories() {
    try {
      console.log('🔄 Loading categories for menu...');
      
      const { data, error } = await this.supabaseService.getMainCategories();
      
      console.log('📊 Categories API Response:', { data, error });
      
      if (error) {
        console.error('❌ Error loading categories:', error);
        // Keep default "All Products" category
        return;
      }
      
      if (data && data.length > 0) {
        console.log('✅ Loaded categories from backend:', data.length, 'categories');
        console.log('📋 Categories data:', data);
        
        // Add "All Products" at the beginning and map backend categories
        this.categories = [
          { id: 'all', name: 'All Products' },
          ...data.map(category => ({
            id: category.name,
            name: category.name
          }))
        ];
        
        console.log('🎨 Mapped categories for menu:', this.categories);
      } else {
        console.log('⚠️ No categories found for store');
        // Keep default "All Products" category
      }
    } catch (error) {
      console.error('💥 Error in loadCategories:', error);
      // Keep default "All Products" category
    }
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

  getMenuTitle(): string {
    if (!this.currentBrand) return 'Our Menu';
    
    switch (this.currentBrand.id) {
      case 'brewbuddy':
        return 'Our Coffee Menu';
      case 'littleducks':
        return 'Our Toys Collection';
      case 'majili':
        return 'Our Fashion Collection';
      case 'cctv-device':
        return 'Our Security Products';
      default:
        return 'Our Menu';
    }
  }

  getSearchPlaceholder(): string {
    if (!this.currentBrand) return 'Search products...';
    
    switch (this.currentBrand.id) {
      case 'brewbuddy':
        return 'Search coffee, drinks, pastries...';
      case 'littleducks':
        return 'Search toys, games, educational...';
      case 'majili':
        return 'Search fashion, clothing, accessories...';
      case 'cctv-device':
        return 'Search security, cameras, systems...';
      default:
        return 'Search products...';
    }
  }
}
