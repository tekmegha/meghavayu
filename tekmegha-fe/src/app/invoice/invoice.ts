import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './invoice.html',
  styleUrl: './invoice.scss',
  encapsulation: ViewEncapsulation.None
})
export class InvoiceComponent implements OnInit {
  currentRoute: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // This component will handle routing between create, edit, and view
    this.currentRoute = this.router.url;
  }

  // Navigation methods
  createInvoice() {
    this.router.navigate(['/invoices/create']);
  }

  viewInvoice(id: string) {
    this.router.navigate(['/invoices/view', id]);
  }

  editInvoice(id: string) {
    this.router.navigate(['/invoices/edit', id]);
  }

  // Check current route
  isCreateRoute(): boolean {
    return this.router.url.includes('/create');
  }

  isEditRoute(): boolean {
    return this.router.url.includes('/edit');
  }

  isViewRoute(): boolean {
    return this.router.url.includes('/view');
  }
}