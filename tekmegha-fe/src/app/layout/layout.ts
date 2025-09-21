import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { TopNavbar } from '../top-navbar/top-navbar';
import { BottomStickyNavbar } from '../bottom-sticky-navbar/bottom-sticky-navbar';
import { NavbarItem } from '../shared/interfaces/navbar-item.interface';

interface LayoutConfig {
  topNavbar: NavbarItem[];
  bottomNavbar: NavbarItem[];
}

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, TopNavbar, BottomStickyNavbar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  topNavbarConfig: NavbarItem[] = [];
  bottomNavbarConfig: NavbarItem[] = [];

  constructor(private http: HttpClient) {}

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
}
