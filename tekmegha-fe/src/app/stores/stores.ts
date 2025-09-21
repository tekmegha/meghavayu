import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Store } from '../shared/interfaces/store.interface'; // Import Store interface

interface BrewBuddyContent {
  topNavbar: any[];
  bottomNavbar: any[];
  stores: Store[]; // Add stores array
}

@Component({
  selector: 'app-stores',
  imports: [CommonModule, SkeletonLoaderComponent],
  templateUrl: './stores.html',
  styleUrl: './stores.scss'
})
export class Stores implements OnInit {
  isLoading = true;
  stores: Store[] = []; // Initialize stores array

  constructor(private http: HttpClient) { } // Inject HttpClient

  ngOnInit() {
    this.http.get<BrewBuddyContent>('assets/brew-buddy-content.json').subscribe(config => {
      this.stores = config.stores;
      // Simulate data loading
      setTimeout(() => {
        this.isLoading = false;
      }, 2000); // Show skeleton for 2 seconds
    });
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/brew-buddy/default.png';
  }
}
