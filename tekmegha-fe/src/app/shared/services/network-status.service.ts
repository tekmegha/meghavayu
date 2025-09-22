import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkStatusService {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnlineSubject.asObservable();

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnlineSubject.next(true);
      console.log('Network: Online');
    });

    window.addEventListener('offline', () => {
      this.isOnlineSubject.next(false);
      console.log('Network: Offline');
    });
  }

  isOnline(): boolean {
    return this.isOnlineSubject.value;
  }

  isOffline(): boolean {
    return !this.isOnlineSubject.value;
  }
}
