import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkStatusService } from '../services/network-status.service';

@Component({
  selector: 'app-network-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (networkStatus.isOffline()) {
      <div class="network-status offline">
        <span class="material-icons">wifi_off</span>
        <span>You're offline. Using cached data.</span>
      </div>
    }
  `,
  styles: [`
    .network-status {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9999;
      padding: 8px 16px;
      text-align: center;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      
      &.offline {
        background-color: #ff9800;
        color: white;
      }
      
      .material-icons {
        font-size: 1.2rem;
      }
    }
  `]
})
export class NetworkStatusComponent {
  constructor(public networkStatus: NetworkStatusService) {}
}
