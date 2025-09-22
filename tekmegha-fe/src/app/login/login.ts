import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../shared/services/supabase.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  phoneNumber: string = '';
  otpCode: string = '';
  isLoading: boolean = false;
  showOtpInput: boolean = false;
  errorMessage: string = '';

  constructor(
    private router: Router,
    private supabaseService: SupabaseService
  ) {}

  async onLogin() {
    if (this.phoneNumber.length === 10) {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const { data, error } = await this.supabaseService.signInWithPhone(this.phoneNumber);
        
        if (error) {
          this.errorMessage = 'Failed to send OTP. Please try again.';
          console.error('Error sending OTP:', error);
        } else {
          this.showOtpInput = true;
        }
      } catch (error) {
        this.errorMessage = 'An error occurred. Please try again.';
        console.error('Error:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.errorMessage = 'Please enter a valid 10-digit phone number.';
    }
  }

  async onVerifyOtp() {
    if (this.otpCode.length === 6) {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const { data, error } = await this.supabaseService.verifyOtp(this.phoneNumber, this.otpCode);
        
        if (error) {
          this.errorMessage = 'Invalid OTP. Please try again.';
          console.error('Error verifying OTP:', error);
        } else {
          // Navigate to home page after successful login
          this.router.navigate(['/home']);
        }
      } catch (error) {
        this.errorMessage = 'An error occurred. Please try again.';
        console.error('Error:', error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.errorMessage = 'Please enter a valid 6-digit OTP.';
    }
  }

  onBack() {
    if (this.showOtpInput) {
      this.showOtpInput = false;
      this.otpCode = '';
      this.errorMessage = '';
    } else {
      this.router.navigate(['/home']);
    }
  }

  onResendOtp() {
    this.onLogin();
  }
}
