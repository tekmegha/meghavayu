import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../shared/services/supabase.service';
import { StoreSessionService } from '../shared/services/store-session.service';
import { BrandService } from '../shared/services/brand.service';

interface InvoiceItem {
  id?: number;
  itemName: string;
  rate: number;
  quantity: number;
  amount: number;
}

interface Invoice {
  id?: number;
  invoiceNumber: string;
  date: string;
  storeId: number;
  storeName: string;
  storeAddress: string;
  storeContact: string;
  storeGstin: string;
  buyerName: string;
  buyerAddress: string;
  buyerContact: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  sgst: number;
  cgst: number;
  total: number;
  balanceDue: number;
  paymentMode: string;
  createdAt?: string;
}

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './invoice.html',
  styleUrl: './invoice.scss',
  encapsulation: ViewEncapsulation.None
})
export class InvoiceComponent implements OnInit {
  invoiceForm: FormGroup;
  items: FormArray;
  currentStore: any = null;
  
  // Tab navigation state
  activeTab = 'items'; // 'items', 'invoice', 'store', 'buyer'
  storeConfig: any = null;
  templateConfig: any = null;
  loading = false;
  error: string | null = null;
  showPreview = false;
  invoiceNumber = '';
  mode: 'new' | 'edit' | 'view' = 'new';
  invoiceId: number | null = null;

  // Store type configurations
  storeTypes = {
    'brew-buddy': {
      defaultItems: [
        { itemName: 'Coffee Beans', rate: 250, quantity: 1 },
        { itemName: 'Espresso', rate: 45, quantity: 2 },
        { itemName: 'Cappuccino', rate: 55, quantity: 1 }
      ]
    },
    'automobile-insurance': {
      defaultItems: [
        { itemName: 'Motor Insurance Policy', rate: 5000, quantity: 1 },
        { itemName: 'Road Tax', rate: 1200, quantity: 1 },
        { itemName: 'Registration Fee', rate: 800, quantity: 1 }
      ]
    },
    'royalfoods': {
      defaultItems: [
        { itemName: 'Rice', rate: 120, quantity: 5 },
        { itemName: 'Wheat Flour', rate: 80, quantity: 2 },
        { itemName: 'Cooking Oil', rate: 200, quantity: 1 }
      ]
    },
    'default': {
      defaultItems: [
        { itemName: 'Milk', rate: 22, quantity: 2 },
        { itemName: 'Bread', rate: 45, quantity: 1 },
        { itemName: 'Coffee', rate: 82, quantity: 1 }
      ]
    }
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private storeSession: StoreSessionService,
    private brandService: BrandService
  ) {
    this.items = this.fb.array([]);
    this.invoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
      date: [this.getCurrentDate(), Validators.required],
      storeName: ['', Validators.required],
      storeAddress: ['', Validators.required],
      storeContact: ['', Validators.required],
      storeGstin: ['', Validators.required],
      buyerName: ['', Validators.required],
      buyerAddress: ['', Validators.required],
      buyerContact: ['', Validators.required],
      items: this.items,
      discount: [0, [Validators.min(0)]],
      paymentMode: ['Cash', Validators.required]
    });
  }

  ngOnInit() {
    this.detectMode();
    this.loadStoreInfo();
    this.generateInvoiceNumber();
    this.addDefaultItems();
  }

  private detectMode() {
    const url = this.router.url;
    if (url.includes('/edit/')) {
      this.mode = 'edit';
      this.invoiceId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    } else if (url.includes('/view/')) {
      this.mode = 'view';
      this.invoiceId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    } else if (url.includes('/print/')) {
      this.mode = 'view'; // Print mode uses view mode
      this.invoiceId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    } else if (url.includes('/new')) {
      this.mode = 'new';
    } else {
      // If accessed directly without /new, redirect to invoices list
      this.router.navigate(['../invoices'], { relativeTo: this.route });
      return;
    }
  }

  private loadStoreInfo() {
    // Get current store from URL-based context
    this.storeSession.selectedStore$.subscribe((store: any) => {
      if (store) {
        this.currentStore = store;
        this.loadTemplateConfig();
      }
    });
  }

  private async loadTemplateConfig() {
    if (!this.currentStore) return;

    try {
      const storeCode = this.currentStore.storeCode;
      const { data, error } = await this.supabase.getSupabaseClient()
        .rpc('get_store_invoice_template', { store_code_param: storeCode });

      if (error) {
        console.error('Error loading template config:', error);
        return;
      }

      if (data && data.length > 0) {
        this.templateConfig = data[0];
        this.updateFormWithTemplate();
      }
    } catch (error) {
      console.error('Error loading template configuration:', error);
    }
  }

  private updateFormWithTemplate() {
    if (!this.templateConfig) return;

    // Update form with template configuration
    this.invoiceForm.patchValue({
      storeName: this.templateConfig.header_company_name || this.currentStore?.storeName || '',
      storeAddress: this.templateConfig.header_company_address || '',
      storeContact: this.templateConfig.header_company_contact || '',
      storeGstin: this.templateConfig.header_company_gstin || '',
      paymentMode: this.templateConfig.default_payment_mode || 'Cash'
    });
  }

  private generateInvoiceNumber() {
    const timestamp = Date.now().toString().slice(-8);
    this.invoiceNumber = `INV${timestamp}`;
    this.invoiceForm.patchValue({
      invoiceNumber: this.invoiceNumber
    });
  }

  private getCurrentDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  private addDefaultItems() {
    // No need for sample items - store will add items manually
    // Just add one empty item for the user to start with
    this.addItem('', 0, 1);
  }

  createItemFormGroup(itemName = '', rate = 0, quantity = 1): FormGroup {
    return this.fb.group({
      itemName: [itemName, Validators.required],
      description: [''],
      rate: [rate, [Validators.required, Validators.min(0)]],
      quantity: [quantity, [Validators.required, Validators.min(1)]],
      amount: [{value: rate * quantity, disabled: true}],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      finalAmount: [{value: rate * quantity, disabled: true}]
    });
  }

  addItem(itemName = '', rate = 0, quantity = 1) {
    const itemGroup = this.createItemFormGroup(itemName, rate, quantity);
    this.items.push(itemGroup);
    
    // Subscribe to rate and quantity changes to update amount
    itemGroup.get('rate')?.valueChanges.subscribe(() => this.updateItemAmount(itemGroup));
    itemGroup.get('quantity')?.valueChanges.subscribe(() => this.updateItemAmount(itemGroup));
    itemGroup.get('discount')?.valueChanges.subscribe(() => this.calculateItemTotal(this.items.length - 1));
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  duplicateItem(index: number) {
    const itemGroup = this.items.at(index);
    const itemData = itemGroup.value;
    
    // Create a new item with the same data
    const newItem = this.createItemFormGroup(
      itemData.itemName + ' (Copy)',
      itemData.rate,
      itemData.quantity
    );
    
    // Set discount if it exists
    if (itemData.discount) {
      newItem.patchValue({ discount: itemData.discount });
    }
    
    // Insert after current item
    this.items.insert(index + 1, newItem);
    
    // Subscribe to changes for the new item
    newItem.get('rate')?.valueChanges.subscribe(() => this.updateItemAmount(newItem));
    newItem.get('quantity')?.valueChanges.subscribe(() => this.updateItemAmount(newItem));
    newItem.get('discount')?.valueChanges.subscribe(() => this.calculateItemTotal(index + 1));
  }

  updateItemAmount(itemGroup: FormGroup) {
    const rate = itemGroup.get('rate')?.value || 0;
    const quantity = itemGroup.get('quantity')?.value || 0;
    const amount = rate * quantity;
    itemGroup.patchValue({ amount }, { emitEvent: false });
  }

  get subtotal(): number {
    return this.items.controls.reduce((sum, item) => {
      return sum + (item.get('amount')?.value || 0);
    }, 0);
  }

  get discountAmount(): number {
    return this.invoiceForm.get('discount')?.value || 0;
  }

  get taxableAmount(): number {
    return this.subtotal - this.discountAmount;
  }

  get sgstAmount(): number {
    // Assuming 9% SGST for general goods, can be made configurable
    return Math.round(this.taxableAmount * 0.09);
  }

  get cgstAmount(): number {
    // Assuming 9% CGST for general goods, can be made configurable
    return Math.round(this.taxableAmount * 0.09);
  }

  get totalAmount(): number {
    return this.taxableAmount + this.sgstAmount + this.cgstAmount;
  }

  get balanceDue(): number {
    return this.totalAmount;
  }

  previewInvoice() {
    if (this.invoiceForm.valid) {
      this.showPreview = true;
    } else {
      this.markFormGroupTouched();
    }
  }

  async saveInvoice() {
    if (this.invoiceForm.valid) {
      this.loading = true;
      this.error = null;

      // Get store ID from URL-based context
      const storeId = await this.supabase.getCurrentStoreId();
      
      const invoiceData: Invoice = {
        invoiceNumber: this.invoiceForm.value.invoiceNumber,
        date: this.invoiceForm.value.date,
        storeId: parseInt(storeId || '0'),
        storeName: this.invoiceForm.value.storeName,
        storeAddress: this.invoiceForm.value.storeAddress,
        storeContact: this.invoiceForm.value.storeContact,
        storeGstin: this.invoiceForm.value.storeGstin,
        buyerName: this.invoiceForm.value.buyerName,
        buyerAddress: this.invoiceForm.value.buyerAddress,
        buyerContact: this.invoiceForm.value.buyerContact,
        items: this.items.value,
        subtotal: this.subtotal,
        discount: this.discountAmount,
        sgst: this.sgstAmount,
        cgst: this.cgstAmount,
        total: this.totalAmount,
        balanceDue: this.balanceDue,
        paymentMode: this.invoiceForm.value.paymentMode
      };

      this.saveInvoiceToDatabase(invoiceData);
    } else {
      this.markFormGroupTouched();
    }
  }

  private async saveInvoiceToDatabase(invoiceData: Invoice) {
    try {
      const supabaseClient = this.supabase.getSupabaseClient();
      const { data, error } = await supabaseClient
        .from('invoices')
        .insert([invoiceData])
        .select();

      if (error) throw error;

      this.loading = false;
      alert('Invoice saved successfully!');
      this.generateInvoiceNumber(); // Generate new invoice number for next invoice
      this.showPreview = false;
    } catch (error) {
      this.loading = false;
      this.error = 'Failed to save invoice: ' + (error as Error).message;
      console.error('Error saving invoice:', error);
    }
  }


  shareInvoice() {
    // Implement sharing logic (email, WhatsApp, etc.)
    const invoiceText = `Invoice ${this.invoiceNumber} - ${this.invoiceForm.value.storeName}\nTotal: ₹${this.totalAmount}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${this.invoiceNumber}`,
        text: invoiceText
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(invoiceText).then(() => {
        alert('Invoice details copied to clipboard!');
      });
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.invoiceForm.controls).forEach(key => {
      const control = this.invoiceForm.get(key);
      control?.markAsTouched();
    });
    
    this.items.controls.forEach(itemGroup => {
      if (itemGroup instanceof FormGroup) {
        Object.keys(itemGroup.controls).forEach(key => {
          const control = itemGroup.get(key);
          control?.markAsTouched();
        });
      }
    });
  }


  // Getter for form controls
  get invoiceNumberControl() { return this.invoiceForm.get('invoiceNumber'); }
  get dateControl() { return this.invoiceForm.get('date'); }
  get storeNameControl() { return this.invoiceForm.get('storeName'); }
  get storeAddressControl() { return this.invoiceForm.get('storeAddress'); }
  get storeContactControl() { return this.invoiceForm.get('storeContact'); }
  get storeGstinControl() { return this.invoiceForm.get('storeGstin'); }
  get buyerNameControl() { return this.invoiceForm.get('buyerName'); }
  get buyerAddressControl() { return this.invoiceForm.get('buyerAddress'); }
  get buyerContactControl() { return this.invoiceForm.get('buyerContact'); }
  get discountControl() { return this.invoiceForm.get('discount'); }
  get paymentModeControl() { return this.invoiceForm.get('paymentMode'); }

  getPageTitle(): string {
    switch (this.mode) {
      case 'new': return 'Create Invoice';
      case 'edit': return 'Edit Invoice';
      case 'view': return 'View Invoice';
      default: return 'Invoice';
    }
  }

  editInvoice() {
    if (this.invoiceId) {
      this.router.navigate(['/invoice/edit', this.invoiceId]);
    }
  }

  printInvoice() {
    if (this.invoiceId) {
      window.open(`/invoice/print/${this.invoiceId}`, '_blank');
    }
  }

  goBack() {
    this.router.navigate(['/invoices']);
  }

  // Tab navigation methods
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  hasTabError(tab: string): boolean {
    switch (tab) {
      case 'items':
        return this.items.controls.some(item => 
          (item.get('itemName')?.invalid ?? false) || 
          (item.get('rate')?.invalid ?? false) || 
          (item.get('quantity')?.invalid ?? false)
        );
      case 'invoice':
        return (this.invoiceNumberControl?.invalid ?? false) || (this.dateControl?.invalid ?? false);
      case 'store':
        return (this.storeNameControl?.invalid ?? false) || 
               (this.storeAddressControl?.invalid ?? false) || 
               (this.storeContactControl?.invalid ?? false) || 
               (this.storeGstinControl?.invalid ?? false);
      case 'buyer':
        return (this.buyerNameControl?.invalid ?? false) || 
               (this.buyerAddressControl?.invalid ?? false) || 
               (this.buyerContactControl?.invalid ?? false) || 
               (this.paymentModeControl?.invalid ?? false);
      default:
        return false;
    }
  }

  isTabCompleted(tab: string): boolean {
    switch (tab) {
      case 'items':
        return this.items.length > 0 && this.items.controls.every(item => 
          (item.get('itemName')?.valid ?? false) && 
          (item.get('rate')?.valid ?? false) && 
          (item.get('quantity')?.valid ?? false)
        );
      case 'invoice':
        return (this.invoiceNumberControl?.valid ?? false) && (this.dateControl?.valid ?? false);
      case 'store':
        return (this.storeNameControl?.valid ?? false) && 
               (this.storeAddressControl?.valid ?? false) && 
               (this.storeContactControl?.valid ?? false) && 
               (this.storeGstinControl?.valid ?? false);
      case 'buyer':
        return (this.buyerNameControl?.valid ?? false) && 
               (this.buyerAddressControl?.valid ?? false) && 
               (this.buyerContactControl?.valid ?? false) && 
               (this.paymentModeControl?.valid ?? false);
      default:
        return false;
    }
  }

  // Items management methods (enhanced)

  calculateItemTotal(index: number) {
    const itemGroup = this.items.at(index);
    const quantity = itemGroup.get('quantity')?.value || 0;
    const rate = itemGroup.get('rate')?.value || 0;
    const discount = itemGroup.get('discount')?.value || 0;
    
    const amount = quantity * rate;
    const discountAmount = (amount * discount) / 100;
    const finalAmount = amount - discountAmount;
    
    itemGroup.patchValue({
      amount: amount,
      finalAmount: finalAmount
    });
    
    this.calculateTotals();
  }

  getItemTotal(index: number): number {
    const itemGroup = this.items.at(index);
    const quantity = itemGroup.get('quantity')?.value || 0;
    const rate = itemGroup.get('rate')?.value || 0;
    return quantity * rate;
  }

  getItemFinalAmount(index: number): number {
    const itemGroup = this.items.at(index);
    const amount = itemGroup.get('amount')?.value || 0;
    const discount = itemGroup.get('discount')?.value || 0;
    const discountAmount = (amount * discount) / 100;
    return amount - discountAmount;
  }

  calculateTotals() {
    let subtotal = 0;
    let totalDiscount = 0;
    
    for (let i = 0; i < this.items.length; i++) {
      const itemGroup = this.items.at(i);
      const amount = itemGroup.get('amount')?.value || 0;
      const discount = itemGroup.get('discount')?.value || 0;
      const discountAmount = (amount * discount) / 100;
      
      subtotal += amount;
      totalDiscount += discountAmount;
    }
    
    const total = subtotal - totalDiscount;
    
    this.invoiceForm.patchValue({
      subtotal: subtotal,
      discount: totalDiscount,
      total: total
    });
  }

  getSubtotal(): number {
    return this.invoiceForm.get('subtotal')?.value || 0;
  }

  getTotalDiscount(): number {
    return this.invoiceForm.get('discount')?.value || 0;
  }

  getTotalAmount(): number {
    return this.invoiceForm.get('total')?.value || 0;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}
