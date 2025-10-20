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
    // Store-specific routes like /jsicare/invoices should NOT be considered global
    const globalRoutes = ['/invoices', '/invoice', '/inventory'];
    
    // Only consider it global if it's exactly the route or starts with the route followed by /
    // But NOT if it's a store-specific route like /jsicare/invoices
    for (const route of globalRoutes) {
      if (url === route || (url.startsWith(route + '/') && !this.isStoreSpecificRoute(url))) {
        return true;
      }
    }
    return false;
  }

  private isStoreSpecificRoute(url: string): boolean {
    // Check if the URL is store-specific (e.g., /jsicare/invoices, /megha/invoices)
    const pathSegments = url.split('/').filter(segment => segment);
    
    // If there are at least 2 segments and the first one is not a known global route
    if (pathSegments.length >= 2) {
      const firstSegment = pathSegments[0];
      const globalRoutes = ['inventory-login', 'tekmegha-clients', 'stores', 'home', 'menu', 'cart', 'profile', 'login'];
      return !globalRoutes.includes(firstSegment);
    }
    
    return false;
  }
}
