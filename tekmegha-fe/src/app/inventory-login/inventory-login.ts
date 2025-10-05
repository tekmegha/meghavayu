import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
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
        this.router.navigate(['/inventory']);
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
          this.successMessage = 'Login successful! Redirecting to inventory...';
          setTimeout(() => {
            this.router.navigate(['/inventory']);
          }, 1500);
        } else {
          this.errorMessage = 'Access denied. You do not have permission to access the inventory module.';
          // Sign out the user since they don't have access
          await this.supabaseService.signOut();
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

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
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
}
