import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreSession } from './store-session.service';

@Injectable({
  providedIn: 'root'
})
export class StoreContextService {
  private currentStoreSubject = new BehaviorSubject<StoreSession | null>(null);
  public currentStore$: Observable<StoreSession | null> = this.currentStoreSubject.asObservable();

  setCurrentStore(store: StoreSession | null): void {
    this.currentStoreSubject.next(store);
  }

  getCurrentStore(): StoreSession | null {
    return this.currentStoreSubject.value;
  }

  getCurrentStoreId(): string | null {
    const store = this.getCurrentStore();
    return store?.storeId || null;
  }
}
