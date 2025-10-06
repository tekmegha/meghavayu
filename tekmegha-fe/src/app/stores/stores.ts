import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';
import { HttpClient } from '@angular/common/http';
import { Store } from '../shared/interfaces/store.interface';
import { SupabaseService, StoreLocation } from '../shared/services/supabase.service';
import { FallbackDataService } from '../shared/services/fallback-data.service';
import { BrandService } from '../shared/services/brand.service';

interface BrewBuddyContent {
  topNavbar: any[];
  bottomNavbar: any[];
  stores: Store[];
}

@Component({
  selector: 'app-stores',
  imports: [CommonModule, SkeletonLoaderComponent],
  templateUrl: './stores.html',
  styleUrl: './stores.scss'
})
export class Stores implements OnInit {
  isLoading = true;
  stores: Store[] = [];

  constructor(
    private http: HttpClient,
    private supabaseService: SupabaseService,
    private fallbackDataService: FallbackDataService,
    private brandService: BrandService
  ) {}

  async ngOnInit() {
    await this.loadStores();
  }

  async loadStores() {
    try {
      const { data, error } = await this.supabaseService.getStoreLocations();
      if (error) {
        console.warn('Supabase error, using fallback data:', error.message);
        // Use fallback data when Supabase fails
        this.stores = this.fallbackDataService.getFallbackStores(this.supabaseService.getCurrentBrand());
        this.isLoading = false;
        return;
      }
      
      // Transform Supabase stores to local Store interface
      this.stores = (data || []).map(this.transformSupabaseStore);
      this.isLoading = false;
    } catch (error) {
      console.warn('Network error, using fallback data:', error);
      // Use fallback data when network fails
      this.stores = this.fallbackDataService.getFallbackStores();
      this.isLoading = false;
    }
  }

  private transformSupabaseStore(storeLocation: StoreLocation): Store {
    return {
      id: storeLocation.id,
      name: storeLocation.name,
      address: storeLocation.address,
      phone: storeLocation.phone || '',
      hours: storeLocation.hours || '',
      brand_id: this.supabaseService.getCurrentBrand()
    };
  }

  private loadStoresFromJson() {
    this.http.get<BrewBuddyContent>('assets/brew-buddy-content.json').subscribe(config => {
      this.stores = config.stores;
      // Simulate data loading
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    });
  }

  onImageError(event: Event) {
    const defaultImage = this.getBrandSpecificDefaultImage();
    (event.target as HTMLImageElement).src = defaultImage;
  }

  private getBrandSpecificDefaultImage(): string {
    if (!this.brandService.getCurrentBrand()) {
      return 'assets/images/brew-buddy/default.png'; // Default fallback
    }
    
    const brandId = this.brandService.getCurrentBrand()?.id;
    switch (brandId) {
      case 'brewbuddy':
        return 'assets/images/brew-buddy/default.png';
      case 'littleducks':
        return 'assets/images/little-ducks/default.png';
      case 'opula':
        return 'assets/images/opula/default.png';
      case 'cctv-device':
        return 'assets/images/cctv-device/default.png';
      default:
        return 'assets/images/brew-buddy/default.png'; // Default fallback
    }
  }
}
