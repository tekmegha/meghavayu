import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-stores',
  imports: [CommonModule, SkeletonLoaderComponent],
  templateUrl: './stores.html',
  styleUrl: './stores.scss'
})
export class Stores implements OnInit {
  isLoading = true;

  ngOnInit() {
    // Simulate data loading
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Show skeleton for 2 seconds
  }
}
