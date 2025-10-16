import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryAuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      const user = this.supabaseService.getCurrentUser();
      
      if (!user) {
        // No user logged in, redirect to inventory login with return URL
        const returnUrl = state.url;
        
        // Check if the URL has a store context, if not redirect to store selection
        if (this.isGlobalRoute(state.url)) {
          this.router.navigate(['/stores']);
          return false;
        }
        
        this.router.navigate(['/inventory-login'], { 
          queryParams: { returnUrl: returnUrl }
        });
        return false;
      }

      // Check if user has inventory access
      const hasAccess = await this.checkInventoryAccess(user.id);
      
      if (!hasAccess) {
        // User doesn't have access, redirect to inventory login with return URL
        const returnUrl = state.url;
        
        // Check if the URL has a store context, if not redirect to store selection
        if (this.isGlobalRoute(state.url)) {
          this.router.navigate(['/stores']);
          return false;
        }
        
        this.router.navigate(['/inventory-login'], { 
          queryParams: { returnUrl: returnUrl }
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking inventory access:', error);
      const returnUrl = state.url;
      
      // Check if the URL has a store context, if not redirect to store selection
      if (this.isGlobalRoute(state.url)) {
        this.router.navigate(['/stores']);
        return false;
      }
      
      this.router.navigate(['/inventory-login'], { 
        queryParams: { returnUrl: returnUrl }
      });
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

  private isGlobalRoute(url: string): boolean {
    // Check if the URL is a global route without store context
    const globalRoutes = ['/invoices', '/invoice', '/inventory'];
    return globalRoutes.some(route => url.startsWith(route));
  }
}
