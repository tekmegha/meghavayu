import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService, Store, StoreLocation } from './supabase.service';

export interface DeliveryOption {
  id: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  estimatedTime: number; // in minutes
  deliveryFee: number;
  isAvailable: boolean;
  distance: number; // in km
}

export interface DeliveryRequest {
  id: string;
  orderId: string;
  storeId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryInstructions?: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled';
  estimatedDeliveryTime: Date;
  actualDeliveryTime?: Date;
  deliveryFee: number;
  totalAmount: number;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryTracking {
  orderId: string;
  status: string;
  estimatedTime: Date;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  driverInfo?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    message: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private deliveryOptionsSubject = new BehaviorSubject<DeliveryOption[]>([]);
  public deliveryOptions$ = this.deliveryOptionsSubject.asObservable();

  private selectedStoreSubject = new BehaviorSubject<string | null>(null);
  public selectedStore$ = this.selectedStoreSubject.asObservable();

  private deliveryRequestsSubject = new BehaviorSubject<DeliveryRequest[]>([]);
  public deliveryRequests$ = this.deliveryRequestsSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.loadDeliveryOptions();
  }

  async loadDeliveryOptions(): Promise<void> {
    try {
      const { data: stores, error } = await this.supabaseService.getStoreLocations();
      if (error) {
        console.error('Error loading stores:', error);
        return;
      }

      // Convert stores to delivery options
      const deliveryOptions: DeliveryOption[] = (stores || []).map(store => ({
        id: `delivery-${store.id}`,
        storeId: store.id,
        storeName: store.name,
        storeAddress: store.address,
        estimatedTime: this.calculateEstimatedTime(store),
        deliveryFee: this.calculateDeliveryFee(store),
        isAvailable: this.isStoreAvailable(store),
        distance: this.calculateDistance(store)
      }));

      this.deliveryOptionsSubject.next(deliveryOptions);
    } catch (error) {
      console.error('Error loading delivery options:', error);
    }
  }

  selectStore(storeId: string): void {
    this.selectedStoreSubject.next(storeId);
  }

  getSelectedStore(): string | null {
    return this.selectedStoreSubject.value;
  }

  async createDeliveryRequest(request: Omit<DeliveryRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string; data?: DeliveryRequest }> {
    try {
      const deliveryRequest: DeliveryRequest = {
        ...request,
        id: this.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to Supabase
      const { data, error } = await this.supabaseService.createDeliveryRequest(deliveryRequest);
      if (error) {
        return { success: false, error: error.message };
      }

      // Update local state
      const currentRequests = this.deliveryRequestsSubject.value;
      this.deliveryRequestsSubject.next([...currentRequests, deliveryRequest]);

      return { success: true, data: deliveryRequest };
    } catch (error) {
      console.error('Error creating delivery request:', error);
      return { success: false, error: 'Failed to create delivery request' };
    }
  }

  async updateDeliveryStatus(orderId: string, status: DeliveryRequest['status']): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabaseService.updateDeliveryStatus(orderId, status);
      if (error) {
        return { success: false, error: error.message };
      }

      // Update local state
      const currentRequests = this.deliveryRequestsSubject.value;
      const updatedRequests = currentRequests.map(request => 
        request.orderId === orderId 
          ? { ...request, status, updatedAt: new Date() }
          : request
      );
      this.deliveryRequestsSubject.next(updatedRequests);

      return { success: true };
    } catch (error) {
      console.error('Error updating delivery status:', error);
      return { success: false, error: 'Failed to update delivery status' };
    }
  }

  async getDeliveryTracking(orderId: string): Promise<{ data: DeliveryTracking | null; error?: string }> {
    try {
      const { data, error } = await this.supabaseService.getDeliveryTracking(orderId);
      if (error) {
        return { data: null, error: error.message };
      }

      return { data };
    } catch (error) {
      console.error('Error getting delivery tracking:', error);
      return { data: null, error: 'Failed to get delivery tracking' };
    }
  }

  getDeliveryOptions(): DeliveryOption[] {
    return this.deliveryOptionsSubject.value;
  }

  getAvailableStores(): DeliveryOption[] {
    return this.deliveryOptionsSubject.value.filter(option => option.isAvailable);
  }

  getNearestStore(customerLocation: { lat: number; lng: number }): DeliveryOption | null {
    const availableStores = this.getAvailableStores();
    if (availableStores.length === 0) return null;

    // Find store with minimum distance
    return availableStores.reduce((nearest, current) => 
      current.distance < nearest.distance ? current : nearest
    );
  }

  private calculateEstimatedTime(store: StoreLocation): number {
    // Base time + distance factor
    const baseTime = 15; // 15 minutes base
    const distance = this.calculateDistance(store);
    return baseTime + (distance * 2); // 2 minutes per km
  }

  private calculateDeliveryFee(store: StoreLocation): number {
    // Base fee + distance factor
    const baseFee = 30; // ₹30 base fee
    const distance = this.calculateDistance(store);
    const distanceFactor = distance * 5; // ₹5 per km
    return Math.max(baseFee, baseFee + distanceFactor);
  }

  private isStoreAvailable(store: StoreLocation): boolean {
    // Check if store is open and has capacity
    const now = new Date();
    const currentHour = now.getHours();
    
    // Assume stores are open 7 AM to 10 PM
    return currentHour >= 7 && currentHour <= 22;
  }

  private calculateDistance(store: StoreLocation): number {
    // Mock distance calculation - in real app, use geolocation API
    return Math.random() * 10 + 1; // 1-11 km
  }

  private generateId(): string {
    return 'delivery_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}
