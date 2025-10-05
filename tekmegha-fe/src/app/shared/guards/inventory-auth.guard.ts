import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryAuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    try {
      const user = this.supabaseService.getCurrentUser();
      
      if (!user) {
        // No user logged in, redirect to inventory login
        this.router.navigate(['/inventory-login']);
        return false;
      }

      // Check if user has inventory access
      const hasAccess = await this.checkInventoryAccess(user.id);
      
      if (!hasAccess) {
        // User doesn't have access, redirect to inventory login
        this.router.navigate(['/inventory-login']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking inventory access:', error);
      this.router.navigate(['/inventory-login']);
      return false;
    }
  }

  private async checkInventoryAccess(userId: string): Promise<boolean> {
    try {
      // Check user role for current store
      const { data, error } = await this.supabaseService.getUserRole();
      
      if (error) {
        console.error('Error checking user role:', error);
        return false;
      }

      // Check if user has inventory access role
      const allowedRoles = ['admin', 'manager', 'inventory_staff', 'store_manager', 'inventory_manager'];
      const hasAccess = !!(data?.role_name && allowedRoles.includes(data.role_name.toLowerCase()));
      
      console.log('Inventory auth guard check:', {
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
}
