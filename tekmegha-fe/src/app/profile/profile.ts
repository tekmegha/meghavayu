import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, SkeletonLoaderComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  isLoading = true;

  ngOnInit() {
    // Simulate data loading
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Show skeleton for 2 seconds
  }
}
