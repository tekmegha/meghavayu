import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../shared/services/supabase.service';
import { Subscription } from 'rxjs';

export interface TekMeghaClient {
  Expiry_Date: string;
  id: string;
  client_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string; 
  Product_Type: string;
  tm_billing_month: number; // Month number (1-12) for billing
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
  Product_Details: string;
  website: string;
  tekmegha_client_id: number;
  Provider: string;
  ID: number;
}

export interface ClientStats {
  total_clients: number;
  active_clients: number;
  pending_renewals: number;
  expiring_this_month: number;
  expiring_next_month: number;
}

export interface BillingMonth {
  month: string;
  monthNumber: number;
  year: number;
  clients: TekMeghaClient[]; // Clients expiring in this month
  billingClients: TekMeghaClient[]; // Clients with billing in this month
  groupedBillingClients: GroupedBillingClient[]; // Grouped clients with combined products
  isCurrentMonth: boolean;
}

export interface GroupedBillingClient {
website: any;
  client_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  tm_billing_month: number;
  products: string[]; // Combined products for this client
  status: 'active' | 'inactive' | 'pending';
  client_count: number; // Number of individual client records
}

export interface UniqueWebsite {
  client_name: string;
  website: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: 'active' | 'inactive' | 'pending';
  products: string[]; // All products for this client
  product_count: number; // Number of products
  tekmegha_client_id: number;
}

@Component({
  selector: 'app-tekmegha-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tekmegha-clients.html',
  styleUrls: ['./tekmegha-clients.scss']
})
export class TekMeghaClientsComponent implements OnInit, OnDestroy {
  clients: TekMeghaClient[] = [];
  filteredClients: TekMeghaClient[] = [];
  uniqueWebsites: UniqueWebsite[] = [];
  filteredUniqueWebsites: UniqueWebsite[] = [];
  stats: ClientStats = {
    total_clients: 0,
    active_clients: 0,
    pending_renewals: 0,
    expiring_this_month: 0,
    expiring_next_month: 0
  };
  currentView: 'table' | 'websites' | 'billing' = 'billing'; // Default to billing calendar view
  billingMonths: BillingMonth[] = [];
   
  isLoading = true;
  searchTerm = '';
  statusFilter = 'all';
  renewalFilter = 'all';
  sortBy = 'tekmegha_client_id';
  sortOrder: 'asc' | 'desc' = 'asc';
  
  private subscription = new Subscription();

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.waitForSupabaseAndLoad();
    
    // Generate billing months on component initialization
    if (this.currentView === 'billing') {
      this.generateBillingMonths();
    }
  }

  private async waitForSupabaseAndLoad() {
    // Wait for Supabase to be ready
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      if (this.supabaseService.isSupabaseReady()) {
        await this.loadClients();
        return;
      }
      
      // Wait 100ms before trying again
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    console.error('Supabase failed to initialize after maximum attempts');
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  async loadClients() {
    try {
      this.isLoading = true;
      
      // Check if Supabase is ready
      if (!this.supabaseService.isSupabaseReady()) {
        console.error('Supabase is not ready yet');
        return;
      }
      
      const { data, error } = await this.supabaseService.getSupabaseClient()
        .from('tekmegha_all_clients')
        .select('*')
        .order('client_name');

      if (error) {
        console.error('Error loading clients:', error);
        if (error.code === 'PGRST116') {
          console.error('Table tekmegha_all_clients does not exist');
          // Load sample data for testing
          this.loadSampleData();
        }
        return;
      }

      this.clients = data || [];
      this.filteredClients = [...this.clients];
      this.generateUniqueWebsites();
      this.filteredUniqueWebsites = [...this.uniqueWebsites];
      this.calculateStats();
      
      // Regenerate billing months with new data
      if (this.currentView === 'billing') {
        this.generateBillingMonths();
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      this.isLoading = false;
    }
  }

  calculateStats() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    this.stats = {
      total_clients: this.clients.length,
      active_clients: this.clients.filter(c => c.status === 'active').length,
      pending_renewals: this.clients.filter(c => c.status === 'pending').length,
      expiring_this_month: this.clients.filter(c => {
        const expiryDate = this.parseDate(c.Expiry_Date);
        return expiryDate.getMonth() === currentMonth && 
               expiryDate.getFullYear() === currentYear;
      }).length,
      expiring_next_month: this.clients.filter(c => {
        const expiryDate = this.parseDate(c.Expiry_Date);
        return expiryDate.getMonth() === nextMonth && 
               expiryDate.getFullYear() === nextYear;
      }).length
    };
  }

  filterClients() {
    this.filteredClients = this.clients.filter(client => {
      // Search filter
      const matchesSearch = !this.searchTerm || 
        client.client_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.contact_person.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.phone.includes(this.searchTerm);

      // Status filter
      const matchesStatus = this.statusFilter === 'all' || client.status === this.statusFilter;

      // Expiry filter
      let matchesExpiry = true;
      if (this.renewalFilter !== 'all') {
        const expiryDate = this.parseDate(client.Expiry_Date);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        switch (this.renewalFilter) {
          case 'expired':
            matchesExpiry = daysUntilExpiry < 0;
            break;
          case 'this_month':
            matchesExpiry = expiryDate.getMonth() === now.getMonth() && 
                           expiryDate.getFullYear() === now.getFullYear();
            break;
          case 'next_month':
            const nextMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
            const nextYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
            matchesExpiry = expiryDate.getMonth() === nextMonth && 
                           expiryDate.getFullYear() === nextYear;
            break;
          case 'next_3_months':
            const threeMonthsFromNow = new Date(now);
            threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
            matchesExpiry = expiryDate <= threeMonthsFromNow && expiryDate >= now;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesExpiry;
    });

    this.sortClients();
  }

  sortClients() {
    this.filteredClients.sort((a, b) => {
      let aValue: any = a[this.sortBy as keyof TekMeghaClient];
      let bValue: any = b[this.sortBy as keyof TekMeghaClient];

      if (this.sortBy === 'Expiry_Date') {
        aValue = this.parseDate(aValue);
        bValue = this.parseDate(bValue);
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSearchChange() {
    this.filterClients();
    if (this.currentView === 'websites') {
      this.filterUniqueWebsites();
    }
  }

  onStatusFilterChange() {
    this.filterClients();
    if (this.currentView === 'websites') {
      this.filterUniqueWebsites();
    }
  }

  onRenewalFilterChange() {
    this.filterClients();
    // Note: Renewal filter doesn't apply to websites view since it's about unique clients
  }

  onSort(column: string) {
    if (this.sortBy === column) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
    
    if (this.currentView === 'websites') {
      this.sortUniqueWebsites();
    } else {
      this.sortClients();
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'inactive': return 'status-inactive';
      case 'pending': return 'status-pending';
      default: return 'status-unknown';
    }
  }

  getRenewalStatus(expiryDate: string): { status: string; class: string; days: number } {
    const expiry = this.parseDate(expiryDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { status: 'Expired', class: 'renewal-expired', days: Math.abs(daysUntilExpiry) };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'Expires Soon', class: 'renewal-due-soon', days: daysUntilExpiry };
    } else if (daysUntilExpiry <= 90) {
      return { status: 'Expires Soon', class: 'renewal-upcoming', days: daysUntilExpiry };
    } else {
      return { status: 'Active', class: 'renewal-active', days: daysUntilExpiry };
    }
  }

  formatDate(dateString: string): string {
    const date = this.parseDate(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  trackByClientId(index: number, client: TekMeghaClient): string {
    return client.id;
  }

  trackByUniqueWebsite(index: number, website: UniqueWebsite): string {
    return website.client_name.toLowerCase();
  }

  trackByBillingMonth(index: number, billingMonth: BillingMonth): string {
    return `${billingMonth.year}-${billingMonth.monthNumber}`;
  }

  /**
   * Parse date string in YYYY-MM-DD format to Date object
   * Handles timezone issues by adding time component
   */
  private parseDate(dateString: string): Date {
    // Handle YYYY-MM-DD format by adding time to avoid timezone issues
    return new Date(dateString + 'T00:00:00');
  }

  private loadSampleData() {
    // Sample data for testing when table doesn't exist
    this.clients = [
      {
        id: '20',
        client_name: 'cctvdevice.com',
        contact_person: 'John Doe',
        email: 'info@cctvdevice.com',
        phone: '1234567890',
        address: '123 Main St, City',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        Expiry_Date: '2026-03-24',
        Product_Type: 'Domain',
        tm_billing_month: 1, // January billing
        status: 'active',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-10-01T15:30:00Z',
        Product_Details: 'No Protection',
        website: 'CCTVDEVICECOM',
        tekmegha_client_id: 7,
        Provider: 'GoDaddy',
        ID: 20
      },
      {
        id: '21',
        client_name: 'Dental Castle',
        contact_person: 'Jane Smith',
        email: 'contact@dentalcastle.com',
        phone: '9876543210',
        address: '456 Dental Ave, City',
        city: 'San Francisco',
        state: 'CA',
        pincode: '94105',
        Expiry_Date: '2026-03-24',
        Product_Type: 'Domain',
        tm_billing_month: 10, // October billing
        status: 'active',
        created_at: '2024-02-20T09:15:00Z',
        updated_at: '2024-09-15T11:45:00Z',
        Product_Details: '',
        website: '',
        tekmegha_client_id: 6,
        Provider: 'GoDaddy',
        ID: 21
      },
      {
        id: '3',
        client_name: 'GENCET',
        contact_person: 'Rajesh Kumar',
        email: 'rajesh@gencet.com',
        phone: '+1-555-0123',
        address: '789 Corporate Blvd',
        city: 'Chicago',
        state: 'IL',
        pincode: '60601',
        Expiry_Date: '2027-02-25',
        Product_Type: 'Email',
        tm_billing_month: 9, // September billing
        status: 'active',
        created_at: '2024-03-10T14:20:00Z',
        updated_at: '2024-09-30T16:10:00Z',
        Product_Details: 'Individual Professional Email (rajesh@gencet.com)',
        website: 'GENCET',
        tekmegha_client_id: 5,
        Provider: 'GoDaddy',
        ID: 3
      },
      {
        id: '4',
        client_name: 'GENCET',
        contact_person: 'Kv Ramana',
        email: 'kvramana@gencet.com',
        phone: '+1-555-0456',
        address: '321 Tech Park',
        city: 'Austin',
        state: 'TX',
        pincode: '73301',
        Expiry_Date: '2027-02-25',
        Product_Type: 'Email',
        tm_billing_month: 9, // September billing
        status: 'active',
        created_at: '2024-04-15T11:30:00Z',
        updated_at: '2024-08-20T14:15:00Z',
        Product_Details: 'Individual Professional Email (kvramana@gencet.com)',
        website: 'GENCET',
        tekmegha_client_id: 5,
        Provider: 'GoDaddy',
        ID: 4
      },
      {
        id: '5',
        client_name: 'GENCET',
        contact_person: 'GENCET Admin',
        email: 'admin@gencet.com',
        phone: '+1-555-0789',
        address: '654 Future Lane',
        city: 'Seattle',
        state: 'WA',
        pincode: '98101',
        Expiry_Date: '2028-09-25',
        Product_Type: 'Email',
        tm_billing_month: 9, // September billing
        status: 'active',
        created_at: '2024-05-10T16:45:00Z',
        updated_at: '2024-09-25T10:20:00Z',
        Product_Details: 'Professional Email Pro Light (New Account)',
        website: 'GENCET',
        tekmegha_client_id: 5,
        Provider: 'GoDaddy',
        ID: 5
      },
      {
        id: '1',
        client_name: 'GENCET',
        contact_person: 'GENCET Admin',
        email: 'admin@gencet.com',
        phone: '+1-555-0789',
        address: '654 Future Lane',
        city: 'Seattle',
        state: 'WA',
        pincode: '98101',
        Expiry_Date: '2028-04-26',
        Product_Type: 'Web Hosting',
        tm_billing_month: 9, // September billing
        status: 'active',
        created_at: '2024-05-10T16:45:00Z',
        updated_at: '2024-09-25T10:20:00Z',
        Product_Details: 'Web Hosting Deluxe',
        website: 'GENCET',
        tekmegha_client_id: 5,
        Provider: 'GoDaddy',
        ID: 1
      },
      {
        id: '2',
        client_name: 'GENCET',
        contact_person: 'GENCET Admin',
        email: 'admin@gencet.com',
        phone: '+1-555-0789',
        address: '654 Future Lane',
        city: 'Seattle',
        state: 'WA',
        pincode: '98101',
        Expiry_Date: '2027-02-25',
        Product_Type: 'Domain Protection',
        tm_billing_month: 9, // September billing
        status: 'active',
        created_at: '2024-05-10T16:45:00Z',
        updated_at: '2024-09-25T10:20:00Z',
        Product_Details: 'Full Domain Protection',
        website: 'GENCET',
        tekmegha_client_id: 5,
        Provider: 'GoDaddy',
        ID: 2
      },
      {
        id: '7',
        client_name: 'Genflyers',
        contact_person: 'Genflyers Admin',
        email: 'admin@genflyers.com',
        phone: '+1-555-0321',
        address: '321 Tech Park',
        city: 'Austin',
        state: 'TX',
        pincode: '73301',
        Expiry_Date: '2026-08-23',
        Product_Type: 'Email',
        tm_billing_month: 9, // September billing
        status: 'active',
        created_at: '2024-04-15T11:30:00Z',
        updated_at: '2024-08-20T14:15:00Z',
        Product_Details: 'Business Starter Email Trial (genflyers.com)',
        website: 'GENFLYERS',
        tekmegha_client_id: 4,
        Provider: 'Hostinger',
        ID: 7
      },
      {
        id: '6',
        client_name: 'Genflyers',
        contact_person: 'Genflyers Admin',
        email: 'admin@genflyers.com',
        phone: '+1-555-0321',
        address: '321 Tech Park',
        city: 'Austin',
        state: 'TX',
        pincode: '73301',
        Expiry_Date: '2026-08-23',
        Product_Type: 'Domain',
        tm_billing_month: 9, // September billing
        status: 'active',
        created_at: '2024-04-15T11:30:00Z',
        updated_at: '2024-08-20T14:15:00Z',
        Product_Details: '.COM Domain Registration (genflyers.com)',
        website: 'GENFLYERS',
        tekmegha_client_id: 4,
        Provider: 'Hostinger',
        ID: 6
      },
      {
        id: '8',
        client_name: 'KKR Jobs',
        contact_person: 'KKR Jobs Admin',
        email: 'admin@kkrjobs.com',
        phone: '+1-555-0123',
        address: '123 Business St',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        Expiry_Date: '2027-03-29',
        Product_Type: 'Domain',
        tm_billing_month: 5, // May billing
        status: 'active',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-10-01T15:30:00Z',
        Product_Details: '.COM Domain Registration (KKRJOBS.COM)',
        website: 'KKRJOBS',
        tekmegha_client_id: 3,
        Provider: 'GoDaddy',
        ID: 8
      },
      {
        id: '9',
        client_name: 'Mycastle',
        contact_person: 'Mycastle Admin',
        email: 'admin@mycastle.com',
        phone: '+1-555-0456',
        address: '456 Innovation Ave',
        city: 'San Francisco',
        state: 'CA',
        pincode: '94105',
        Expiry_Date: '2028-09-26',
        Product_Type: 'Domain',
        tm_billing_month: 10, // October billing
        status: 'active',
        created_at: '2024-02-20T09:15:00Z',
        updated_at: '2024-09-15T11:45:00Z',
        Product_Details: 'No Protection',
        website: 'MYCASTLE',
        tekmegha_client_id: 11,
        Provider: 'GoDaddy',
        ID: 9
      },
      {
        id: '11',
        client_name: 'SpaceV Designs',
        contact_person: 'SpaceV Admin',
        email: 'admin@spacevdesigns.com',
        phone: '+1-555-0789',
        address: '789 Corporate Blvd',
        city: 'Chicago',
        state: 'IL',
        pincode: '60601',
        Expiry_Date: '2026-05-23',
        Product_Type: 'Domain',
        tm_billing_month: 5, // May billing
        status: 'active',
        created_at: '2024-03-10T14:20:00Z',
        updated_at: '2024-09-30T16:10:00Z',
        Product_Details: '.COM Domain Registration (SPACEVDESIGNS.COM)',
        website: 'SPACEVDESIGNS',
        tekmegha_client_id: 2,
        Provider: 'GoDaddy',
        ID: 11
      },
      {
        id: '10',
        client_name: 'SpaceV Designs',
        contact_person: 'SpaceV Admin',
        email: 'admin@spacevdesigns.com',
        phone: '+1-555-0789',
        address: '789 Corporate Blvd',
        city: 'Chicago',
        state: 'IL',
        pincode: '60601',
        Expiry_Date: '2026-04-03',
        Product_Type: 'Email',
        tm_billing_month: 5, // May billing
        status: 'active',
        created_at: '2024-03-10T14:20:00Z',
        updated_at: '2024-09-30T16:10:00Z',
        Product_Details: 'Professional Email (individualarchitect@spacevdesigns.com)',
        website: 'SPACEVDESIGNS',
        tekmegha_client_id: 2,
        Provider: 'GoDaddy',
        ID: 10
      },
      {
        id: '12',
        client_name: 'Srivenkateswara Engineering',
        contact_person: 'Srivenkateswara Admin',
        email: 'admin@srivenkateswaraengineering.com',
        phone: '+1-555-0321',
        address: '321 Tech Park',
        city: 'Austin',
        state: 'TX',
        pincode: '73301',
        Expiry_Date: '2027-10-19',
        Product_Type: 'Domain',
        tm_billing_month: 5, // May billing
        status: 'active',
        created_at: '2024-04-15T11:30:00Z',
        updated_at: '2024-08-20T14:15:00Z',
        Product_Details: '.IN Domain Registration (SRIVENKATESWARAENGINEERINGWORKS.IN)',
        website: 'SRIVENKATESWARAENGINEERING',
        tekmegha_client_id: 0,
        Provider: 'GoDaddy',
        ID: 12
      },
      {
        id: '14',
        client_name: 'Tekmegha',
        contact_person: 'Tekmegha Admin',
        email: 'admin@tekmegha.com',
        phone: '+1-555-0654',
        address: '654 Future Lane',
        city: 'Seattle',
        state: 'WA',
        pincode: '98101',
        Expiry_Date: '2029-10-23',
        Product_Type: 'Hosting',
        tm_billing_month: 1, // January billing
        status: 'active',
        created_at: '2024-05-10T16:45:00Z',
        updated_at: '2024-09-25T10:20:00Z',
        Product_Details: 'Business Web Hosting (tekmegha.com)',
        website: 'TEKMEGHA',
        tekmegha_client_id: 0,
        Provider: 'Hostinger',
        ID: 14
      },
      {
        id: '13',
        client_name: 'Tekmegha',
        contact_person: 'Tekmegha Admin',
        email: 'admin@tekmegha.com',
        phone: '+1-555-0654',
        address: '654 Future Lane',
        city: 'Seattle',
        state: 'WA',
        pincode: '98101',
        Expiry_Date: '2027-04-10',
        Product_Type: 'Domain',
        tm_billing_month: 1, // January billing
        status: 'active',
        created_at: '2024-05-10T16:45:00Z',
        updated_at: '2024-09-25T10:20:00Z',
        Product_Details: '.COM Domain Registration (TEKMEGHA.COM)',
        website: 'TEKMEGHA',
        tekmegha_client_id: 0,
        Provider: 'GoDaddy',
        ID: 13
      },
      {
        id: '17',
        client_name: 'VRK Greens',
        contact_person: 'VRK Greens Admin',
        email: 'admin@vrkgreens.com',
        phone: '+1-555-0123',
        address: '123 Business St',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        Expiry_Date: '2026-03-16',
        Product_Type: 'Hosting',
        tm_billing_month: 5, // May billing
        status: 'active',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-10-01T15:30:00Z',
        Product_Details: 'Windows Hosting Ultimate (vrkgreens.in)',
        website: 'VRKGREENS',
        tekmegha_client_id: 1,
        Provider: 'GoDaddy',
        ID: 17
      },
      {
        id: '18',
        client_name: 'VRK Greens',
        contact_person: 'VRK Greens Admin',
        email: 'admin@vrkgreens.com',
        phone: '+1-555-0123',
        address: '123 Business St',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        Expiry_Date: '2028-01-10',
        Product_Type: 'Domain',
        tm_billing_month: 5, // May billing
        status: 'active',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-10-01T15:30:00Z',
        Product_Details: '.IN Domain Registration (VRKGREENS.IN)',
        website: 'VRKGREENS',
        tekmegha_client_id: 1,
        Provider: 'GoDaddy',
        ID: 18
      },
      {
        id: '19',
        client_name: 'VRK Greens',
        contact_person: 'VRK Greens Admin',
        email: 'admin@vrkgreens.com',
        phone: '+1-555-0123',
        address: '123 Business St',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        Expiry_Date: '2028-07-17',
        Product_Type: 'Domain',
        tm_billing_month: 5, // May billing
        status: 'active',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-10-01T15:30:00Z',
        Product_Details: '.COM Domain Registration (VRKGREENS.COM)',
        website: 'VRKGREENS',
        tekmegha_client_id: 1,
        Provider: 'GoDaddy',
        ID: 19
      },
      {
        id: '15',
        client_name: 'VRK Greens',
        contact_person: 'VRK Greens Admin',
        email: 'admin@vrkgreens.com',
        phone: '+1-555-0123',
        address: '123 Business St',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        Expiry_Date: '2026-12-25',
        Product_Type: 'Email',
        tm_billing_month: 5, // May billing
        status: 'active',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-10-01T15:30:00Z',
        Product_Details: 'Microsoft 365 Email Essentials (hr@vrkgreens.com)',
        website: 'VRKGREENS',
        tekmegha_client_id: 1,
        Provider: 'GoDaddy',
        ID: 15
      },
      {
        id: '16',
        client_name: 'VRK Greens',
        contact_person: 'VRK Greens Admin',
        email: 'admin@vrkgreens.com',
        phone: '+1-555-0123',
        address: '123 Business St',
        city: 'New York',
        state: 'NY',
        pincode: '10001',
        Expiry_Date: '2026-05-14',
        Product_Type: 'Email',
        tm_billing_month: 5, // May billing
        status: 'active',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-10-01T15:30:00Z',
        Product_Details: 'Microsoft 365 Email Essentials (info@vrkgreens.com)',
        website: 'VRKGREENS',
        tekmegha_client_id: 1,
        Provider: 'GoDaddy',
        ID: 16
      }
    ];
    
    this.filteredClients = [...this.clients];
    this.generateUniqueWebsites();
    this.filteredUniqueWebsites = [...this.uniqueWebsites];
    this.calculateStats();
    
    // Regenerate billing months with sample data
    if (this.currentView === 'billing') {
      this.generateBillingMonths();
    }
  }

  setView(view: 'table' | 'websites' | 'billing') {
    this.currentView = view;
    if (view === 'billing') {
      this.generateBillingMonths();
    } else if (view === 'websites') {
      this.filterUniqueWebsites();
    }
  }

  generateBillingMonths() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    this.billingMonths = [];
    
    // Generate 12 months starting from current month
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(currentYear, currentMonth + i, 1);
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
      const monthNumber = monthDate.getMonth();
      const year = monthDate.getFullYear();
      
      // Find clients that expire in this month (based on Expiry_Date)
      const clientsExpiringInMonth = this.clients.filter(client => {
        const expiryDate = this.parseDate(client.Expiry_Date);
        return expiryDate.getMonth() === monthNumber && 
               expiryDate.getFullYear() === year;
      });
      
      // Find clients that have billing in this month (based on tm_billing_month)
      const clientsBillingInMonth = this.clients.filter(client => {
        return client.tm_billing_month === (monthNumber + 1); // Convert 0-11 to 1-12
      });
      
      // Group billing clients by client_name and combine their products
      const groupedBillingClients = this.groupBillingClients(clientsBillingInMonth);
      
      this.billingMonths.push({
        month: monthName,
        monthNumber: monthNumber,
        year: year,
        clients: clientsExpiringInMonth,
        billingClients: clientsBillingInMonth,
        groupedBillingClients: groupedBillingClients,
        isCurrentMonth: i === 0
      });
    }
  }

  getBillingMonthClass(billingMonth: BillingMonth): string {
    if (billingMonth.isCurrentMonth) {
      return 'current-month';
    } else if (billingMonth.clients.length === 0) {
      return 'no-clients';
    } else {
      return 'has-clients';
    }
  }

  getBillingMonthStatus(billingMonth: BillingMonth): string {
    if (billingMonth.isCurrentMonth) {
      return 'Current Month';
    } else if (billingMonth.clients.length === 0 && billingMonth.billingClients.length === 0) {
      return 'No Payments Due';
    } else {
      const totalClients = billingMonth.clients.length + billingMonth.billingClients.length;
      return `${totalClients} Client${totalClients === 1 ? '' : 's'} Due`;
    }
  }

  groupBillingClients(clients: TekMeghaClient[]): GroupedBillingClient[] {
    const groupedMap = new Map<string, GroupedBillingClient>();
    
    clients.forEach(client => {
      const key = client.client_name.toLowerCase();
      
      if (groupedMap.has(key)) {
        const existing = groupedMap.get(key)!;
        if (!existing.products.includes(client.Product_Type)) {
          existing.products.push(client.Product_Type);
        }
        existing.client_count++;
      } else {
        groupedMap.set(key, {
          website: client.website,
          client_name: client.client_name,
          contact_person: client.contact_person,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: client.city,
          state: client.state,
          pincode: client.pincode,
          tm_billing_month: client.tm_billing_month,
          products: [client.Product_Type],
          status: client.status,
          client_count: 1
        });
      }
    });
    
    return Array.from(groupedMap.values());
  }

  trackByGroupedClient(index: number, client: GroupedBillingClient): string {
    return client.client_name.toLowerCase();
  }

  getProductsList(products: string[]): string {
    return Array.isArray(products) ? products.join(', ') : products || 'N/A';
  }

  generateUniqueWebsites() {
    const uniqueMap = new Map<string, UniqueWebsite>();
    
    this.clients.forEach(client => {
      const key = client.client_name.toLowerCase();
      
      if (uniqueMap.has(key)) {
        const existing = uniqueMap.get(key)!;
        // Add product if not already included
        if (!existing.products.includes(client.Product_Type)) {
          existing.products.push(client.Product_Type);
        }
        existing.product_count++;
        
        // Update website if this client has one and the existing one doesn't
        if (client.website && client.website.trim() && (!existing.website || !existing.website.trim())) {
          existing.website = client.website;
        }
      } else {
        uniqueMap.set(key, {
          client_name: client.client_name,
          website: client.website || '',
          contact_person: client.contact_person,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: client.city,
          state: client.state,
          pincode: client.pincode,
          status: client.status,
          products: [client.Product_Type],
          product_count: 1,
          tekmegha_client_id: client.tekmegha_client_id
        });
      }
    });
    
    this.uniqueWebsites = Array.from(uniqueMap.values());
  }

  filterUniqueWebsites() {
    this.filteredUniqueWebsites = this.uniqueWebsites.filter(website => {
      // Search filter
      const matchesSearch = !this.searchTerm || 
        website.client_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        website.contact_person.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        website.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        website.phone.includes(this.searchTerm) ||
        (website.website && website.website.toLowerCase().includes(this.searchTerm.toLowerCase()));

      // Status filter
      const matchesStatus = this.statusFilter === 'all' || website.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });

    this.sortUniqueWebsites();
  }

  sortUniqueWebsites() {
    this.filteredUniqueWebsites.sort((a, b) => {
      let aValue: any = a[this.sortBy as keyof UniqueWebsite];
      let bValue: any = b[this.sortBy as keyof UniqueWebsite];

      // Default sort by tekmegha_client_id if no specific sort is applied
      if (!this.sortBy || this.sortBy === 'tekmegha_client_id') {
        return a.tekmegha_client_id - b.tekmegha_client_id;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
