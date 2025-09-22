import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { Store } from '../interfaces/store.interface';

@Injectable({
  providedIn: 'root'
})
export class FallbackDataService {
  
  getFallbackProducts(): Product[] {
    return [
      {
        id: 'fallback-1',
        name: 'Espresso Blend',
        price: 4.50,
        rating: 4.8,
        reviewCount: 120,
        serves: 1,
        description: 'A rich and intense coffee experience.',
        imageUrl: 'assets/images/brew-buddy/espresso.jpg',
        customisable: false,
        category: 'Brewed Coffee',
        discountPercentage: 15,
        oldPrice: 5.29
      },
      {
        id: 'fallback-2',
        name: 'Vanilla Latte',
        price: 5.25,
        rating: 4.7,
        reviewCount: 95,
        serves: 1,
        description: 'Smooth latte with a hint of sweet vanilla.',
        imageUrl: 'assets/images/brew-buddy/latte.jpg',
        customisable: true,
        category: 'Espresso Drinks',
        discountPercentage: 10,
        oldPrice: 5.85
      },
      {
        id: 'fallback-3',
        name: 'Chocolate Croissant',
        price: 3.00,
        rating: 4.6,
        reviewCount: 80,
        serves: 1,
        description: 'Flaky pastry with a rich chocolate filling.',
        imageUrl: 'assets/images/brew-buddy/muffin.jpg',
        customisable: false,
        category: 'Pastries & Snacks'
      },
      {
        id: 'fallback-4',
        name: 'Cappuccino',
        price: 4.75,
        rating: 4.9,
        reviewCount: 150,
        serves: 1,
        description: 'Perfect balance of espresso, steamed milk, and foam.',
        imageUrl: 'assets/images/brew-buddy/cappuccino.jpg',
        customisable: true,
        category: 'Espresso Drinks',
        discountPercentage: 12,
        oldPrice: 5.40
      },
      {
        id: 'fallback-5',
        name: 'Cold Brew',
        price: 4.25,
        rating: 4.5,
        reviewCount: 75,
        serves: 1,
        description: 'Smooth and refreshing cold-brewed coffee.',
        imageUrl: 'assets/images/brew-buddy/cold-brew.jpg',
        customisable: false,
        category: 'Brewed Coffee',
        discountPercentage: 8,
        oldPrice: 4.62
      },
      {
        id: 'fallback-6',
        name: 'Caramel Macchiato',
        price: 5.50,
        rating: 4.8,
        reviewCount: 110,
        serves: 1,
        description: 'Rich espresso with vanilla and caramel drizzle.',
        imageUrl: 'assets/images/brew-buddy/macchiato.jpg',
        customisable: true,
        category: 'Espresso Drinks',
        discountPercentage: 15,
        oldPrice: 6.47
      },
      {
        id: 'fallback-7',
        name: 'Blueberry Muffin',
        price: 3.25,
        rating: 4.4,
        reviewCount: 65,
        serves: 1,
        description: 'Fresh baked muffin with juicy blueberries.',
        imageUrl: 'assets/images/brew-buddy/blueberry-muffin.jpg',
        customisable: false,
        category: 'Pastries & Snacks'
      },
      {
        id: 'fallback-8',
        name: 'Americano',
        price: 3.75,
        rating: 4.6,
        reviewCount: 85,
        serves: 1,
        description: 'Classic espresso with hot water for a clean taste.',
        imageUrl: 'assets/images/brew-buddy/americano.jpg',
        customisable: false,
        category: 'Espresso Drinks'
      }
    ];
  }

  getFallbackStores(): Store[] {
    return [
      {
        id: 'fallback-store-1',
        name: 'BrewBuddy Gachibowli',
        address: 'Plot No. 1, Hitech City Main Rd, Gachibowli, Hyderabad, Telangana 500032',
        phone: '+91 40 1111 2222',
        hours: 'Mon-Fri: 8 AM - 9 PM, Sat-Sun: 9 AM - 8 PM'
      },
      {
        id: 'fallback-store-2',
        name: 'BrewBuddy Jubilee Hills',
        address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
        phone: '+91 40 3333 4444',
        hours: 'Mon-Sun: 7 AM - 10 PM'
      },
      {
        id: 'fallback-store-3',
        name: 'BrewBuddy Banjara Hills',
        address: 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034',
        phone: '+91 40 5555 6666',
        hours: 'Mon-Fri: 7:30 AM - 9:30 PM, Sat-Sun: 8 AM - 9 PM'
      }
    ];
  }
}
