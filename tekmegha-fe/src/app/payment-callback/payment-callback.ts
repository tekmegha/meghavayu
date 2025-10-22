import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { PhonePePaymentService } from '../shared/services/phonepe-payment.service';

@Component({
  selector: 'app-payment-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="callback-container">
      <div class="callback-card">
        <div class="loading">
          <div class="spinner"></div>
          <p>Processing payment...</p>
        </div>
      </div>
    </div>
  `,
  styleUrl: './payment-callback.scss'
})
export class PaymentCallbackComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private phonePePaymentService: PhonePePaymentService
  ) {}

  async ngOnInit() {
    // Get payment response from URL parameters
    this.route.queryParams.subscribe(async params => {
      const orderId = params['orderId'] || params['transactionId'];
      const status = params['status'];
      
      if (orderId) {
        try {
          // Verify payment status with PhonePe V2 API
          const paymentStatus = await this.phonePePaymentService.verifyPaymentV2(orderId);
          
          if (paymentStatus && paymentStatus.state === 'COMPLETED') {
            // Redirect to success page with order details
            this.router.navigate(['/payment/success'], {
              queryParams: {
                orderId: orderId,
                amount: paymentStatus.amount ? paymentStatus.amount / 100 : 0
              }
            });
          } else if (paymentStatus && paymentStatus.state === 'FAILED') {
            // Redirect to failure page
            this.router.navigate(['/payment/success'], {
              queryParams: {
                orderId: orderId,
                status: 'failed'
              }
            });
          } else {
            // Pending status
            this.router.navigate(['/payment/success'], {
              queryParams: {
                orderId: orderId,
                status: 'pending'
              }
            });
          }
        } catch (error) {
          console.error('Error processing payment callback:', error);
          // Redirect to failure page
          this.router.navigate(['/payment/success'], {
            queryParams: {
              status: 'failed'
            }
          });
        }
      } else {
        // No order ID, redirect to home
        this.router.navigate(['/home']);
      }
    });
  }
}
