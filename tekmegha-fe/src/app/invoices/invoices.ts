import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../shared/services/supabase.service';
import { StoreSessionService } from '../shared/services/store-session.service';
import { Invoice } from '../shared/interfaces/invoice.interface';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.scss']
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  loading = false;
  error: string | null = null;
  currentStore: any = null;
  templateConfig: any = null;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 0;

  // Filters
  searchTerm = '';
  dateFrom = '';
  dateTo = '';
  statusFilter = 'all';
  showFilters = false;

  constructor(
    private supabase: SupabaseService,
    private storeSession: StoreSessionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStoreInfo();
    // Don't call loadInvoices() here - it will be called when store is loaded
  }

  private loadStoreInfo() {
    this.storeSession.selectedStore$.subscribe(store => {
      if (store) {
        this.currentStore = store;
        this.loadTemplateConfig();
        this.loadInvoices(); // Load invoices when store is available
      } else {
        this.error = 'No store selected. Please select a store first.';
        this.loading = false;
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
      }
    } catch (error) {
      console.error('Error loading template configuration:', error);
    }
  }

  async loadInvoices() {
    console.log('Loading invoices...', { currentStore: this.currentStore });
    
    if (!this.currentStore) {
      console.log('No current store found');
      this.error = 'Store context not found. Please select a store.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const storeId = this.currentStore.storeId;
      console.log('Loading invoices for store ID:', storeId);
      
      // Check if Supabase is ready
      if (!this.supabase.isSupabaseReady()) {
        console.log('Supabase not ready, waiting...');
        await new Promise(resolve => setTimeout(resolve, 100));
        if (!this.supabase.isSupabaseReady()) {
          console.error('Supabase client not ready');
          this.error = 'Database connection not ready. Please try again.';
          this.loading = false;
          return;
        }
      }
      
      let query = this.supabase.getSupabaseClient()
        .from('invoices')
        .select(`
          *,
          invoice_items (
            id,
            item_name,
            rate,
            quantity,
            amount
          )
        `)
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (this.searchTerm) {
        query = query.or(`invoice_number.ilike.%${this.searchTerm}%,buyer_name.ilike.%${this.searchTerm}%`);
      }

      if (this.dateFrom) {
        query = query.gte('date', this.dateFrom);
      }

      if (this.dateTo) {
        query = query.lte('date', this.dateTo);
      }

      if (this.statusFilter !== 'all') {
        if (this.statusFilter === 'paid') {
          query = query.eq('balance_due', 0);
        } else if (this.statusFilter === 'unpaid') {
          query = query.gt('balance_due', 0);
        }
      }

      // Apply pagination
      const from = (this.currentPage - 1) * this.itemsPerPage;
      const to = from + this.itemsPerPage - 1;

      const { data, error, count } = await query
        .range(from, to);

      if (error) {
        throw error;
      }

      console.log('Invoices loaded:', data);
      console.log('Total count:', count);
      
      // Map database field names to interface field names
      this.invoices = (data || []).map((invoice: any) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        date: invoice.date,
        storeId: invoice.store_id,
        storeName: invoice.store_name,
        storeAddress: invoice.store_address,
        storeContact: invoice.store_contact,
        storeGstin: invoice.store_gstin,
        buyerName: invoice.buyer_name,
        buyerAddress: invoice.buyer_address,
        buyerContact: invoice.buyer_contact,
        buyerGstin: invoice.buyer_gstin,
        items: invoice.invoice_items || [],
        subtotal: invoice.subtotal,
        discount: invoice.discount,
        sgst: invoice.sgst,
        cgst: invoice.cgst,
        total: invoice.total,
        balanceDue: invoice.balance_due,
        paymentMode: invoice.payment_mode,
        createdAt: invoice.created_at,
        updatedAt: invoice.updated_at
      }));
      
      this.totalItems = count || 0;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      console.log('Invoices after processing:', this.invoices.length, 'invoices');

    } catch (error) {
      console.error('Error loading invoices:', error);
      
      // Check if it's a table not found error
      if (error && typeof error === 'object' && 'code' in error && error.code === 'PGRST205') {
        this.error = 'Invoice tables not found. Please run the database setup first.';
        console.log('Database tables not created yet. Showing setup message.');
      } else {
        this.error = 'Failed to load invoices. Please try again.';
      }
    } finally {
      this.loading = false;
    }
  }

  createNewInvoice() {
    const storeCode = this.getCurrentStoreCode();
    
    // Navigate to store-specific invoice route if store code exists
    if (storeCode) {
      this.router.navigate([`/${storeCode}/invoice/new`]);
    } else {
      // Fallback to global route
      this.router.navigate(['/invoice/new']);
    }
  }

  editInvoice(invoiceId: number | undefined) {
    if (invoiceId) {
      const storeCode = this.getCurrentStoreCode();
      if (storeCode) {
        this.router.navigate([`/${storeCode}/invoice/edit`, invoiceId]);
      } else {
        this.router.navigate(['/invoice/edit', invoiceId]);
      }
    }
  }

  viewInvoice(invoiceId: number | undefined) {
    if (invoiceId) {
      const storeCode = this.getCurrentStoreCode();
      if (storeCode) {
        this.router.navigate([`/${storeCode}/invoice/view`, invoiceId]);
      } else {
        this.router.navigate(['/invoice/view', invoiceId]);
      }
    }
  }

  async deleteInvoice(invoiceId: number | undefined) {
    if (!invoiceId) return;
    
    if (!confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      const { error } = await this.supabase.getSupabaseClient()
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) {
        throw error;
      }

      this.loadInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      this.error = 'Failed to delete invoice. Please try again.';
    }
  }

  async printInvoice(invoiceId: number | undefined) {
    if (invoiceId) {
      const storeCode = this.getCurrentStoreCode();
      // Open print view in new window with store context
      const printUrl = storeCode ? `/${storeCode}/invoice/print/${invoiceId}` : `/invoice/print/${invoiceId}`;
      window.open(printUrl, '_blank');
    }
  }

  applyFilters() {
    this.currentPage = 1;
    this.loadInvoices();
  }

  clearFilters() {
    this.searchTerm = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.statusFilter = 'all';
    this.currentPage = 1;
    this.loadInvoices();
  }

  // Search functionality
  searchInvoices() {
    this.currentPage = 1;
    this.loadInvoices();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadInvoices();
    }
  }

  getStatusClass(balanceDue: number): string {
    if (balanceDue === 0) {
      return 'status-paid';
    } else {
      return 'status-unpaid';
    }
  }

  getStatusText(balanceDue: number): string {
    if (balanceDue === 0) {
      return 'Paid';
    } else {
      return 'Unpaid';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN');
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getEndItemNumber(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  private getCurrentStoreCode(): string {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment);
    
    // Extract store code from current URL
    if (pathSegments.length > 0) {
      const potentialStoreCode = pathSegments[0];
      const globalRoutes = ['home', 'menu', 'cart', 'stores', 'profile', 'login', 'inventory', 'invoice', 'insurances', 'tekmegha-clients', 'inventory-login'];
      
      if (!globalRoutes.includes(potentialStoreCode)) {
        return potentialStoreCode;
      }
    }
    
    return '';
  }
}
