import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../shared/services/supabase.service';
import { InsurancePolicy, InsuranceFilter, InsuranceStats } from '../shared/interfaces/insurance.interface';

@Component({
  selector: 'app-insurances',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './insurances.html',
  styleUrls: ['./insurances.scss']
})
export class InsurancesComponent implements OnInit {
  policies: InsurancePolicy[] = [];
  filteredPolicies: InsurancePolicy[] = [];
  loading = false;
  error: string | null = null;

  // Filter properties
  searchTerm = '';
  selectedCompany = 'all';
  selectedPolicyType = 'all';
  selectedAgent = 'all';
  selectedStatus = 'all';

  // Unique values for filters
  companies: string[] = [];
  policyTypes: string[] = [];
  agents: string[] = [];

  // Statistics
  stats: InsuranceStats = {
    totalPolicies: 0,
    activePolicies: 0,
    expiredPolicies: 0,
    expiringSoon: 0,
    totalPremium: 0,
    averagePremium: 0
  };

  // Pagination
  currentPage = 1;
  itemsPerPage = 20;
  totalPages = 1;

  // Sorting
  sortColumn: string = 'policy_issue_date';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(
    private supabaseService: SupabaseService,
    public router: Router
  ) {}

  async ngOnInit() {
    await this.loadPolicies();
  }

  async loadPolicies() {
    this.loading = true;
    this.error = null;

    try {
      const supabase = this.supabaseService.getSupabaseClient();
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      const { data, error } = await supabase
        .from('dkassociates_products')
        .select('*')
        .order('tm_ins_id', { ascending: false });

      if (error) {
        throw error;
      }

      // Map database columns to interface properties
      this.policies = (data || []).map((row: any) => ({
        tm_ins_id: row.tm_ins_id,
        policy_issue_date: row['POLICY ISSUE DATE'] || '',
        exp_date: row['EXP DATE'] || '',
        who_issued_policy: row['WHO ISSUED POLICY'] || '',
        name: row['NAME'] || '',
        vehicle_type: row['VEHICLE TYPE'] || '',
        type: row['TYPE'] || '',
        vehicle_no: row['VEHICLE NO'] || '',
        policy_no: row['POLICY NO'] || '',
        od: row['OD'] || '',
        net: parseInt(row['NET']) || 0,
        gross: parseInt(row['GROSS']) || 0,
        reference: row['REFERENCE'] || '',
        reference_2: row['REFERENCE 2'] || '',
        mb_no: row['MB NO'] || '',
        mail_id: row['MAIL ID'] || '',
        payment_mode: row['PAYMENT MODE'] || '',
        company: row['COMPANY'] || '',
        cc_gvw_seating: row['CC/GVW/SEATING'] || '',
        remark: row['REMARK'] || ''
      }));

      this.extractFilterOptions();
      this.calculateStats();
      this.applyFilters();

    } catch (err: any) {
      console.error('Error loading policies:', err);
      this.error = err.message || 'Failed to load insurance policies';
    } finally {
      this.loading = false;
    }
  }

  extractFilterOptions() {
    // Extract unique companies
    this.companies = [...new Set(this.policies.map(p => p.company).filter(c => c))].sort();

    // Extract unique policy types
    this.policyTypes = [...new Set(this.policies.map(p => p.type).filter(t => t))].sort();

    // Extract unique agents
    this.agents = [...new Set(this.policies.map(p => p.who_issued_policy).filter(a => a))].sort();
  }

  calculateStats() {
    this.stats.totalPolicies = this.policies.length;
    this.stats.totalPremium = this.policies.reduce((sum, p) => sum + p.gross, 0);
    this.stats.averagePremium = this.stats.totalPolicies > 0 
      ? this.stats.totalPremium / this.stats.totalPolicies 
      : 0;

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    this.policies.forEach(policy => {
      const expiryDate = this.parseDate(policy.exp_date);
      if (expiryDate) {
        if (expiryDate < today) {
          this.stats.expiredPolicies++;
        } else if (expiryDate >= today && expiryDate <= thirtyDaysFromNow) {
          this.stats.expiringSoon++;
          this.stats.activePolicies++;
        } else {
          this.stats.activePolicies++;
        }
      }
    });
  }

  parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    
    // Parse DD/MM/YYYY format (e.g., 5/12/2023 = 5th December 2023)
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // JS months are 0-indexed
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
    
    return null;
  }

  applyFilters() {
    this.filteredPolicies = this.policies.filter(policy => {
      // Search term filter
      if (this.searchTerm) {
        const search = this.searchTerm.toLowerCase();
        const matchesSearch = 
          policy.name.toLowerCase().includes(search) ||
          policy.policy_no.toLowerCase().includes(search) ||
          policy.vehicle_no.toLowerCase().includes(search) ||
          policy.vehicle_type.toLowerCase().includes(search);
        
        if (!matchesSearch) return false;
      }

      // Company filter
      if (this.selectedCompany !== 'all' && policy.company !== this.selectedCompany) {
        return false;
      }

      // Policy type filter
      if (this.selectedPolicyType !== 'all' && policy.type !== this.selectedPolicyType) {
        return false;
      }

      // Agent filter
      if (this.selectedAgent !== 'all' && policy.who_issued_policy !== this.selectedAgent) {
        return false;
      }

      // Status filter
      if (this.selectedStatus !== 'all') {
        const expiryDate = this.parseDate(policy.exp_date);
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        if (this.selectedStatus === 'active' && expiryDate && expiryDate < today) {
          return false;
        }
        if (this.selectedStatus === 'expired' && expiryDate && expiryDate >= today) {
          return false;
        }
        if (this.selectedStatus === 'expiring-soon') {
          if (!expiryDate || expiryDate < today || expiryDate > thirtyDaysFromNow) {
            return false;
          }
        }
      }

      return true;
    });

    // Apply sorting
    this.sortPolicies();

    // Update pagination
    this.totalPages = Math.ceil(this.filteredPolicies.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  sortPolicies() {
    this.filteredPolicies.sort((a, b) => {
      let aValue: any = a[this.sortColumn as keyof InsurancePolicy];
      let bValue: any = b[this.sortColumn as keyof InsurancePolicy];

      // Handle date sorting
      if (this.sortColumn === 'policy_issue_date' || this.sortColumn === 'exp_date') {
        aValue = this.parseDate(aValue as string)?.getTime() || 0;
        bValue = this.parseDate(bValue as string)?.getTime() || 0;
      }

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortPolicies();
  }

  getPaginatedPolicies(): InsurancePolicy[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPolicies.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getStatusClass(policy: InsurancePolicy): string {
    const expiryDate = this.parseDate(policy.exp_date);
    if (!expiryDate) return 'status-unknown';

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (expiryDate < today) return 'status-expired';
    if (expiryDate <= thirtyDaysFromNow) return 'status-expiring-soon';
    return 'status-active';
  }

  getStatusText(policy: InsurancePolicy): string {
    const expiryDate = this.parseDate(policy.exp_date);
    if (!expiryDate) return 'Unknown';

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    if (expiryDate < today) return 'Expired';
    if (expiryDate <= thirtyDaysFromNow) return 'Expiring Soon';
    return 'Active';
  }

  formatCurrency(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
  }

  viewPolicyDetails(policy: InsurancePolicy) {
    // Navigate to policy details page (to be implemented)
    console.log('View policy:', policy);
    // this.router.navigate(['/dkassociates/policy', policy.tm_ins_id]);
  }

  exportToExcel() {
    console.log('Export to Excel');
    // TODO: Implement Excel export
  }

  printList() {
    window.print();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCompany = 'all';
    this.selectedPolicyType = 'all';
    this.selectedAgent = 'all';
    this.selectedStatus = 'all';
    this.applyFilters();
  }
}

