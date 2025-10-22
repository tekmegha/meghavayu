import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PhonePePaymentService } from '../shared/services/phonepe-payment.service';
import { CartService } from '../shared/services/cart-service';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.scss'
})
export class PaymentSuccessComponent implements OnInit {
  paymentStatus: 'success' | 'failed' | 'pending' = 'pending';
  transactionId: string = '';
  amount: number = 0;
  isLoading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private phonePePaymentService: PhonePePaymentService,
    private cartService: CartService
  ) {}

  async ngOnInit() {
    // Get order ID from URL parameters
    this.route.queryParams.subscribe(async params => {
      this.transactionId = params['orderId'] || params['transactionId'] || '';
      
      if (this.transactionId) {
        try {
          // Verify payment status using V2 API
          const paymentStatus = await this.phonePePaymentService.verifyPaymentV2(this.transactionId);
          
          if (paymentStatus && paymentStatus.state === 'COMPLETED') {
            this.paymentStatus = 'success';
            this.amount = paymentStatus.amount ? paymentStatus.amount / 100 : 0; // Convert from paise to rupees
            
            // Clear cart after successful payment
            this.cartService.clearCart();
          } else if (paymentStatus && paymentStatus.state === 'FAILED') {
            this.paymentStatus = 'failed';
          } else {
            this.paymentStatus = 'pending';
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          this.paymentStatus = 'failed';
        }
      } else {
        this.paymentStatus = 'failed';
      }
      
      this.isLoading = false;
    });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
