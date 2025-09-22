import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';
import { HttpClient } from '@angular/common/http';
import { Store } from '../shared/interfaces/store.interface';
import { SupabaseService, Store as SupabaseStore } from '../shared/services/supabase.service';

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
    private supabaseService: SupabaseService
  ) {}

  async ngOnInit() {
    await this.loadStores();
  }

  async loadStores() {
    try {
      const { data, error } = await this.supabaseService.getStores();
      if (error) {
        console.error('Error loading stores:', error);
        // Fallback to JSON file
        this.loadStoresFromJson();
        return;
      }
      
      // Transform Supabase stores to local Store interface
      this.stores = (data || []).map(this.transformSupabaseStore);
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading stores:', error);
      // Fallback to JSON file
      this.loadStoresFromJson();
    }
  }

  private transformSupabaseStore(supabaseStore: SupabaseStore): Store {
    return {
      id: supabaseStore.id,
      name: supabaseStore.name,
      address: supabaseStore.address,
      phone: supabaseStore.phone,
      hours: supabaseStore.hours
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
    (event.target as HTMLImageElement).src = 'assets/images/brew-buddy/default.png';
  }
}
