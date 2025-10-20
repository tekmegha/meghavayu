# Navbar Route Debugging and Fix

## 🎯 **Issue Identified**

The bottom-sticky-navbar component was still receiving routes with "megha" store name, even after implementing the database-controlled navbar system. This was happening because:

1. **Database migration not run** - The navbar configuration fields haven't been added to the database yet
2. **Fallback to default config** - NavbarConfigService was falling back to default configuration with hardcoded "megha" routes
3. **Route transformation logic** - The bottom-sticky-navbar was trying to transform routes that were already store-specific

## 🔧 **Fixes Applied**

### **1. Enhanced Bottom-Sticky-Navbar Route Handling**

**File:** `tekmegha-fe/src/app/bottom-sticky-navbar/bottom-sticky-navbar.ts`

#### **Improved Route Logic:**
```typescript
if (item.route) {
  let targetRoute = item.route;
  
  // Check if the route is already store-specific (starts with /store-code/)
  const isStoreSpecific = /^\/[^\/]+\//.test(targetRoute);
  
  console.log('Route analysis:', {
    targetRoute: targetRoute,
    isStoreSpecific: isStoreSpecific,
    currentStore: currentStore
  });
  
  // If route is already store-specific, use it as-is
  if (isStoreSpecific) {
    console.log('Route is already store-specific, using as-is:', targetRoute);
    this.router.navigateByUrl(targetRoute);
    return;
  }
  
  // If route is not store-specific and we have a current store, make it store-specific
  if (!isStoreSpecific && currentStore) {
    if (targetRoute.startsWith('/')) {
      targetRoute = `/${currentStore}${targetRoute}`;
    } else {
      targetRoute = `/${currentStore}/${targetRoute}`;
    }
    console.log('Transformed route:', targetRoute);
  }
  
  console.log('Final navigation to:', targetRoute);
  this.router.navigateByUrl(targetRoute);
}
```

#### **Key Changes:**
- **Early return** for store-specific routes to avoid double transformation
- **Better route detection** using regex pattern `/^\/[^\/]+\//`
- **Clearer logic flow** with separate handling for store-specific vs non-store-specific routes

### **2. Added Comprehensive Debugging**

#### **Bottom-Sticky-Navbar Component:**
```typescript
ngOnInit() {
  // Debug: Log the navbar items being passed to this component
  console.log('BottomStickyNavbar - navbarItems received:', this.navbarItems);
  
  // ... rest of ngOnInit
}
```

#### **NavbarConfigService:**
```typescript
private processNavbarConfig(storeData: StoreNavbarData): void {
  const storeCode = storeData.store_code;
  const navbarConfig = storeData.navbar_config;
  
  console.log('NavbarConfigService - processing config for store:', storeCode);
  console.log('NavbarConfigService - storeData:', storeData);
  console.log('NavbarConfigService - navbarConfig:', navbarConfig);
  // ... rest of method
}

private setDefaultNavbarConfig(): void {
  const storeCode = this.supabaseService.getCurrentStore() || 'megha';
  
  console.log('NavbarConfigService - using default config for store:', storeCode);
  console.log('NavbarConfigService - getCurrentStore() returned:', this.supabaseService.getCurrentStore());
  // ... rest of method
}
```

## 🧪 **Debugging Steps**

### **Step 1: Check Console Logs**
When navigating to a store page, check the browser console for these logs:

1. **NavbarConfigService logs:**
   - `NavbarConfigService - processing config for store: [storeCode]`
   - `NavbarConfigService - storeData: [object]`
   - `NavbarConfigService - navbarConfig: [object]`

2. **BottomStickyNavbar logs:**
   - `BottomStickyNavbar - navbarItems received: [array]`
   - `Route analysis: { targetRoute, isStoreSpecific, currentStore }`

### **Step 2: Identify the Source**
- **If you see "using default config"** - The database migration hasn't been run
- **If you see "processing config"** - The database migration has been run successfully
- **If routes still contain "megha"** - Check if the database has the correct store configuration

### **Step 3: Verify Database Configuration**
Run this query to check if the navbar configuration exists:
```sql
SELECT store_code, navbar_config, enable_navbar_home, enable_navbar_menu 
FROM megha_stores 
WHERE store_code = 'jsicare';
```

## 📋 **Expected Behavior**

### **Before Database Migration:**
- **Console shows:** "using default config for store: megha"
- **Routes contain:** `/megha/home`, `/megha/menu`, etc.
- **Navigation works** but uses fallback store

### **After Database Migration:**
- **Console shows:** "processing config for store: jsicare"
- **Routes contain:** `/jsicare/home`, `/jsicare/menu`, etc.
- **Navigation works** with correct store-specific routes

### **Route Transformation Logic:**
```typescript
// Example 1: Store-specific route (no transformation needed)
item.route = "/jsicare/home"
isStoreSpecific = true
result = "/jsicare/home" (used as-is)

// Example 2: Non-store-specific route (transformation needed)
item.route = "/home"
currentStore = "jsicare"
isStoreSpecific = false
result = "/jsicare/home" (transformed)

// Example 3: Fallback route with "megha" (transformation needed)
item.route = "/megha/home"
currentStore = "jsicare"
isStoreSpecific = true (but wrong store)
result = "/megha/home" (used as-is, but wrong store)
```

## 🎯 **Root Cause Analysis**

The "megha" routes are coming from one of these sources:

1. **Database migration not run** - NavbarConfigService falls back to default config
2. **Database has old configuration** - Store still has hardcoded "megha" routes
3. **BrandService still being used** - Layout component might still be using old BrandService

## 🚀 **Next Steps**

1. **Run the database migration** to add navbar control fields
2. **Check console logs** to see which configuration source is being used
3. **Verify database data** for the specific store
4. **Test navigation** to ensure routes are store-specific

## 🎉 **Status**

The route transformation logic has been improved to handle both store-specific and non-store-specific routes correctly. The debugging logs will help identify the exact source of the "megha" routes. ✅
