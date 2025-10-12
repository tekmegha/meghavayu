import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerAuthGuard implements CanActivate {
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
        // No user logged in, redirect to login page
        // Store the attempted URL for redirecting after login
        const returnUrl = state.url;
        this.router.navigate(['/login'], { 
          queryParams: { returnUrl: returnUrl }
        });
        return false;
      }

      // User is logged in
      console.log('Customer auth check passed for user:', user.email);
      return true;
    } catch (error) {
      console.error('Error checking customer authentication:', error);
      this.router.navigate(['/login']);
      return false;
    }
  }
}

