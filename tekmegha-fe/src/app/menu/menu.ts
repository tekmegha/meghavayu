import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, SkeletonLoaderComponent],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  isLoading = true;

  ngOnInit() {
    // Simulate data loading
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Show skeleton for 2 seconds
  }
}
