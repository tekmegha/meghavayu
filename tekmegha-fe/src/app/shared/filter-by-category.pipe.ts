import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './interfaces/product.interface';

@Pipe({
  name: 'filterByCategory',
  standalone: true,
})
export class FilterByCategoryPipe implements PipeTransform {
  transform(products: Product[] | null | undefined, category: string): Product[] {
    if (!products || !category) {
      return [];
    }
    return products.filter(product => product.category === category);
  }
}
