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
  discount?: number;
  finalAmount?: number;
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
  selector: 'app-invoice-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './invoice-edit.component.html',
  styleUrl: './invoice-edit.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InvoiceEditComponent implements OnInit {
  invoiceForm: FormGroup;
  items: FormArray;
  customerForm!: FormGroup;
  showDiscountColumn = false;
  showCustomerModal = false;
  currentStore: any = null;
  invoiceId: string | null = null;
  originalInvoice: Invoice | null = null;

  // Tab navigation state
  activeTab = 'items';
  storeConfig: any = null;
  templateConfig: any = null;

  // Form state
  loading = false;
  error: string | null = null;
  showPreview = false;

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
      invoiceNumber: ['', Validators.required],
      date: ['', Validators.required],
      storeName: ['', Validators.required],
      storeAddress: ['', Validators.required],
      storeContact: ['', Validators.required],
      storeGstin: [''],
      buyerName: ['', Validators.required],
      buyerAddress: ['', Validators.required],
      buyerContact: ['', Validators.required],
      paymentMode: ['Cash', Validators.required],
      items: this.items
    });
  }

  ngOnInit() {
    this.invoiceId = this.route.snapshot.paramMap.get('id');
    if (this.invoiceId) {
      this.loadInvoice();
    } else {
      this.router.navigate(['/invoices']);
    }
  }

  // Load existing invoice
  async loadInvoice() {
    if (!this.invoiceId) return;

    try {
      this.loading = true;
      const supabaseClient = this.supabase.getSupabaseClient();

      // Load invoice data
      const { data: invoiceData, error: invoiceError } = await supabaseClient
        .from('invoices')
        .select('*')
        .eq('id', this.invoiceId)
        .single();

      if (invoiceError) throw invoiceError;

      // Load invoice items
      const { data: itemsData, error: itemsError } = await supabaseClient
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', this.invoiceId)
        .order('sort_order');

      if (itemsError) throw itemsError;

      // Populate form with invoice data
      this.invoiceForm.patchValue({
        invoiceNumber: invoiceData.invoice_number,
        date: invoiceData.date,
        storeName: invoiceData.store_name,
        storeAddress: invoiceData.store_address,
        storeContact: invoiceData.store_contact,
        storeGstin: invoiceData.store_gstin,
        buyerName: invoiceData.buyer_name,
        buyerAddress: invoiceData.buyer_address,
        buyerContact: invoiceData.buyer_contact,
        paymentMode: invoiceData.payment_mode
      });

      // Populate items
      this.items.clear();
      itemsData.forEach((item: any) => {
        const itemGroup = this.fb.group({
          id: [item.id],
          itemName: [item.item_name, Validators.required],
          rate: [item.rate, [Validators.required, Validators.min(0)]],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          amount: [item.amount],
          discount: [item.discount || 0, [Validators.min(0), Validators.max(100)]],
          finalAmount: [item.final_amount]
        });
        this.items.push(itemGroup);
        this.setupItemListeners(itemGroup, this.items.length - 1);
      });

      this.originalInvoice = invoiceData;
      this.calculateTotals();
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.error = 'Failed to load invoice: ' + (error as Error).message;
      console.error('Error loading invoice:', error);
    }
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
      total: total
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

  // Update Invoice
  async updateInvoice() {
    if (this.invoiceForm.valid && this.invoiceId) {
      this.loading = true;
      this.error = null;

      const storeId = await this.supabase.getCurrentStoreId();
      
      if (!storeId) {
        throw new Error('Store ID not found. Please select a store first.');
      }
      
      const invoiceData: Invoice = {
        id: parseInt(this.invoiceId),
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

      this.updateInvoiceInDatabase(invoiceData);
    } else {
      this.markFormGroupTouched();
    }
  }

  private async updateInvoiceInDatabase(invoiceData: Invoice) {
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

      console.log('Updating invoice data:', dbInvoiceData);
      
      // Update invoice
      const { error: invoiceError } = await supabaseClient
        .from('invoices')
        .update(dbInvoiceData)
        .eq('id', this.invoiceId);

      if (invoiceError) {
        console.error('Database error:', invoiceError);
        throw invoiceError;
      }

      // Update invoice items
      await this.updateInvoiceItems();

      this.loading = false;
      alert('Invoice updated successfully!');
      this.router.navigate(['/invoices']);
    } catch (error) {
      this.loading = false;
      this.error = 'Failed to update invoice: ' + (error as Error).message;
      console.error('Error updating invoice:', error);
    }
  }

  private async updateInvoiceItems() {
    if (!this.invoiceId) return;

    try {
      const supabaseClient = this.supabase.getSupabaseClient();
      
      // Delete existing items
      await supabaseClient
        .from('invoice_items')
        .delete()
        .eq('invoice_id', this.invoiceId);

      // Insert updated items
      const items = this.items.value;
      const invoiceItems = items.map((item: any, index: number) => {
        const quantity = item.quantity || 0;
        const rate = item.rate || 0;
        const discount = item.discount || 0;
        
        const amount = quantity * rate;
        const discountAmount = (amount * discount) / 100;
        const finalAmount = amount - discountAmount;
        
        return {
          invoice_id: parseInt(this.invoiceId!),
          item_name: item.itemName,
          rate: rate,
          quantity: quantity,
          amount: amount,
          discount: discount,
          final_amount: finalAmount,
          sort_order: index
        };
      });

      console.log('Updating invoice items:', invoiceItems);

      const { error } = await supabaseClient
        .from('invoice_items')
        .insert(invoiceItems);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating invoice items:', error);
      throw error;
    }
  }

  // Discount Column Toggle
  toggleDiscountColumn() {
    this.showDiscountColumn = !this.showDiscountColumn;
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
      navigator.clipboard.writeText(invoiceText).then(() => {
        alert('Invoice details copied to clipboard!');
      });
    }
  }

  // Navigation
  goBack() {
    this.router.navigate(['/invoices']);
  }
}
