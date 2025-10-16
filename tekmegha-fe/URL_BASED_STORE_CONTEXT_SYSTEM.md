# URL-Based Store Context System

## Overview
The entire application has been refactored to use **URL-based store context** instead of relying on localStorage or session storage. This ensures that the store context is always determined from the current URL, making the system more reliable and predictable.

## Core Architecture

### 1. **StoreContextService** (Primary Store Context Manager)
- **Purpose**: Central service for managing store context based on URL
- **Key Features**:
  - Automatically detects store from URL on initialization
  - Provides reactive store context via `currentStore$` observable
  - Loads store data from database based on URL store code
  - Refreshes context when URL changes

**Key Methods**:
```typescript
// URL-based methods (preferred)
getCurrentStoreFromUrl(): StoreSession | null
getCurrentStoreIdFromUrl(): string | null
refreshStoreFromUrl(): Promise<void>

// Legacy methods (deprecated)
getCurrentStore(): StoreSession | null // ⚠️ Use getCurrentStoreFromUrl()
getCurrentStoreId(): string | null     // ⚠️ Use getCurrentStoreIdFromUrl()
```

### 2. **StoreSessionService** (Session Management)
- **Purpose**: Manages store session state and navigation
- **Key Features**:
  - URL-driven store loading
  - No localStorage dependency
  - Navigation-based store selection

**Key Changes**:
- ✅ Removed localStorage storage
- ✅ Store selection navigates to store URL instead of storing
- ✅ Store clearing navigates to global home

### 3. **SupabaseService** (Database Integration)
- **Purpose**: Enhanced with URL-based store detection
- **Key Features**:
  - `getCurrentStore()` - Detects store code from URL
  - `getCurrentStoreId()` - Gets store ID from URL-based store code
  - Enhanced returnUrl parameter handling for login flows

## URL-Based Store Detection Logic

### Store Code Detection Priority:
1. **Route Parameters**: `/:storeCode/invoice` → storeCode = `rragency-bheem`
2. **ReturnUrl Parameters**: `/inventory-login?returnUrl=/rragency-bheem/invoice` → storeCode = `rragency-bheem`
3. **Known Routes**: `/brew-buddy/home` → storeCode = `brew-buddy`
4. **Wildcard Routes**: `/any-store-code/menu` → storeCode = `any-store-code`

### URL Patterns Supported:
```
✅ /rragency-bheem/invoice          → Store: rragency-bheem
✅ /brew-buddy/home                 → Store: brew-buddy
✅ /inventory-login?returnUrl=/store/invoice → Store: store
✅ /new-store-123/menu              → Store: new-store-123
✅ /invoice                         → Global context (no store)
```

## Component Integration

### Invoice Component
```typescript
// OLD (storage-based)
this.storeSession.selectedStore$.subscribe(store => {
  this.currentStore = store;
});

// NEW (URL-based)
this.storeContextService.currentStore$.subscribe(store => {
  this.currentStore = store;
});

// Store ID from URL
const storeId = await this.supabase.getCurrentStoreId();
```

### Dynamic Layout Component
```typescript
// Automatically refreshes store context on route changes
this.route.params.subscribe(() => {
  this.detectStoreFromUrl();
  this.storeContextService.refreshStoreFromUrl();
});
```

## Database Integration

### Store Loading Process:
1. **URL Detection**: Extract store code from current URL
2. **Database Query**: Query `megha_stores` table by `store_code`
3. **Context Update**: Update store context with loaded data
4. **Component Notification**: Notify all subscribed components

### Database Schema:
```sql
-- megha_stores table structure
CREATE TABLE megha_stores (
    id BIGSERIAL PRIMARY KEY,
    store_code VARCHAR(50) UNIQUE NOT NULL,  -- URL store code
    store_name VARCHAR(255) NOT NULL,
    store_type VARCHAR(100),
    theme JSONB,
    is_active BOOLEAN DEFAULT true
);
```

## Authentication & Navigation Flow

### Login Flow with ReturnUrl:
```
1. User tries: /rragency-bheem/invoice
2. InventoryAuthGuard blocks access
3. Redirects to: /inventory-login?returnUrl=/rragency-bheem/invoice
4. StoreContextService detects: storeCode = 'rragency-bheem' from returnUrl
5. Store context loaded: rragency-bheem store data
6. User logs in successfully
7. Redirects to: /rragency-bheem/invoice with proper store context
```

### Store Selection Flow:
```
1. User selects store from store selector
2. Navigates to: /selected-store/home
3. StoreContextService detects: storeCode = 'selected-store'
4. Store context updated: selected-store data loaded
5. All components receive new store context
```

## Benefits of URL-Based Approach

### ✅ **Reliability**
- Store context always matches URL
- No stale data from localStorage
- Consistent behavior across page refreshes

### ✅ **Predictability**
- URL determines store context
- Easy to debug and understand
- Bookmarkable store-specific URLs

### ✅ **Scalability**
- Any store can be accessed via URL
- No need to add routes for new stores
- Universal store support

### ✅ **User Experience**
- Direct access to store-specific features
- Proper browser back/forward navigation
- Shareable store URLs

## Migration Guide

### For Developers:

#### **Replace Storage-Based Store Access:**
```typescript
// OLD - Storage-based
const store = this.storeSession.getSelectedStore();
const storeId = this.storeSession.getSelectedStoreId();

// NEW - URL-based
const store = this.storeContextService.getCurrentStoreFromUrl();
const storeId = this.storeContextService.getCurrentStoreIdFromUrl();
```

#### **Use Reactive Store Context:**
```typescript
// Subscribe to store context changes
this.storeContextService.currentStore$.subscribe(store => {
  if (store) {
    // Update component with new store context
    this.updateComponentForStore(store);
  }
});
```

#### **Handle Store Navigation:**
```typescript
// OLD - Store in localStorage
this.storeSession.selectStore(store);
localStorage.setItem('selected-store', JSON.stringify(store));

// NEW - Navigate to store URL
this.storeSession.navigateToStore(store.storeCode, 'home');
```

### For Components:

#### **Store Context Access:**
```typescript
// Import StoreContextService
import { StoreContextService } from '../shared/services/store-context.service';

// Inject in constructor
constructor(private storeContextService: StoreContextService) {}

// Subscribe to store context
ngOnInit() {
  this.storeContextService.currentStore$.subscribe(store => {
    this.currentStore = store;
    this.loadStoreData();
  });
}
```

## Testing Scenarios

### **URL-Based Store Detection:**
- ✅ `/rragency-bheem/invoice` → Store: `rragency-bheem`
- ✅ `/brew-buddy/home` → Store: `brew-buddy`
- ✅ `/new-store/menu` → Store: `new-store`
- ✅ `/inventory-login?returnUrl=/store/invoice` → Store: `store`

### **Navigation & Context Updates:**
- ✅ Navigate between stores → Context updates automatically
- ✅ Page refresh → Store context maintained from URL
- ✅ Direct URL access → Store context loaded correctly
- ✅ Login with returnUrl → Store context preserved

### **Invoice System:**
- ✅ Store-specific invoice creation
- ✅ Correct store ID in database
- ✅ Store-specific default items
- ✅ Proper brand configuration

## Troubleshooting

### **Store Not Detected:**
1. Check if store exists in `megha_stores` table
2. Verify `store_code` matches URL exactly
3. Ensure store is marked as `is_active = true`
4. Check browser console for store detection logs

### **Context Not Updating:**
1. Verify component subscribes to `storeContextService.currentStore$`
2. Check if route change listeners are active
3. Ensure `refreshStoreFromUrl()` is called on navigation
4. Check for circular dependency issues

### **Navigation Issues:**
1. Verify wildcard routes are properly configured
2. Check if store code is in global routes list
3. Ensure returnUrl parameter is properly encoded
4. Verify authentication guards use correct redirect URLs

## Future Enhancements

### **Planned Features:**
- Multi-language store support via URL
- Store-specific subdomain support
- Advanced store context caching
- Real-time store status updates
- Store context analytics

The URL-based store context system provides a robust, scalable foundation for multi-store applications while maintaining simplicity and reliability.
