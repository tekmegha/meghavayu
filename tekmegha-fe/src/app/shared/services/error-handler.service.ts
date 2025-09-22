import { Injectable, ErrorHandler } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Handle NavigatorLockAcquireTimeoutError specifically
    if (error.name === 'NavigatorLockAcquireTimeoutError') {
      console.warn('Navigator Lock timeout (non-critical):', error.message);
      // Don't throw the error, just log it as a warning
      return;
    }

    // Handle other Supabase-related errors
    if (error.message && error.message.includes('sb-') && error.message.includes('auth-token')) {
      console.warn('Supabase auth lock error (non-critical):', error.message);
      return;
    }

    // Log other errors normally
    console.error('Global error:', error);
  }
}
