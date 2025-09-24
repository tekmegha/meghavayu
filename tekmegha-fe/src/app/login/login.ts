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
  // Phone authentication
  phoneNumber: string = '';
  otpCode: string = '';
  showOtpInput: boolean = false;
  
  // Email authentication
  email: string = '';
  password: string = '';
  fullName: string = '';
  confirmPassword: string = '';
  
  // UI state
  loginMethod: 'phone' | 'email' = 'phone';
  isSignUp: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

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

  // Email authentication methods
  async onEmailLogin() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { data, error } = await this.supabaseService.signInWithEmail(this.email, this.password);
      
      if (error) {
        this.errorMessage = error.message || 'Login failed. Please check your credentials.';
        console.error('Email login error:', error);
      } else {
        this.successMessage = 'Login successful!';
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1000);
      }
    } catch (error) {
      this.errorMessage = 'An error occurred. Please try again.';
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onEmailSignUp() {
    if (!this.email || !this.password || !this.fullName) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { data, error } = await this.supabaseService.signUpWithEmail(
        this.email, 
        this.password, 
        this.fullName
      );
      
      if (error) {
        this.errorMessage = error.message || 'Sign up failed. Please try again.';
        console.error('Email signup error:', error);
      } else {
        this.successMessage = 'Account created successfully! Please check your email to verify your account.';
        this.isSignUp = false;
        this.loginMethod = 'email';
      }
    } catch (error) {
      this.errorMessage = 'An error occurred. Please try again.';
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async onForgotPassword() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const { data, error } = await this.supabaseService.resetPassword(this.email);
      
      if (error) {
        this.errorMessage = error.message || 'Failed to send reset email.';
        console.error('Password reset error:', error);
      } else {
        this.successMessage = 'Password reset email sent! Please check your inbox.';
      }
    } catch (error) {
      this.errorMessage = 'An error occurred. Please try again.';
      console.error('Error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // UI methods
  switchToPhone() {
    this.loginMethod = 'phone';
    this.clearMessages();
  }

  switchToEmail() {
    this.loginMethod = 'email';
    this.clearMessages();
  }

  toggleSignUp() {
    this.isSignUp = !this.isSignUp;
    this.clearMessages();
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // Helper methods for template
  getButtonAction() {
    if (this.loginMethod === 'phone') {
      return this.showOtpInput ? this.onVerifyOtp() : this.onLogin();
    } else {
      return this.isSignUp ? this.onEmailSignUp() : this.onEmailLogin();
    }
  }

  isButtonDisabled(): boolean {
    if (this.loginMethod === 'phone') {
      return (!this.phoneNumber.trim() && !this.showOtpInput) || (!this.otpCode.trim() && this.showOtpInput);
    } else {
      if (this.isSignUp) {
        return !this.email.trim() || !this.password.trim() || !this.fullName.trim() || !this.confirmPassword.trim();
      } else {
        return !this.email.trim() || !this.password.trim();
      }
    }
  }

  getButtonText(): string {
    if (this.loginMethod === 'phone') {
      return this.showOtpInput ? 'VERIFY OTP' : 'CONTINUE';
    } else {
      return this.isSignUp ? 'SIGN UP' : 'LOGIN';
    }
  }

  getLoadingText(): string {
    if (this.loginMethod === 'phone') {
      return this.showOtpInput ? 'VERIFYING...' : 'SENDING OTP...';
    } else {
      return this.isSignUp ? 'CREATING ACCOUNT...' : 'LOGGING IN...';
    }
  }
}
