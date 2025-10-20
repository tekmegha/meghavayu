import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../shared/services/supabase.service';

@Component({
  selector: 'app-inventory-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-login.html',
  styleUrl: './inventory-login.scss'
})
export class InventoryLogin implements OnInit {
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showLogoutOption = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    this.checkExistingAuth();
  }

  async checkExistingAuth() {
    const user = this.supabaseService.getCurrentUser();
    if (user) {
      // Check if user has inventory access
      const hasAccess = await this.checkInventoryAccess(user.id);
      if (hasAccess) {
        // Check if there's a return URL, otherwise go to current store's inventory
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.getDefaultInventoryRoute();
        this.router.navigateByUrl(returnUrl);
      } else {
        // User doesn't have access, show logout option
        this.showAccessDeniedWithLogout();
      }
    }
  }

  async onLogin() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.clearMessages();

    try {
      const { data, error } = await this.supabaseService.signInWithEmail(this.email, this.password);
      
      if (error) {
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        return;
      }

      if (data?.user) {
        // Check if user has inventory access
        const hasAccess = await this.checkInventoryAccess(data.user.id);
        
        if (hasAccess) {
          // Check if there's a return URL, otherwise go to current store's inventory
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.getDefaultInventoryRoute();
          this.successMessage = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigateByUrl(returnUrl);
          }, 1500);
        } else {
          // User doesn't have access, show logout option
          this.showAccessDeniedWithLogout();
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = 'An unexpected error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private async checkInventoryAccess(userId: string): Promise<boolean> {
    try {
      // Check if user has inventory access role for current store
      const { data, error } = await this.supabaseService.getUserRole();
      
      if (error) {
        console.error('Error checking user role:', error);
        return false;
      }

      // Check if user has inventory access (admin, manager, inventory_staff, or inventory_manager role)
      const allowedRoles = ['admin', 'manager', 'inventory_staff', 'store_manager', 'inventory_manager'];
      const hasAccess = !!(data?.role_name && allowedRoles.includes(data.role_name.toLowerCase()));
      
      console.log('Inventory access check:', {
        userRole: data?.role_name,
        allowedRoles: allowedRoles,
        hasAccess: hasAccess,
        roleData: data
      });
      
      return hasAccess;
    } catch (error) {
      console.error('Error checking inventory access:', error);
      return false;
    }
  }

  private validateForm(): boolean {
    if (!this.email.trim()) {
      this.errorMessage = 'Email is required';
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return false;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Password is required';
      return false;
    }

    if (this.password.length < 4) {
      this.errorMessage = 'Password must be at least 4 characters long';
      return false;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  onForgotPassword() {
    // Implement forgot password functionality
    this.errorMessage = 'Forgot password feature coming soon. Please contact your administrator.';
  }

  goToCustomerLogin() {
    this.router.navigate(['/login']);
  }

  private getDefaultInventoryRoute(): string {
    // Get the current store from the URL or service
    const currentStore = this.supabaseService.getCurrentStore();
    if (currentStore) {
      return `/${currentStore}/inventory`;
    }
    // Fallback to global inventory route
    return '/inventory';
  }

  private showAccessDeniedWithLogout() {
    this.errorMessage = 'Access denied. You do not have permission to access the inventory module for this store.';
    this.showLogoutOption = true;
  }

  async onLogout() {
    try {
      await this.supabaseService.signOut();
      this.errorMessage = '';
      this.successMessage = 'You have been logged out. Please try logging in with different credentials.';
      this.showLogoutOption = false;
      
      // Clear form
      this.email = '';
      this.password = '';
    } catch (error) {
      console.error('Logout error:', error);
      this.errorMessage = 'Error during logout. Please try again.';
    }
  }
}
