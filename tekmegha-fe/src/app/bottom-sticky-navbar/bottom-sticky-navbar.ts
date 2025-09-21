import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarItem } from '../shared/interfaces/navbar-item.interface';

@Component({
  selector: 'app-bottom-sticky-navbar',
  standalone: true, // Added standalone: true
  imports: [CommonModule, RouterLink],
  templateUrl: './bottom-sticky-navbar.html',
  styleUrl: './bottom-sticky-navbar.scss'
})
export class BottomStickyNavbar {
  @Input() navbarItems: NavbarItem[] = [];
}
