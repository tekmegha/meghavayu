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
      const { data, error } = await this.supabaseService.getUserRole(userId);
      
      if (error) {
        console.error('Error checking user role:', error);
        return false;
      }

      // Check if user has inventory access role
      const allowedRoles = ['admin', 'manager', 'inventory_staff', 'store_manager'];
      return data?.role && allowedRoles.includes(data.role.toLowerCase());
    } catch (error) {
      console.error('Error checking inventory access:', error);
      return false;
    }
  }
}
