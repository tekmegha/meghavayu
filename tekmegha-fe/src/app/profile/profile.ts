import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';
import { SupabaseService } from '../shared/services/supabase.service';
import { NetworkStatusService } from '../shared/services/network-status.service';
import { BrandService } from '../shared/services/brand.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, SkeletonLoaderComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  isLoading = true;
  currentUser: any = null;
  userOrders: any[] = [];
  isOnline = true;

  constructor(
    private supabaseService: SupabaseService,
    private networkStatus: NetworkStatusService,
    private router: Router,
    private brandService: BrandService
  ) {}

  async ngOnInit() {
    this.isOnline = this.networkStatus.isOnline();
    this.networkStatus.isOnline$.subscribe(online => {
      this.isOnline = online;
    });

    await this.loadUserData();
    this.isLoading = false;
  }

  async loadUserData() {
    try {
      this.currentUser = this.supabaseService.getCurrentUser();
      
      if (this.currentUser && this.isOnline) {
        // Load user orders
        const { data: orders } = await this.supabaseService.getOrders();
        this.userOrders = orders || [];
      }
    } catch (error) {
      console.warn('Error loading user data:', error);
    }
  }

  async onLogout() {
    try {
      await this.supabaseService.signOut();
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout by clearing local data
      this.router.navigate(['/home']);
    }
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    const defaultImage = this.getBrandSpecificDefaultImage();
    
    // Prevent infinite loop
    if (imgElement.src !== defaultImage && !imgElement.src.includes('default.png')) {
      imgElement.src = defaultImage;
    } else if (!imgElement.src.includes('brew-buddy/default.png')) {
      imgElement.src = 'assets/images/brew-buddy/default.png';
    } else {
      imgElement.onerror = null; // Stop retrying
    }
  }

  private getBrandSpecificDefaultImage(): string {
    if (!this.brandService.getCurrentBrand()) {
      return 'assets/images/brew-buddy/default.png'; // Default fallback
    }
    
    const brandId = this.brandService.getCurrentBrand()?.id;
    const folderName = this.mapBrandIdToFolder(brandId);
    return `assets/images/${folderName}/default.png`;
  }

  private mapBrandIdToFolder(brandId: string | undefined): string {
    // Map brand IDs to their actual folder names
    switch (brandId) {
      case 'brewbuddy':
        return 'brew-buddy';
      case 'littleducks':
        return 'little-ducks';
      case 'majili':
        return 'majili';
      case 'cctv-device':
        return 'cctv-device';
      case 'royalfoods':
        return 'royalfoods';
      default:
        return 'brew-buddy';
    }
  }

  getDisplayName(): string {
    if (this.currentUser?.user_metadata?.full_name) {
      return this.currentUser.user_metadata.full_name;
    }
    if (this.currentUser?.phone) {
      return this.currentUser.phone;
    }
    return 'BrewBuddy User';
  }

  getDisplayEmail(): string {
    if (this.currentUser?.email) {
      return this.currentUser.email;
    }
    if (this.currentUser?.phone) {
      return `${this.currentUser.phone}@brewbuddy.com`;
    }
    return 'user@brewbuddy.com';
  }

  getDisplayPhone(): string {
    if (this.currentUser?.phone) {
      return this.currentUser.phone;
    }
    return '+91 9876543210';
  }
}
