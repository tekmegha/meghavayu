import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductTransformService {

  /**
   * Transform Supabase product to include legacy compatibility properties
   */
  transformSupabaseProduct(supabaseProduct: any): Product {
    return {
      ...supabaseProduct,
      // Add legacy compatibility properties
      reviewCount: supabaseProduct.review_count,
      imageUrl: supabaseProduct.image_url,
      discountPercentage: supabaseProduct.discount_percentage,
      oldPrice: supabaseProduct.old_price,
      // Ensure brand_id for backward compatibility
      brand_id: supabaseProduct.megha_store_id || supabaseProduct.brand_id || 'brew-buddy'
    };
  }

  /**
   * Transform multiple Supabase products
   */
  transformSupabaseProducts(supabaseProducts: any[]): Product[] {
    return supabaseProducts.map(product => this.transformSupabaseProduct(product));
  }

  /**
   * Transform product for legacy components that expect old property names
   */
  transformForLegacyComponent(product: Product): any {
    return {
      ...product,
      reviewCount: product.reviewCount || product.review_count,
      imageUrl: product.imageUrl || product.image_url,
      discountPercentage: product.discountPercentage || product.discount_percentage,
      oldPrice: product.oldPrice || product.old_price,
      brand_id: product.brand_id || product.megha_store_id || 'brew-buddy'
    };
  }

  /**
   * Transform legacy product to new schema format
   */
  transformLegacyProduct(legacyProduct: any): Partial<Product> {
    return {
      ...legacyProduct,
      review_count: legacyProduct.reviewCount || legacyProduct.review_count,
      image_url: legacyProduct.imageUrl || legacyProduct.image_url,
      discount_percentage: legacyProduct.discountPercentage || legacyProduct.discount_percentage,
      old_price: legacyProduct.oldPrice || legacyProduct.old_price,
      megha_store_id: legacyProduct.brand_id || legacyProduct.megha_store_id
    };
  }
}
