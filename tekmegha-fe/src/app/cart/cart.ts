import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from '../shared/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, SkeletonLoaderComponent],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  isLoading = true;

  ngOnInit() {
    // Simulate data loading
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Show skeleton for 2 seconds
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/images/brew-buddy/default.png';
  }

  payWithRazorpay() {
    const options = {
      "key": "rzp_test_RKMGS8fK1yROHg", // Replace with your actual Key ID
      "amount": "75000", // Amount in currency subunits (e.g., 75000 for ₹750)
      "currency": "INR",
      "name": "BrewBuddy",
      "description": "Order Payment",
      "image": "assets/images/brew-buddy/hero-brewbuddy.jpg", // Your app logo
      "order_id": "order_test_12345", // Replace with a dynamically generated order ID
      "handler": function (response: any) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        // You would typically send this response to your backend for verification
      },
      "prefill": {
        "name": "tekmegha", // Replace with customer's name
        "email": "info@tekmegha.com", // Replace with customer's email
        "contact": "+919876543210" // Replace with customer's phone number
      },
      "notes": {
        "address": "BrewBuddy Office"
      },
      "theme": {
        "color": "#ff6600" // Your brand color
      }
    };

    // Ensure Razorpay object is available globally (from script in index.html)
    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  }
}
