import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../interfaces/product.interface';

@Component({
  selector: 'app-product-tile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-tile.html',
  styleUrl: './product-tile.scss'
})
export class ProductTileComponent implements OnInit {
  @Input() product!: Product;
  @Output() addProduct = new EventEmitter<Product>();
  @Output() updateQuantity = new EventEmitter<{ product: Product; quantity: number }>();

  quantity: number = 0;

  ngOnInit() {
    if (this.product && this.product.initialQuantity) {
      this.quantity = this.product.initialQuantity;
    }
  }

  onAdd() {
    this.quantity = 1;
    this.addProduct.emit(this.product);
  }

  onIncrement() {
    this.quantity++;
    this.updateQuantity.emit({ product: this.product, quantity: this.quantity });
  }

  onDecrement() {
    if (this.quantity > 0) {
      this.quantity--;
      this.updateQuantity.emit({ product: this.product, quantity: this.quantity });
    }
  }
}
