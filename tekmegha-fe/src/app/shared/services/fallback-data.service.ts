import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { Store } from '../interfaces/store.interface';

@Injectable({
  providedIn: 'root'
})
export class FallbackDataService {
  
  getFallbackProducts(brandId: string = 'brew-buddy'): Product[] {
    if (brandId === 'little-ducks') {
      return this.getLittleDucksProducts();
    } else if (brandId === 'opula') {
      return this.getOpulaProducts();
    } else {
      return this.getBrewBuddyProducts();
    }
  }

  private getBrewBuddyProducts(): Product[] {
    return [
      {
        id: 'fallback-1',
        name: 'Espresso Blend',
        price: 4.50,
        rating: 4.8,
        review_count: 120,
        reviewCount: 120,
        serves: 1,
        description: 'A rich and intense coffee experience.',
        image_url: 'assets/images/brew-buddy/espresso.jpg',
        imageUrl: 'assets/images/brew-buddy/espresso.jpg',
        customisable: false,
        category: 'Brewed Coffee',
        discount_percentage: 15,
        discountPercentage: 15,
        old_price: 5.29,
        oldPrice: 5.29,
        brand_id: 'brew-buddy',
        megha_store_id: 'brew-buddy',
        is_available: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        oldPrice: 5.85,
        brand_id: 'brew-buddy',
        megha_store_id: 'brew-buddy',
        is_available: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        category: 'Pastries & Snacks',
        brand_id: 'brew-buddy',
        megha_store_id: 'brew-buddy',
        is_available: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        oldPrice: 5.40,
        brand_id: 'brew-buddy',
        megha_store_id: 'brew-buddy',
        is_available: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        oldPrice: 4.62,
        brand_id: 'brew-buddy',
        megha_store_id: 'brew-buddy',
        is_available: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        discount_percentage: 15,
        discountPercentage: 15,
        oldPrice: 6.47,
        brand_id: 'brew-buddy',
        megha_store_id: 'brew-buddy',
        is_available: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        category: 'Pastries & Snacks',
        brand_id: 'brew-buddy',
        megha_store_id: 'brew-buddy',
        is_available: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        category: 'Espresso Drinks',
        brand_id: 'brew-buddy',
        megha_store_id: 'brew-buddy',
        is_available: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  getFallbackStores(brandId: string = 'brew-buddy'): Store[] {
    if (brandId === 'little-ducks') {
      return this.getLittleDucksStores();
    } else if (brandId === 'opula') {
      return this.getOpulaStores();
    } else {
      return this.getBrewBuddyStores();
    }
  }

  private getBrewBuddyStores(): Store[] {
    return [
      {
        id: 'fallback-store-1',
        name: 'BrewBuddy Gachibowli',
        address: 'Plot No. 1, Hitech City Main Rd, Gachibowli, Hyderabad, Telangana 500032',
        phone: '+91 40 1111 2222',
        hours: 'Mon-Fri: 8 AM - 9 PM, Sat-Sun: 9 AM - 8 PM',
        brand_id: 'brew-buddy',
        megha_store_id: 'brew-buddy',
        is_available: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'fallback-store-2',
        name: 'BrewBuddy Jubilee Hills',
        address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
        phone: '+91 40 3333 4444',
        hours: 'Mon-Sun: 7 AM - 10 PM',
        brand_id: 'brew-buddy',
        megha_store_id: 'brew-buddy',
        is_available: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'fallback-store-3',
        name: 'BrewBuddy Banjara Hills',
        address: 'Road No. 1, Banjara Hills, Hyderabad, Telangana 500034',
        phone: '+91 40 5555 6666',
        hours: 'Mon-Fri: 7:30 AM - 9:30 PM, Sat-Sun: 8 AM - 9 PM',
        brand_id: 'brew-buddy',
        megha_store_id: 'brew-buddy',
        is_available: true,
        is_featured: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private getLittleDucksProducts(): Product[] {
    return [
      {
        id: 'toys-fallback-1',
        name: 'LEGO Classic Set',
        price: 25.00,
        rating: 4.8,
        reviewCount: 234,
        serves: 1,
        description: 'Creative building blocks for endless fun',
        imageUrl: 'assets/images/little-ducks/lego-classic.jpg',
        customisable: false,
        category: 'Educational',
        discount_percentage: 15,
        discountPercentage: 15,
        oldPrice: 29.50,
        brand_id: 'little-ducks'
      },
      {
        id: 'toys-fallback-2',
        name: 'Action Figure Set',
        price: 8.50,
        rating: 4.6,
        reviewCount: 156,
        serves: 1,
        description: 'Superhero action figures with accessories',
        imageUrl: 'assets/images/little-ducks/action-figures.jpg',
        customisable: false,
        category: 'Action Figures',
        brand_id: 'little-ducks'
      }
    ];
  }

  private getOpulaProducts(): Product[] {
    return [
      {
        id: 'fashion-fallback-1',
        name: 'Designer Dress',
        price: 35.00,
        rating: 4.7,
        reviewCount: 145,
        serves: 1,
        description: 'Elegant evening dress for special occasions',
        imageUrl: 'assets/images/opula/designer-dress.jpg',
        customisable: false,
        category: 'Dresses',
        discountPercentage: 30,
        oldPrice: 50.00,
        brand_id: 'opula'
      },
      {
        id: 'fashion-fallback-2',
        name: 'Luxury Watch',
        price: 85.00,
        rating: 4.9,
        reviewCount: 67,
        serves: 1,
        description: 'Swiss-made luxury timepiece',
        imageUrl: 'assets/images/opula/luxury-watch.jpg',
        customisable: false,
        category: 'Accessories',
        discount_percentage: 15,
        discountPercentage: 15,
        oldPrice: 100.00,
        brand_id: 'opula'
      }
    ];
  }

  private getLittleDucksStores(): Store[] {
    return [
      {
        id: 'toys-store-1',
        name: 'Little Ducks Mall Store',
        address: 'City Center Mall, Ground Floor, Hyderabad, Telangana 500032',
        phone: '+91 40 7777 8888',
        hours: 'Mon-Sun: 10 AM - 10 PM',
        brand_id: 'little-ducks'
      }
    ];
  }

  private getOpulaStores(): Store[] {
    return [
      {
        id: 'fashion-store-1',
        name: 'Opula Fashion Mall',
        address: 'Phoenix Mall, Level 2, Hyderabad, Telangana 500032',
        phone: '+91 40 1234 5678',
        hours: 'Mon-Sun: 10 AM - 11 PM',
        brand_id: 'opula'
      }
    ];
  }
}
