import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryService, InventoryProduct, InventoryStats } from '../shared/services/inventory.service';
import { SupabaseService } from '../shared/services/supabase.service';

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

  categories = [
    'Espresso Drinks',
    'Brewed Coffee',
    'Pastries & Snacks'
  ];

  currentUser: any = null;

  constructor(
    private inventoryService: InventoryService,
    private supabaseService: SupabaseService,
    private router: Router
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
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      this.isLoading = false;
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
    this.newProduct = {
      name: '',
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
    this.showAddModal = true;
  }

  openEditModal(product: InventoryProduct) {
    this.selectedProduct = { ...product };
    this.showEditModal = true;
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

  async onLogout() {
    try {
      await this.supabaseService.signOut();
      this.router.navigate(['/inventory-login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
