# Store Features System

## Overview

The Store Features System allows you to control which features are available for each store, helping to avoid unnecessary frontend calls and providing a more efficient user experience.

## Database Schema

### New Columns Added to `megha_stores` Table

```sql
-- Feature control columns
enable_products BOOLEAN DEFAULT true,
enable_cart BOOLEAN DEFAULT true,
enable_payments BOOLEAN DEFAULT true,
enable_inventory BOOLEAN DEFAULT true,
enable_invoices BOOLEAN DEFAULT true,
enable_customers BOOLEAN DEFAULT true,
enable_reports BOOLEAN DEFAULT true
```

### Database Functions

#### `get_store_features(store_code_param VARCHAR)`
Returns all feature flags for a specific store.

#### `is_store_feature_enabled(store_code_param VARCHAR, feature_name VARCHAR)`
Checks if a specific feature is enabled for a store.

## Frontend Integration

### TypeScript Interface

```typescript
export interface StoreFeatures {
  storeId: string;
  storeCode: string;
  storeName: string;
  storeType: string;
  enableProducts: boolean;
  enableCart: boolean;
  enablePayments: boolean;
  enableInventory: boolean;
  enableInvoices: boolean;
  enableCustomers: boolean;
  enableReports: boolean;
}
```

### Service Usage

```typescript
// Inject the service
constructor(private storeFeatures: StoreFeaturesService) {}

// Check if a feature is enabled
const canShowProducts = await this.storeFeatures.canShowProducts('brew-buddy');
const canShowCart = await this.storeFeatures.canShowCart('brew-buddy');

// Get all features for a store
const features = await this.storeFeatures.getStoreFeatures('brew-buddy');

// Subscribe to current features
this.storeFeatures.currentFeatures$.subscribe(features => {
  if (features) {
    console.log('Products enabled:', features.enableProducts);
    console.log('Cart enabled:', features.enableCart);
  }
});
```

## Store Type Configurations

### Coffee/Retail Stores (Default)
```sql
UPDATE megha_stores SET 
  enable_products = true,
  enable_cart = true,
  enable_payments = true,
  enable_inventory = true,
  enable_invoices = true,
  enable_customers = true,
  enable_reports = true
WHERE store_type IN ('coffee', 'toys', 'fashion', 'food', 'digitalsecurity');
```

### Insurance Stores
```sql
UPDATE megha_stores SET 
  enable_products = false,
  enable_cart = false,
  enable_payments = false,
  enable_inventory = false,
  enable_invoices = true,
  enable_customers = true,
  enable_reports = true
WHERE store_type = 'insurance';
```

### Dealer/Wholesale Stores
```sql
UPDATE megha_stores SET 
  enable_products = true,
  enable_cart = false,
  enable_payments = false,
  enable_inventory = true,
  enable_invoices = true,
  enable_customers = true,
  enable_reports = true
WHERE store_type = 'dealer';
```

## Usage Examples

### 1. Conditional Navigation

```typescript
// In your component
async ngOnInit() {
  const storeCode = this.getCurrentStoreCode();
  
  // Check if cart should be shown
  const showCart = await this.storeFeatures.canShowCart(storeCode);
  this.showCartInNavigation = showCart;
  
  // Check if inventory should be shown
  const showInventory = await this.storeFeatures.canShowInventory(storeCode);
  this.showInventoryInNavigation = showInventory;
}
```

### 2. Conditional Component Rendering

```html
<!-- In your template -->
<div *ngIf="canShowProducts$ | async" class="products-section">
  <!-- Products content -->
</div>

<div *ngIf="canShowCart$ | async" class="cart-section">
  <!-- Cart content -->
</div>

<div *ngIf="canShowInvoices$ | async" class="invoices-section">
  <!-- Invoices content -->
</div>
```

### 3. Service Integration

```typescript
// In your service
async loadStoreData(storeCode: string) {
  // Check features before making expensive calls
  const canShowProducts = await this.storeFeatures.canShowProducts(storeCode);
  const canShowInventory = await this.storeFeatures.canShowInventory(storeCode);
  
  if (canShowProducts) {
    await this.loadProducts(storeCode);
  }
  
  if (canShowInventory) {
    await this.loadInventory(storeCode);
  }
}
```

## Benefits

### 1. Performance Optimization
- **Avoid unnecessary API calls** for disabled features
- **Reduce database load** by checking flags first
- **Improve page load times** by not loading unused components

### 2. User Experience
- **Cleaner interfaces** with only relevant features
- **Faster navigation** without disabled options
- **Consistent experience** across different store types

### 3. Maintenance
- **Centralized feature control** in database
- **Easy to update** feature flags per store
- **Scalable system** for future features

## Migration Guide

### 1. Apply Database Changes
```bash
psql -d your_database -f alter-megha-stores-features.sql
```

### 2. Update Frontend Components
```typescript
// Before
if (this.storeType === 'insurance') {
  // Hide cart
}

// After
const canShowCart = await this.storeFeatures.canShowCart(storeCode);
if (!canShowCart) {
  // Hide cart
}
```

### 3. Update Navigation
```typescript
// Check features before showing navigation items
const features = await this.storeFeatures.getStoreFeatures(storeCode);
this.navigationItems = [
  { name: 'Products', show: features?.enableProducts },
  { name: 'Cart', show: features?.enableCart },
  { name: 'Inventory', show: features?.enableInventory },
  { name: 'Invoices', show: features?.enableInvoices }
].filter(item => item.show);
```

## Testing

### Database Testing
```sql
-- Test feature functions
SELECT * FROM get_store_features('brew-buddy');
SELECT is_store_feature_enabled('brew-buddy', 'products');
SELECT is_store_feature_enabled('dkassociates', 'cart');
```

### Frontend Testing
```typescript
// Test service methods
const features = await this.storeFeatures.getStoreFeatures('brew-buddy');
expect(features?.enableProducts).toBe(true);
expect(features?.enableCart).toBe(true);

const canShowProducts = await this.storeFeatures.canShowProducts('brew-buddy');
expect(canShowProducts).toBe(true);
```

## Future Enhancements

1. **Feature Dependencies** - Some features might depend on others
2. **User Role Features** - Different features for different user roles
3. **Feature Tiers** - Premium features for certain store types
4. **A/B Testing** - Enable features for testing purposes
5. **Analytics** - Track feature usage per store

## Troubleshooting

### Common Issues

1. **Features not loading** - Check database connection and function permissions
2. **Cache issues** - Use `clearCache()` or `refreshFeatures()` methods
3. **Performance** - Ensure proper indexing on feature columns
4. **Type errors** - Make sure to import the correct interfaces

### Debug Commands

```typescript
// Check current features
console.log('Current features:', this.storeFeatures.getCurrentFeatures());

// Clear cache and reload
await this.storeFeatures.refreshFeatures(storeCode);

// Check specific feature
const canShow = await this.storeFeatures.canShowProducts(storeCode);
console.log('Can show products:', canShow);
```
