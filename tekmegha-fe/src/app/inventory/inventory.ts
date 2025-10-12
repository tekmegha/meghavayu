import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService, InventoryProduct, InventoryStats } from '../shared/services/inventory.service';
import { SupabaseService } from '../shared/services/supabase.service';
import { BrandService } from '../shared/services/brand.service';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss'
})
export class Inventory implements OnInit {
  products: InventoryProduct[] = [];
  filteredProducts: InventoryProduct[] = [];
  stats: InventoryStats = {
    totalProducts: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalValue: 0
  };

  // UI State
  isLoading = true;
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedProduct: InventoryProduct | null = null;
  searchQuery = '';
  filterStatus = 'all'; // all, active, inactive, lowStock, outOfStock

  // Form Data
  newProduct: Partial<InventoryProduct> = {
    name: '',
    sku: '',
    price: 0,
    description: '',
    image_url: '',
    category: 'Espresso Drinks',
    stock_quantity: 100,
    low_stock_threshold: 10,
    is_active: true,
    supplier: '',
    cost_price: 0,
    margin_percentage: 40
  };

  // Product number for image path generation
  productNumber: number = 1;
  editProductNumber: number = 1;

  categories: string[] = [];

  currentUser: any = null;

  constructor(
    private inventoryService: InventoryService,
    private supabaseService: SupabaseService,
    private router: Router,
    private brandService: BrandService
  ) {}

  async ngOnInit() {
    this.currentUser = this.supabaseService.getCurrentUser();
    await this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    try {
      await this.inventoryService.loadProducts();
      
      this.inventoryService.products$.subscribe(products => {
        this.products = products;
        this.applyFilters();
      });

      this.inventoryService.stats$.subscribe(stats => {
        this.stats = stats;
      });

      // Load categories for inventory management
      await this.loadCategories();
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async loadCategories() {
    try {
      console.log('🔄 Loading categories for inventory management...');
      
      const { data, error } = await this.supabaseService.getCategoriesForInventory();
      
      if (error) {
        console.error('❌ Error loading categories for inventory:', error);
        this.categories = [];
        return;
      }
      
      if (data && data.length > 0) {
        console.log('✅ Loaded categories for inventory:', data.length, 'categories');
        this.categories = data.map(category => category.name);
        console.log('📋 Available categories:', this.categories);
      } else {
        console.log('⚠️ No categories found for inventory');
        this.categories = [];
      }
    } catch (error) {
      console.error('💥 Error loading categories for inventory:', error);
      this.categories = [];
    }
  }

  applyFilters() {
    let filtered = [...this.products];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.supplier?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (this.filterStatus) {
      case 'active':
        filtered = filtered.filter(p => p.is_active);
        break;
      case 'inactive':
        filtered = filtered.filter(p => !p.is_active);
        break;
      case 'lowStock':
        filtered = filtered.filter(p => p.stock_quantity <= p.low_stock_threshold && p.is_active);
        break;
      case 'outOfStock':
        filtered = filtered.filter(p => p.stock_quantity === 0 && p.is_active);
        break;
    }

    this.filteredProducts = filtered;
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  openAddModal() {
    this.productNumber = this.getNextProductNumber();
    this.newProduct = {
      name: '',
      price: 0,
      description: '',
      image_url: this.generateImageUrl(this.productNumber),
      category: 'Espresso Drinks',
      stock_quantity: 100,
      low_stock_threshold: 10,
      is_active: true,
      supplier: '',
      cost_price: 0,
      margin_percentage: 40
    };
    this.showAddModal = true;
  }

  getNextProductNumber(): number {
    // Get the highest product number from existing products and add 1
    if (this.products.length === 0) return 1;
    
    const numbers = this.products.map(p => {
      // Try to extract from image URL first, then SKU
      return this.extractProductNumberFromImageUrl(p.image_url) || this.extractProductNumberFromSKU(p.sku);
    });
    const maxNumber = Math.max(...numbers);
    return maxNumber + 1;
  }

  onProductNumberChange(): void {
    // Auto-generate image URL when product number changes
    if (this.productNumber && this.productNumber > 0) {
      this.newProduct.image_url = this.generateImageUrl(this.productNumber);
    }
  }

  generateImageUrl(productNumber: number): string {
    const brandId = this.brandService.getCurrentBrand()?.id || 'brewbuddy';
    return `assets/images/${brandId}/products/${productNumber}.png`;
  }

  getBrandId(): string {
    return this.brandService.getCurrentBrand()?.id || 'brewbuddy';
  }

  onPreviewImageError(event: Event): void {
    // Show default image in preview if image fails to load
    (event.target as HTMLImageElement).src = this.getBrandSpecificDefaultImage();
  }

  openEditModal(product: InventoryProduct) {
    this.selectedProduct = { ...product };
    // Extract product number from existing image URL or SKU
    this.editProductNumber = this.extractProductNumberFromImageUrl(product.image_url) || this.extractProductNumberFromSKU(product.sku || '');
    this.showEditModal = true;
  }

  private extractProductNumberFromImageUrl(imageUrl: string | undefined): number | null {
    // Extract number from image URL like "assets/images/brewbuddy/products/5.png"
    if (!imageUrl) return null;
    const match = imageUrl.match(/products\/(\d+)\.png/);
    return match ? parseInt(match[1], 10) : null;
  }

  private extractProductNumberFromSKU(sku: string | undefined): number {
    // Try to extract number from SKU
    if (sku) {
      const match = sku.match(/\d+/);
      if (match) {
        return parseInt(match[0], 10);
      }
    }
    return 1;
  }

  onEditProductNumberChange(): void {
    // Auto-generate image URL when edit product number changes
    if (this.selectedProduct && this.editProductNumber && this.editProductNumber > 0) {
      this.selectedProduct.image_url = this.generateImageUrl(this.editProductNumber);
    }
  }

  openDeleteModal(product: InventoryProduct) {
    this.selectedProduct = product;
    this.showDeleteModal = true;
  }

  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedProduct = null;
  }

  async onAddProduct() {
    if (!this.validateProduct(this.newProduct)) {
      return;
    }

    const result = await this.inventoryService.addProduct(this.newProduct);
    if (result.success) {
      this.closeModals();
    } else {
      alert('Error adding product: ' + result.error);
    }
  }

  async onUpdateProduct() {
    if (!this.selectedProduct || !this.validateProduct(this.selectedProduct)) {
      return;
    }

    const result = await this.inventoryService.updateProduct(
      this.selectedProduct.id,
      this.selectedProduct
    );

    if (result.success) {
      this.closeModals();
    } else {
      alert('Error updating product: ' + result.error);
    }
  }

  async onDeleteProduct() {
    if (!this.selectedProduct) return;

    const result = await this.inventoryService.deleteProduct(this.selectedProduct.id);
    if (result.success) {
      this.closeModals();
    } else {
      alert('Error deleting product: ' + result.error);
    }
  }

  async onUpdateStock(product: InventoryProduct, newStock: number) {
    const result = await this.inventoryService.updateStock(product.id, newStock);
    if (!result.success) {
      alert('Error updating stock: ' + result.error);
    }
  }

  async onToggleStatus(product: InventoryProduct) {
    const result = await this.inventoryService.toggleProductStatus(product.id);
    if (!result.success) {
      alert('Error updating status: ' + result.error);
    }
  }

  private validateProduct(product: Partial<InventoryProduct>): boolean {
    if (!product.name?.trim()) {
      alert('Product name is required');
      return false;
    }
    if (!product.price || product.price <= 0) {
      alert('Valid price is required');
      return false;
    }
    if (!product.description?.trim()) {
      alert('Product description is required');
      return false;
    }
    if (product.stock_quantity === undefined || product.stock_quantity < 0) {
      alert('Valid stock quantity is required');
      return false;
    }
    return true;
  }

  getStockStatus(product: InventoryProduct): string {
    if (product.stock_quantity === 0) return 'out-of-stock';
    if (product.stock_quantity <= product.low_stock_threshold) return 'low-stock';
    return 'in-stock';
  }

  getStockStatusText(product: InventoryProduct): string {
    if (product.stock_quantity === 0) return 'Out of Stock';
    if (product.stock_quantity <= product.low_stock_threshold) return 'Low Stock';
    return 'In Stock';
  }

  calculateMargin(product: InventoryProduct): number {
    if (!product.cost_price || product.cost_price === 0) return 0;
    return ((product.price - product.cost_price) / product.cost_price) * 100;
  }

  formatCurrency(amount: number): string {
    return `₹${amount.toFixed(2)}`;
  }

  onImageError(event: Event, product: InventoryProduct): void {
    // Fallback to brand-specific default image
    const defaultImage = this.getBrandSpecificDefaultImage();
    (event.target as HTMLImageElement).src = defaultImage;
  }

  private getBrandSpecificDefaultImage(): string {
    const brandId = this.brandService.getCurrentBrand()?.id || 'brewbuddy';
    
    // Try different fallback images
    const fallbacks = [
      `assets/images/${brandId}/default.png`,
      `assets/images/brew-buddy/default.png`,
      'assets/images/default-product.png'
    ];
    
    return fallbacks[0];
  }

  async onLogout() {
    try {
      await this.supabaseService.signOut();
      this.router.navigate(['/inventory-login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
