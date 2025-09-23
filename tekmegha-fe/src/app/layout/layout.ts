import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet, Router } from '@angular/router';
import { TopNavbar } from '../top-navbar/top-navbar';
import { BottomStickyNavbar } from '../bottom-sticky-navbar/bottom-sticky-navbar';
import { CheckoutBannerComponent } from '../shared/checkout-banner/checkout-banner';
import { NetworkStatusComponent } from '../shared/network-status/network-status';
import { LocationBarComponent } from '../shared/location-bar/location-bar';
import { NavbarItem } from '../shared/interfaces/navbar-item.interface';

interface LayoutConfig {
  topNavbar: NavbarItem[];
  bottomNavbar: NavbarItem[];
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, TopNavbar, BottomStickyNavbar, CheckoutBannerComponent, NetworkStatusComponent, LocationBarComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  topNavbarConfig: NavbarItem[] = [];
  bottomNavbarConfig: NavbarItem[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.http.get<LayoutConfig>('assets/brew-buddy-content.json')
      .subscribe(config => {
        this.topNavbarConfig = config.topNavbar;
        this.bottomNavbarConfig = config.bottomNavbar;
      });
  }

  onMenuToggle() {
    console.log('Menu Toggled!');
    // Implement actual menu toggle logic here (e.g., open a side navigation)
  }

  onSearchOpen() {
    console.log('Search Opened!');
    // Implement actual search opening logic here (e.g., open a search overlay)
  }

  onLoginOpen() {
    console.log('Login Opened!');
    // Navigate to login page
    this.router.navigate(['/login']);
  }

  onCartOpen() {
    console.log('Cart Opened!');
    // Navigate to cart page
    this.router.navigate(['/cart']);
  }
}
