# Royal Foods Brand Setup

## Overview
This document outlines the complete setup for the Royal Foods brand - a premium restaurant and food delivery service.

## Brand Information
- **Brand ID**: `royalfoods`
- **Display Name**: Royal Foods
- **Theme**: Food
- **Domain**: royalfoods.com
- **Store Code**: royalfoods

## Components Created

### 1. Layout-Food Component
**Location**: `src/app/layout-food/`

**Files**:
- `layout-food.ts` - Component logic
- `layout-food.html` - Template with food-themed layout
- `layout-food.scss` - Food theme styling with amber/orange colors

**Theme Colors**:
- Primary: `#d97706` (Amber 600)
- Secondary: `#f59e0b` (Amber 500)
- Accent: `#ef4444` (Red 500)
- Background: `#fff7ed` (Orange 50)
- Gradient: `linear-gradient(135deg, #d97706 0%, #f59e0b 100%)`

## Brand Configuration

### Brand Service (brand.service.ts)
```typescript
{
  id: 'royalfoods',
  name: 'royalfoods',
  displayName: 'Royal Foods',
  description: 'Premium Restaurant & Food Delivery',
  theme: 'food',
  domain: 'royalfoods.com',
  // ... full configuration
}
```

### Navigation
**Top Navbar**:
- Restaurant menu icon (left)
- Account icon (right)
- Shopping cart icon (right)

**Bottom Navbar**:
- Home
- Menu (Restaurant icon)
- Cart
- Inventory
- Stores
- Profile

### Content Categories
- Chapati (bakery_dining icon)
- Poori (breakfast_dining icon)
- Pulka (restaurant icon)
- Parota (ramen_dining icon)

## Routing

### Routes (app.routes.ts)
```typescript
{ path: 'royalfoods', component: DynamicLayoutComponent, children: [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'menu', component: Menu },
  { path: 'cart', component: Cart },
  { path: 'stores', component: Stores },
  { path: 'profile', component: Profile },
  { path: 'login', component: Login },
  { path: 'inventory', component: Inventory },
  { path: 'tekmegha-clients', component: TekMeghaClientsComponent }
]}

// Redirect
{ path: 'food', redirectTo: '/royalfoods', pathMatch: 'full' }
```

### URL Structure
```
/royalfoods/home           # Royal Foods home
/royalfoods/menu           # Royal Foods menu
/royalfoods/cart           # Royal Foods cart
/royalfoods/stores         # Royal Foods stores
/royalfoods/profile        # Royal Foods profile
/royalfoods/inventory      # Royal Foods inventory
/food                      # Redirects to /royalfoods
```

## Dynamic Layout Integration

### Layout Switching (dynamic-layout.ts)
```typescript
<!-- Food Layout (Royal Foods) -->
<app-layout-food *ngIf="selectedStore?.storeCode === 'royalfoods'">
  <router-outlet></router-outlet>
</app-layout-food>
```

### URL Detection
- `/royalfoods` → Royal Foods store
- `/food` → Royal Foods store (redirect)

## Theme Styling

### CSS Theme Class
```scss
:host-context(.royalfoods-theme) {
  --primary-color: #d97706;
  --secondary-color: #f59e0b;
  --accent-color: #ef4444;
}
```

### Body Class
Applied dynamically: `.royalfoods-theme`

## Assets Structure

### Image Directories
```
src/assets/images/royalfoods/
  ├── default.png (placeholder - replace with actual logo)
  ├── logo.png (add your logo)
  ├── hero-food.jpg (add hero image)
  └── products/
      ├── 1.png
      ├── 2.png
      ├── 3.png
      └── ... (add product images)
```

### Content Configuration
**File**: `src/assets/royalfoods-content.json`

Contains:
- Top navbar configuration
- Bottom navbar configuration
- Store locations

## Store Selector Integration

### Store Icon
```typescript
case 'royalfoods':
  return 'restaurant';
```

### Store Description
```typescript
case 'royalfoods':
  return 'Restaurant & food delivery';
```

## Updated Components

### All components updated with Royal Foods support:
- ✅ `home.ts` - Store descriptions and brand mapping
- ✅ `menu.ts` - Menu titles and search placeholders
- ✅ `cart.ts` - Default images
- ✅ `profile.ts` - Default images
- ✅ `stores.ts` - Default images
- ✅ `product-tile.ts` - Default images
- ✅ `store-selector.ts` - Icons and descriptions
- ✅ `store-session.service.ts` - URL regex pattern
- ✅ `supabase.service.ts` - Store detection
- ✅ `fallback-data.service.ts` - Fallback products and stores

## Fallback Data

### Products
- Biryani Special (Main Course)
- Paneer Tikka (Appetizers)

### Stores
- Royal Foods Main Branch (Jubilee Hills)

## Testing the Setup

### 1. Navigate to Royal Foods
```
http://localhost:4200/royalfoods/home
```

### 2. Verify Layout
- ✅ Food layout (layout-food) should load
- ✅ Amber/orange theme should apply
- ✅ Restaurant icon in store selector
- ✅ Food-specific navigation items

### 3. Test Store Selection
1. Go to home page
2. Select Royal Foods from store selector
3. Verify URL changes to `/royalfoods/home`
4. Check theme colors are applied

### 4. Test Components
- Navigate to menu: `/royalfoods/menu`
- Navigate to cart: `/royalfoods/cart`
- Navigate to stores: `/royalfoods/stores`
- Navigate to inventory: `/royalfoods/inventory`

## Next Steps

### 1. Add Brand Assets
Place the following images in `src/assets/images/royalfoods/`:
- `logo.png` - Royal Foods logo
- `hero-food.jpg` - Hero banner image
- `default.png` - Default product image

### 2. Add Product Images
Place product images in `src/assets/images/royalfoods/products/`:
- `1.png`, `2.png`, `3.png`, etc.

### 3. Create Database Entries
Create SQL scripts for Royal Foods:
- Store entry in `megha_stores` table
- Categories for food items
- Sample products

### 4. Configure Categories
Set up food-specific categories in the database:
- Appetizers
- Main Course
- Desserts
- Beverages
- And any subcategories

## Features

### ✅ Implemented
- Layout-food component with food theme
- Brand configuration in brand service
- Routing for all Royal Foods pages
- Dynamic layout switching
- Store selector integration
- Fallback data for offline mode
- Theme styling (amber/orange colors)
- Product image URL generation
- All component integration

### 🎯 Ready to Use
- URL: `/royalfoods` or `/food`
- Theme: Food-themed with warm amber colors
- Icon: Restaurant icon
- Layout: Custom food layout

## Color Palette

**Primary Colors**:
- Amber 600: `#d97706`
- Amber 500: `#f59e0b`
- Red 500: `#ef4444`

**Background**:
- Orange 50: `#fff7ed`
- White: `#ffffff`

**Gradients**:
- Primary: `linear-gradient(135deg, #d97706 0%, #f59e0b 100%)`
- Accent: `linear-gradient(135deg, #ef4444 0%, #f97316 100%)`

## Summary

The Royal Foods brand is now fully integrated into the application with:
- ✅ Custom food-themed layout
- ✅ Amber/orange color scheme
- ✅ Restaurant-focused navigation
- ✅ Food categories (Appetizers, Main Course, Desserts, Beverages)
- ✅ Dynamic routing and layout switching
- ✅ Complete asset structure
- ✅ Fallback data for testing

You can now access Royal Foods at: `/royalfoods/home` or `/food`

