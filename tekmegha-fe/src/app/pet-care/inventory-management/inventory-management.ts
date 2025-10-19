import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SupabaseService } from '../../shared/services/supabase.service';
import { StoreSessionService } from '../../shared/services/store-session.service';
import { Subscription } from 'rxjs';

interface PetInventory {
  id: string;
  megha_store_id: string;
  item_code: string;
  item_name: string;
  category: string;
  subcategory?: string;
  description?: string;
  unit_price: number;
  quantity_in_stock: number;
  minimum_stock_level: number;
  supplier?: string;
  expiry_date?: string;
  is_active: boolean;
  created_at: string;
}

interface InventoryTransaction {
  id: string;
  inventory_id: string;
  transaction_type: string;
  quantity: number;
  unit_price?: number;
  total_amount?: number;
  notes?: string;
  created_at: string;
}

@Component({
  selector: 'app-inventory-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inventory-management.html',
  styleUrl: './inventory-management.scss'
})
export class InventoryManagementComponent implements OnInit, OnDestroy {
  inventoryItems: PetInventory[] = [];
  transactions: InventoryTransaction[] = [];
  selectedItem: PetInventory | null = null;
  isAddingItem = false;
  isEditingItem = false;
  isAddingTransaction = false;
  inventoryForm: FormGroup;
  transactionForm: FormGroup;
  private subscription = new Subscription();

  // Category options
  categories = [
    { value: 'medicine', label: 'Medicine' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'food', label: 'Food' },
    { value: 'grooming', label: 'Grooming' },
    { value: 'safety', label: 'Safety' }
  ];

  // Transaction types
  transactionTypes = [
    { value: 'purchase', label: 'Purchase' },
    { value: 'sale', label: 'Sale' },
    { value: 'adjustment', label: 'Adjustment' },
    { value: 'expiry', label: 'Expiry' },
    { value: 'damage', label: 'Damage' },
    { value: 'return', label: 'Return' }
  ];

  // Filter options
  filterCategory = '';
  filterStatus = 'all';
  searchTerm = '';

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private storeSessionService: StoreSessionService
  ) {
    this.inventoryForm = this.fb.group({
      item_code: ['', [Validators.required, Validators.minLength(3)]],
      item_name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      subcategory: [''],
      description: [''],
      unit_price: [0, [Validators.required, Validators.min(0)]],
      quantity_in_stock: [0, [Validators.required, Validators.min(0)]],
      minimum_stock_level: [0, [Validators.required, Validators.min(0)]],
      supplier: [''],
      expiry_date: ['']
    });

    this.transactionForm = this.fb.group({
      transaction_type: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      unit_price: [0, [Validators.min(0)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.loadInventoryItems();
    this.loadTransactions();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadInventoryItems(): void {
    this.subscription.add(
      this.storeSessionService.getCurrentStore().subscribe((store: any) => {
        if (store?.id) {
          this.supabaseService.getData('pet_inventory', { megha_store_id: store.id }).subscribe({
            next: (items: any) => {
              this.inventoryItems = items;
            },
            error: (error: any) => {
              console.error('Error loading inventory items:', error);
            }
          });
        }
      })
    );
  }

  loadTransactions(): void {
    this.subscription.add(
      this.storeSessionService.getCurrentStore().subscribe((store: any) => {
        if (store?.id) {
          this.supabaseService.getData('inventory_transactions', { megha_store_id: store.id }).subscribe({
            next: (transactions: any) => {
              this.transactions = transactions;
            },
            error: (error: any) => {
              console.error('Error loading transactions:', error);
            }
          });
        }
      })
    );
  }

  addItem(): void {
    this.isAddingItem = true;
    this.isEditingItem = false;
    this.selectedItem = null;
    this.inventoryForm.reset();
  }

  editItem(item: PetInventory): void {
    this.selectedItem = item;
    this.isEditingItem = true;
    this.isAddingItem = false;
    this.inventoryForm.patchValue({
      item_code: item.item_code,
      item_name: item.item_name,
      category: item.category,
      subcategory: item.subcategory,
      description: item.description,
      unit_price: item.unit_price,
      quantity_in_stock: item.quantity_in_stock,
      minimum_stock_level: item.minimum_stock_level,
      supplier: item.supplier,
      expiry_date: item.expiry_date
    });
  }

  saveItem(): void {
    if (this.inventoryForm.valid) {
      const formData = this.inventoryForm.value;
      
      this.subscription.add(
        this.storeSessionService.getCurrentStore().subscribe((store: any) => {
          if (store?.id) {
            const itemData = {
              ...formData,
              megha_store_id: store.id,
              is_active: true
            };

            if (this.isAddingItem) {
              this.supabaseService.createData('pet_inventory', itemData).subscribe({
                next: () => {
                  this.loadInventoryItems();
                  this.isAddingItem = false;
                  this.inventoryForm.reset();
                },
                error: (error: any) => {
                  console.error('Error creating inventory item:', error);
                }
              });
            } else if (this.selectedItem) {
              this.supabaseService.updateData('pet_inventory', this.selectedItem.id, itemData).subscribe({
                next: () => {
                  this.loadInventoryItems();
                  this.isEditingItem = false;
                  this.selectedItem = null;
                  this.inventoryForm.reset();
                },
                error: (error: any) => {
                  console.error('Error updating inventory item:', error);
                }
              });
            }
          }
        })
      );
    }
  }

  deleteItem(item: PetInventory): void {
    if (confirm(`Are you sure you want to delete ${item.item_name}?`)) {
      this.supabaseService.deleteData('pet_inventory', item.id).subscribe({
        next: () => {
          this.loadInventoryItems();
        },
        error: (error: any) => {
          console.error('Error deleting inventory item:', error);
        }
      });
    }
  }

  toggleItemStatus(item: PetInventory): void {
    this.supabaseService.updateData('pet_inventory', item.id, { is_active: !item.is_active }).subscribe({
      next: () => {
        this.loadInventoryItems();
      },
      error: (error: any) => {
        console.error('Error updating item status:', error);
      }
    });
  }

  addTransaction(item: PetInventory): void {
    this.selectedItem = item;
    this.isAddingTransaction = true;
    this.transactionForm.reset();
    this.transactionForm.patchValue({
      unit_price: item.unit_price
    });
  }

  saveTransaction(): void {
    if (this.transactionForm.valid && this.selectedItem) {
      const formData = this.transactionForm.value;
      
      this.supabaseService.createData('inventory_transactions', {
        ...formData,
        inventory_id: this.selectedItem.id,
        total_amount: formData.quantity * (formData.unit_price || this.selectedItem.unit_price)
      }).subscribe({
        next: () => {
          this.loadInventoryItems();
          this.loadTransactions();
          this.isAddingTransaction = false;
          this.selectedItem = null;
          this.transactionForm.reset();
        },
        error: (error: any) => {
          console.error('Error creating transaction:', error);
        }
      });
    }
  }

  getFilteredItems(): PetInventory[] {
    let filtered = this.inventoryItems;

    if (this.filterCategory) {
      filtered = filtered.filter(item => item.category === this.filterCategory);
    }

    if (this.filterStatus === 'low') {
      filtered = filtered.filter(item => item.quantity_in_stock <= item.minimum_stock_level);
    } else if (this.filterStatus === 'out') {
      filtered = filtered.filter(item => item.quantity_in_stock === 0);
    } else if (this.filterStatus === 'expired') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(item => item.expiry_date && item.expiry_date < today);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.item_name.toLowerCase().includes(term) ||
        item.item_code.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
      );
    }

    return filtered;
  }

  getItemTransactions(itemId: string): InventoryTransaction[] {
    return this.transactions.filter(transaction => transaction.inventory_id === itemId);
  }

  getCategoryLabel(category: string): string {
    const categoryObj = this.categories.find(c => c.value === category);
    return categoryObj ? categoryObj.label : category;
  }

  getTransactionTypeLabel(type: string): string {
    const typeObj = this.transactionTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }

  getStockStatus(item: PetInventory): string {
    if (item.quantity_in_stock === 0) return 'out';
    if (item.quantity_in_stock <= item.minimum_stock_level) return 'low';
    return 'good';
  }

  getStockStatusClass(item: PetInventory): string {
    const status = this.getStockStatus(item);
    return `stock-${status}`;
  }

  cancelEdit(): void {
    this.isAddingItem = false;
    this.isEditingItem = false;
    this.isAddingTransaction = false;
    this.selectedItem = null;
    this.inventoryForm.reset();
    this.transactionForm.reset();
  }
}
