import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PhonePeAuthToken {
  token: string;
  expiresAt: number;
}

export interface PhonePeOAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export interface PhonePeCheckoutV2Request {
  merchantOrderId: string;
  amount: number;
  paymentFlow: {
    type: string;
    message: string;
    merchantUrls: {
      redirectUrl: string;
    };
  };
}

export interface PhonePeCheckoutV2Response {
  orderId: string;
  state: string;
  expireAt: number;
  redirectUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhonePePaymentService {
  private readonly baseUrl = 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  private readonly merchantId = 'TEST-M23X2TBWLYLBK_25102'; // Replace with your actual merchant ID
  private readonly saltKey = 'NmM2ZTFlYWItNDgzOS00OWYwLWE0YzUtZGI0NzFiNmMxNDUy'; // Replace with your actual salt key
  private readonly saltIndex = 1; // Replace with your actual salt index
  private readonly clientId = 'TEST-M23X2TBWLYLBK_25102'; // Replace with your actual client ID
  private readonly clientSecret = 'NmM2ZTFlYWItNDgzOS00OWYwLWE0YzUtZGI0NzFiNmMxNDUy'; // Replace with your actual client secret
  private readonly clientVersion = '1.0'; // Replace with your actual client version
  private authToken: PhonePeAuthToken | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Generate Authorization Token for PhonePe API using OAuth
   */
  async generateAuthToken(): Promise<string> {
    try {
      // Check if we have a valid cached token
      if (this.authToken && this.authToken.expiresAt > Date.now()) {
        return this.authToken.token;
      }

      // Prepare form-encoded data for OAuth token request
      const formData = new URLSearchParams();
      formData.append('client_id', this.clientId);
      formData.append('client_version', this.clientVersion);
      formData.append('client_secret', this.clientSecret);
      formData.append('grant_type', 'client_credentials');

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
      });

      const response = await this.http.post<PhonePeOAuthResponse>(
        `${this.baseUrl}/v1/oauth/token`,
        formData.toString(),
        { headers }
      ).toPromise();

      if (response?.access_token) {
        this.authToken = {
          token: response.access_token,
          expiresAt: Date.now() + (response.expires_in * 1000) // Convert seconds to milliseconds
        };
        return response.access_token;
      } else {
        throw new Error('Failed to generate authorization token');
      }
    } catch (error) {
      console.error('Error generating PhonePe auth token:', error);
      throw error;
    }
  }

  /**
   * Create Payment using PhonePe Checkout V2 API
   */
  async createCheckoutV2Payment(checkoutRequest: PhonePeCheckoutV2Request): Promise<PhonePeCheckoutV2Response> {
    try {
      // Get authorization token
      const authToken = await this.generateAuthToken();

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${authToken}`,
        'accept': 'application/json'
      });

      const response = await this.http.post<PhonePeCheckoutV2Response>(
        `${this.baseUrl}/checkout/v2/pay`,
        checkoutRequest,
        { headers }
      ).toPromise();

      if (!response) {
        throw new Error('No response received from PhonePe Checkout V2 API');
      }

      return response;
    } catch (error) {
      console.error('Error creating PhonePe Checkout V2 payment:', error);
      throw error;
    }
  }

  /**
   * Verify payment status using V2 API
   */
  async verifyPaymentV2(orderId: string): Promise<any> {
    try {
      // Get authorization token
      const authToken = await this.generateAuthToken();
      
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${authToken}`,
        'accept': 'application/json'
      });

      const response = await this.http.get(
        `${this.baseUrl}/checkout/v2/status/${orderId}`,
        { headers }
      ).toPromise();
      
      return response;
    } catch (error) {
      console.error('Error verifying PhonePe payment V2:', error);
      throw error;
    }
  }

  /**
   * Generate unique transaction ID
   */
  generateTransactionId(): string {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Generate nonce for authentication
   */
  private generateNonce(): string {
    return Math.random().toString(36).substr(2, 15) + Date.now().toString(36);
  }

  /**
   * Clear cached authorization token
   */
  clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * Force refresh authorization token
   */
  async refreshAuthToken(): Promise<string> {
    this.clearAuthToken();
    return await this.generateAuthToken();
  }

  /**
   * Check if current token is valid
   */
  isTokenValid(): boolean {
    return this.authToken !== null && this.authToken.expiresAt > Date.now();
  }

  /**
   * Get current token info
   */
  getTokenInfo(): { token: string; expiresAt: number; isValid: boolean } | null {
    if (!this.authToken) {
      return null;
    }
    
    return {
      token: this.authToken.token,
      expiresAt: this.authToken.expiresAt,
      isValid: this.isTokenValid()
    };
  }

  /**
   * Format amount for PhonePe (in paise)
   */
  formatAmount(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Create a simple checkout v2 payment request
   */
  async createSimpleCheckoutV2Payment(
    merchantOrderId: string,
    amount: number,
    redirectUrl: string,
    message: string = 'Payment for order'
  ): Promise<PhonePeCheckoutV2Response> {
    const checkoutRequest: PhonePeCheckoutV2Request = {
      merchantOrderId,
      amount,
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message,
        merchantUrls: {
          redirectUrl
        }
      }
    };

    return await this.createCheckoutV2Payment(checkoutRequest);
  }

  /**
   * Generate merchant order ID
   */
  generateMerchantOrderId(): string {
    return 'ORD_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Create payment and get redirect URL
   */
  async createPaymentAndGetUrl(
    amount: number,
    redirectUrl: string,
    message: string = 'Payment for order'
  ): Promise<string> {
    const orderId = this.generateMerchantOrderId();
    const response = await this.createSimpleCheckoutV2Payment(orderId, amount, redirectUrl, message);
    return response.redirectUrl;
  }
}
