import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryService, DeliveryOption } from '../services/delivery.service';

@Component({
  selector: 'app-store-selector',
  imports: [CommonModule],
  templateUrl: './store-selector.html',
  styleUrl: './store-selector.scss'
})
export class StoreSelectorComponent implements OnInit {
  @Input() showModal = false;
  @Output() storeSelected = new EventEmitter<DeliveryOption>();
  @Output() modalClosed = new EventEmitter<void>();

  deliveryOptions: DeliveryOption[] = [];
  selectedStore: DeliveryOption | null = null;
  isLoading = true;

  constructor(private deliveryService: DeliveryService) {}

  ngOnInit() {
    this.loadDeliveryOptions();
  }

  async loadDeliveryOptions() {
    this.isLoading = true;
    try {
      await this.deliveryService.loadDeliveryOptions();
      this.deliveryService.deliveryOptions$.subscribe(options => {
        this.deliveryOptions = options;
        this.isLoading = false;
      });
    } catch (error) {
      console.error('Error loading delivery options:', error);
      this.isLoading = false;
    }
  }

  selectStore(store: DeliveryOption) {
    this.selectedStore = store;
    this.deliveryService.selectStore(store.storeId);
    this.storeSelected.emit(store);
    this.closeModal();
  }

  closeModal() {
    this.modalClosed.emit();
  }

  formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatDistance(km: number): string {
    return `${km.toFixed(1)} km`;
  }

  getStatusColor(store: DeliveryOption): string {
    if (!store.isAvailable) return 'unavailable';
    if (store.estimatedTime <= 20) return 'fast';
    if (store.estimatedTime <= 40) return 'medium';
    return 'slow';
  }

  getStatusText(store: DeliveryOption): string {
    if (!store.isAvailable) return 'Closed';
    if (store.estimatedTime <= 20) return 'Fast Delivery';
    if (store.estimatedTime <= 40) return 'Normal Delivery';
    return 'Slower Delivery';
  }
}
