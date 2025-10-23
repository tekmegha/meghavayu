import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../shared/services/supabase.service';

interface InvoiceItem {
  id: number;
  itemName: string;
  rate: number;
  quantity: number;
  amount: number;
  discount: number;
  finalAmount: number;
  sortOrder: number;
}

interface Invoice {
  id: number;
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
  subtotal: number;
  discount: number;
  sgst: number;
  cgst: number;
  total: number;
  balanceDue: number;
  paymentMode: string;
  createdAt: string;
  items: InvoiceItem[];
}

@Component({
  selector: 'app-invoice-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-view.component.html',
  styleUrl: './invoice-view.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InvoiceViewComponent implements OnInit {
  invoice: Invoice | null = null;
  invoiceId: string | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private supabase: SupabaseService
  ) {}

  ngOnInit() {
    this.invoiceId = this.route.snapshot.paramMap.get('id');
    if (this.invoiceId) {
      this.loadInvoice();
    } else {
      this.router.navigate(['/invoices']);
    }
  }

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

      // Transform data to match interface
      this.invoice = {
        id: invoiceData.id,
        invoiceNumber: invoiceData.invoice_number,
        date: invoiceData.date,
        storeId: invoiceData.store_id,
        storeName: invoiceData.store_name,
        storeAddress: invoiceData.store_address,
        storeContact: invoiceData.store_contact,
        storeGstin: invoiceData.store_gstin,
        buyerName: invoiceData.buyer_name,
        buyerAddress: invoiceData.buyer_address,
        buyerContact: invoiceData.buyer_contact,
        buyerGstin: invoiceData.buyer_gstin,
        subtotal: invoiceData.subtotal,
        discount: invoiceData.discount,
        sgst: invoiceData.sgst,
        cgst: invoiceData.cgst,
        total: invoiceData.total,
        balanceDue: invoiceData.balance_due,
        paymentMode: invoiceData.payment_mode,
        createdAt: invoiceData.created_at,
        items: itemsData.map((item: any) => ({
          id: item.id,
          itemName: item.item_name,
          rate: item.rate,
          quantity: item.quantity,
          amount: item.amount,
          discount: item.discount,
          finalAmount: item.final_amount,
          sortOrder: item.sort_order
        }))
      };

      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.error = 'Failed to load invoice: ' + (error as Error).message;
      console.error('Error loading invoice:', error);
    }
  }

  // Actions
  editInvoice() {
    if (this.invoiceId) {
      this.router.navigate(['/invoices/edit', this.invoiceId]);
    }
  }

  goBack() {
    this.router.navigate(['/invoices']);
  }

  shareInvoice() {
    if (!this.invoice) return;

    const invoiceText = `Invoice ${this.invoice.invoiceNumber} - ${this.invoice.storeName}\nTotal: ₹${this.invoice.total}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Invoice ${this.invoice.invoiceNumber}`,
        text: invoiceText
      });
    } else {
      navigator.clipboard.writeText(invoiceText).then(() => {
        alert('Invoice details copied to clipboard!');
      });
    }
  }

  printInvoice() {
    window.print();
  }

  async screenShotInvoice() {
    if (!this.invoice) return;

    try {
      // Show loading message
      const loadingMsg = document.createElement('div');
      loadingMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #007AFF; color: white; padding: 16px 24px; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 20px rgba(0,0,0,0.3);';
      loadingMsg.textContent = 'Capturing screenshot...';
      document.body.appendChild(loadingMsg);

      // Dynamic import of html2canvas to reduce bundle size
      const html2canvas = (await import('html2canvas')).default;
      
      const invoiceContent = document.querySelector('.invoice-document') as HTMLElement;
      
      if (!invoiceContent) {
        throw new Error('Invoice content not found');
      }

      const canvas = await html2canvas(invoiceContent, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob || !this.invoice) {
          throw new Error('Failed to create blob or invoice is null');
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice-${this.invoice.invoiceNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Remove loading message
        document.body.removeChild(loadingMsg);

        // Show success message
        const successMsg = document.createElement('div');
        successMsg.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #34c759; color: white; padding: 16px 24px; border-radius: 8px; z-index: 10000; box-shadow: 0 4px 20px rgba(0,0,0,0.3);';
        successMsg.textContent = 'Screenshot saved!';
        document.body.appendChild(successMsg);

        setTimeout(() => {
          document.body.removeChild(successMsg);
        }, 2000);
      }, 'image/png');
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      alert('Failed to capture screenshot. Please try again.');
    }
  }

  // Format date
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}
