import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-bar',
  imports: [CommonModule],
  templateUrl: './location-bar.html',
  styleUrl: './location-bar.scss'
})
export class LocationBarComponent implements OnInit {
  currentLocation: string = 'Hyderabad, Telangana';
  deliveryTime: string = '25-30 mins';
  isLocationModalOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Load saved location from localStorage or default
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      this.currentLocation = savedLocation;
    }
  }

  onLocationClick() {
    this.isLocationModalOpen = true;
  }

  onLocationSelect(location: string) {
    this.currentLocation = location;
    localStorage.setItem('selectedLocation', location);
    this.isLocationModalOpen = false;
  }

  onCloseModal() {
    this.isLocationModalOpen = false;
  }

  getLocationIcon(): string {
    return 'location_on';
  }

  getDeliveryIcon(): string {
    return 'local_shipping';
  }
}
