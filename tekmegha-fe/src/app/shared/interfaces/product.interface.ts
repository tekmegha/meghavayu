export interface Product {
  // This is a dummy comment to try and force a re-evaluation of types.
  id: string;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  serves: number;
  description: string;
  imageUrl: string;
  customisable: boolean;
  category: 'Espresso Drinks' | 'Brewed Coffee' | 'Pastries & Snacks'; // Add category
  discountPercentage?: number; // Optional, for displaying discounts
  oldPrice?: number; // Optional, for displaying old price with discount
  initialQuantity?: number; // Optional, for items already in cart
}
