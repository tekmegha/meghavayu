import { Pipe, PipeTransform } from '@angular/core';
import { NavbarItem } from './shared/interfaces/navbar-item.interface';

@Pipe({
  name: 'filterByPosition',
  standalone: true
})
export class FilterByPositionPipe implements PipeTransform {

  transform(items: NavbarItem[] | null | undefined, position: 'left' | 'center' | 'right'): NavbarItem[] {
    if (!items || !position) {
      return [];
    }
    return items.filter(item => item.position === position);
  }

}
