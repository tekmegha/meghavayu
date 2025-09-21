import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  phoneNumber: string = '';
  isLoading: boolean = false;

  constructor(private router: Router) {}

  onLogin() {
    if (this.phoneNumber.trim()) {
      this.isLoading = true;
      
      // Simulate login process with dummy number
      setTimeout(() => {
        this.isLoading = false;
        // Navigate to home page after successful login
        this.router.navigate(['/home']);
      }, 2000);
    }
  }

  onBack() {
    this.router.navigate(['/home']);
  }
}
