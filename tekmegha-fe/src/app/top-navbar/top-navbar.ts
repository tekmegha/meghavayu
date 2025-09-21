import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilterByPositionPipe } from '../filter-by-position-pipe';
import { NavbarItem } from '../shared/interfaces/navbar-item.interface';

@Component({
  selector: 'app-top-navbar',
  imports: [CommonModule, RouterLink, FilterByPositionPipe],
  templateUrl: './top-navbar.html',
  styleUrl: './top-navbar.scss'
})
export class TopNavbar {
  @Input() navbarItems: NavbarItem[] = [];
  @Output() menuToggle = new EventEmitter<void>();
  @Output() searchOpen = new EventEmitter<void>();

  onItemClick(item: NavbarItem) {
    if (item.action === 'toggleMenu') {
      this.menuToggle.emit();
    } else if (item.action === 'openSearch') {
      this.searchOpen.emit();
    }
    // Handle route navigation if item.route exists and no action is specified
  }
}
