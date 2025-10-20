import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../shared/services/supabase.service';
import { StoreSessionService } from '../../shared/services/store-session.service';
import { BrandService } from '../../shared/services/brand.service';

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
  storeId: string;
  storeName: string;
  storeAddress: string;
  storeContact: string;
  storeGstin: string;
  buyerName: string;
  buyerAddress: string;
  buyerContact: string;
  buyerGstin?: string;
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
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './invoice-create.component.html',
  styleUrl: './invoice-create.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InvoiceCreateComponent implements OnInit {
  invoiceForm: FormGroup;
  items: FormArray;
  customerForm!: FormGroup;
  showDiscountColumn = false;
  showCustomerModal = false;
  currentStore: any = null;

  // Tab navigation state
  activeTab = 'items';
  storeConfig: any = null;
  templateConfig: any = null;

  // Form state
  loading = false;
  error: string | null = null;
  showPreview = false;

  // Sample data for development
  sampleData = {
    items: [
      { itemName: 'Coffee', rate: 82, quantity: 1 }
    ]
  };
  storeCode: string='';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private supabase: SupabaseService,
    private storeSession: StoreSessionService,
    private brandService: BrandService
  ) {
    this.items = this.fb.array([]);
    this.initializeCustomerForm();
    this.invoiceForm = this.fb.group({
      buyerName: ['', Validators.required],
      itemDescription: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(0)]],
      // Hidden fields for backend
      invoiceNumber: ['', Validators.required],
      date: [this.getCurrentDate(), Validators.required],
      storeName: ['', Validators.required],
      storeAddress: ['', Validators.required],
      storeContact: ['', Validators.required],
      storeGstin: [''],
      buyerAddress: ['', Validators.required],
      buyerContact: ['', Validators.required],
      paymentMode: ['Cash', Validators.required],
      // Totals fields
      subtotal: [0],
      discount: [0],
      sgst: [0],
      cgst: [0],
      total: [0],
      balanceDue: [0],
      items: this.items
    });
  }

  async ngOnInit() {
    await this.loadStoreConfig();
    this.generateInvoiceNumber();
    this.prefillWithDummyData();
    
    // Check and fill missing store data after initialization
    setTimeout(() => {
      this.checkAndFillMissingStoreData();
    }, 1000);
  }

  // Customer Modal Methods
  initializeCustomerForm() {
    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      customerPhone: [''],
      customerEmail: [''],
      customerAddress: [''],
      customerGstin: [''],
      customerCity: ['']
    });
  }

  openCustomerModal() {
    // Prefill customer modal with dummy data if empty
    if (!this.customerForm.get('customerName')?.value) {
      this.customerForm.patchValue({
        customerName: 'Jane Smith',
        customerPhone: '+91 98765 54321',
        customerEmail: 'jane.smith@email.com',
        customerAddress: '789 Residential Area, Suburb, Mumbai - 400003',
        customerGstin: '27FGHIJ5678K9L6',
        customerCity: 'Mumbai'
      });
    }
    this.showCustomerModal = true;
  }

  closeCustomerModal() {
    this.showCustomerModal = false;
    this.customerForm.reset();
  }

  saveCustomerDetails() {
    if (this.customerForm.valid) {
      this.invoiceForm.patchValue({
        buyerName: this.customerForm.value.customerName,
        buyerContact: this.customerForm.value.customerPhone,
        buyerAddress: this.customerForm.value.customerAddress
      });
      this.closeCustomerModal();
    }
  }

  // Tab Navigation
  isTabActive(tab: string): boolean {
    return this.activeTab === tab;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Store Configuration
  async loadStoreConfig() {
    try {
      const storeCode = this.supabase.getCurrentStore();
      this.storeCode = storeCode;
      
      if (storeCode) {
        // Get store details from Supabase directly
        const supabaseClient = this.supabase.getSupabaseClient();
        const { data: storeData, error } = await supabaseClient
          .from('megha_stores')
          .select('*')
          .eq('store_code', storeCode)
          .single();

        if (error) {
          this.setDummyStoreData();
          return;
        }

        if (storeData && storeData.store_name && storeData.address && storeData.support_phone) {
          this.invoiceForm.patchValue({
            storeName: storeData.store_name,
            storeAddress: storeData.address,
            storeContact: storeData.support_phone,
            storeGstin: storeData.tax_id || ''
          });
        } else {
          this.setDummyStoreData();
        }
      } else {
        this.setDummyStoreData();
      }
    } catch (error) {
      this.setDummyStoreData();
    }
  }

  private setDummyStoreData() {
    const dummyStoreData = {
      storeName: 'Megha Store',
      storeAddress: '456 Business District, Commercial Area, Mumbai - 400002',
      storeContact: '+91 98765 12340',
      storeGstin: '27ABCDE1234F1Z5'
    };
    
    this.invoiceForm.patchValue(dummyStoreData);
  }

  // Force refresh store data
  async refreshStoreData() {
    await this.loadStoreConfig();
  }

  // Invoice Number Generation
  generateInvoiceNumber() {
    const timestamp = Date.now().toString().slice(-6);
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const invoiceNumber = `INV-${timestamp}-${randomNum}`;
    this.invoiceForm.patchValue({ invoiceNumber });
  }

  getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Prefill with dummy data
  prefillWithDummyData() {
    // Check if form already has values
    const hasBuyerName = this.invoiceForm.get('buyerName')?.value;
    const hasItemDescription = this.invoiceForm.get('itemDescription')?.value;
    const hasRate = this.invoiceForm.get('rate')?.value;

    // Only prefill if form is empty
    if (!hasBuyerName && !hasItemDescription && !hasRate) {
      this.invoiceForm.patchValue({
        buyerName: 'John Doe',
        itemDescription: 'Premium Coffee Beans - Arabica Blend',
        quantity: 2,
        rate: 150.00,
        buyerAddress: '123 Main Street, City Center, Mumbai - 400001',
        buyerContact: '+91 98765 43210'
      });

      // Calculate initial totals
      this.calculateTotals();
    }
  }

  // Items Management
  addItem() {
    const newItem = this.fb.group({
      itemName: ['', Validators.required],
      rate: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      amount: [0],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      finalAmount: [0]
    });

    this.items.push(newItem);
    this.setupItemListeners(newItem, this.items.length - 1);
  }

  addSampleItem() {
    const sampleItem = this.fb.group({
      itemName: ['Coffee', Validators.required],
      rate: [82, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      amount: [82],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      finalAmount: [82]
    });

    this.items.push(sampleItem);
    this.setupItemListeners(sampleItem, 0);
    this.calculateTotals();
  }

  setupItemListeners(itemGroup: FormGroup, index: number) {
    itemGroup.get('rate')?.valueChanges.subscribe(() => this.updateItemAmount(itemGroup));
    itemGroup.get('quantity')?.valueChanges.subscribe(() => this.updateItemAmount(itemGroup));
    itemGroup.get('discount')?.valueChanges.subscribe(() => this.calculateItemTotal(index));
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.calculateTotals();
  }

  duplicateItem(index: number) {
    const itemToDuplicate = this.items.at(index);
    const duplicatedItem = this.fb.group({
      itemName: [itemToDuplicate.get('itemName')?.value, Validators.required],
      rate: [itemToDuplicate.get('rate')?.value, [Validators.required, Validators.min(0)]],
      quantity: [itemToDuplicate.get('quantity')?.value, [Validators.required, Validators.min(1)]],
      amount: [itemToDuplicate.get('amount')?.value],
      discount: [itemToDuplicate.get('discount')?.value, [Validators.min(0), Validators.max(100)]],
      finalAmount: [itemToDuplicate.get('finalAmount')?.value]
    });

    this.items.insert(index + 1, duplicatedItem);
    this.setupItemListeners(duplicatedItem, index + 1);
    this.calculateTotals();
  }

  updateItemAmount(itemGroup: FormGroup) {
    const rate = itemGroup.get('rate')?.value || 0;
    const quantity = itemGroup.get('quantity')?.value || 0;
    const amount = rate * quantity;
    
    itemGroup.patchValue({ amount }, { emitEvent: false });
    this.calculateItemTotal(this.items.controls.indexOf(itemGroup));
  }

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

  // Totals Calculation
  calculateTotals() {
    const items = this.items.value;
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
    const discountAmount = items.reduce((sum: number, item: any) => {
      const itemDiscount = (item.amount || 0) * (item.discount || 0) / 100;
      return sum + itemDiscount;
    }, 0);
    
    const sgstRate = 9; // 9% SGST
    const cgstRate = 9; // 9% CGST
    const taxableAmount = subtotal - discountAmount;
    const sgst = (taxableAmount * sgstRate) / 100;
    const cgst = (taxableAmount * cgstRate) / 100;
    const total = taxableAmount + sgst + cgst;

    this.invoiceForm.patchValue({
      subtotal: subtotal,
      discount: discountAmount,
      sgst: sgst,
      cgst: cgst,
      total: total,
      balanceDue: total // Explicitly set balanceDue
    });

  }

  get subtotal(): number {
    return this.invoiceForm.get('subtotal')?.value || 0;
  }

  get discountAmount(): number {
    return this.invoiceForm.get('discount')?.value || 0;
  }

  get sgstAmount(): number {
    return this.invoiceForm.get('sgst')?.value || 0;
  }

  get cgstAmount(): number {
    return this.invoiceForm.get('cgst')?.value || 0;
  }

  get totalAmount(): number {
    return this.invoiceForm.get('total')?.value || 0;
  }

  get balanceDue(): number {
    return this.totalAmount;
  }

  // Form Validation
  markFormGroupTouched() {
    Object.keys(this.invoiceForm.controls).forEach(key => {
      const control = this.invoiceForm.get(key);
      control?.markAsTouched();
    });
  }

  // Check if form has required store data
  hasRequiredStoreData(): boolean {
    const storeName = this.invoiceForm.get('storeName')?.value;
    const storeAddress = this.invoiceForm.get('storeAddress')?.value;
    const storeContact = this.invoiceForm.get('storeContact')?.value;
    
    return !!(storeName && storeAddress && storeContact);
  }

  // Check and fill missing store data with dummy values
  checkAndFillMissingStoreData() {
    const storeName = this.invoiceForm.get('storeName')?.value;
    const storeAddress = this.invoiceForm.get('storeAddress')?.value;
    const storeContact = this.invoiceForm.get('storeContact')?.value;
    
    if (!storeName || !storeAddress || !storeContact) {
      this.setDummyStoreData();
      return true; // Data was missing and filled
    }
    return false; // Data was already present
  }

  // Get form validation status
  getFormValidationStatus() {
    const storeValid = this.hasRequiredStoreData();
    const customerValid = this.invoiceForm.get('buyerName')?.valid;
    const itemValid = this.invoiceForm.get('itemDescription')?.valid && 
                     this.invoiceForm.get('rate')?.valid;
    
    return {
      store: storeValid,
      customer: customerValid,
      item: itemValid,
      overall: storeValid && customerValid && itemValid
    };
  }

  // Save Invoice
  async saveInvoice() {
    // Check and fill missing store data before validation
    this.checkAndFillMissingStoreData();
    
    // Check form validation status
    const validationStatus = this.getFormValidationStatus();
    
    if (!validationStatus.store) {
      this.error = 'Store information is required. Please ensure store details are loaded.';
      return;
    }
    
    if (!validationStatus.customer) {
      this.error = 'Customer information is required. Please enter customer name.';
      return;
    }
    
    if (!validationStatus.item) {
      this.error = 'Item information is required. Please enter item description and rate.';
      return;
    }

    if (this.invoiceForm.valid) {
      this.loading = true;
      this.error = null;

      const storeId = await this.supabase.getCurrentStoreId();
      
      if (!storeId) {
        this.error = 'Store ID not found. Please select a store first.';
        this.loading = false;
        return;
      }
      
      const invoiceData: Invoice = {
        invoiceNumber: this.invoiceForm.value.invoiceNumber,
        date: this.invoiceForm.value.date,
        storeId: storeId,
        storeName: this.invoiceForm.value.storeName,
        storeAddress: this.invoiceForm.value.storeAddress,
        storeContact: this.invoiceForm.value.storeContact,
        storeGstin: this.invoiceForm.value.storeGstin,
        buyerName: this.invoiceForm.value.buyerName,
        buyerAddress: this.invoiceForm.value.buyerAddress,
        buyerContact: this.invoiceForm.value.buyerContact,
        buyerGstin: this.invoiceForm.value.buyerGstin || '',
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
      
      const dbInvoiceData = {
        invoice_number: invoiceData.invoiceNumber,
        date: invoiceData.date,
        store_id: invoiceData.storeId,
        store_name: invoiceData.storeName,
        store_address: invoiceData.storeAddress,
        store_contact: invoiceData.storeContact,
        store_gstin: invoiceData.storeGstin,
        buyer_name: invoiceData.buyerName,
        buyer_address: invoiceData.buyerAddress,
        buyer_contact: invoiceData.buyerContact,
        buyer_gstin: invoiceData.buyerGstin || '',
        subtotal: invoiceData.subtotal,
        discount: invoiceData.discount,
        sgst: invoiceData.sgst,
        cgst: invoiceData.cgst,
        total: invoiceData.total,
        balance_due: invoiceData.balanceDue,
        payment_mode: invoiceData.paymentMode
      };

      const { data, error } = await supabaseClient
        .from('invoices')
        .insert([dbInvoiceData])
        .select();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      if (data && data.length > 0) {
        const invoiceId = data[0].id;
        await this.saveInvoiceItems(invoiceId);
      }

      this.loading = false;
      alert('Invoice saved successfully!');
      this.generateInvoiceNumber();
      this.showPreview = false;
    } catch (error) {
      this.loading = false;
      this.error = 'Failed to save invoice: ' + (error as Error).message;
      console.error('Error saving invoice:', error);
    }
  }

  private async saveInvoiceItems(invoiceId: number) {
    try {
      const supabaseClient = this.supabase.getSupabaseClient();
      const items = this.items.value;
      
      const invoiceItems = items.map((item: any, index: number) => {
        const quantity = item.quantity || 0;
        const rate = item.rate || 0;
        const discount = item.discount || 0;
        
        const amount = quantity * rate;
        const discountAmount = (amount * discount) / 100;
        const finalAmount = amount - discountAmount;
        
        return {
          invoice_id: invoiceId,
          item_name: item.itemName,
          rate: rate,
          quantity: quantity,
          amount: amount,
          discount: discount,
          final_amount: finalAmount,
          sort_order: index
        };
      });

      const { error } = await supabaseClient
        .from('invoice_items')
        .insert(invoiceItems);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving invoice items:', error);
      throw error;
    }
  }

  // Discount Column Toggle
  toggleDiscountColumn() {
    this.showDiscountColumn = !this.showDiscountColumn;
  }

  // Simplified Interface Methods
  goBack() {
    // add storeCode 
    this.router.navigate([`/${this.storeCode}/invoices`]);
  }

  clearForm() {
    this.invoiceForm.patchValue({
      buyerName: '',
      itemDescription: '',
      quantity: 1,
      rate: 0,
      buyerAddress: '',
      buyerContact: ''
    });
    this.calculateTotals();
  }


  // Manual store data setter
  setStoreDataManually() {
    this.invoiceForm.patchValue({
      storeName: 'Manual Store',
      storeAddress: '123 Manual Street, Test City, Mumbai - 400001',
      storeContact: '+91 99999 99999',
      storeGstin: '27MANUAL1234M1N2'
    });
  }

  // Get different dummy store options
  getDummyStoreOptions() {
    return [
      {
        name: 'Megha Store',
        address: '456 Business District, Commercial Area, Mumbai - 400002',
        contact: '+91 98765 12340',
        gstin: '27ABCDE1234F1Z5'
      },
      {
        name: 'Tech Solutions Store',
        address: '789 IT Park, Phase 2, Bangalore - 560001',
        contact: '+91 87654 32109',
        gstin: '29TECH5678T9E1C'
      },
      {
        name: 'Retail Hub',
        address: '321 Shopping Complex, Delhi - 110001',
        contact: '+91 76543 21098',
        gstin: '07RETAIL1234R5H6'
      }
    ];
  }

  // Set specific dummy store
  setSpecificDummyStore(storeIndex: number = 0) {
    const dummyStores = this.getDummyStoreOptions();
    const selectedStore = dummyStores[storeIndex] || dummyStores[0];
    
    this.invoiceForm.patchValue({
      storeName: selectedStore.name,
      storeAddress: selectedStore.address,
      storeContact: selectedStore.contact,
      storeGstin: selectedStore.gstin
    });
  }

  decreaseQuantity() {
    const currentQty = this.invoiceForm.get('quantity')?.value || 1;
    if (currentQty > 1) {
      this.invoiceForm.patchValue({ quantity: currentQty - 1 });
      this.calculateTotals();
      this.updateBalanceDue();
    }
  }

  increaseQuantity() {
    const currentQty = this.invoiceForm.get('quantity')?.value || 1;
    this.invoiceForm.patchValue({ quantity: currentQty + 1 });
    this.calculateTotals();
    this.updateBalanceDue();
  }

  // Update balance due when form values change
  updateBalanceDue() {
    const total = this.invoiceForm.get('total')?.value || 0;
    this.invoiceForm.patchValue({ balanceDue: total });
  }

  getItemPrice(): number {
    const quantity = this.invoiceForm.get('quantity')?.value || 0;
    const rate = this.invoiceForm.get('rate')?.value || 0;
    return quantity * rate;
  }

  getTotalAmount(): number {
    // For the simplified interface, use the item price
    const itemPrice = this.getItemPrice();
    
    // But also ensure the form totals are calculated
    this.calculateTotals();
    
    // Return the form total if available, otherwise item price
    const formTotal = this.invoiceForm.get('total')?.value;
    return formTotal || itemPrice;
  }

  saveDraft() {
    // Save as draft functionality
    // Implement draft saving logic
  }

  submitInvoice() {
    // Convert simple form to full invoice format
    const itemDescription = this.invoiceForm.get('itemDescription')?.value;
    const quantity = this.invoiceForm.get('quantity')?.value;
    const rate = this.invoiceForm.get('rate')?.value;
    
    // Create item from simple form
    const item = this.fb.group({
      itemName: [itemDescription, Validators.required],
      rate: [rate, [Validators.required, Validators.min(0)]],
      quantity: [quantity, [Validators.required, Validators.min(1)]],
      amount: [quantity * rate],
      discount: [0, [Validators.min(0), Validators.max(100)]],
      finalAmount: [quantity * rate]
    });

    // Clear existing items and add the new one
    this.items.clear();
    this.items.push(item);
    this.setupItemListeners(item, 0);
    
    // Calculate totals and ensure balanceDue is set
    this.calculateTotals();

    // Save the invoice
    this.saveInvoice();
  }

  // Preview and Actions
  previewInvoice() {
    this.showPreview = true;
  }

  shareInvoice() {
    const invoiceText = `Invoice ${this.invoiceForm.value.invoiceNumber} - ${this.invoiceForm.value.storeName}\nTotal: ₹${this.totalAmount}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${this.invoiceForm.value.invoiceNumber}`,
        text: invoiceText
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(invoiceText).then(() => {
        alert('Invoice details copied to clipboard!');
      });
    }
  }
}
